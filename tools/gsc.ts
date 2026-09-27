import path from 'path';
import fs from 'fs';
import { searchconsole, auth as googleAuth } from '@googleapis/searchconsole';
import { analyticsdata } from '@googleapis/analyticsdata';

const KEY_FILE = path.join(process.cwd(), 'scripts', 'gsc-key.json');
const GSC_SITE_URL = 'sc-domain:pukadigital.com';
const GA4_PROPERTY_ID = 'properties/514366233';

if (!fs.existsSync(KEY_FILE)) {
  console.error(`❌ No se encontró la clave en: ${KEY_FILE}`);
  console.error('Coloca tu archivo de service account JSON en scripts/gsc-key.json');
  process.exit(1);
}

// GoogleAuth sale de googleapis-common, no de google-auth-library directo: el que
// resuelve la raíz es el 10.x de @google/genai y sus tipos no calzan con el 11.x.
const auth = new googleAuth.GoogleAuth({
  keyFile: KEY_FILE,
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly'
  ],
});

const sc = searchconsole({ version: 'v1', auth });
const analytics = analyticsdata({ version: 'v1beta', auth });

/**
 * Inspecciona una URL y muestra estado de indexación y errores de schema / rich results
 */
async function inspeccionarURL(url: string) {
  try {
    console.log(`\n🔍 Inspeccionando: ${url}...`);
    const res = await sc.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: GSC_SITE_URL,
        languageCode: 'es',
      },
    });

    const result = res.data.inspectionResult;
    const indexStatus = result?.indexStatusResult;
    const richResults = result?.richResultsResult;

    console.log(`--------------------------------------------------`);
    console.log(`📍 URL Canónica de Google: ${indexStatus?.googleCanonical || 'N/A'}`);
    console.log(`🚦 Estado de Indexación:  ${indexStatus?.verdict || 'N/A'}`);
    console.log(`📋 Cobertura:             ${indexStatus?.coverageState || 'N/A'}`);
    console.log(`📅 Último Rastreo:        ${indexStatus?.lastCrawlTime || 'N/A'}`);

    if (richResults?.detectedItems && richResults.detectedItems.length > 0) {
      console.log(`\n🧩 Datos Estructurados Detectados:`);
      for (const item of richResults.detectedItems) {
        console.log(`\n  ▸ Tipo: ${item.richResultType}`);
        for (const element of item.items || []) {
          if (element.issues && element.issues.length > 0) {
            console.log(`    ⚠️ Inconvenientes en "${element.name || 'Elemento'}":`);
            element.issues.forEach((issue) => {
              console.log(`       - [${issue.severity}] ${issue.issueMessage}`);
            });
          } else {
            console.log(`    ✅ ${element.name || item.richResultType}: Válido sin errores`);
          }
        }
      }
    } else {
      console.log(`\nℹ️ No se detectaron Rich Results evaluados en el último rastreo de Google.`);
    }
    console.log(`--------------------------------------------------`);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`❌ Error al inspeccionar ${url}:`, error.message);
  }
}

/**
 * Consulta las mejores keywords y páginas en Google Search Console
 */
async function consultarGSC(dias = 28) {
  try {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - dias);

    const startDate = inicio.toISOString().split('T')[0];
    const endDate = hoy.toISOString().split('T')[0];

    console.log(`\n📊 1. Google Search Console (${startDate} a ${endDate}):`);

    const res = await sc.searchanalytics.query({
      siteUrl: GSC_SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 15,
      },
    });

    if (!res.data.rows || res.data.rows.length === 0) {
      console.log('No se encontraron datos de búsqueda orgánica para el rango.');
      return;
    }

    console.table(
      res.data.rows.map((row) => ({
        Búsqueda: row.keys?.[0],
        Clics: row.clicks,
        Impresiones: row.impressions,
        CTR: `${((row.ctr || 0) * 100).toFixed(2)}%`,
        Posición: (row.position || 0).toFixed(1),
      }))
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error('❌ Error al consultar GSC:', error.message);
  }
}

/**
 * Consulta las métricas de tráfico y conversiones en Google Analytics 4
 */
async function consultarGA4(dias = 28) {
  try {
    console.log(`\n📈 2. Google Analytics 4 (Últimos ${dias} días):`);

    // Fuentes de tráfico
    const sources = await analytics.properties.runReport({
      property: GA4_PROPERTY_ID,
      requestBody: {
        dateRanges: [{ startDate: `${dias}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }, { name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
        limit: '10'
      }
    });

    console.log('\n▸ Fuentes de Tráfico:');
    console.table(sources.data.rows?.map(r => ({
      Canal: r.dimensionValues?.[0]?.value,
      'Fuente / Medio': r.dimensionValues?.[1]?.value,
      Sesiones: r.metricValues?.[0]?.value,
      Usuarios: r.metricValues?.[1]?.value,
      'Interacción': ((parseFloat(r.metricValues?.[2]?.value || '0')) * 100).toFixed(1) + '%'
    })));

    // Conversiones clave (WhatsApp clicks)
    const events = await analytics.properties.runReport({
      property: GA4_PROPERTY_ID,
      requestBody: {
        dateRanges: [{ startDate: `${dias}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['whatsapp_directo_click', 'whatsapp_opened', 'blog_articulo_lectura', 'first_visit']
            }
          }
        }
      }
    });

    console.log('\n▸ Conversiones y Eventos Clave:');
    console.table(events.data.rows?.map(r => ({
      Evento: r.dimensionValues?.[0]?.value,
      Total: r.metricValues?.[0]?.value,
      Usuarios: r.metricValues?.[1]?.value
    })));

  } catch (err: unknown) {
    const error = err as Error;
    console.error('❌ Error al consultar GA4:', error.message);
  }
}

async function main() {
  const comando = process.argv[2] || 'audit';
  const param = process.argv[3];

  if (comando === 'inspect') {
    const url = param || 'https://pukadigital.com/casos';
    await inspeccionarURL(url);
  } else if (comando === 'analytics') {
    const dias = param ? parseInt(param, 10) : 28;
    await consultarGSC(dias);
    await consultarGA4(dias);
  } else {
    console.log(`🚀 Auditoría Unificada PukaDigital (GSC + GA4)...`);
    await inspeccionarURL('https://pukadigital.com/casos');
    await inspeccionarURL('https://pukadigital.com/nosotros');
    await consultarGSC(28);
    await consultarGA4(28);
  }
}

main();

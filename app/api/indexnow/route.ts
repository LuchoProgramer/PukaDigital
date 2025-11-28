// app/api/indexnow/route.ts
import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "f6cfe5524c17476c948aec9f6a9700d4";
const DOMAIN = "pukadigital.com";
const KEY_LOCATION = `https://${DOMAIN}/${INDEXNOW_KEY}.txt`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "No URLs provided" },
        { status: 400 }
      );
    }

    // Validar que las URLs sean del dominio correcto
    const validUrls = urls.filter((url: string) => 
      url.startsWith(`https://${DOMAIN}`)
    );

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs for this domain" },
        { status: 400 }
      );
    }

    // Llamar a la API de IndexNow
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: DOMAIN,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: validUrls,
      }),
    });

    const status = response.status;
    const responseText = await response.text();

    // IndexNow returns 200 for success, 202 for accepted
    if (status === 200 || status === 202) {
      return NextResponse.json({
        ok: true,
        message: "URLs enviadas a IndexNow correctamente",
        status,
        urlsSubmitted: validUrls.length,
      });
    } else {
      return NextResponse.json(
        {
          error: `IndexNow retornó status ${status}`,
          details: responseText,
        },
        { status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error enviando a IndexNow", details: String(error) },
      { status: 500 }
    );
  }
}

// GET para verificar que el endpoint está activo
export async function GET() {
  return NextResponse.json({
    service: "IndexNow",
    status: "active",
    domain: DOMAIN,
    keyLocation: KEY_LOCATION,
  });
}

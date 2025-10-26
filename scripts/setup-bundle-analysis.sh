#!/bin/bash

# Bundle Optimization Setup Script
echo "🔧 Configurando herramientas de análisis de bundle..."

# Install development dependencies for bundle analysis
echo "📦 Instalando dependencias..."
npm install --save-dev webpack-bundle-analyzer bundlesize cross-env

# Add scripts to package.json if they don't exist
echo "⚙️ Configurando scripts..."

# Check if analyze script exists
if ! grep -q '"analyze"' package.json; then
  npm pkg set scripts.analyze="cross-env ANALYZE=true npm run build"
fi

if ! grep -q '"analyze:dev"' package.json; then
  npm pkg set scripts.analyze:dev="cross-env ANALYZE=true npm run dev"
fi

if ! grep -q '"bundle:size"' package.json; then
  npm pkg set scripts.bundle:size="npx bundlesize"
fi

# Create .bundlerc for bundlesize configuration
cat > .bundlerc << EOL
{
  "files": [
    {
      "path": ".next/static/chunks/pages/*.js",
      "maxSize": "250 KB",
      "compression": "gzip"
    },
    {
      "path": ".next/static/chunks/*.js",
      "maxSize": "150 KB",
      "compression": "gzip"
    }
  ]
}
EOL

# Create bundle analysis documentation
cat > docs/bundle-optimization.md << EOL
# Bundle Optimization Guide

## Herramientas de Análisis

### 1. Webpack Bundle Analyzer
\`\`\`bash
npm run analyze        # Analizar build de producción
npm run analyze:dev    # Analizar en desarrollo
\`\`\`

### 2. Bundle Size Monitoring
\`\`\`bash
npm run bundle:size    # Verificar tamaños de bundle
\`\`\`

## Optimizaciones Implementadas

### 1. Code Splitting
- Chunks automáticos por vendor
- Separación de Firebase y React Icons
- Chunks específicos para CMS y Testing

### 2. Tree Shaking
- Habilitado \`usedExports\`
- Configurado \`sideEffects: false\`
- Imports optimizados

### 3. Caching
- Headers de cache optimizados
- Immutable assets
- API caching con stale-while-revalidate

### 4. Compression
- SWC minification
- Gzip compression
- CSS optimization

## Métricas Objetivo

- **Main bundle**: < 250KB (gzipped)
- **Vendor chunks**: < 150KB (gzipped)
- **Page chunks**: < 100KB (gzipped)
- **CSS**: < 50KB (gzipped)

## Monitoring Continuo

1. CI/CD integration con bundlesize
2. Performance budgets
3. Bundle analysis en cada PR
4. Core Web Vitals tracking
EOL

echo "✅ Configuración completada!"
echo ""
echo "🚀 Comandos disponibles:"
echo "  npm run analyze      - Analizar bundle (producción)"
echo "  npm run analyze:dev  - Analizar bundle (desarrollo)"
echo "  npm run bundle:size  - Verificar tamaños"
echo ""
echo "📊 Para ver el análisis de bundle:"
echo "  1. Ejecuta 'npm run analyze'"
echo "  2. Abre http://localhost:8888"
echo "  3. O visita /testing y ve a 'Bundle Tests'"
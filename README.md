# Puka Digital

Un proyecto moderno de Next.js con TypeScript y Tailwind CSS.

## 🚀 Características

- **Next.js 14** - Framework de React para producción
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **App Router** - Sistema de enrutamiento moderno de Next.js
- **ESLint** - Linter para mantener código consistente

## 📦 Instalación

```bash
# Clona el repositorio
git clone <tu-repositorio>
cd pukadigital

# Instala las dependencias
npm install
```

## 🛠️ Scripts Disponibles

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar código con ESLint
npm run lint
```

## 🌐 Desarrollo

1. Ejecuta `npm run dev` para iniciar el servidor de desarrollo
2. Abre [http://localhost:3000](http://localhost:3000) en tu navegador
3. Edita `src/app/page.tsx` para empezar a desarrollar
4. Los cambios se reflejarán automáticamente en el navegador

## 📁 Estructura del Proyecto

```
pukadigital/
├── src/
│   └── app/
│       ├── globals.css      # Estilos globales
│       ├── layout.tsx       # Layout principal
│       ├── page.tsx         # Página de inicio
│       └── fonts/           # Fuentes personalizadas
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── .eslintrc.json
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Personalización

### Tailwind CSS
La configuración de Tailwind está en `tailwind.config.ts`. Puedes personalizar:
- Colores
- Fuentes
- Espaciado
- Breakpoints

### TypeScript
La configuración de TypeScript está en `tsconfig.json` con:
- Alias de importación `@/*` para `./src/*`
- Configuración optimizada para Next.js
- Strict mode habilitado

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
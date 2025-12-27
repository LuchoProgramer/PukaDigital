# Refactorización de Arquitectura: i18n y Gestión de Datos

Este documento detalla la reestructuración realizada en Diciembre 2025 para mejorar la escalabilidad, el rendimiento y la mantenibilidad del proyecto PukaDigital.

## 1. El Problema Original
- **Archivo i18n Monolítico**: `lib/i18n.tsx` superaba las 1,300 líneas, mezclando lógica de React Context con miles de líneas de traducciones.
- **Datos Hardcodeados**: La información de los casos de éxito (aliados) estaba duplicada en múltiples archivos JSX (Home, Casos, Footer).
- **Mantenimiento Lento**: Agregar un nuevo cliente requería editar manualmente traducciones en 3 idiomas y ajustar círculos visuales de "cupos" en el código.

## 2. La Solución Aplicada

### A. Modularización de Traducciones
Se movieron los textos a archivos independientes por idioma dentro de `lib/i18n/translations/es.ts`, `en.ts` y `pt.ts`.
- **Ventaja**: Carga de memoria más ligera.
- **Ventaja**: Facilidad para encontrar y editar textos específicos sin riesgo de romper la lógica del Contexto.

### B. Centralización de Datos de Negocio (`data/allies.ts`)
Toda la información de los aliados (clientes) ahora vive en un solo "Single Source of Truth".
- **Ventaja**: Agregar un cliente toma segundos.
- **Ventaja**: Tipado fuerte con TypeScript para evitar errores en slugs o estados.
- **SEO**: Permite mantener rutas amigables y metadatos consistentes.

### C. UI Dinámica e Inteligente
Las secciones de "Aliados" y "Cupos Disponibles" en la Home y Footer ahora son reactivas al archivo de datos.
- **Lógica de Cupos**: El sistema calcula automáticamente el total de cupos (5) y resta los clientes activos. 
- **Estados Automáticos**: Al cambiar un estado a `graduated`, el sistema libera el cupo visual y mueve el cliente a la sección de "Casos de Éxito" sin tocar el JSX.

## 3. Guía para el Usuario (Luis)

### Cómo agregar un nuevo cliente:
1. Abre `/data/allies.ts`.
2. Agrega un nuevo objeto al array `allies`.
3. ¡Listo! El cambio se reflejará en:
    - La cuadrícula de aliados de la Home.
    - Los indicadores de cupos (círculos 🔴/🟢).
    - La página de Casos Reales.
    - El contador del Footer.

### Cómo editar un texto general:
1. Ve a `/lib/i18n/translations/es.ts`.
2. Busca la clave (ej: `nav.blog`) y cambia el valor.

---
*Documentado por Antigravity - Diciembre 2025*

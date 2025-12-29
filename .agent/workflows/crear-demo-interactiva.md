---
description: Guía para crear demos interactivas tipo "Motion-Graphics" usando React y Tailwind CSS
---

# Guía de Demos Interactivas Puka Digital

Este documento describe el estándar técnico para crear simuladores de producto animados que reemplazan videos pesados, permitiendo una carga instantánea y SEO optimizado.

## Concepto
La demo interactiva simula el viaje del usuario (Customer Journey) dividiendo la pantalla en dos perspectivas: **Cliente** (quien compra) y **Admin/Emprendedor** (quien recibe la gestión).

## Estructura del Componente (`LiveDemoSim.tsx`)

### 1. Gestión de Estados (El Reloj)
Se utiliza un buecle de tiempo para ciclar entre las diferentes etapas de la venta.
- **Step 0**: Exploración (Scroll).
- **Step 1**: Selección (Hover/Enfoque).
- **Step 2**: Acción (Click/Compra).
- **Step 3**: Notificación (Recepción).
- **Step 4**: Automatización (Actualización de Stock).

### 2. Elementos Clave de Animación
- **Cursor Animado**: Un `div` con posición absoluta que se mueve mediante clases de Tailwind condicionales.
- **Transiciones**: Uso de `transition-all duration-1000` para suavizar movimientos.
- **Feedback Visual**: Uso del icono `Zap` o `MessageSquare` para mostrar la conexión entre dispositivos.

## Cómo replicar este componente
1. Definir un array de productos con imágenes reales (Assets Premium).
2. Crear dos contenedores que simulen dispositivos (Mobile-First).
3. Implementar el motor de estados con `useEffect` y `setInterval`.
4. Mapear cada estado a una clase de Tailwind específica (ej: `${step === 1 ? 'scale-110' : ''}`).

## Beneficios
- **Performance**: < 100kb vs > 5MB de un video.
- **Mantenibilidad**: Se puede cambiar el catálogo sin editar video.
- **Engagement**: La fluidez del código atrapa al usuario más que un video estático.

## Solución de Problemas (Mobile Centering)

Si la demo no aparece centrada en móviles o se ve "lejos" al cambiar de paso:

### El Problema de "Doble Ancho"
Al usar un contenedor con `w-[200%]` para permitir el deslizamiento, los hijos con `w-full` heredarán el 200% del ancho del viewport, duplicando su tamaño y rompiendo el centrado.

### La Solución: Aislamiento Completo
1.  **Hijos**: Usar `min-w-full` (o `basis-full`) en lugar de `w-full` para obligar a cada dispositivo a medir exactamente el 100% de la pantalla visible.
2.  **Transición**: Usar `-translate-x-full` (moverse un 100% del contenedor visible) para que el paso entre la vista Cliente y Emprendedor sea exacto.
3.  **Contenedor Padre**: Asegurarse de que el contenedor de la sección tenga `p-0` y `overflow-hidden` para evitar offsets laterales.

---
*Hito logrado el 29 de Diciembre de 2025 - Puka Digital Team.*

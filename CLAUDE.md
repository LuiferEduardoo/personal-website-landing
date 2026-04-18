# CLAUDE.md

Guía de trabajo para Claude Code en este proyecto (Astro).

## Stack

- **Framework:** Astro (template `minimal`, TypeScript `strict`).
- **Gestor de paquetes:** npm.
- **Scripts:** `npm run dev`, `npm run build`, `npm run preview`, `npm run astro`.

## Principios de desarrollo

Todo cambio en este repositorio debe respetar, en este orden:

### 1. Buenas prácticas

- Seguir las convenciones oficiales de Astro (islas, `.astro`, layouts, colecciones de contenido cuando aplique).
- TypeScript estricto: sin `any` implícitos; tipar props de componentes y datos externos.
- Accesibilidad (a11y): HTML semántico, jerarquía de encabezados, `alt` en imágenes, foco visible, contraste AA, navegación por teclado.
- SEO básico: `<title>`, `<meta name="description">`, Open Graph, `lang` en `<html>`, URLs limpias.
- Variables de entorno en `.env` (nunca commitear secretos).

### 2. Responsive

- **Mobile-first**: estilos base para móvil, `min-width` media queries para pantallas mayores.
- Unidades relativas (`rem`, `%`, `clamp()`, `min()`, `max()`) antes que `px` fijos.
- Layouts con CSS Grid / Flexbox; evitar anchos fijos.
- Imágenes responsivas: usar `<Image />` / `<Picture />` de `astro:assets` con `widths` y `sizes`.
- Probar en breakpoints comunes: 360, 768, 1024, 1440.

### 3. Performance

- Preferir Astro puro (cero JS) por defecto; añadir `client:*` solo cuando sea imprescindible, y elegir la directiva más barata (`client:visible` / `client:idle` antes que `client:load`).
- Optimizar imágenes con `astro:assets` (formatos modernos: AVIF/WebP, `loading="lazy"`, `decoding="async"`).
- Minimizar CSS/JS crítico; evitar librerías pesadas si una solución nativa basta.
- Precargar solo lo necesario (`<link rel="preload">` con criterio).
- Objetivo Lighthouse: **≥ 95** en Performance, Accessibility, Best Practices y SEO en producción.
- Vigilar Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.

### 4. Código modular

- Un componente por archivo en `src/components/`, con responsabilidad única.
- Layouts reutilizables en `src/layouts/`.
- Utilidades puras en `src/utils/` o `src/lib/`; tipos compartidos en `src/types/`.
- Props tipadas e interfaces explícitas; evitar acoplamiento entre componentes.
- Contenido estático en `src/content/` usando Content Collections cuando crezca.

### 5. Código limpio

- Nombres descriptivos en inglés para código, en español solo para copy de UI.
- Funciones cortas y con un solo propósito; early returns frente a anidación profunda.
- Sin código muerto, sin `console.log` en commits, sin comentarios obvios.
- Comentar **por qué**, no **qué**: solo cuando el motivo no sea evidente.
- Formato consistente (Prettier/EditorConfig si se añaden); imports ordenados.
- No introducir abstracciones anticipadas: resolver el caso actual, refactorizar cuando aparezca la tercera repetición.

## Estructura esperada

```
src/
  components/   # Componentes .astro reutilizables
  layouts/      # Layouts base
  pages/        # Rutas (file-based routing)
  styles/       # CSS global / tokens
  utils/        # Helpers puros
  content/      # Content collections (si aplica)
public/         # Assets estáticos servidos tal cual
```

## Flujo de trabajo

- Antes de dar una tarea por terminada: `npm run build` debe pasar sin errores ni warnings de tipos.
- Para cambios de UI: verificar en el navegador (`npm run dev`) en móvil y escritorio.
- Commits pequeños y con mensajes claros; no mezclar refactor con feature.

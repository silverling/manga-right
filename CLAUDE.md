# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PDF viewer web application built with Nuxt 4.2.1, using Vue 3.5.24 and Vue Router 4.6.3. The project is configured to use TailwindCSS for styling.

## Features

- Support for viewing local PDF documents directly in the browser
- Responsive design using TailwindCSS
- Support better manga reading experience (e.g., double-page view, right-to-left reading)

## Development Commands

**Install dependencies:**

```bash
bun install
# or npm install / pnpm install / yarn install
```

**Start development server** (http://localhost:3000):

```bash
bun run dev
# or npm run dev / pnpm dev / yarn dev
```

**Build for production:**

```bash
bun run build
# or npm run build / pnpm build / yarn build
```

**Preview production build:**

```bash
bun run preview
# or npm run preview / pnpm preview / yarn preview
```

**Generate static site:**

```bash
bun run generate
# or npm run generate / pnpm generate / yarn generate
```

## Architecture

### Framework Structure

- **Nuxt 4.2.1**: Full-stack Vue framework with auto-imports, file-based routing, and server-side rendering capabilities
- **App Entry**: `/app/app.vue` - Main application component that includes route announcer and will contain the PDF viewer layout
- **Public Assets**: `/public/` - Static assets served directly (favicon, robots.txt)
- **Configuration**: `nuxt.config.ts` - Nuxt configuration with devtools enabled and compatibility date set to 2025-07-15

### Project State

This is a freshly initialized Nuxt project with minimal starter code. The main app component currently shows the Nuxt welcome screen. The PDF viewer functionality and TailwindCSS integration need to be implemented.

### Key Nuxt Concepts

- **Auto-imports**: Components, composables, and utils are automatically imported when placed in their respective directories (`components/`, `composables/`, `utils/`)
- **File-based routing**: Pages placed in `pages/` directory automatically become routes
- **TypeScript**: Project uses TypeScript with types auto-generated in `.nuxt/` directory
- **Module system**: Nuxt modules can be added in `nuxt.config.ts` to extend functionality (e.g., @nuxtjs/tailwindcss for TailwindCSS support)

## Implementation Notes

When implementing the PDF viewer:

- Add `@nuxtjs/tailwindcss` module to `nuxt.config.ts` for TailwindCSS support
- Consider using a PDF rendering library like `pdfjs-dist` or `vue-pdf-embed`
- Create components in `components/` directory - they'll be auto-imported
- PDF upload/selection UI should be styled with TailwindCSS utility classes
- Consider creating composables in `composables/` for PDF state management

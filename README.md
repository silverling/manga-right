# Manga Right

A modern PDF viewer web application optimized for reading manga and comics, built with Nuxt 4.

## Features

- **Local PDF Support**: View PDF documents directly in your browser without uploading to servers
- **Manga-Optimized Reading**:
  - Double-page spread view for a traditional manga reading experience
  - Right-to-left reading mode for Japanese manga
- **Responsive Design**: Clean, modern interface built with TailwindCSS
- **Fast & Lightweight**: Built on Nuxt 4 with Vue 3 for optimal performance

## Tech Stack

- **Framework**: Nuxt 4.2.1
- **UI Library**: Vue 3.5.24
- **Routing**: Vue Router 4.6.3
- **Styling**: TailwindCSS
- **Package Manager**: Bun (also supports npm, pnpm, yarn)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A modern web browser

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd manga-right
```

2. Install dependencies:

```bash
bun install
# or npm install / pnpm install / yarn install
```

### Development

Start the development server at `http://localhost:3000`:

```bash
bun run dev
# or npm run dev / pnpm dev / yarn dev
```

### Production

Build the application for production:

```bash
bun run build
# or npm run build / pnpm build / yarn build
```

Preview the production build locally:

```bash
bun run preview
# or npm run preview / pnpm preview / yarn preview
```

Generate a static site:

```bash
bun run generate
# or npm run generate / pnpm generate / yarn generate
```

## Project Structure

```
manga-right/
├── app/
│   └── app.vue          # Main application component
├── components/          # Auto-imported Vue components
├── composables/         # Auto-imported Vue composables
├── pages/              # File-based routing
├── public/             # Static assets
├── utils/              # Auto-imported utility functions
└── nuxt.config.ts      # Nuxt configuration
```

## Development Notes

- Components placed in `components/` are automatically imported
- Composables in `composables/` are automatically available
- Pages in `pages/` automatically become routes
- TypeScript types are auto-generated in `.nuxt/` directory

## License

MIT License. See `LICENSE` file for details.

## Contributing

Just create an issue or open a pull request!

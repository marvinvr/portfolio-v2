# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Marvin von Rappard built with SvelteKit, TypeScript, Tailwind CSS, and MDsveX. Features a portfolio section and markdown-based blog system.

## Essential Commands

```bash
# Development
bun run dev          # Start development server (port 5173)
bun run build        # Build for production
bun run preview      # Preview production build
bun run check        # Run TypeScript and Svelte type checking
bun run check:watch  # Type checking in watch mode

```

**Note**: No linting or test commands are configured in this project.

## Architecture Overview

### Tech Stack
- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS + SCSS
- **Content**: MDsveX for markdown processing
- **Deployment**: Docker + Node.js adapter on VPS via Coolify
- **Monitoring**: Sentry for error tracking

### Key Directories
```
src/
├── routes/          # SvelteKit pages and API routes
├── lib/
│   ├── components/  # Reusable Svelte components
│   ├── posts/       # Blog post images (YYYY-MM-DD-slug/)
│   └── utils/       # Utility functions
└── posts/           # Markdown blog posts (YYYY-MM-DD-slug.md)
```

### Blog System

Blog posts are markdown files in `/src/posts/` with frontmatter:
```yaml
---
title: Post Title
description: Brief description
date: "YYYY-MM-DD"
categories: ["category1", "category2"]
published: true
header: header.png
---
```

Images for posts go in `/src/lib/posts/YYYY-MM-DD-slug/`.

### API Endpoints
- `/api/posts` - Get all published posts
- `/api/posts/latest` - Get latest 3 posts
- `/api/posts/categories` - Get post categories

### Important Configuration
- **svelte.config.js**: MDsveX setup, Node adapter, external link handling
- **vite.config.ts**: Sentry integration, image optimization
- **No test framework or linting configured**

### Creating New Features
1. Components go in `/src/lib/components/`
2. New pages use SvelteKit's file-based routing in `/src/routes/`
3. Images use vite-imagetools for optimization (automatic WebP conversion)
4. Use existing component patterns (check Hero.svelte, Timeline.svelte for examples)

### Deployment
Multi-stage Docker build using Bun for building and Node.js Alpine for running. Deployed at https://marvinvr.ch.
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

## Design System

### Color palette (authoritative — do not deviate)

The palette is intentionally muted. Let photography and content carry visual weight, not color. Do not use indigo, purple, blue, or any saturated accent. Do not invent new hues — stick to this list.

**Neutrals** (Tailwind gray scale)
- `gray-50` `#f9fafb` — subtle hover backgrounds
- `gray-100` `#f3f4f6` — chip / tag backgrounds
- `gray-200` `#e5e7eb` — default borders, hairlines, dividers
- `gray-300` `#d1d5db` — stronger borders, hover border step
- `gray-400` `#9ca3af` — disabled text, placeholder
- `gray-500` `#6b7280` — meta text, secondary labels
- `gray-600` `#4b5563` — default body text
- `gray-700` `#374151` — emphasized body, button text
- `gray-800` `#1f2937` — headings (h1–h3), card titles
- `gray-900` `#111827` — hero-level titles, highest-contrast text

**Accent** (soft blue — links, icons, small highlights)
- `sky-700` `#0369a1` — primary link color, accent icon color, "view all →"
- `sky-800` `#075985` — link hover, pressed accent
- `gray-800` `#1f2937` — secondary-CTA button background (dark button like "More about me")
- Avoid `indigo-*`, `blue-*`, or saturated purples — `sky-700` is the only accent hue.

**Brand** (quiet, rarely dominant)
- Brand teal `hsl(193 67% 34%)` — `--colour-brand`, seeds layered shadow on code blocks
- Warm off-white `hsl(7 53% 97%)` — `--colour-light`, fantasy cream
- Inline code pill in prose: `bg-orange-50` (`#fff7ed`) + `text-orange-900` (`#7c2d12`) — **only** inside `<code>` within prose

**Surface**
- Page background: pure white `#ffffff` everywhere. No gradients on chrome.
- **Two-tier shape system**:
  - Large surfaces (cards, images, portrait, Timeline icons, post header, tooltips, modal captions) → **`rounded-md`** (6px) + 1px `gray-200` border. No shadow.
  - Small UI (chips, tags, buttons, Socials, blog category chips) → **`rounded-sm`** (2px). Stays sharp — engineered feel.
  - Never `rounded-lg`, `rounded-xl`, or `rounded-full` pills (exception: spinners, which have to be circular).
- `SetupShowcase` keeps its dynamic per-image gradient background behind the image — that's one-off.

**Rules**
- Default body text = `gray-600`. Default heading = `gray-800`. Default border = `gray-200`.
- Any link, accent icon, or "view more →" → `sky-700`, hover `sky-800`.
- Secondary CTA = `gray-800` solid background, white text, `rounded-sm`.

### Typography

- Sans: **Geist** with system fallbacks.
- Mono: `font-mono` = **Geist Mono** (loaded via Google Fonts in `src/app.html`).
- Use mono only where it communicates structured data: dates, health/stat numbers, inline code, and code blocks. Do **not** use mono for section labels, buttons, links, chips/tags, nav/footer links, body paragraphs, or primary headings.

### Editorial structure

- Section titles must stand on their own. Do not add eyebrow labels above homepage sections.
- `SectionHeader` is the single source of truth for title + description (+ optional view-all link) blocks. Used by Projects, Posts, TechStack, Timeline, YouTube, WhoopStats, SetupShowcase, HireMe. Only `SubHeading` stays bespoke (has a divider above + uses h3 instead of h2 to act as a section transition).
- Section title spacing: `SectionHeader` applies zero margin on the h2 and `mt-2` on description. Global `h2/h3/h4` has no default `mt/mb` — those are scoped to `.prose` (markdown content) only. Don't add `mt-8` back to the base h2 rule; it'll reintroduce the hat-on-a-hat gap.
- Avoid numbered prefixes on project/post/video cards and setup items. They add a dashboard/terminal feel without adding useful information.
- Hero has no eyebrow — top-level page identity doesn't need section-label chrome. Greeting, name, and tagline form a single tight block (`mt-1`, `mt-3` between them).

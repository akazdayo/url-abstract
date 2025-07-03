# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a URL summarization web application built with Astro and deployed on Cloudflare Pages. The application allows users to input URLs and receive AI-powered summaries using Gemini API.

## Development Commands

Common development commands (run from project root):

```bash
# Development server
pnpm dev              # Starts dev server at localhost:4321

# Build and deployment
pnpm build           # Build production site to ./dist/
pnpm preview         # Preview build locally
wrangler deploy      # Deploy to Cloudflare Pages

# Code quality
pnpm lint            # Run Biome linter and auto-fix (biome check --write src/)
```

## Architecture

- **Framework**: Astro 5.x with TypeScript
- **Deployment**: Cloudflare Pages with Cloudflare Workers adapter
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Linting**: Biome

## Routing Structure

Based on PLAN.md, the application has these main routes:

- `/` - URL input screen (main page)
- `/history/` - History listing page (7-day retention)
- `/history/[id]` - Individual summary detail page

## Key Configuration

- **Cloudflare Workers**: Configured in `wrangler.jsonc` with nodejs_compat flag
- **Astro Config**: Uses Cloudflare adapter with Tailwind CSS integration
- **SSR**: Dynamic pages use `prerender = false` for Cloudflare Workers

## Development Notes

- The application stores API keys in localStorage (no authentication system)
- Database uses KVS (Key-Value Store) with content SHA256 as primary key
- History retention is limited to 7 days
- UI optimized for tools like Notion Web Clipper and Obsidian Web Clipper

## Output Guidelines

- **Output Language**: 
  - 日本語で出力・回答すること
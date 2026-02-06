# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React/TypeScript web application for RainLogger, a rainfall monitoring system. The frontend allows users to log and track rainfall amounts.

## Development Commands

- **Development server**: `pnpm dev` (Vite dev server on port 3000)
- **Build**: `pnpm build` (TypeScript check + Vite build, output to `dist/`)
- **Preview**: `pnpm preview` (preview production build locally on port 3000)
- **Test**: `pnpm test` (Vitest - not yet configured)
- **Linting**: `pnpm lint` (ESLint with auto-fix)
- **Formatting**: `pnpm prettify` (Prettier formatting)
- **Type checking**: `pnpm types` (TypeScript compiler check)

## Architecture

### Core Structure
- **Entry point**: `app/index.tsx` - React DOM rendering with StrictMode
- **App component**: `app/App.tsx` - Root component
- **Static files**: `public/` - Served at root by Vite

### Data Flow
- Types defined in `app/types/`
- Components in `app/components/`

## Technology Stack

- **Frontend**: React 19, TypeScript 5.9
- **Build**: Vite 7
- **Testing**: Vitest (to be configured)
- **Linting**: ESLint 9 (flat config) with TypeScript, React, jsx-a11y, testing-library, simple-import-sort, and Prettier integration
- **Formatting**: Prettier
- **Package manager**: pnpm

## Important Notes

- Uses path aliases (`@/*` maps to `app/*`) via `vite-tsconfig-paths`
- ESLint config is in `eslint.config.js` (ES module flat config)
- Build output directory: `dist/`
- Vite serves `public/` directory at root in both dev and production

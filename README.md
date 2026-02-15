# RainLogger Front

Frontend application for **RainLogger**, a rainfall monitoring system. Built with React and TypeScript, it allows users to log, track, and visualize rainfall data through table, calendar, and chart views.

## Features

- Log new rainfall measurements with date, amount, and location
- View logs in three formats: **table**, **monthly calendar**, and **bar chart**
- Edit and delete existing logs
- Filter logs by month, year, location, and reading type
- Monthly total rainfall summary
- JWT-based authentication
- Internationalization (English and Spanish)
- Progressive Web App (PWA) with offline support
- Fully responsive design (mobile and desktop)

## Tech Stack

- **React 19** with **TypeScript 5.9**
- **React Router 7** (framework mode, SPA)
- **Material UI 7** for components and theming
- **Recharts 3** for data visualization
- **i18next** for internationalization
- **Zod** + **react-hook-form** for form validation
- **Vite 7** as build tool
- **Vitest** + **React Testing Library** + **MSW** for testing

## Requirements

- **Node.js** >= 24.0.0
- **pnpm** >= 10 (`corepack enable` to activate)
- A running instance of [rainlogger-back](https://github.com/macolmenerori/rainlogger-back) (API)
- A running instance of [opensesame-back](https://github.com/macolmenerori/opensesame-back) (authentication API)

## Getting Started

### With Docker

1. Set up and configure [opensesame-back](https://github.com/macolmenerori/opensesame-back) for authentication

2. Set up and configure [rainlogger-back](https://github.com/macolmenerori/rainlogger-back)

3. Clone the repository:

   ```bash
   git clone https://github.com/macolmenerori/rainlogger-front.git
   cd rainlogger-front
   ```

4. Create a `.env` file in the project root (see [Configuration](#configuration)).

5. Build and run the Docker image:

   ```bash
   docker build -t rainlogger-front:latest .
   docker run -p 80:80 --name rainlogger-front rainlogger-front
   ```

   The application will be available at `http://localhost`.

> The Docker image uses a multi-stage build: it compiles the app with Node.js and serves the static output with **Nginx** on port 80.

### Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/macolmenerori/rainlogger-front.git
   cd rainlogger-front
   ```

2. Enable pnpm via corepack (if not already):

   ```bash
   corepack enable
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a `.env` file in the project root (see [Configuration](#configuration)).

5. Start the development server:

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`.

## Configuration

Create a `.env` file in the project root with the following variables:

| Variable              | Description                                           | Example                                                  |
| --------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| `NODE_ENV`            | Environment mode                                      | `development`                                            |
| `BASE_URL_AUTH`       | Base URL for the authentication API (opensesame-back) | `https://your-auth-api.example.com/api`                  |
| `BASE_URL_RAINLOGGER` | Base URL for the RainLogger API (rainlogger-back)     | `https://your-rainlogger-api.example.com/rainlogger-api` |
| `LOCATION_NAMES`      | Comma-separated list of measurement location names    | `Location1,Location2`                                    |

Example `.env`:

```env
NODE_ENV=development
BASE_URL_AUTH=https://your-auth-api.example.com/api
BASE_URL_RAINLOGGER=https://your-rainlogger-api.example.com/rainlogger-api
LOCATION_NAMES=Castraz,Salamanca
```

> Environment variables are injected at **build time** by Vite. Changes to `.env` require restarting the dev server or rebuilding.

## Available Scripts

| Command              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `pnpm dev`           | Start development server (port 3000)                       |
| `pnpm build`         | Production build (output to `dist/`)                       |
| `pnpm preview`       | Preview production build locally                           |
| `pnpm test`          | Run tests (single run)                                     |
| `pnpm test:watch`    | Run tests in watch mode                                    |
| `pnpm test:ui`       | Run tests with browser UI dashboard                        |
| `pnpm test:coverage` | Run tests with coverage report                             |
| `pnpm lint`          | Lint and auto-fix with ESLint                              |
| `pnpm prettify`      | Format code with Prettier                                  |
| `pnpm types`         | Type-check (React Router typegen + tsc)                    |
| `pnpm verify`        | Full verification: lint, format, types, test, audit, build |

## Project Structure

```
app/
├── components/       # Shared UI components
├── config/           # Environment configuration
├── context/          # React context providers (Alert, User)
├── hooks/            # Custom hooks (useApi)
├── pages/            # Page components (Login, MainPage, NewLog, WatchLogs)
├── services/         # API client and service modules
├── test/             # Test setup, mocks, and utilities
├── types/            # TypeScript type definitions
├── ui/               # Core UI infrastructure (AuthGuard, Layout, ErrorBoundary, theme, i18n)
├── utils/            # Utility modules
├── root.tsx          # Application root (providers, layout, error boundary)
└── routes.ts         # Route definitions
public/
├── icons/            # PWA and favicon icons
├── locales/          # Translation files (en.json, es.json)
└── site.webmanifest  # PWA manifest
```

## License

This project is licensed under the [MIT License](LICENSE.md).

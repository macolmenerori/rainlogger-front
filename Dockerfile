FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY .env .env
COPY app app
COPY public public
COPY .prettierignore .prettierignore
COPY .prettierrc .prettierrc
COPY eslint.config.js eslint.config.js
COPY nginx.conf nginx.conf
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY react-router.config.ts react-router.config.ts
COPY tsconfig.json tsconfig.json
COPY vite.config.ts vite.config.ts
COPY vitest.config.ts vitest.config.ts
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
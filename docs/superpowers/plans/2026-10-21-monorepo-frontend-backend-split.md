# Monorepo Frontend & Backend Division Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Divide the Cust-Post project into dedicated `frontend/` and `backend/` packages using native npm workspaces while preserving zero-drift production builds, test coverage, and local development commands.

**Architecture:** An npm workspaces monorepo where `@cust-post/backend` encapsulates database access, server services, agronomic rule calculation, and validation schemas, while `@cust-post/frontend` is a Next.js 15 application consuming the backend workspace package for type-safe server route delegation and client UI rendering.

**Tech Stack:** Next.js 15.2.9, React 19, TypeScript 5.8, Tailwind CSS, npm workspaces, Vitest 3.0, Supabase, Zod 4.

**Spec:** [`docs/superpowers/specs/2026-10-21-monorepo-frontend-backend-split-design.md`](file:///d:/All%20Codes/nir/docs/superpowers/specs/2026-10-21-monorepo-frontend-backend-split-design.md)

## Global Constraints
- Node & npm workspaces must be used natively without external monorepo tools (no Lerna, no Turborepo) to maintain simplicity and compatibility.
- Zero changes to the user-facing UI, botanical background styling, responsive card layouts, and PWA capabilities.
- Zero regressions in the 177 Vitest test assertions.
- Next.js production build (`npm run build`) must compile cleanly with all 35 static and dynamic routes generated.

## Review Focus
- **Workspace Symlinking**: Ensure npm properly links `@cust-post/backend` into `@cust-post/frontend` without unresolved module errors.
- **Next.js Package Transpilation**: Ensure `frontend/next.config.ts` includes `transpilePackages: ["@cust-post/backend"]` to transpile TypeScript files from the sibling workspace.
- **Path Aliases**: Ensure both `@/...` inside `frontend` and imports from `@cust-post/backend` resolve without circular dependencies or runtime module-not-found errors.
- **Client vs Server Boundary**: Keep Zustand stores and React client components in `frontend/src/` while keeping business logic and Supabase server clients in `backend/src/`.
- **API Delegation**: Keep route handlers (`frontend/src/app/api/...`) calling backend services cleanly with no duplicate database connection logic.

---

### Task 1: Scaffold Monorepo Root Configuration

**Files:**
- Create: `backend/package.json`
- Create: `frontend/package.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: Existing dependencies in root `package.json`.
- Produces: Root npm workspace orchestration targeting `["backend", "frontend"]`.

- [ ] **Step 1: Create backend/package.json**

```json
{
  "name": "@cust-post/backend",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@better-auth/infra": "^0.4.20",
    "@supabase/supabase-js": "^2.49.1",
    "better-auth": "^1.7.10",
    "zod": "^4.6.7"
  }
}
```

- [ ] **Step 2: Create frontend/package.json**

```json
{
  "name": "@cust-post/frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "@cust-post/backend": "*",
    "@hookform/resolvers": "^6.0.0",
    "@radix-ui/react-slot": "^1.1.2",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.1",
    "better-auth": "^1.7.10",
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "next": "^15.2.9",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-hook-form": "^7.54.2",
    "tailwind-merge": "^3.0.2",
    "zod": "^4.6.7",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/node": "^22.13.9",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "autoprefixer": "^10.6.1",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2"
  }
}
```

- [ ] **Step 3: Update root package.json to declare workspaces**

```json
{
  "name": "cust-post-monorepo",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=@cust-post/frontend",
    "build": "npm run build --workspace=@cust-post/frontend",
    "start": "npm run start --workspace=@cust-post/frontend",
    "lint": "npm run lint --workspace=@cust-post/frontend",
    "test": "vitest run",
    "test:unit": "vitest run"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.14.0",
    "@eslint/eslintrc": "^3.3.0",
    "@playwright/test": "^1.64.1",
    "@testing-library/dom": "^10.4.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/node": "^22.13.9",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.6.1",
    "eslint": "^9.21.0",
    "eslint-config-next": "^15.2.9",
    "jsdom": "^26.0.0",
    "postcss": "^8.5.3",
    "prettier": "^3.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2",
    "vitest": "^3.0.7"
  }
}
```

- [ ] **Step 4: Commit root scaffolding**

```bash
git add package.json backend/package.json frontend/package.json
git commit -m "chore(monorepo): scaffold root and workspace package definitions"
```

---

### Task 2: Build & Populate `@cust-post/backend`

**Files:**
- Create: `backend/tsconfig.json`
- Create: `backend/src/index.ts`
- Move: `src/lib/compost-rules/` -> `backend/src/compost-rules/`
- Move: `src/lib/services/` -> `backend/src/services/`
- Move: `src/lib/validation/` -> `backend/src/validation/`
- Move: `src/lib/data/` -> `backend/src/data/`
- Move: `src/types/` -> `backend/src/types/`
- Move: `src/lib/supabase/` -> `backend/src/supabase/`
- Move: `src/lib/auth.ts` -> `backend/src/auth/auth.ts`
- Copy/Move: `supabase/migrations/` -> `backend/supabase/migrations/`

**Interfaces:**
- Consumes: None (independent foundational package).
- Produces: `@cust-post/backend` barrel exports: rule calculators, storage services, schemas, and types.

- [ ] **Step 1: Create backend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 2: Move backend directories and code into backend/src/**

Move:
- `src/lib/compost-rules` to `backend/src/compost-rules`
- `src/lib/services` to `backend/src/services`
- `src/lib/validation` to `backend/src/validation`
- `src/lib/data` to `backend/src/data`
- `src/types` to `backend/src/types`
- `src/lib/supabase` to `backend/src/supabase`
- `src/lib/auth.ts` to `backend/src/auth/auth.ts`
- `supabase/migrations` to `backend/supabase/migrations`

- [ ] **Step 3: Create backend/src/index.ts barrel file**

```ts
// Domain Types
export * from "./types/domain";

// Rule Engine
export * from "./compost-rules/volume-calculator";
export * from "./compost-rules/container-evaluator";
export * from "./compost-rules/mixture-evaluator";
export * from "./compost-rules/method-recommender";
export * from "./compost-rules/readiness-evaluator";
export * from "./compost-rules/troubleshooter";

// Validation Schemas
export * from "./validation/space-container.schema";
export * from "./validation/waste-materials.schema";
export * from "./validation/batch.schema";
export * from "./validation/batch-observation.schema";
export * from "./validation/feedback.schema";

// Services
export * from "./services/batch-storage.service";
export * from "./services/community.service";

// Data Registries
export * from "./data/sources-registry";
export * from "./data/plants-data";

// Supabase
export * from "./supabase/client";
```

- [ ] **Step 4: Move backend unit tests into backend/tests/**

Move:
- `tests/unit/volume-calculator.test.ts` -> `backend/tests/volume-calculator.test.ts`
- `tests/unit/container-evaluator.test.ts` -> `backend/tests/container-evaluator.test.ts`
- `tests/unit/mixture-evaluator.test.ts` -> `backend/tests/mixture-evaluator.test.ts`
- `tests/unit/method-recommender.test.ts` -> `backend/tests/method-recommender.test.ts`
- `tests/unit/readiness-evaluator.test.ts` -> `backend/tests/readiness-evaluator.test.ts`
- `tests/unit/troubleshooter.test.ts` -> `backend/tests/troubleshooter.test.ts`
- `tests/unit/schemas.test.ts` -> `backend/tests/schemas.test.ts`
- `tests/unit/rls-sql.test.ts` -> `backend/tests/rls-sql.test.ts`
- `tests/unit/data-registry.test.ts` -> `backend/tests/data-registry.test.ts`

- [ ] **Step 5: Verify backend tests pass**

Run: `npx vitest run backend/tests`
Expected: PASS all backend unit tests.

- [ ] **Step 6: Commit backend package**

```bash
git add backend/
git commit -m "feat(backend): populate @cust-post/backend package with rules, services, schemas and tests"
```

---

### Task 3: Assemble & Configure `@cust-post/frontend`

**Files:**
- Create: `frontend/tsconfig.json`
- Create: `frontend/next.config.ts`
- Move: `src/app/` -> `frontend/src/app/`
- Move: `src/components/` -> `frontend/src/components/`
- Move: `src/lib/stores/` -> `frontend/src/lib/stores/`
- Move: `src/lib/utils.ts` -> `frontend/src/lib/utils.ts`
- Move: `public/` -> `frontend/public/`
- Move: `tailwind.config.ts` -> `frontend/tailwind.config.ts`
- Move: `postcss.config.mjs` -> `frontend/postcss.config.mjs`
- Move remaining frontend tests -> `frontend/tests/`

**Interfaces:**
- Consumes: `@cust-post/backend` exported types, schemas, and rule calculators.
- Produces: Next.js 15 client-facing application.

- [ ] **Step 1: Create frontend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@cust-post/backend": ["../backend/src/index.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Configure frontend/next.config.ts with transpilePackages**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cust-post/backend"],
};

export default nextConfig;
```

- [ ] **Step 3: Move frontend assets, components, pages, and client stores into frontend/**

Move:
- `src/app` -> `frontend/src/app`
- `src/components` -> `frontend/src/components`
- `src/lib/stores` -> `frontend/src/lib/stores`
- `src/lib/utils.ts` -> `frontend/src/lib/utils.ts`
- `public` -> `frontend/public`
- `tailwind.config.ts` -> `frontend/tailwind.config.ts`
- `postcss.config.mjs` -> `frontend/postcss.config.mjs`
- `tests/unit/*.test.tsx` -> `frontend/tests/`

- [ ] **Step 4: Update import references in frontend to import from `@cust-post/backend`**

Update imports in:
- `frontend/src/lib/stores/setup-wizard.store.ts`: import domain types and validation schemas from `@cust-post/backend`
- `frontend/src/components/setup/*.tsx`: import volume and mixture calculators from `@cust-post/backend`
- `frontend/src/components/compost/*.tsx`: import evaluator and recommender functions from `@cust-post/backend`
- `frontend/src/app/(app)/**/*.tsx`: import services and registries from `@cust-post/backend`
- `frontend/src/app/api/**/*.ts`: import services and schemas from `@cust-post/backend`

- [ ] **Step 5: Commit frontend package**

```bash
git add frontend/
git commit -m "feat(frontend): assemble @cust-post/frontend Next.js app consuming backend workspace"
```

---

### Task 4: Link Workspaces, Run Full Test Suite, and Verify Production Build

**Files:**
- Modify: `vitest.config.ts` (include tests from `backend/tests` and `frontend/tests`)
- Remove obsolete source root directories once migrated

**Interfaces:**
- Consumes: Linked workspace packages.
- Produces: Passing test suites and verified production Next.js build from root.

- [ ] **Step 1: Update vitest.config.ts to discover tests in workspaces**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "backend/tests/**/*.{test,spec}.{ts,tsx}",
      "frontend/tests/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@cust-post/backend": path.resolve(__dirname, "./backend/src/index.ts"),
      "@": path.resolve(__dirname, "./frontend/src"),
    },
  },
});
```

- [ ] **Step 2: Run npm install to link workspaces**

Run: `npm install`
Expected: Workspaces `@cust-post/backend` and `@cust-post/frontend` linked successfully.

- [ ] **Step 3: Run full Vitest test suite**

Run: `npx vitest run`
Expected: PASS on all 177 tests across backend and frontend suites.

- [ ] **Step 4: Run production build from root**

Run: `npm run build`
Expected: Next.js compiles production bundle, prerendering all 35 static/dynamic pages with 0 errors.

- [ ] **Step 5: Commit and push monorepo division to git**

```bash
git add .
git commit -m "feat(arch): divide repository into frontend and backend npm workspaces"
git push origin main
```

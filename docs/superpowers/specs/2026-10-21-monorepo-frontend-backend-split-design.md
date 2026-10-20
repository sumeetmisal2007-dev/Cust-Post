# Architectural Design: Monorepo Frontend & Backend Division

## 1. Context & Objectives

Cust-Post has evolved from a single monolithic Next.js repository into a feature-complete urban composting assistant with domain-driven rule evaluation, client-side offline persistence, community exchange services, database models, and explainable recommendations.

To improve modularity, maintainability, and code organization, the codebase is being structured into dedicated **`frontend/`** and **`backend/`** packages using native **npm workspaces**.

### Core Goals
1. **Clear Architectural Separation**:
   - `frontend/`: Houses the Next.js 15 client-facing user interface, React components, Tailwind styling, Zustand stores, and static assets.
   - `backend/`: Houses the server business logic, Supabase database client, SQL migrations, agronomic rule engine, storage services, and Zod validation schemas.
2. **Type Safety & Code Sharing**:
   - `frontend` consumes `@cust-post/backend` directly as an npm workspace package (`"@cust-post/backend": "*"`).
   - Domain types, validation schemas, and rule calculations are shared seamlessly with complete TypeScript type checking.
3. **Unified Developer Experience**:
   - Single root commands (`npm run dev`, `npm run build`, `npm test`) run across both workspaces without requiring manual terminal juggling or multiple port configurations.
4. **Zero Regressions**:
   - Preserve all existing routes, offline PWA features, guest-mode privacy, botanical theme styling, and 177 unit tests.

---

## 2. Monorepo Directory Layout

```
nir/
├── package.json                         # Root monorepo workspace orchestrator
├── package-lock.json
├── docs/                                # Architecture & design documentation
│   └── superpowers/specs/
│       └── 2026-10-21-monorepo-frontend-backend-split-design.md
├── backend/                             # Package: @cust-post/backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                     # Central barrel export
│   │   ├── compost-rules/               # Agronomic evaluation rule engine
│   │   │   ├── volume-calculator.ts
│   │   │   ├── container-evaluator.ts
│   │   │   ├── mixture-evaluator.ts
│   │   │   ├── method-recommender.ts
│   │   │   ├── readiness-evaluator.ts
│   │   │   └── troubleshooter.ts
│   │   ├── services/                    # Business & data access services
│   │   │   ├── batch-storage.service.ts
│   │   │   └── community.service.ts
│   │   ├── supabase/                    # DB connection & server client
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── validation/                  # Zod validation schemas
│   │   │   ├── space-container.schema.ts
│   │   │   ├── waste-materials.schema.ts
│   │   │   ├── batch.schema.ts
│   │   │   ├── batch-observation.schema.ts
│   │   │   └── feedback.schema.ts
│   │   ├── data/                        # Plant guides & literature sources
│   │   │   ├── sources-registry.ts
│   │   │   └── plants-data.ts
│   │   ├── types/                       # Core domain types & interfaces
│   │   │   └── domain.ts
│   │   └── auth/                        # Better Auth server configuration
│   │       └── auth.ts
│   ├── supabase/                        # Database migrations & RLS policies
│   │   └── migrations/
│   └── tests/                           # Backend unit tests
│       ├── volume-calculator.test.ts
│       ├── container-evaluator.test.ts
│       ├── mixture-evaluator.test.ts
│       ├── method-recommender.test.ts
│       ├── readiness-evaluator.test.ts
│       ├── troubleshooter.test.ts
│       ├── schemas.test.ts
│       ├── rls-sql.test.ts
│       └── batch-api.test.ts
└── frontend/                            # Package: @cust-post/frontend
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── vitest.config.ts
    ├── public/                          # Static assets, icons, botanical photography
    ├── src/
    │   ├── app/                         # Next.js App Router (pages & layout)
    │   │   ├── layout.tsx
    │   │   ├── globals.css              # Botanical gradient & design tokens
    │   │   ├── page.tsx                 # Landing page
    │   │   ├── manifest.ts              # PWA webmanifest
    │   │   ├── (app)/                   # App feature routes
    │   │   │   ├── setup/page.tsx
    │   │   │   ├── setup/result/page.tsx
    │   │   │   ├── batches/page.tsx
    │   │   │   ├── batches/[id]/page.tsx
    │   │   │   ├── batches/[id]/maturity/page.tsx
    │   │   │   ├── batches/[id]/troubleshoot/page.tsx
    │   │   │   ├── plants/page.tsx
    │   │   │   ├── plants/[slug]/page.tsx
    │   │   │   ├── community/page.tsx
    │   │   │   ├── profile/page.tsx
    │   │   │   └── sources/page.tsx
    │   │   └── api/                     # Lightweight API route controllers
    │   │       ├── auth/[...all]/route.ts
    │   │       ├── batches/route.ts
    │   │       ├── batches/[id]/observations/route.ts
    │   │       ├── feedback/route.ts
    │   │       └── user/delete/route.ts
    │   ├── components/                  # UI components
    │   │   ├── setup/
    │   │   ├── compost/
    │   │   ├── dashboard/
    │   │   ├── layout/
    │   │   ├── marketing/
    │   │   ├── plants/
    │   │   ├── pwa/
    │   │   └── ui/
    │   └── lib/                         # Client stores & utilities
    │       ├── stores/
    │       │   └── setup-wizard.store.ts
    │       └── utils.ts
    └── tests/                           # Frontend UI component & page tests
```

---

## 3. Backend Package Specification (`backend/`)

### 3.1 Package Configuration (`backend/package.json`)
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

### 3.2 Main Barrel Export (`backend/src/index.ts`)
The backend exposes clean, centralized access to all domain capabilities:
- **Rule Engines**:
  - `calculateGeometricVolume`, `validateSpaceFit`
  - `evaluateContainer`
  - `evaluateStartingMixture`
  - `recommendCompostingMethod`
  - `evaluateBatchReadiness`
  - `diagnoseCompostIssue`
- **Services**:
  - `batchStorageService`
  - `communityService`
- **Validation Schemas**:
  - `spaceProfileSchema`, `containerCheckSchema`
  - `wasteInputItemSchema`, `wasteInventorySchema`
  - `batchObservationSchema`, `createBatchSchema`
  - `feedbackReportSchema`
- **Data & Types**:
  - `PLANT_GUIDES`, `getSourceByRuleId`, `RULE_SOURCES_REGISTRY`
  - `CompostBatch`, `SpaceDimensions`, `ContainerCheckInputs`, `WasteInputItem`, `RuleSource`

---

## 4. Frontend Package Specification (`frontend/`)

### 4.1 Package Configuration (`frontend/package.json`)
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
  }
}
```

### 4.2 Next.js Transpilation (`frontend/next.config.ts`)
Enable Next.js to compile the local workspace package:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cust-post/backend"],
};

export default nextConfig;
```

### 4.3 API Route Delegation
Next.js route handlers in `frontend/src/app/api/` remain in place to serve API endpoints under the existing origin, importing and executing backend services directly:
```ts
// frontend/src/app/api/batches/route.ts
import { NextResponse } from "next/server";
import { batchStorageService, createBatchSchema } from "@cust-post/backend";

export async function GET() {
  const batches = await batchStorageService.listBatches();
  return NextResponse.json({ success: true, data: batches });
}
```

---

## 5. Root Monorepo Orchestration (`nir/package.json`)

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
    "test": "vitest run",
    "lint": "npm run lint --workspaces"
  },
  "devDependencies": {
    "vitest": "^3.0.7",
    "typescript": "^5.8.2"
  }
}
```

---

## 6. Migration Steps & Execution Flow

1. **Scaffold Directory Structure**:
   - Create `backend/` and `frontend/` folders.
2. **Extract Backend**:
   - Move `compost-rules/`, `services/`, `validation/`, `data/`, `types/`, and `supabase/` into `backend/src/`.
   - Create `backend/src/index.ts` barrel file.
   - Configure `backend/package.json` and `backend/tsconfig.json`.
3. **Assemble Frontend**:
   - Move Next.js `src/app/`, `src/components/`, `src/lib/stores/`, `public/`, and configuration files into `frontend/`.
   - Update `next.config.ts` with `transpilePackages: ["@cust-post/backend"]`.
   - Configure `frontend/package.json` with workspace dependency.
4. **Update Imports & Path Aliases**:
   - Update imports in frontend code referencing backend logic to use `@cust-post/backend`.
5. **Configure Root Orchestration**:
   - Set up root `package.json` workspaces.
   - Link dependencies via `npm install`.
6. **Verify Test Suites & Production Build**:
   - Run Vitest test suite across backend and frontend.
   - Run `npm run build` to confirm clean production Next.js compilation.

---

## 7. Success Criteria
- `npm run dev` boots the Next.js frontend with active backend integration.
- `npm run build` succeeds with all 35 static and dynamic pages generated.
- All 177 Vitest tests pass across backend rules and frontend components.
- Zero drift in UI appearance, PWA functionality, and botanical background theme.

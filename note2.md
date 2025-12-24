# Project Overview (note2)

This document explains the main parts of the **React-Portfolio-sadcn** project, focusing on
source code and runtime behavior. It skips the following config/infra-focused areas:

- `.nginx/`
- `.nx/`
- `.vscode/`
- `.dockerignore`
- `.editorconfig`
- `.eslintignore`
- `.eslintrc.json`
- `.gitignore`
- `.npmrc`
- `.prettierignore`
- `.prettierrc`
- `compose.yaml`
- `Dockerfile`
- `jest.config.ts`
- `jest.preset.js`
- `migrations.json`
- `note.txt`
- `nx.json`
- `package-lock.json`
- `package.json`
- `tsconfig.base.json`

Instead, this file describes the **working code and assets**:

- `apps/`
- `libs/`
- `assets/`
- `tools/`
- Generated output folders: `.next/`, `dist/`
- Dependency folder: `node_modules/`

---

## 1. apps/

The `apps` folder contains runnable applications in this Nx workspace.

### 1.1 apps/personal-portfolio

This is the **main portfolio application**.

Typical responsibilities:
- Defines the frontend user interface for your personal portfolio.
- Uses React + Next.js (and probably shadcn/ui) to render pages and components.
- Consumes shared code from `libs/` (e.g., UI components, state store, i18n).

Common structure you will see inside `apps/personal-portfolio`:
- `app/` or `src/`
  - Page components (e.g., Home, About, Projects, Contact).
  - Layouts and route segments.
  - Page-level data fetching (if using Next.js data functions).
- `public/` (if present)
  - Static assets like images, favicons, etc.

How it fits in the system:
- This app is the **entry point** users see in the browser.
- It imports design system components (buttons, cards, navbars) from `libs/core-components`.
- It uses global state or data utilities from `libs/store` and `libs/i18n`.

### 1.2 apps/personal-portfolio-e2e

This is the **end-to-end (E2E) test project** for the portfolio app.

Typical responsibilities:
- Contains automated browser tests (e.g., Cypress, Playwright, or similar).
- Verifies that important user journeys work:
  - Home page loads.
  - Navigation to sections/routes.
  - Forms (contact forms, etc.) submit correctly.

How it fits in the system:
- Runs against `apps/personal-portfolio` (usually on `nx serve` or a test server).
- Helps you catch regressions when changing UI or behavior.

### 1.3 apps/.gitkeep

- An empty file whose only purpose is to make sure Git tracks the `apps` folder
  even if there are no apps. It has no runtime behavior.

---

## 2. libs/

The `libs` folder contains **reusable code** shared between applications.

### 2.1 libs/core-components

Purpose:
- A library of **UI components** (design system) used by the portfolio app.
- Likely contains shadcn/ui-based components plus any custom building blocks.

Typical content:
- Buttons, inputs, text fields, cards, modals, navbars, footers.
- Section components such as Hero, Skills, Projects list, Contact section.

How it fits in the system:
- Imported into `apps/personal-portfolio` so UI is consistent everywhere.
- Encourages reuse if you ever create more apps in this workspace.

### 2.2 libs/i18n

Purpose:
- Internationalization (i18n) and localization support.

Typical content:
- Translation files (JSON or TS objects) for different languages.
- Helper functions or hooks like `useTranslation`.
- A context/provider that wraps the React tree and provides language strings.

How it fits in the system:
- Used by both `apps/personal-portfolio` and other libs to display translated
  text.
- Allows your portfolio to support multiple languages or locales.

### 2.3 libs/store

Purpose:
- Global state management for the application.

Typical content:
- Stores (Redux, Zustand, or other state libraries).
- Slices or modules that hold things like theme (dark/light), selected language,
  user preferences, fetched data caches, etc.

How it fits in the system:
- Imported by components from `core-components` and by pages in
  `apps/personal-portfolio`.
- Provides a single source of truth for app-wide data.

### 2.4 libs/.gitkeep

- Similar to `apps/.gitkeep`, this empty file ensures Git tracks the `libs`
  folder. It has no effect at runtime.

---

## 3. assets/

### 3.1 assets/open-link.svg

Purpose:
- An SVG icon asset, likely used anywhere a **"open in new tab"** or
  **"external link"** indicator is needed.

How it fits in the system:
- Imported in React components within `apps` or `libs`.
- Keeps icons centralized rather than duplicating SVG code inline.

---

## 4. tools/

### 4.1 tools/tsconfig.tools.json

While this is technically a config file, it is tied to **developer tooling code**.

Purpose:
- TypeScript configuration for any custom tools or scripts inside the `tools`
  folder (e.g., code generators, Nx executors, migrations).

How it fits in the system:
- Ensures tooling scripts compile with the correct TypeScript settings.

---

## 5. Generated & dependency folders

These folders are not edited manually but are important to understand.

### 5.1 .next/

Purpose:
- Next.js build output for the portfolio application.

What it contains:
- Compiled server and client bundles.
- Generated pages, route manifests, and other internal Next.js artifacts.

How it fits in the system:
- Used when running `npm run dev`, `npm run build`, or equivalent Nx commands.
- Can be safely deleted; it will be recreated on the next build.

### 5.2 dist/

Purpose:
- Nx build output for apps and libs.

What it contains:
- Production-ready bundles for `apps/personal-portfolio` and its libraries.

How it fits in the system:
- Often used by Docker or deployment scripts to serve the compiled app.
- Like `.next/`, this is generated and can be cleaned when needed.

### 5.3 node_modules/

Purpose:
- Contains all installed dependencies for this workspace.

What it contains:
- React, Next.js, Nx, shadcn/ui, TypeScript, testing libraries, etc.

How it fits in the system:
- Required for development, testing, and building.
- Not committed to Git; recreated via `npm install`.

---

## 6. How everything works together

1. **Core logic & UI** live in `libs/`:
   - `core-components` defines shared UI building blocks.
   - `i18n` handles translations.
   - `store` manages global state.

2. **The main app** (`apps/personal-portfolio`):
   - Composes pages using components from `core-components`.
   - Reads and updates state from `store`.
   - Displays text using translations from `i18n`.

3. **End-to-end tests** (`apps/personal-portfolio-e2e`):
   - Spin up the portfolio app and run browser tests to ensure all key
     flows still work.

4. **Assets and icons** (`assets/`):
   - Provide shared media (like `open-link.svg`) for use across components
     and apps.

5. **Build output** (`.next/`, `dist/`) and **dependencies** (`node_modules/`):
   - Are generated or installed as part of the development/build process.
   - Feed into dockerized or other deployment targets (defined in configs that
     this file intentionally does not describe).

This `note2` file should help you quickly understand **where the real code
lives and how the different projects (apps and libs) relate to each other** in
this monorepo, without diving into the lower-level configuration files.

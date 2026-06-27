# Contributing to bRando.js

Thanks for your interest in contributing! This guide covers everything you need to get the project running locally.

---

## Requirements

- **Node.js** 24 (use [nvm](https://github.com/nvm-sh/nvm): `nvm use` — reads `.nvmrc` automatically)
- **npm** ≥ 11 (bundled with Node 24)

---

## Setup

```bash
git clone https://github.com/yak-was-here/brandojs.git
cd brandojs
npm install
```

That's it. No separate build step is needed to start developing.

---

## Project Structure

```
brandojs/
├── src/
│   ├── bRando.ts           # Core class (background cycling logic)
│   ├── BRando.tsx          # React component (wraps bRando)
│   ├── index.ts            # Package entry point (public exports)
│   ├── bRando.test.ts      # Tests for the core class
│   ├── BRando.test.tsx     # Tests for the React component
│   ├── readme.test.ts      # Sanity checks for README.md
│   ├── test-setup.ts       # Vitest setup (jest-dom matchers)
│   ├── docs/               # TypeDoc entry points
│   └── readme/             # README content fragments (used by demo)
├── demo/
│   ├── index.html          # Demo app root HTML
│   ├── main.tsx            # React entry point
│   └── App.tsx             # Demo UI (uses BRando with ref controls)
├── dist/                   # Built library output (git-ignored)
├── public/                 # Built demo + docs + coverage (git-ignored)
├── vite.config.ts          # Library build + Vitest config
├── vite.demo.config.ts     # Demo app dev server + build config
├── tsconfig.json           # Main TypeScript config (noEmit, for IDE + Vitest)
├── tsconfig.build.json     # Declaration emit config (produces dist/*.d.ts)
├── tsconfig.docs.json      # TypeDoc-specific TypeScript config
└── typedoc.json            # TypeDoc config
```

---

## Development

### Demo site (hot reload)

```bash
npm run dev
```

Opens the demo app at `http://localhost:4000`. Changes to `src/` and `demo/` hot-reload instantly.

> **Viewing docs in dev:** `npm run dev` also starts `typedoc --watch`, so `public/docs/` is built immediately and rebuilt on any source change. The docs are available at `http://localhost:4000/docs/` as soon as TypeDoc finishes its first pass (a few seconds after startup).

---

## Testing

### Run tests once

```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

Coverage is written to `public/coverage/`. Open `public/coverage/lcov-report/index.html` in a browser to view the full report.

Tests use **Vitest** with a **jsdom** environment. React component tests use `@testing-library/react`.

---

## Building

### Full build (what Vercel runs)

```bash
npm run build
```

This runs in sequence:

1. `test:coverage` — all tests must pass and coverage is written to `public/coverage/`
2. `build-coverage-badge` — generates `src/readme/coverage.svg` from the clover XML report
3. `build:lib` — compiles the library to `dist/` (ESM + CJS + type declarations)
4. `build:demo` — builds the demo React app to `public/`
5. `docs` — generates TypeDoc API docs to `public/docs/`

### Build just the library

```bash
npm run build:lib
```

Outputs:
- `dist/index.js` — ESM build
- `dist/index.cjs` — CommonJS build
- `dist/index.d.ts` — TypeScript declarations
- `dist/bRando.d.ts`, `dist/BRando.d.ts` — per-module declarations

### Build just the demo site

```bash
npm run build:demo
```

Outputs the demo React app to `public/`.

### Preview the built demo site

```bash
npm run preview
```

Serves the built `public/` at `http://localhost:4000`. Use this to verify the production build before deploying.

---

## API Docs (TypeDoc)

### Build docs once

```bash
npm run docs
```

Outputs HTML to `public/docs/`. Open `public/docs/index.html` to view.

### Build docs in watch mode

```bash
npm run docs:watch
```

Automatically rebuilds `public/docs/` when source files change.

---

## Code Overview

### Core class — `src/bRando.ts`

Manages background cycling on a DOM element using CSS custom properties and `::after` pseudo-elements. Accepts an `Options` object on construction and exposes `play()`, `pause()`, `next()`, `remove()`, `isRunning()`, and `isRemoved()`.

### React component — `src/BRando.tsx`

Wraps `bRando` inside a `forwardRef` component. Each instance gets a unique `data-brando` attribute as its CSS selector so multiple `<BRando>` components coexist independently. Prop changes are forwarded to the underlying `bRando` instance via individual `useEffect` hooks. The imperative handle (`BRandoHandle`) is exposed via `ref`.

### Demo app — `demo/`

A Vite + React app that showcases the `BRando` component as a full-page background with interactive ref controls. Markdown content from `src/readme/` is imported with `?raw` and rendered at runtime via `marked`.

---

## Making Changes

1. Fork the repo and create a branch from `master`
2. Make your changes in `src/`
3. Add or update tests in `src/*.test.ts` / `src/*.test.tsx`
4. Run `npm test` to verify everything passes
5. Open a pull request against `master`

---

## Publishing (maintainers only)

```bash
npm version patch   # or minor / major
npm publish
```

The `preversion` hook checks out `master`, pulls latest, and runs `npm ci`. The `version` hook runs the full build and stages all changes. The `postpublish` hook pushes the commit and tags to GitHub.

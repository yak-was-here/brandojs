# Migration Report: brandojs v1.1.6 → v2.0.0

Migrated from a Webpack + Jest vanilla-TS library to a Vite + Vitest React component library, npm-publishable, deployed on Vercel.

---

## Phases

- [x] **Phase 1** — Plan (this document)
- [x] **Phase 2** — Fix `.gitignore`
- [x] **Phase 3** — Drop browser API, React-only exports & docs
- [x] **Phase 4** — Convert demo to a React app
- [x] **Phase 5** — Update README source content for React
- [x] **Phase 6** — Restore full build pipeline (scripts, coverage, readme gen, badges)
- [x] **Phase 7** — Vercel configuration & `engines` field
- [x] **Phase 8** — Full build verification

---

## Phase 2 — `.gitignore`

**Problems with the original:**
- `public` was ignored — correct for Vercel (built at deploy time), but `dist/` was left unignored, allowing stale build artifacts to be committed
- Missing: `dist/`, `.env*`, `*.tgz`, `coverage/`

**Fix:** Added `dist/` (Vite rebuilds it fresh; `npm publish` packages it directly from the build output without committing). Added standard ignores for env files and pack artifacts.

---

## Phase 3 — Drop browser API, React-only

**Removed:**
- `src/browser/index.ts` — the `create()` factory function
- `src/browser/index.test.ts` — its tests
- `src/docs/browser.ts` — the browser-focused TypeDoc entry point

**Updated:**
- `src/index.ts` — no longer exports `create`; exports `BRando`, `BRandoProps`, `BRandoHandle`, `Options`, `bRando`
- `src/docs/react.ts` → renamed to `src/docs/index.ts` — single TypeDoc entry covering the full public API
- `typedoc.json` — now uses a single `src/docs/index.ts` entry point

The underlying `bRando` class is still exported as an escape hatch for advanced users who need to target arbitrary DOM elements outside of React.

---

## Phase 4 — Demo as a React app

**Before:** Vanilla HTML page, processed Webpack template syntax, used `bRando.create()` global.

**After:** Full Vite + React app in `src/demo/`:
- `src/demo/index.html` — root HTML with `<div id="root">`
- `src/demo/main.tsx` — React entry (`createRoot`)
- `src/demo/App.tsx` — demo UI using `BRando` with ref controls + rendered markdown
- `src/demo/public/` — static assets (background images, screencap) served verbatim
- `vite.demo.config.ts` — `root: src/demo/`, `@vitejs/plugin-react`, custom `serveDir` middleware

The demo now directly shows `BRando` in use as a full-page background with interactive ref controls.

---

## Phase 5 — README

`@appnest/readme` (blueprint-based generation) was removed entirely. `README.md` is now hand-authored. The `src/readme/` directory is gone.

- Coverage badge served from `https://brandojs.isaacyakl.com/coverage/coverage.svg` (generated fresh each build, not committed)
- Libraries.io badge removed (showed stale data from old npm release)
- Compatibility updated to React-only (`✔️ React 17, 18, 19+`)

---

## Phase 6 — Build pipeline

**Scripts:**

| Script | Description |
|---|---|
| `build` | Full build: tests → badge → lib → demo → docs |
| `build:lib` | `vite build` + `tsc` declarations |
| `build:demo` | Vite demo app → `public/` |
| `build-coverage-badge` | `coverage-badger` from clover XML → `public/coverage/coverage.svg` |
| `test` | `vitest run` |
| `test:watch` | `vitest` (watch mode) |
| `test:coverage` | `vitest run --coverage` (outputs to `public/coverage/`) |
| `dev` | `concurrently`: Vite dev server (port 4000) + `typedoc --watch` |
| `preview` | Serve built `public/` on port 4000 |
| `docs` | `typedoc` |
| `docs:watch` | `typedoc --watch` |
| `preversion` | `git checkout master && git pull && npm ci` |
| `version` | `npm run build && git add -A` |
| `postpublish` | `git push && git push --tags` |

**New devDependencies:**
- `coverage-badger` — SVG badge from clover XML
- `concurrently` — parallel watch processes (`dev` runs Vite + TypeDoc simultaneously)
- `@types/node` — Node.js types (pinned to `24.x` to match `.nvmrc`)

**Vitest coverage config:**
- Reporters: `text`, `lcov`, `clover` (clover required by `coverage-badger`)
- Output: `public/coverage/` (served by Vercel at `/coverage/`)

---

## Phase 7 — Vercel

- `vercel.json` — `buildCommand: npm run build`, `outputDirectory: public`, `framework: null`, `trailingSlash: true`
- `package.json` `engines` field — `node: "24.x"` (pinned major; `>=24` caused Vercel auto-upgrade warning)

---

## What changed (original migration summary)

### Toolchain

| Before | After |
|---|---|
| Webpack 5 (bundler) | Vite 8 (library mode, ESM + CJS) |
| Jest 29 + ts-jest + Babel | Vitest 4 (jsdom environment) |
| typedoc 0.24 + typedoc-plugin-extras 2 | typedoc 0.28 + typedoc-plugin-extras 4 (restored) |
| `@babel/preset-env`, `@babel/preset-typescript` | removed |

### Package shape

| Field | Before | After |
|---|---|---|
| `type` | _(absent, CJS implied)_ | `"module"` |
| `main` | `dist/bRando.js` (UMD) | `dist/index.cjs` |
| `module` | _(absent)_ | `dist/index.js` (ESM) |
| `types` | _(absent)_ | `dist/index.d.ts` |
| `exports` | _(absent)_ | conditional exports map (ESM / CJS / types) |
| `peerDependencies` | _(absent)_ | `react >=17`, `react-dom >=17` (optional — covers 17, 18, 19+) |
| Published size | ~UMD bundle | ~14 kB tarball |

### Files added

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite library build config + Vitest test config |
| `vite.demo.config.ts` | Vite demo app config (dev server + build) |
| `tsconfig.build.json` | Declaration-only emit for `dist/*.d.ts` |
| `tsconfig.docs.json` | TypeDoc-specific tsconfig |
| `typedoc.json` | TypeDoc config (restored and updated for v0.28) |
| `vercel.json` | Vercel deployment config |
| `src/index.ts` | Single package entry point |
| `src/BRando.tsx` | React component with full JSDoc |
| `src/BRando.test.tsx` | 15 React component tests |
| `src/test-setup.ts` | Registers `@testing-library/jest-dom` matchers |
| `src/docs/index.ts` | Single TypeDoc entry (replaces browser.ts + react.ts) |
| `src/demo/index.html` | React app root HTML |
| `src/demo/main.tsx` | React entry point |
| `src/demo/App.tsx` | Demo UI component |

### Files removed

- `webpack.config.js`
- `jest.config.ts`
- `src/browser/index.ts`
- `src/browser/index.test.ts`
- `src/docs/browser.ts`
- `src/docs/react.ts`

### Files modified

| File | Change |
|---|---|
| `src/bRando.ts` | `_changer` type: `number` (sentinel `-1`) → `ReturnType<typeof setInterval> \| null` |
| `src/bRando.test.ts` | `jest.*` → `vi.*`; `-1` sentinel → `.toBeNull()`; `getComputedStyle(el, "::after")` → `el.style.cssText` |
| `src/docs/index.ts` | Single entry: exports `BRando`, `BRandoProps`, `BRandoHandle`, `bRando`, `Options` |
| `src/readme/installation-usage.md` | Replaced vanilla JS examples with React `<BRando />` quick-start |
| `src/readme/todo.md` | Marked React component done; updated ideas |
| `src/readme/badges.md` | Removed stale `dist/bRando.js` file-size badge |
| `src/readme/blueprint.json` | Updated bullets: React now supported |
| `src/readme/readme.md.test.ts` | Migrated to Vitest (`// @vitest-environment node`) |
| `tsconfig.json` | Vite-compatible (`moduleResolution: bundler`, `jsx: react-jsx`, `noEmit: true`) |
| `tsconfig.build.json` | Added `rootDir: ./src` (required by TS 6) |
| `package.json` | Full rewrite of scripts; added `exports`/`module`/`types`; `engines`; `peerDependencies` |
| `.gitignore` | Added `dist/`; added standard env/pack ignores |

---

## Known limitations

- `getComputedStyle(el, "::after")` is not implemented in jsdom, so tests verify CSS custom properties via `element.style.cssText` instead. Browser behaviour is unchanged.
- `gaID` was dropped from typedoc-plugin-extras v4 — Google Analytics tracking in TypeDoc docs is no longer active.

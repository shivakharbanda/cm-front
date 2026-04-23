# Frontend

React 19 + Vite 6 SPA for managing Instagram automations and link-in-bio pages. Calls the `automation_service` REST API.

> `README.md` in this directory is boilerplate from the `react-shadcn-starter` template. Ignore it — this file is the source of truth.

## Tech stack

- React 19.0, TypeScript ~5.7
- Vite 6.2 (build, dev server on 5173)
- Tailwind CSS 4 via `@tailwindcss/vite`
- shadcn/ui components (Radix primitives, `components.json` for generator config)
- react-router-dom 7.3
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop bio editor
- recharts 3 for analytics charts
- sonner for toasts
- `vite-plugin-pwa` (manifest + offline)
- ESLint 9 + typescript-eslint 8

## Project structure

```
src/
├── main.tsx                    # React 19 root, AuthProvider + ThemeProvider wrappers
├── App.tsx                     # Thin wrapper around Router
├── Router.tsx                  # Route table (see below)
├── index.css                   # Tailwind entry + global tokens
├── components/
│   ├── app-layout.tsx          # Outlet wrapper with header/sidebar/footer/bottomnav
│   ├── app-header.tsx | app-sidebar.tsx | app-footer.tsx | app-bottomnav.tsx
│   ├── app-logo.tsx | mode-toggle.tsx | auth-btns.tsx | page-header.tsx
│   ├── CreateAutomationDialog.tsx | EditAutomationDialog.tsx
│   ├── CarouselCardEditor.tsx | CarouselPreview.tsx | TextPreview.tsx
│   ├── InstallPrompt.tsx       # PWA install prompt UI
│   ├── bio/                    # Bio-editor building blocks
│   ├── icons/
│   └── ui/                     # shadcn primitives
├── pages/
│   ├── Dashboard.tsx
│   ├── LoginForm.tsx | RegistrationForm.tsx
│   ├── InstagramCallback.tsx
│   ├── AutomationAnalyticsPage.tsx
│   ├── PublicBioPage.tsx       # unauthenticated
│   ├── NotMatch.tsx            # 404
│   └── bio/
│       ├── BioEditorPage.tsx
│       ├── BioAnalyticsPage.tsx
│       └── BioSettingsPage.tsx
├── contexts/
│   ├── AuthContext.tsx         # current user, login/logout, auto-refresh
│   └── ThemeContext.tsx        # dark/light
├── hooks/
│   ├── use-mobile.ts
│   ├── use-pwa-install.ts
│   └── useBioPage.ts
├── lib/                        # API client layer — see below
├── types/                      # Shared TS types (bio.ts, etc.)
├── config/                     # App metadata, nav menu definitions
└── styles/
```

Path alias: `@/` → `./src/` (see `tsconfig.json`, `vite.config.ts`).

## Routes

From `src/Router.tsx`:

| Path | Component | Auth | Layout |
|---|---|---|---|
| `bio/:slug` | `PublicBioPage` | public | none (bare) |
| `` (index) | `Dashboard` | yes | `AppLayout` |
| `login` | `LoginForm` | — | `AppLayout` |
| `register` | `RegistrationForm` | — | `AppLayout` |
| `auth/instagram/callback` | `InstagramCallback` | yes | `AppLayout` |
| `automations/:id/analytics` | `AutomationAnalyticsPage` | yes | `AppLayout` |
| `bio` | `BioEditorPage` | yes | `AppLayout` |
| `bio/analytics` | `BioAnalyticsPage` | yes | `AppLayout` |
| `bio/settings` | `BioSettingsPage` | yes | `AppLayout` |
| `*` | `NotMatch` | — | `AppLayout` |

The only non-layout route is the public bio page so it renders clean for end-users/visitors.

## API client layer

`src/lib/api.ts` exports `fetcher<T>(path, options?)`:

- Sends `credentials: 'include'` on every request (JWT is in an httpOnly cookie set by the API).
- Prefixes requests with `API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'`.
- Normalises error shapes (`detail`, `non_field_errors`, per-field errors) into a thrown `Error`.
- Returns `undefined` on 204; parses JSON when `content-type` is JSON, otherwise text.

Domain wrappers built on `fetcher`:

| File | Covers |
|---|---|
| `lib/auth.ts` | login, register, logout, `getCurrentUser` |
| `lib/automations.ts` | automation CRUD |
| `lib/bio.ts` | bio pages, links, cards, page items, routing rules, leads, analytics |
| `lib/instagram.ts` | OAuth URL generation, account info |
| `lib/utils.ts` | shared helpers |

When adding a new API call, put it in the matching `lib/*.ts` file and call `fetcher` — don't reach into `fetch` directly.

## Auth flow

1. `LoginForm` / `RegistrationForm` POSTs to `/api/v1/auth/...`.
2. Server sets an httpOnly JWT cookie.
3. `AuthContext` (`contexts/AuthContext.tsx`) holds the current user, exposes `login` / `logout`.
4. Every subsequent `fetcher` call includes the cookie automatically (`credentials: 'include'`).
5. Logout clears server cookie and client auth state, redirects to `/login`.

Because cookies are credentialed, the backend's `FRONTEND_URL` (CORS) must match the exact origin this app is served from.

## Environment variables

- `VITE_API_URL` — backend base URL. Defaults to `http://localhost:8000` in `lib/api.ts`.
- `VITE_BASE_URL` — Vite `base` path (used for subdirectory deploys, e.g. GitHub Pages).
- `VITE_USE_HASH_ROUTE` — enable hash routing for static-host deploys.
- `VITE_APP_NAME` — display name.

## Commands

```bash
npm install
npm run dev          # Vite dev server on :5173
npm run build        # tsc -b && vite build  (outputs to dist/)
npm run preview      # serve dist/ locally
npm run lint         # eslint
npm run build:gh     # GH Pages build (sets VITE_BASE_URL + hash routing)
```

## PWA notes

`vite-plugin-pwa` is configured in `vite.config.ts`. If you change the manifest or service-worker config, run a fresh `npm run build` + `npm run preview` to test — HMR does not exercise the service worker.

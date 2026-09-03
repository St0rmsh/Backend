# Testing and QA

## Commands

- `npm test` runs Vitest unit and component tests.
- `npm run test:watch` runs Vitest interactively.
- `npm run test:e2e` runs Playwright smoke tests in Chromium and mobile emulation.
- `npm run lint` runs ESLint.
- `npm run build` runs the TypeScript and Vite production build.

## Current coverage

The initial suite covers theme mode class application, PWA connection/install state, and image/video upload validation. Browser smoke tests cover guest login routing and the offline fallback route.

## QA findings

- Focused frontend TypeScript, ESLint, and Vitest checks pass.
- Backend TypeScript checks pass.
- The TypeScript check and Vite production build pass. The build emits the manifest and Workbox service worker.
- Full ESLint currently reports 103 legacy issues, primarily explicit `any`, `@ts-nocheck`, and unused values in older admin and feature modules. These remain a release quality task.
- `npm install` reports 38 dependency vulnerabilities (29 moderate, 9 high). No automatic dependency upgrade was applied because it can introduce breaking changes; these should be reviewed before release.
- Playwright smoke tests pass in Chromium desktop and Pixel 5 mobile projects after `npx playwright install chromium`.

## Next QA slices

Add authenticated MSW integration coverage for feed, settings, follows, comments, likes, bookmarks, and upload flows. Add accessibility scans and network-failure scenarios once the application build blockers are resolved.

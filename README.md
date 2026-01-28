# rn-number-input

Monorepo for developing a React Native-compatible number input component **using react-native-web only** (no emulators).

## Quick start

```bash
cd C:\Users\brian\sites\rn-number-input
npm install
npm run dev:web
```

Then open the URL Vite prints.

## Repo layout

- `packages/core` → the reusable component package (`@rn-number-input/core`)
- `apps/web` → Vite + React + react-native-web playground

## Notes

- The web app aliases `react-native` → `react-native-web` in `apps/web/vite.config.ts`.
- The web app imports the package source directly for fast iteration.

# Documentation site

VitePress documentation for `@rn-number-input/core`, deployable to GitHub Pages.

## Local development

```bash
npm run dev:docs
```

Open the URL VitePress prints (e.g. `http://localhost:5173/react-fancy-number-input/`).

## Preview production build

```bash
npm run build:docs
npm run preview:docs
```

## Deploy to GitHub Pages

```bash
npm run deploy:docs
```

This builds the docs and pushes the output to the `gh-pages` branch.

**GitHub setup:** In your repo settings, go to **Settings → Pages** and set **Source** to "Deploy from a branch", **Branch** to `gh-pages`, and **Folder** to `/ (root)`.

After deployment, the site is available at:

https://brianephraim.github.io/react-fancy-number-input/

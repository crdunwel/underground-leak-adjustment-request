# underground-leak-adjustment-request

Small React + Vite utility app scaffold.

## What is included

- React + Vite
- TypeScript
- GitHub Pages deployment
- Basic app structure
- Shared folders for components, data, styles, and lib helpers
- Print CSS starter
- Base-aware asset helper
- Simple starter page

## Setup

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev       # start local dev server and open browser
npm run build     # type-check and create production build
npm run lint      # run eslint
npm run preview   # preview production build
npm run deploy    # build and deploy dist/ to GitHub Pages
```

## GitHub Pages

This app is configured for a GitHub repo named:

```txt
underground-leak-adjustment-request
```

The Vite base path is:

```ts
base: '/underground-leak-adjustment-request/'
```

After creating the GitHub repo:

```bash
git remote add origin https://github.com/YOUR_USERNAME/underground-leak-adjustment-request.git
git branch -M main
git push -u origin main
npm run deploy
```

Then enable Pages:

```txt
Settings → Pages → Deploy from branch → gh-pages → /root
```

## Structure

```txt
src/
  components/
    ExampleCard.tsx
  data/
    appConfig.ts
  lib/
    assetPath.ts
  styles/
    app.css
    print.css
  App.tsx
  index.css
  main.tsx
```

## Static assets

Static assets go in:

```txt
public/
```

Use the helper:

```ts
import { assetPath } from './lib/assetPath'

const imageUrl = assetPath('image.png')
```

This works locally and on GitHub Pages.

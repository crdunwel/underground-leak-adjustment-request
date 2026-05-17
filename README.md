# Underground Leak Adjustment Request

A small React + Vite utility app that helps Miami-Dade homeowners complete the official Underground / Concealed Leak Adjustment Request form.

The app:
- walks the user through the form step-by-step
- captures a digital signature
- generates a completed PDF packet in the browser
- supports repair photos and supporting documents
- works entirely client-side (no backend)

---

# Features

- React + Vite + TypeScript
- Client-side PDF generation with `pdf-lib`
- Digital signature capture
- Repair photo uploads
- Invoice / supporting document uploads
- HEIC / HEIF / WEBP image conversion
- Draft persistence using IndexedDB + localStorage
- GitHub Pages ready
- Mobile-friendly workflow
- No server required

---

# Local Development

## 1. Install dependencies

```bash
npm install
```

## 2. Start the app

```bash
npm run dev
```

Then open the local URL shown in the terminal.

Usually:

```txt
http://localhost:5173
```

---

# Available Commands

```bash
npm run dev       # start local dev server
npm run build     # create production build
npm run preview   # preview production build locally
npm run lint      # run eslint
```

---

# Project Structure

```txt
src/
  components/
  data/
  lib/
  styles/
  types/
  App.tsx

public/
  underground-leak-adjustment-request.pdf
```

---

# Important Notes

## This app is NOT Miami-Dade Government

This tool only helps users complete the official form.

Users still submit the packet themselves.

---

## Data Storage

The app stores drafts locally in the browser using:
- IndexedDB
- localStorage

No data is uploaded to a server.

---

# GitHub Pages Deployment

This project is configured for GitHub Pages.

Expected repo name:

```txt
underground-leak-adjustment-request
```

## vite.config.ts

Make sure the base path matches the repo name:

```ts
base: '/underground-leak-adjustment-request/'
```

---

## Deploy

Push to GitHub normally:

```bash
git add .
git commit -m "Initial commit"
git push
```

GitHub Actions handles deployment automatically.

Live URL:

```txt
https://miamileakadjustment.com/
```

---

# Static Assets

Place static files inside:

```txt
public/
```

Use the helper:

```ts
import { assetPath } from './lib/assetPath'

const url = assetPath('image.png')
```

This ensures assets work both locally and on GitHub Pages.

---

# License

MIT
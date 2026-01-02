# RecyClose

RecyClose is a personal side project exploring how a mobile-first interface can make recycling drop-off information easier to discover and understand.  
The project is built in collaboration with an independent UI/UX designer, with a strong focus on layout, interaction flow, and map-based exploration.

This is an early-stage prototype rather than a production system.

---

## What it does (current state)

### Map-based drop-off search
Browse recycling drop-off centers on an interactive Mapbox map.

### Recycling item database
A structured database of common recyclable items, grouped by category, with images and short explanations.

### Saved items (local)
Users can save database items locally in the browser (no account required).

### Mobile-first UI
Designed and developed primarily for small screens, inspired by native map apps.

---

## What this project is (and isn’t)

- Drop-off locations and recycling data are **mock / placeholder data**
- There is **no backend or authentication**
- Saved items use **local browser storage only**
- Images are manually added assets, not dynamically fetched
- The project focuses on **UI, interaction, and structure**, not data completeness

---

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Mapbox GL JS

---

## Project structure (high-level)

- `app/(main)/dropoff`  
  Map-based drop-off search experience, including the bottom sheet and map interactions.

- `app/(main)/database`  
  Recycling item database pages (home, category, and item detail).

- `lib/databaseData.ts`  
  Static database definitions for recycling categories and items.

- `lib/savedDb.ts`  
  Local save / unsave logic using browser storage.

---

## Getting started (local)

### Install dependencies
```bash
npm install

# Local Community Map 📍

A small demo app built with **React**, **TypeScript**, and **Vite** that uses **Leaflet** and **react-leaflet** to display local places on a map. You can add, import, and export places, filter by category, and view places both on the map and in a list.

---

## Features ✅

- Add new places by placing a pin on the map (draggable marker for new places)
- Filter places by category (categories live in `src/data/categories.ts`)
- Interactive list and map: selecting a list item opens the map popup and centers the map optionally
- Import / Export places: supports **GeoJSON** and **CSV** formats
- Show user location and optionally sort by distance

---

## Quick Start 🚀

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
# open http://localhost:5173
```

3. Build and preview

```bash
npm run build
npm run preview
```

4. Lint

```bash
npm run lint
```

---

## Project Structure 🔧

- `src/components/` — UI components (`MapView.tsx`, `LocationList.tsx`, `AddLocationForm.tsx`, `CategoryFilter.tsx`)
- `src/data/`
  - `categories.ts` — category list (string union)
  - `locations.ts` — example locations and `LocationItem` type
- `src/utils/`
  - `fixLeafletIcon.ts` — fixes Leaflet default icon paths (imported in `App.tsx`)
  - `markerIcons.ts` — category-based marker icons
  - `distance.ts` — haversine distance utility
- `public/` — static assets

---

## Data import/export ✉️

- Export to GeoJSON or CSV from the UI
- Import GeoJSON (FeatureCollection of Point features) or CSV with headers: `id,name,category,lat,lng,description`

---

## Customization Tips 💡

- Add or remove categories in `src/data/categories.ts` to change the filter options
- Modify `src/utils/markerIcons.ts` to provide different marker styles per category

---

## License & Notes ⚠️

This repository currently does not include a `LICENSE` file. Add a license (for example MIT) if you intend to publish the project publicly.

> Note: Allow your browser to access location services to use the "show my location" and "sort by distance" features.
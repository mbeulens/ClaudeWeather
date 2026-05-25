# ClaudeWeather

A full-screen map of the world with live weather (sun / cloud / rain icons + temperature) per region. Opens centered on Europe.

- **Map:** Leaflet, full viewport — toggle between **Satellite** (Esri World Imagery, default) and **Map** (CartoDB Positron)
- **Data:** [Open-Meteo](https://open-meteo.com) (free, no API key required)
- **Granularity:** countries shaded by temperature + city markers (icon + temp); click a country for its capital's weather
- **Forecast slider:** scrub from today through +7 days; fills and markers re-style in place
- **Zoom-based cities:** 241 capitals load up front; cities (≥100k population) reveal as you zoom in
- **Decluttering:** overlapping markers are thinned at each zoom (capitals / larger cities win)
- **Caching:** weather is cached in `localStorage` for 1 hour, so reloads are instant
- **Stack:** Plain HTML / CSS / JavaScript — no build step

## Run

Open `index.html` directly in a browser, or serve the folder over a local HTTP server (recommended, so `fetch` against the GeoJSON works on all browsers):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project layout

| File             | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| `index.html`     | Leaflet container + forecast slider markup + script tags             |
| `style.css`      | Full-bleed map, marker / popup / legend / slider styles              |
| `app.js`         | Weather fetch + cache, country shading, markers, slider, zoom, declutter |
| `world.geo.json` | Bundled GeoJSON of world countries (Natural Earth)                   |
| `capitals.json`  | 241 national capitals, always loaded                                 |
| `cities.json`    | World cities ≥100k population, tiered by `minZoom`                   |
| `VERSION`        | Current semver                                                       |
| `CHANGELOG.md`   | Release history                                                      |

## Versioning

Patch bumps land on every file edit in `dev`. Minor / major bumps are explicit release ceremonies that merge `dev` into `main`.

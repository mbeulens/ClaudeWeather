# ClaudeWeather

A full-screen map of Europe with live weather (sun / cloud / rain icons + temperature) per region.

- **Map:** Leaflet + CartoDB Positron tiles, full viewport
- **Data:** [Open-Meteo](https://open-meteo.com) (free, no API key required)
- **Granularity:** European countries (shaded by temperature) + capital-city markers (icon + temp)
- **Forecast slider:** scrub from today through +5 days; fills and markers re-style in place
- **Zoom-based cities:** 51 capitals load up front; more cities appear as you zoom in
- **Stack:** Plain HTML / CSS / JavaScript — no build step

## Run

Open `index.html` directly in a browser, or serve the folder over a local HTTP server (recommended, so `fetch` against the GeoJSON works on all browsers):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project layout

| File              | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `index.html`      | Leaflet container + forecast slider markup + script tags   |
| `style.css`       | Full-bleed map, marker / tooltip / legend / slider styles  |
| `app.js`          | Weather fetch, country shading, markers, slider, zoom logic |
| `europe.geo.json` | Bundled GeoJSON of European countries                      |
| `cities.json`     | European cities ≥100k population, tiered by `minZoom`       |
| `VERSION`         | Current semver                                             |
| `CHANGELOG.md`    | Release history                                            |

## Versioning

Patch bumps land on every file edit in `dev`. Minor / major bumps are explicit release ceremonies that merge `dev` into `main`.

# Changelog

All notable changes to ClaudeWeather are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-05-25

Goes worldwide. The map now covers the whole planet (opening on Europe), adds a
satellite view, declutters overlapping markers, and caches weather for an hour.

### Added

- **Worldwide coverage** — Natural Earth countries (`world.geo.json`), all 241
  national capitals (`capitals.json`), and ~5,937 cities ≥100k population
  (`cities.json`). The map opens centered on Europe but pans/zooms to the whole
  world.
- **Satellite / Map base-layer toggle** (top-right control), defaulting to
  satellite imagery (Esri World Imagery + place labels). The temperature
  choropleth dims over satellite so the imagery shows through.
- **Marker decluttering** — overlapping weather pills are hidden at each zoom,
  with capitals and larger cities taking priority; more reveal as you zoom in.
- **1-hour weather cache** in localStorage — reloads within the hour render
  instantly and make no API calls.

### Changed

- Country weather now shows in a **popup on click** instead of a hover tooltip.
- Weather batches are fetched in **parallel with a 15s timeout**, and a failed
  batch is skipped rather than stalling the whole load (fixes the slow/“hanging”
  startup with 241 capitals).
- Retitled from “Europe Weather” to “World Weather”.

### Removed

- `europe.geo.json` (replaced by `world.geo.json`).

[0.3.0]: https://github.com/mbeulens/ClaudeWeather/releases/tag/v0.3.0

## [0.2.0] - 2026-05-25

First release ceremony. Bundles the initial weather map plus the 7-day forecast
slider and zoom-based city loading.

### Added

- Full-screen Leaflet map of Europe (CartoDB Positron tiles) with countries
  shaded by temperature and capital-city markers (weather icon + temperature).
- Live weather from the Open-Meteo API (no API key required).
- 7-day forecast slider: scrub from today through +5 days; country fills and
  markers re-style in place as the day changes.
- Zoom-based city loading: 51 capitals load up front, with extra cities
  (`cities.json`, European cities ≥100k population) lazily revealed at higher
  zoom levels via tiered `minZoom` and batched fetches.

### Changed

- Week bar (forecast slider track) is now a single solid blue instead of
  reusing the temperature gradient.

[0.2.0]: https://github.com/mbeulens/ClaudeWeather/releases/tag/v0.2.0

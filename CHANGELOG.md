# Changelog

All notable changes to ClaudeWeather are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

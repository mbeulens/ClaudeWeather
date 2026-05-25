// ClaudeWeather — full-bleed world map with live weather + 7-day forecast.
// National capitals are always visible; extra cities lazy-load as the user
// zooms in. The map opens centered on Europe but pans/zooms to the whole world.

const WEATHER_CODES = {
  0:  { icon: "☀️", label: "Clear sky" },
  1:  { icon: "🌤️", label: "Mainly clear" },
  2:  { icon: "⛅", label: "Partly cloudy" },
  3:  { icon: "☁️", label: "Overcast" },
  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Rime fog" },
  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌧️", label: "Heavy drizzle" },
  56: { icon: "🌧️", label: "Freezing drizzle" },
  57: { icon: "🌧️", label: "Freezing drizzle" },
  61: { icon: "🌦️", label: "Light rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  66: { icon: "🌧️", label: "Freezing rain" },
  67: { icon: "🌧️", label: "Freezing rain" },
  71: { icon: "🌨️", label: "Light snow" },
  73: { icon: "❄️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy snow" },
  77: { icon: "🌨️", label: "Snow grains" },
  80: { icon: "🌦️", label: "Rain showers" },
  81: { icon: "🌧️", label: "Rain showers" },
  82: { icon: "⛈️", label: "Violent rain showers" },
  85: { icon: "🌨️", label: "Snow showers" },
  86: { icon: "❄️", label: "Heavy snow showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Thunderstorm with hail" },
  99: { icon: "⛈️", label: "Thunderstorm with hail" },
};

const TEMP_STOPS = [
  { t: -10, c: [44, 123, 182]  },
  { t:   0, c: [92, 179, 217]  },
  { t:   5, c: [171, 217, 233] },
  { t:  10, c: [217, 240, 163] },
  { t:  15, c: [254, 224, 144] },
  { t:  22, c: [253, 174,  97] },
  { t:  35, c: [215,  25,  28] },
];

function tempToColor(t) {
  if (t == null || Number.isNaN(t)) return "#cccccc";
  if (t <= TEMP_STOPS[0].t) return rgb(TEMP_STOPS[0].c);
  if (t >= TEMP_STOPS[TEMP_STOPS.length - 1].t) return rgb(TEMP_STOPS[TEMP_STOPS.length - 1].c);
  for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
    const a = TEMP_STOPS[i];
    const b = TEMP_STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const r = (t - a.t) / (b.t - a.t);
      return rgb([
        Math.round(a.c[0] + (b.c[0] - a.c[0]) * r),
        Math.round(a.c[1] + (b.c[1] - a.c[1]) * r),
        Math.round(a.c[2] + (b.c[2] - a.c[2]) * r),
      ]);
    }
  }
  return "#cccccc";
}

function rgb([r, g, b]) {
  return `rgb(${r}, ${g}, ${b})`;
}

function describeCode(code) {
  return WEATHER_CODES[code] ?? { icon: "❓", label: "Unknown" };
}

function setStatus(text) {
  const el = document.getElementById("status");
  if (el) el.textContent = text;
}

function showError(message, onRetry) {
  const existing = document.getElementById("error-banner");
  if (existing) existing.remove();
  const banner = document.createElement("div");
  banner.id = "error-banner";
  banner.innerHTML = `<span>${message}</span>`;
  if (onRetry) {
    const btn = document.createElement("button");
    btn.textContent = "Retry";
    btn.addEventListener("click", () => {
      banner.remove();
      onRetry();
    });
    banner.appendChild(btn);
  }
  document.body.appendChild(banner);
}

function debounce(fn, ms) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

function viewForDay(city, day) {
  if (day === 0) {
    const c = city.current;
    if (!c) return null;
    return {
      temp: c.temp,
      code: c.code,
      extras: { humidity: c.humidity, wind: c.wind, updated: c.updated, isToday: true },
    };
  }
  const d = city.daily?.[day];
  if (!d) return null;
  return {
    temp: d.tmax,
    tmax: d.tmax,
    tmin: d.tmin,
    code: d.code,
    extras: { isToday: false, date: d.date },
  };
}

function formatDayHeader(day, sampleCity) {
  const today = new Date();
  if (day === 0) {
    return {
      name: "Today",
      date: new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(today),
    };
  }
  const dateStr = sampleCity?.daily?.[day]?.date;
  const d = dateStr ? new Date(dateStr) : new Date(today.getTime() + day * 86400000);
  return {
    name: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(d),
    date: new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d),
  };
}

// Open-Meteo allows batched lat/lon. Cap each request at MAX_BATCH coordinates.
const MAX_BATCH = 80;
const FETCH_TIMEOUT_MS = 15000;

// Weather is cached in localStorage for one hour, keyed by city. Reloads within
// the hour render instantly and make no network calls — this is what keeps the
// 241-capital startup from stalling on every visit.
const WEATHER_TTL_MS = 60 * 60 * 1000;
const CACHE_PREFIX = "cw:wx:";

function readWeatherCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || Date.now() - entry.t > WEATHER_TTL_MS) return null;
    return { current: entry.current, daily: entry.daily };
  } catch {
    return null;
  }
}

function writeWeatherCache(key, current, daily) {
  const payload = JSON.stringify({ t: Date.now(), current, daily });
  try {
    localStorage.setItem(CACHE_PREFIX + key, payload);
  } catch {
    // Likely quota exceeded — drop our cached entries and try once more.
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
      }
      localStorage.setItem(CACHE_PREFIX + key, payload);
    } catch {
      /* storage unavailable — fetching still works, just uncached */
    }
  }
}

function parseForecast(d) {
  let current = null;
  const daily = [];
  if (d?.current) {
    current = {
      temp:     d.current.temperature_2m,
      code:     d.current.weather_code,
      humidity: d.current.relative_humidity_2m,
      wind:     d.current.wind_speed_10m,
      updated:  d.current.time,
    };
  }
  if (d?.daily?.time) {
    for (let k = 0; k < d.daily.time.length; k++) {
      daily.push({
        date: d.daily.time[k],
        code: d.daily.weather_code?.[k],
        tmax: d.daily.temperature_2m_max?.[k],
        tmin: d.daily.temperature_2m_min?.[k],
      });
    }
  }
  return { current, daily };
}

async function fetchBatch(chunk) {
  const lats = chunk.map((c) => c.lat).join(",");
  const lons = chunk.map((c) => c.lon).join(",");
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=8` +
    `&timezone=auto`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    if (!resp.ok) throw new Error(`Open-Meteo ${resp.status}`);
    const data = await resp.json();
    const list = Array.isArray(data) ? data : [data];
    return chunk.map((c, i) => {
      const { current, daily } = parseForecast(list[i]);
      writeWeatherCache(c.key, current, daily);
      return { ...c, current, daily };
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWeatherForCities(cities) {
  if (cities.length === 0) return [];

  // 1. Serve anything still fresh from the 1-hour cache.
  const out = [];
  const misses = [];
  for (const c of cities) {
    const cached = readWeatherCache(c.key);
    if (cached) out.push({ ...c, current: cached.current, daily: cached.daily });
    else misses.push(c);
  }
  if (misses.length === 0) return out;

  // 2. Fetch the misses as parallel batches with a timeout. A failed or
  //    timed-out batch is skipped (logged), not fatal — partial data still renders.
  const batches = [];
  for (let off = 0; off < misses.length; off += MAX_BATCH) {
    batches.push(misses.slice(off, off + MAX_BATCH));
  }
  const settled = await Promise.allSettled(batches.map(fetchBatch));
  let failed = 0;
  for (const r of settled) {
    if (r.status === "fulfilled") out.push(...r.value);
    else { failed++; console.warn("Weather batch failed", r.reason); }
  }
  if (failed === settled.length && out.length === 0) {
    throw new Error("All weather requests failed");
  }
  return out;
}

function buildMarkerIcon(view) {
  if (!view) {
    return L.divIcon({
      className: "weather-marker",
      html: `<div class="marker-inner"><span class="icon">❓</span><span class="temp">—</span></div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }
  const { icon } = describeCode(view.code);
  const tempStr = view.temp == null ? "—" : `${Math.round(view.temp)}°`;
  return L.divIcon({
    className: "weather-marker",
    html: `<div class="marker-inner"><span class="icon">${icon}</span><span class="temp">${tempStr}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function buildTooltipHtml(city, view) {
  if (!view) return `<strong>${city.name}</strong><br>No data`;
  const { label } = describeCode(view.code);
  if (view.extras?.isToday) {
    return `<strong>${city.name}</strong><br>${Math.round(view.temp)}°C · ${label}`;
  }
  return (
    `<strong>${city.name}</strong> · ${view.extras?.date ?? ""}<br>` +
    `${Math.round(view.tmax)}° / ${Math.round(view.tmin)}° · ${label}`
  );
}

function buildPopupHtml(city, view) {
  if (!view) {
    return `<div class="popup-title">${city.name}, ${city.country}</div><div class="popup-row"><span>No data</span></div>`;
  }
  const { icon, label } = describeCode(view.code);
  if (view.extras?.isToday) {
    const w = view.extras;
    const updated = w?.updated ? new Date(w.updated).toLocaleString() : "—";
    return `
      <div class="popup-title"><span class="icon">${icon}</span>${city.name}, ${city.country}</div>
      <div class="popup-row"><span class="label">Condition</span><span>${label}</span></div>
      <div class="popup-row"><span class="label">Temperature</span><span>${Math.round(view.temp)}°C</span></div>
      <div class="popup-row"><span class="label">Humidity</span><span>${w?.humidity != null ? w.humidity + "%" : "—"}</span></div>
      <div class="popup-row"><span class="label">Wind</span><span>${w?.wind != null ? w.wind + " km/h" : "—"}</span></div>
      <div class="popup-updated">Updated ${updated}</div>
    `;
  }
  const dateLabel = view.extras?.date
    ? new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(new Date(view.extras.date))
    : "—";
  return `
    <div class="popup-title"><span class="icon">${icon}</span>${city.name}, ${city.country}</div>
    <div class="popup-row"><span class="label">Forecast</span><span>${dateLabel}</span></div>
    <div class="popup-row"><span class="label">Condition</span><span>${label}</span></div>
    <div class="popup-row"><span class="label">High</span><span>${view.tmax != null ? Math.round(view.tmax) + "°C" : "—"}</span></div>
    <div class="popup-row"><span class="label">Low</span><span>${view.tmin != null ? Math.round(view.tmin) + "°C" : "—"}</span></div>
  `;
}

const state = {
  map: null,
  cities: [],                       // all cities (capitals + extras), populated incrementally
  citiesByKey: new Map(),           // key → city object (same refs as state.cities)
  countryLayers: new Map(),         // ISO2 → Leaflet path layer (capitals drive country fill)
  weatherMarkers: new Map(),        // key → Leaflet marker
  selectedDay: 0,
  pendingFetchKeys: new Set(),      // keys currently being fetched
  satellite: true,                  // true when the satellite base layer is active (default)
};

function applyDay(day) {
  state.selectedDay = day;

  const sample = state.cities.find((c) => c.daily?.length > 0) ?? state.cities[0];
  const { name, date } = formatDayHeader(day, sample);
  const nameEl = document.getElementById("day-name");
  const dateEl = document.getElementById("day-date");
  if (nameEl) nameEl.textContent = name;
  if (dateEl) dateEl.textContent = date;

  // Country fills are driven by capitals only.
  for (const city of state.cities) {
    if (!city.isCapital) continue;
    const layer = state.countryLayers.get(city.iso);
    if (!layer) continue;
    const view = viewForDay(city, day);
    const t = view?.temp;
    const noData = t == null;
    layer.setStyle({
      fillColor: tempToColor(t),
      fillOpacity: state.satellite ? (noData ? 0.08 : 0.32) : (noData ? 0.15 : 0.55),
    });
    layer.setTooltipContent(buildTooltipHtml(city, view));
  }

  // Update all live markers.
  for (const [key, marker] of state.weatherMarkers) {
    const city = state.citiesByKey.get(key);
    if (!city) continue;
    const view = viewForDay(city, day);
    marker.setIcon(buildMarkerIcon(view));
    marker.setTooltipContent(buildTooltipHtml(city, view));
    marker.setPopupContent(buildPopupHtml(city, view));
  }
}

function addMarkerForCity(city) {
  if (state.weatherMarkers.has(city.key)) return;
  const view = viewForDay(city, state.selectedDay);
  if (!view) return;
  const marker = L.marker([city.lat, city.lon], {
    icon: buildMarkerIcon(view),
    keyboard: false,
    riseOnHover: true,
  }).addTo(state.map);
  marker.bindTooltip(buildTooltipHtml(city, view), {
    className: "weather-tooltip",
    direction: "top",
    offset: [0, -10],
  });
  marker.bindPopup(buildPopupHtml(city, view), { maxWidth: 260 });
  state.weatherMarkers.set(city.key, marker);
}

function setMarkerVisibility(city, visible) {
  const marker = state.weatherMarkers.get(city.key);
  if (!marker) return;
  if (visible && !state.map.hasLayer(marker)) marker.addTo(state.map);
  else if (!visible && state.map.hasLayer(marker)) state.map.removeLayer(marker);
}

// Approx on-screen footprint of a marker pill (centered on its point), plus a
// little breathing room, used for collision tests.
const MARKER_W = 68;
const MARKER_H = 34;

// Higher wins when two markers collide: capitals outrank extras; ties broken by
// population (capitals carry exact pop; extras use their zoom tier as a proxy).
function cityPriority(city) {
  if (city.isCapital) return 2e9 + (city.pop || 0);
  return { 5: 500000, 6: 200000, 7: 100000 }[city.minZoom] || 0;
}

// Hide markers that would overlap a higher-priority neighbour at the current
// zoom; reveal more as the user zooms in. Greedy, highest priority placed first.
function declutter() {
  const map = state.map;
  if (!map) return;
  const zoom = map.getZoom();
  const bounds = map.getBounds();

  const candidates = [];
  for (const city of state.cities) {
    if (!state.weatherMarkers.has(city.key)) continue;
    const zoomOk = city.isCapital || zoom >= city.minZoom;
    if (zoomOk && bounds.contains([city.lat, city.lon])) candidates.push(city);
    else setMarkerVisibility(city, false);
  }
  candidates.sort((a, b) => cityPriority(b) - cityPriority(a));

  const placed = [];
  for (const city of candidates) {
    const p = map.latLngToContainerPoint([city.lat, city.lon]);
    let collides = false;
    for (const q of placed) {
      if (Math.abs(p.x - q.x) < MARKER_W && Math.abs(p.y - q.y) < MARKER_H) {
        collides = true;
        break;
      }
    }
    setMarkerVisibility(city, !collides);
    if (!collides) placed.push(p);
  }
}

async function recomputeVisible() {
  const map = state.map;
  if (!map) return;
  const zoom = map.getZoom();
  const bounds = map.getBounds();

  const needFetch = [];
  for (const city of state.cities) {
    const eligible = city.isCapital || (zoom >= city.minZoom && bounds.contains([city.lat, city.lon]));
    if (eligible && !city.current && !state.pendingFetchKeys.has(city.key)) {
      needFetch.push(city);
    }
  }

  // Reveal/hide existing markers based on overlap at the current zoom.
  declutter();

  if (needFetch.length === 0) return;

  for (const c of needFetch) state.pendingFetchKeys.add(c.key);
  try {
    const fetched = await fetchWeatherForCities(needFetch);
    for (const fc of fetched) {
      const stored = state.citiesByKey.get(fc.key);
      if (!stored) continue;
      stored.current = fc.current;
      stored.daily = fc.daily;
      addMarkerForCity(stored);
    }
    // After adding new markers, ensure they reflect the selected day and
    // re-run collision layout so the new pills don't overlap.
    applyDay(state.selectedDay);
    declutter();
  } catch (err) {
    console.error("Lazy city fetch failed", err);
  } finally {
    for (const c of needFetch) state.pendingFetchKeys.delete(c.key);
  }
}

function wireSlider() {
  const slider = document.getElementById("day-slider");
  if (!slider) return;
  slider.addEventListener("input", (e) => {
    const day = Number(e.target.value);
    applyDay(day);
  });
}

async function loadCapitals() {
  const r = await fetch("capitals.json");
  if (!r.ok) throw new Error(`capitals.json ${r.status}`);
  const data = await r.json();
  return data.map((c) => ({
    key: `cap:${c.iso}`,
    iso: c.iso,
    name: c.name,
    country: c.country,
    lat: c.lat,
    lon: c.lon,
    pop: c.pop ?? 0,
    minZoom: 0,
    isCapital: true,
  }));
}

async function loadExtraCities() {
  try {
    const r = await fetch("cities.json");
    if (!r.ok) throw new Error(`cities.json ${r.status}`);
    const data = await r.json();
    return data.map((c) => ({
      key: `city:${c.id}`,
      iso: c.iso,
      name: c.name,
      country: c.country,
      lat: c.lat,
      lon: c.lon,
      minZoom: c.minZoom,
      isCapital: false,
    }));
  } catch (err) {
    console.warn("cities.json missing; only capitals will be shown", err);
    return [];
  }
}

async function init() {
  setStatus("Initializing map…");

  // Opens centered on Europe; pans/zooms to the whole world.
  state.map = L.map("map", {
    zoomControl: true,
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 9,
    maxBounds: [
      [-85, -200],
      [85, 200],
    ],
    maxBoundsViscosity: 0.5,
  }).setView([54, 15], 4);

  // Two switchable base layers: a light vector map and satellite imagery.
  // Each bundles its own label/reference overlay (in shadowPane, above the
  // country choropleth but below the markers).
  const cartoBase = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  });
  const cartoLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    { subdomains: "abcd", maxZoom: 19, pane: "shadowPane" }
  );
  const mapView = L.layerGroup([cartoBase, cartoLabels]);

  const satImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Imagery &copy; <a href=\"https://www.esri.com\">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community",
      maxZoom: 19,
    }
  );
  const satLabels = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19, pane: "shadowPane" }
  );
  const satelliteView = L.layerGroup([satImagery, satLabels]);

  satelliteView.addTo(state.map); // satellite is the default view
  L.control
    .layers(
      { "Satellite": satelliteView, "Map": mapView },
      {},
      { position: "topright" }
    )
    .addTo(state.map);

  // Dim the temperature choropleth over satellite so the imagery shows through.
  state.map.on("baselayerchange", (e) => {
    state.satellite = e.name === "Satellite";
    applyDay(state.selectedDay);
  });

  let geojson, capitals;
  try {
    setStatus("Loading world map…");
    const [geoResp, caps] = await Promise.all([fetch("world.geo.json"), loadCapitals()]);
    if (!geoResp.ok) throw new Error(`GeoJSON ${geoResp.status}`);
    geojson = await geoResp.json();
    capitals = caps;
  } catch (err) {
    console.error(err);
    setStatus("Failed to load map.");
    showError("Could not load world map data.", () => init());
    return;
  }

  // Register capitals and extras into shared state.cities.
  const extras = await loadExtraCities();
  state.cities = [...capitals, ...extras];
  for (const c of state.cities) state.citiesByKey.set(c.key, c);

  // Draw country layer; capture references.
  L.geoJSON(geojson, {
    style: () => ({
      fillColor: "#cccccc",
      fillOpacity: 0.15,
      color: "#ffffff",
      weight: 1,
      opacity: 0.7,
    }),
    onEachFeature: (feature, layer) => {
      const iso = feature.properties.ISO2;
      state.countryLayers.set(iso, layer);
      layer.bindTooltip("", {
        className: "weather-tooltip",
        sticky: true,
        direction: "top",
      });
      layer.on({
        mouseover: (e) => e.target.setStyle({ weight: 2, color: "#222", opacity: 1 }),
        mouseout:  (e) => e.target.setStyle({ weight: 1, color: "#ffffff", opacity: 0.7 }),
      });
    },
  }).addTo(state.map);

  // Fetch capitals up-front and create their markers.
  try {
    setStatus(`Fetching weather + 7-day forecast for ${capitals.length} capitals…`);
    const fetched = await fetchWeatherForCities(capitals);
    for (const fc of fetched) {
      const stored = state.citiesByKey.get(fc.key);
      if (!stored) continue;
      stored.current = fc.current;
      stored.daily = fc.daily;
      addMarkerForCity(stored);
    }
  } catch (err) {
    console.error(err);
    setStatus("Weather unavailable.");
    showError("Could not fetch weather from Open-Meteo.", () => init());
  }

  wireSlider();
  applyDay(0);
  declutter(); // thin out overlapping capitals on the initial view

  // Lazy-load extras on map movement.
  const debounced = debounce(recomputeVisible, 300);
  state.map.on("moveend", debounced);
  state.map.on("zoomend", debounced);

  setStatus(`${capitals.length} capitals · ${extras.length} extra cities (zoom to load) · live + 7-day from Open-Meteo`);
}

document.addEventListener("DOMContentLoaded", init);

// ClaudeWeather — full-bleed Europe map with live weather + 7-day forecast,
// capitals always visible, extra cities lazy-loaded as the user zooms in.

const CAPITALS_RAW = [
  { iso: "AL", name: "Tirana",      country: "Albania",                                    lat: 41.3275, lon: 19.8189 },
  { iso: "AD", name: "Andorra la Vella", country: "Andorra",                               lat: 42.5063, lon:  1.5218 },
  { iso: "AM", name: "Yerevan",     country: "Armenia",                                    lat: 40.1792, lon: 44.4991 },
  { iso: "AT", name: "Vienna",      country: "Austria",                                    lat: 48.2082, lon: 16.3738 },
  { iso: "AZ", name: "Baku",        country: "Azerbaijan",                                 lat: 40.4093, lon: 49.8671 },
  { iso: "BY", name: "Minsk",       country: "Belarus",                                    lat: 53.9006, lon: 27.5590 },
  { iso: "BE", name: "Brussels",    country: "Belgium",                                    lat: 50.8503, lon:  4.3517 },
  { iso: "BA", name: "Sarajevo",    country: "Bosnia and Herzegovina",                     lat: 43.8563, lon: 18.4131 },
  { iso: "BG", name: "Sofia",       country: "Bulgaria",                                   lat: 42.6977, lon: 23.3219 },
  { iso: "HR", name: "Zagreb",      country: "Croatia",                                    lat: 45.8150, lon: 15.9819 },
  { iso: "CY", name: "Nicosia",     country: "Cyprus",                                     lat: 35.1856, lon: 33.3823 },
  { iso: "CZ", name: "Prague",      country: "Czech Republic",                             lat: 50.0755, lon: 14.4378 },
  { iso: "DK", name: "Copenhagen",  country: "Denmark",                                    lat: 55.6761, lon: 12.5683 },
  { iso: "EE", name: "Tallinn",     country: "Estonia",                                    lat: 59.4370, lon: 24.7536 },
  { iso: "FO", name: "Tórshavn",    country: "Faroe Islands",                              lat: 62.0079, lon: -6.7713 },
  { iso: "FI", name: "Helsinki",    country: "Finland",                                    lat: 60.1699, lon: 24.9384 },
  { iso: "FR", name: "Paris",       country: "France",                                     lat: 48.8566, lon:  2.3522 },
  { iso: "GE", name: "Tbilisi",     country: "Georgia",                                    lat: 41.7151, lon: 44.8271 },
  { iso: "DE", name: "Berlin",      country: "Germany",                                    lat: 52.5200, lon: 13.4050 },
  { iso: "GR", name: "Athens",      country: "Greece",                                     lat: 37.9838, lon: 23.7275 },
  { iso: "VA", name: "Vatican City",country: "Holy See (Vatican City)",                    lat: 41.9029, lon: 12.4534 },
  { iso: "HU", name: "Budapest",    country: "Hungary",                                    lat: 47.4979, lon: 19.0402 },
  { iso: "IS", name: "Reykjavík",   country: "Iceland",                                    lat: 64.1466, lon: -21.9426 },
  { iso: "IE", name: "Dublin",      country: "Ireland",                                    lat: 53.3498, lon: -6.2603 },
  { iso: "IL", name: "Jerusalem",   country: "Israel",                                     lat: 31.7683, lon: 35.2137 },
  { iso: "IT", name: "Rome",        country: "Italy",                                      lat: 41.9028, lon: 12.4964 },
  { iso: "LV", name: "Riga",        country: "Latvia",                                     lat: 56.9496, lon: 24.1052 },
  { iso: "LI", name: "Vaduz",       country: "Liechtenstein",                              lat: 47.1410, lon:  9.5209 },
  { iso: "LT", name: "Vilnius",     country: "Lithuania",                                  lat: 54.6872, lon: 25.2797 },
  { iso: "LU", name: "Luxembourg",  country: "Luxembourg",                                 lat: 49.6116, lon:  6.1319 },
  { iso: "MT", name: "Valletta",    country: "Malta",                                      lat: 35.8989, lon: 14.5146 },
  { iso: "MC", name: "Monaco",      country: "Monaco",                                     lat: 43.7384, lon:  7.4246 },
  { iso: "ME", name: "Podgorica",   country: "Montenegro",                                 lat: 42.4304, lon: 19.2594 },
  { iso: "NL", name: "Amsterdam",   country: "Netherlands",                                lat: 52.3676, lon:  4.9041 },
  { iso: "NO", name: "Oslo",        country: "Norway",                                     lat: 59.9139, lon: 10.7522 },
  { iso: "PL", name: "Warsaw",      country: "Poland",                                     lat: 52.2297, lon: 21.0122 },
  { iso: "PT", name: "Lisbon",      country: "Portugal",                                   lat: 38.7223, lon: -9.1393 },
  { iso: "MD", name: "Chișinău",    country: "Republic of Moldova",                        lat: 47.0105, lon: 28.8638 },
  { iso: "RO", name: "Bucharest",   country: "Romania",                                    lat: 44.4268, lon: 26.1025 },
  { iso: "RU", name: "Moscow",      country: "Russia",                                     lat: 55.7558, lon: 37.6173 },
  { iso: "SM", name: "San Marino",  country: "San Marino",                                 lat: 43.9424, lon: 12.4578 },
  { iso: "RS", name: "Belgrade",    country: "Serbia",                                     lat: 44.7866, lon: 20.4489 },
  { iso: "SK", name: "Bratislava",  country: "Slovakia",                                   lat: 48.1486, lon: 17.1077 },
  { iso: "SI", name: "Ljubljana",   country: "Slovenia",                                   lat: 46.0569, lon: 14.5058 },
  { iso: "ES", name: "Madrid",      country: "Spain",                                      lat: 40.4168, lon: -3.7038 },
  { iso: "SE", name: "Stockholm",   country: "Sweden",                                     lat: 59.3293, lon: 18.0686 },
  { iso: "CH", name: "Bern",        country: "Switzerland",                                lat: 46.9480, lon:  7.4474 },
  { iso: "MK", name: "Skopje",      country: "The former Yugoslav Republic of Macedonia",  lat: 41.9981, lon: 21.4254 },
  { iso: "TR", name: "Ankara",      country: "Turkey",                                     lat: 39.9334, lon: 32.8597 },
  { iso: "UA", name: "Kyiv",        country: "Ukraine",                                    lat: 50.4501, lon: 30.5234 },
  { iso: "GB", name: "London",      country: "United Kingdom",                             lat: 51.5074, lon: -0.1278 },
];

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

async function fetchWeatherForCities(cities) {
  if (cities.length === 0) return [];
  const out = [];
  for (let off = 0; off < cities.length; off += MAX_BATCH) {
    const chunk = cities.slice(off, off + MAX_BATCH);
    const lats = chunk.map((c) => c.lat).join(",");
    const lons = chunk.map((c) => c.lon).join(",");
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
      `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&forecast_days=8` +
      `&timezone=auto`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Open-Meteo ${resp.status}`);
    const data = await resp.json();
    const list = Array.isArray(data) ? data : [data];
    chunk.forEach((c, i) => {
      const d = list[i];
      let current = null;
      let daily = [];
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
      out.push({ ...c, current, daily });
    });
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
    layer.setStyle({
      fillColor: tempToColor(t),
      fillOpacity: t == null ? 0.15 : 0.55,
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
    // Existing markers: toggle visibility (capitals always visible).
    if (state.weatherMarkers.has(city.key)) {
      setMarkerVisibility(city, eligible);
    }
  }

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
    // After adding new markers, ensure they reflect the selected day.
    applyDay(state.selectedDay);
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

  state.map = L.map("map", {
    zoomControl: true,
    worldCopyJump: false,
    minZoom: 3,
    maxZoom: 9,
  }).setView([54, 15], 4);

  state.map.setMaxBounds([
    [30, -35],
    [75,  55],
  ]);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(state.map);

  const labelsLayer = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    { subdomains: "abcd", maxZoom: 19, pane: "shadowPane" }
  );

  let geojson;
  try {
    setStatus("Loading Europe map…");
    const r = await fetch("europe.geo.json");
    if (!r.ok) throw new Error(`GeoJSON ${r.status}`);
    geojson = await r.json();
  } catch (err) {
    console.error(err);
    setStatus("Failed to load map.");
    showError("Could not load Europe map data.", () => init());
    return;
  }

  // Register capitals and extras into shared state.cities.
  const capitals = CAPITALS_RAW.map((c) => ({
    ...c,
    key: `cap:${c.iso}`,
    country: c.country,
    minZoom: 0,
    isCapital: true,
  }));
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
  labelsLayer.addTo(state.map);

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

  // Lazy-load extras on map movement.
  const debounced = debounce(recomputeVisible, 300);
  state.map.on("moveend", debounced);
  state.map.on("zoomend", debounced);

  setStatus(`${capitals.length} capitals · ${extras.length} extra cities (zoom to load) · live + 7-day from Open-Meteo`);
}

document.addEventListener("DOMContentLoaded", init);

// ClaudeWeather — full-bleed Europe map with live weather per capital + country fill by temperature.

const CAPITALS = [
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

// Open-Meteo WMO weather codes → { icon, label }
// https://open-meteo.com/en/docs (WMO Weather interpretation codes table)
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
  { t: -10, c: [44, 123, 182]  }, // deep blue
  { t:   0, c: [92, 179, 217]  },
  { t:   5, c: [171, 217, 233] },
  { t:  10, c: [217, 240, 163] },
  { t:  15, c: [254, 224, 144] },
  { t:  22, c: [253, 174,  97] },
  { t:  35, c: [215,  25,  28] }, // hot red
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

async function fetchWeatherForAll(capitals) {
  // Batch all capitals into ONE Open-Meteo request via comma-separated lat/lon.
  // The response is then an array (one entry per coordinate). Falls back to per-city
  // requests if the batch fails.
  const lats = capitals.map((c) => c.lat).join(",");
  const lons = capitals.map((c) => c.lon).join(",");
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
    `&timezone=auto`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Open-Meteo ${resp.status}`);
  const data = await resp.json();
  const list = Array.isArray(data) ? data : [data];
  return capitals.map((cap, i) => {
    const d = list[i];
    if (!d || !d.current) return { ...cap, weather: null };
    return {
      ...cap,
      weather: {
        temp:     d.current.temperature_2m,
        code:     d.current.weather_code,
        humidity: d.current.relative_humidity_2m,
        wind:     d.current.wind_speed_10m,
        updated:  d.current.time,
      },
    };
  });
}

function buildMarkerIcon(temp, code) {
  const { icon } = describeCode(code);
  const tempStr = temp == null ? "—" : `${Math.round(temp)}°`;
  return L.divIcon({
    className: "weather-marker",
    html: `<div class="marker-inner"><span class="icon">${icon}</span><span class="temp">${tempStr}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function buildPopupHtml(c) {
  const w = c.weather;
  const { icon, label } = describeCode(w?.code);
  const updated = w?.updated ? new Date(w.updated).toLocaleString() : "—";
  return `
    <div class="popup-title"><span class="icon">${icon}</span>${c.name}, ${c.country}</div>
    <div class="popup-row"><span class="label">Condition</span><span>${label}</span></div>
    <div class="popup-row"><span class="label">Temperature</span><span>${w?.temp != null ? Math.round(w.temp) + "°C" : "—"}</span></div>
    <div class="popup-row"><span class="label">Humidity</span><span>${w?.humidity != null ? w.humidity + "%" : "—"}</span></div>
    <div class="popup-row"><span class="label">Wind</span><span>${w?.wind != null ? w.wind + " km/h" : "—"}</span></div>
    <div class="popup-updated">Updated ${updated}</div>
  `;
}

async function init() {
  setStatus("Initializing map…");

  const map = L.map("map", {
    zoomControl: true,
    worldCopyJump: false,
    minZoom: 3,
    maxZoom: 7,
  }).setView([54, 15], 4);

  // Constrain view to roughly Europe
  map.setMaxBounds([
    [30, -35],
    [75,  55],
  ]);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  // Labels-only layer goes on top of country fills later.
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

  let capitalsWithWeather;
  try {
    setStatus(`Fetching weather for ${CAPITALS.length} capitals…`);
    capitalsWithWeather = await fetchWeatherForAll(CAPITALS);
  } catch (err) {
    console.error(err);
    setStatus("Weather unavailable.");
    showError("Could not fetch weather from Open-Meteo.", () => init());
    capitalsWithWeather = CAPITALS.map((c) => ({ ...c, weather: null }));
  }

  // Index temps by ISO2 for country fill.
  const tempByIso = {};
  for (const c of capitalsWithWeather) {
    if (c.weather?.temp != null) tempByIso[c.iso] = c.weather.temp;
  }

  // Draw country layer.
  L.geoJSON(geojson, {
    style: (feature) => {
      const iso = feature.properties.ISO2;
      const t = tempByIso[iso];
      return {
        fillColor: tempToColor(t),
        fillOpacity: t == null ? 0.15 : 0.55,
        color: "#ffffff",
        weight: 1,
        opacity: 0.7,
      };
    },
    onEachFeature: (feature, layer) => {
      const iso = feature.properties.ISO2;
      const cap = capitalsWithWeather.find((c) => c.iso === iso);
      const name = feature.properties.NAME;
      const t = tempByIso[iso];
      const condition = cap?.weather?.code != null ? describeCode(cap.weather.code).label : "—";
      const tooltip =
        `<strong>${name}</strong><br>` +
        (t != null
          ? `${Math.round(t)}°C · ${condition}`
          : "No data");
      layer.bindTooltip(tooltip, {
        className: "weather-tooltip",
        sticky: true,
        direction: "top",
      });
      layer.on({
        mouseover: (e) => e.target.setStyle({ weight: 2, color: "#222", opacity: 1 }),
        mouseout:  (e) => e.target.setStyle({ weight: 1, color: "#ffffff", opacity: 0.7 }),
      });
    },
  }).addTo(map);

  // Draw labels on top of country fills.
  labelsLayer.addTo(map);

  // Drop weather markers.
  let placed = 0;
  for (const c of capitalsWithWeather) {
    if (!c.weather) continue;
    const marker = L.marker([c.lat, c.lon], {
      icon: buildMarkerIcon(c.weather.temp, c.weather.code),
      keyboard: false,
      riseOnHover: true,
    }).addTo(map);

    marker.bindTooltip(
      `<strong>${c.name}</strong><br>${Math.round(c.weather.temp)}°C · ${describeCode(c.weather.code).label}`,
      { className: "weather-tooltip", direction: "top", offset: [0, -10] }
    );
    marker.bindPopup(buildPopupHtml(c), { maxWidth: 260 });
    placed++;
  }

  setStatus(`${placed} cities · live data from Open-Meteo`);
}

document.addEventListener("DOMContentLoaded", init);

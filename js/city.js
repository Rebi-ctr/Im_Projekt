// Importiert die Dial-Funktion
import { initDial } from './dial.js';

// ===== HILFSUNKTIONEN =====

/**
 * Wettercode in Text und Icon umwandeln
 */
function mapWeatherCode(code) {
  const map = {
    0: { label: "Klar", icon: "img/sun.svg" },
    1: { label: "Überwiegend klar", icon: "img/überwiegend.svg" },
    2: { label: "Bewölkt", icon: "img/cloud.svg" },
    3: { label: "Bedeckt", icon: "img/cloud.svg" },
    45: { label: "Nebel", icon: "img/fog.svg" },
    48: { label: "Reifnebel", icon: "img/fog.svg" },
    51: { label: "Leichter Nieselregen", icon: "img/rain.svg" },
    61: { label: "Leichter Regen", icon: "img/rain.svg" },
    63: { label: "Mäßiger Regen", icon: "img/rain.svg" },
    65: { label: "Starker Regen", icon: "img/show.svg" },
    71: { label: "Schneefall", icon: "img/snow.svg" },
    80: { label: "Regenschauer", icon: "img/shower.svg" },
    95: { label: "Gewitter", icon: "img/storm.svg" },
  };
  return map[code] || { label: `Wettercode ${code}`, icon: "img/cloud.svg" };
}

/**
 * Passt die Hintergrundfarbe (Himmel) basierend auf der Uhrzeit an.
 */
function updateSkyColor(date) {
  // Nachtblau exakt wie im CSS (#001b1f)
  const NIGHT = [0, 27, 31];

  const hour = date.getHours();
  const min = date.getMinutes();
  const t = hour + min / 60;

  const lerp = (a, b, f) => a + (b - a) * f;
  const lerp3 = (c1, c2, f) => [
    Math.round(lerp(c1[0], c2[0], f)),
    Math.round(lerp(c1[1], c2[1], f)),
    Math.round(lerp(c1[2], c2[2], f)),
  ];
  const smoothstep = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  const KF = [
    { time: 0.0, top: NIGHT, bottom: NIGHT },
    { time: 5.0, top: [10, 30, 70], bottom: [255, 160, 120] }, // Morgendämmerung
    // Vormittag
    { time: 12.0, top: [157, 189, 209], bottom: [157, 189, 209] }, // Mittag
    { time: 17.5, top: [60, 120, 200], bottom: [255, 180, 120] }, // Golden Hour
    { time: 19.2, top: [15, 40, 90], bottom: [255, 180, 120] }, // Blue Hour
    { time: 20.5, top: NIGHT, bottom: NIGHT },           // Nacht
    { time: 24.0, top: NIGHT, bottom: NIGHT },
  ];

  let k1 = KF[0], k2 = KF[1];
  for (let i = 0; i < KF.length - 1; i++) {
    if (t >= KF[i].time && t < KF[i + 1].time) { k1 = KF[i]; k2 = KF[i + 1]; break; }
  }
  let f = smoothstep((t - k1.time) / (k2.time - k1.time || 1));
  const top = lerp3(k1.top, k2.top, f);
  const bottom = lerp3(k1.bottom, k2.bottom, f);

  const gradient = `linear-gradient(180deg, rgb(${top[0]}, ${top[1]}, ${top[2]}) 0%, rgb(${bottom[0]}, ${bottom[1]}, ${bottom[2]}) 100%)`;
  document.documentElement.style.setProperty("--bg-sky", gradient);
}


/**
 * Erzeugt bzw. aktualisiert TukTuks basierend auf pm10.
 */
// merkt sich den zuletzt gerenderten PM10-Wert
let lastPm10Value = null;

function updateTuktuks(pm10) {
  const track = document.getElementById("tuktukTrack");
  if (!track) {
    console.error("tuktukTrack Element nicht gefunden!");
    return;
  }

  // Eingabe normalisieren
  const num = Number(pm10);
  const hasValidValue = pm10 !== null && pm10 !== undefined && pm10 !== "--" && Number.isFinite(num);

  // wenn kein gültiger Wert → leeren und Merker zurücksetzen
  if (!hasValidValue) {
    if (lastPm10Value !== null) {
      track.innerHTML = "";
      console.log("Keine gültigen PM10-Daten, TukTuk-Track geleert");
    }
    lastPm10Value = null;
    return;
  }

  // wenn sich der Wert nicht geändert hat → nichts tun
  if (num === lastPm10Value) {
    // console.log("PM10 unverändert, TukTuks nicht neu gerendert");
    return;
  }

  // ab hier: es hat sich wirklich etwas geändert
  lastPm10Value = num;

  console.log(`updateTuktuks aufgerufen mit PM10: ${num}`);

  const value = Math.max(0, Math.floor(num / 10));
  const MAX_TUKS = 30;
  const count = Math.min(value, MAX_TUKS);

  console.log(`PM10: ${num} → ${count} TukTuks werden erstellt`);

  track.innerHTML = "";

  if (count === 0) {
    console.log("PM10 < 10, keine TukTuks");
    return;
  }

  const svgSrc = "img/TukTuk.png";

  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    const layerClass = i % 3 === 0 ? "layer-1" : (i % 3 === 1 ? "layer-2" : "layer-3");
    img.className = `tuktuk ${layerClass}`;

    if (count > 5) img.classList.add("small");

    img.src = svgSrc;
    img.alt = "TukTuk";
    img.ariaHidden = "true";

    const baseDuration = 15 + Math.random() * 10; // 15–25s
    const speedFactor = Math.max(0.5, 1 - (value / 50));
    const duration = baseDuration * speedFactor;

    const delay = -Math.random() * duration;

    img.style.animationDuration = `${duration}s`;
    img.style.animationDelay = `${delay}s`;
    img.style.animationDirection = "normal";

    if (layerClass === "layer-2") {
      img.style.animationName = "tuktuk-bounce-layer2";
    } else if (layerClass === "layer-3") {
      img.style.animationName = "tuktuk-bounce-layer3";
    } else {
      img.style.animationName = "tuktuk-bounce";
    }

    img.style.animationTimingFunction = "linear";
    img.style.animationIterationCount = "infinite";
    img.style.animationFillMode = "both";

    track.appendChild(img);

    console.log(
      `TukTuk ${i + 1}/${count} erstellt (${layerClass}, ${duration.toFixed(1)}s, delay: ${delay.toFixed(1)}s)`
    );
  }

  console.log(`${count} TukTuks erstellt mit echten Richtungswechseln`);
}


/**
 * UI-Helper: Zeit und Datum in DOM schreiben
 */
function setClockUI(date, el) {
  if (el.time) {
    el.time.textContent = date.toLocaleTimeString("de-CH", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  if (el.date) {
    el.date.textContent = date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }
}

/**
 * UI-Helper: Wetter- und Luftqualitätsdaten in DOM schreiben
 */
function setDataUI(entry, el) {
  if (!entry) {
    if (el.pm10) el.pm10.textContent = "-- PM10 μg/m³";
    if (el.pm25) el.pm25.textContent = "-- PM2.5 μg/m³";
    if (el.temperature) el.temperature.textContent = "--°C";
    if (el.weather_icon) el.weather_icon.src = "img/cloud.png";
    // Kein TukTuk bei fehlenden Daten
    updateTuktuks("--");
    return;
  }

  if (el.pm10) el.pm10.textContent = `${entry.pm10} PM10 μg/m³`;
  if (el.pm25) el.pm25.textContent = `${entry.pm2_5} PM2.5 μg/m³`;
  if (el.temperature) el.temperature.textContent = `${entry.temperature}°C`;
  const wc = mapWeatherCode(Number(entry.weather_code));
  if (el.weather_icon) el.weather_icon.src = wc.icon;

  // Hier die TukTuks aktualisieren
  updateTuktuks(Number(entry.pm10));
}

/**
 * Zeigt Loading-State an wenn Daten noch nicht geladen sind
 */
function showLoadingState(el) {
  if (el.time) el.time.textContent = "Laden...";
  if (el.date) el.date.textContent = "Daten werden geladen";
  if (el.pm10) el.pm10.textContent = "-- PM10 μg/m³";
  if (el.temperature) el.temperature.textContent = "Laden...";
  if (el.description) el.description.textContent = "Lade Stadtinformationen...";
}

// ===== ZEIT-HELFER =====

const MS15 = 15 * 60 * 1000; // 15 Minuten in Millisekunden
const pad2 = n => String(n).padStart(2, "0");

/**
 * Datum um Tage verschieben
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Zeit auf 15-Minuten-Raster snappen (immer abrunden)
 */
const snap15 = (date) => new Date(Math.floor(date.getTime() / MS15) * MS15);

/**
 * Datum zu lokalem DB-Key formatieren ("YYYY-MM-DD HH:mm:00")
 */
function localKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} `
    + `${pad2(date.getHours())}:${pad2(date.getMinutes())}:00`;
}

/**
 * Findet den passenden Datensatz für ein bestimmtes Datum/Zeit
 * Sucht zuerst exakten Match, dann den zeitlich nächstliegenden
 */
function findEntryForDateTime(series, targetDate) {
  if (!series || !series.length) return null;

  const snapped = snap15(targetDate);
  const key = localKey(snapped);

  console.log(`Suche Daten für: ${key}`);

  // 1. Versuch: Exakter Match
  const exact = series.find(entry => entry.datetimelocal === key);
  if (exact) {
    console.log("Exakte Übereinstimmung gefunden:", exact);
    return exact;
  }

  // 2. Versuch: Nächstliegenden Zeitpunkt finden
  let best = null;
  let bestDiff = Infinity;

  for (const entry of series) {
    try {
      const entryDate = new Date(entry.datetimelocal);
      const diff = Math.abs(entryDate.getTime() - snapped.getTime());

      if (diff < bestDiff) {
        best = entry;
        bestDiff = diff;
      }
    } catch (error) {
      console.warn("Ungültiges Datum in Datensatz:", entry.datetimelocal);
    }
  }

  if (best) {
    console.log(`Nächstliegender Datensatz gefunden (${Math.round(bestDiff / 60000)}min Unterschied):`, best);
  } else {
    console.warn("Kein passender Datensatz gefunden");
  }

  return best;
}

/**
 * Berechnet das Ziel-Datum basierend auf Dial-Position
 */
function calculateTargetDate(baseDate, dateWithinDay, turns) {
  // Basis-Datum + Tage-Offset durch Drehungen
  const targetDate = addDays(baseDate, turns || 0);

  // Zeit vom dateWithinDay übernehmen
  targetDate.setHours(dateWithinDay.getHours());
  targetDate.setMinutes(dateWithinDay.getMinutes());
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  return targetDate;
}




// ===== MAIN SCRIPT =====

document.addEventListener("DOMContentLoaded", async () => {
  // 1) Stadt aus der URL
  const loader = document.getElementById("loader");
  const params = new URLSearchParams(location.search);
  const cityKey = params.get("city");
  if (!cityKey) {
    console.error("Kein ?city Parameter in der URL");
    return;
  }

  // Loader anzeigen
  if (loader) {
    loader.style.display = "flex";
    loader.classList.remove("hidden");
  }

  // 2) DOM Elemente sammeln
  const el = {
    pageTitle: document.getElementById("pageTitle"),
    city_name_top: document.getElementById("city_name_top"),
    city_name: document.getElementById("city_name"),
    city_image: document.getElementById("city_image"),
    description: document.getElementById("description"),
    pm10: document.getElementById("pm10"),
    pm25: document.getElementById("pm25"),
    time: document.getElementById("time"),
    date: document.getElementById("date"),
    temperature: document.getElementById("temperature"),
    weather_icon: document.getElementById("weather_icon"),
    record: document.getElementById("record"),
    average: document.getElementById("average"),
    lowest: document.getElementById("lowest"),
    chartCanvas: document.getElementById("airQualityChart"),
  };

  // Debug: Prüfe ob alle wichtigen Elemente gefunden wurden
  const required = ['time', 'date', 'pm10', 'temperature', 'weather_icon'];
  required.forEach(key => {
    if (!el[key]) console.error(`Wichtiges Element nicht gefunden: ${key}`);
  });

  let series = []; // Wird später mit API-Daten gefüllt

  try {
    // === API CALLS ===
    const API_URL_Info = `php/unloadC.php?city=${encodeURIComponent(cityKey)}`;
    const API_URL_Data = `php/unloadW.php?city=${encodeURIComponent(cityKey)}`;

    // 1) Stadt-Meta laden
    console.log("Lade Stadt-Infos für:", cityKey);
    const resInfo = await fetch(API_URL_Info);
    if (!resInfo.ok) throw new Error(`Info API HTTP ${resInfo.status}`);
    const meta = await resInfo.json();

    console.log("Stadt-Infos geladen:", meta);

    // Meta-Daten setzen
    if (el.pageTitle) el.pageTitle.textContent = meta.city;
    if (el.city_name_top) el.city_name_top.textContent = meta.city.toUpperCase();
    if (el.city_name) el.city_name.textContent = meta.city.toUpperCase();
    if (el.description) el.description.textContent = meta.description || "Keine Beschreibung verfügbar";
    if (meta.image && el.city_image) el.city_image.src = meta.image;

    // 2) Zeitreihen-Daten laden
    console.log("Lade Zeitreihen-Daten für:", cityKey);
    const resData = await fetch(API_URL_Data);
    if (!resData.ok) throw new Error(`Data API HTTP ${resData.status}`);
    series = await resData.json();

    console.log("Zeitreihen-Daten geladen:", series.length, "Einträge");

    if (!Array.isArray(series) || !series.length) {
      console.warn("Keine Zeitreihen-Daten verfügbar");
      return;
    }

    // === STARTZUSTAND: AKTUELLE ZEIT IN GMT+5:30 (Indien) ===
    const tz = "Asia/Kolkata";
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
    const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startMinutes = now.getHours() * 60 + Math.floor(now.getMinutes() / 15) * 15; // Abrunden statt runden

    // Aktuelle Daten anzeigen
    const currentEntry = findEntryForDateTime(series, now);
    setClockUI(now, el);
    setDataUI(currentEntry, el);

    // === STATISTIKEN ===
    const pm10Values = series.map(d => Number(d.pm10)).filter(Number.isFinite);
    if (pm10Values.length) {
      if (el.record) el.record.textContent = `${Math.max(...pm10Values)} PM10 μg/m³`;
      if (el.average) el.average.textContent = `${Math.round(pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length)} PM10 μg/m³`;
      if (el.lowest) el.lowest.textContent = `${Math.min(...pm10Values)} PM10 μg/m³`;
    }

    const pm2_5Values = series.map(d => Number(d.pm2_5)).filter(Number.isFinite);

    const temperatureValues = series.map(d => Number(d.temperature)).filter(Number.isFinite);

    // === CHART ERSTELLEN ===
    if (el.chartCanvas) {
      console.log("Erstelle Chart...");
      const chartData = series.slice(0, 480).reverse().filter((_, i) => i % 4 === 0); // Alle 4. Datenpunkt = stündlich

      new Chart(el.chartCanvas, {
        type: "line",
        data: {
          labels: chartData.map(d => {
            const date = new Date(d.datetimelocal);
            return date.toLocaleDateString("de-CH", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit"
            });
          }),
          datasets: [
            {
              label: "PM10 μg/m³",
              data: chartData.map(d => Number(d.pm10)),
              borderWidth: 2,
              tension: 0.3,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true
            },
            {
              label: "PM2.5 μg/m³",
              data: chartData.map(d => Number(d.pm2_5)),
              borderWidth: 2,
              tension: 0.3,
              borderColor: 'rgb(255, 206, 86)',
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              fill: true
            },
            {

              label: "Temperatur °C",
              data: chartData.map(d => Number(d.temperature)),
              borderWidth: 2,
              tension: 0.3,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: `Luftqualität in ${meta.city} (letzte 5 Tage)`
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "" }
            },
            x: {
              title: { display: true, text: "Datum/Zeit" }
            }
          }
        }
});
      console.log("Chart erfolgreich erstellt");
    }

    // === DIAL INITIALISIEREN ===
    const wrap = document.getElementById("dialWrap");
    const dial = document.getElementById("dial");

    if (wrap && dial) {
      console.log("Initialisiere Dial...");


      initDial({
        wrap,
        dial,
        baseDate,
        startMinutes,
        snapMinutes: 15,
        maxTurns: 0, // NEU: Keine Umdrehungen in die Zukunft erlaubt
        maxMinutes: now.getHours() * 60 + Math.floor(now.getMinutes() / 15) * 15, // NEU: Aktuelle Zeit als Maximum (abgerundet)

        // Wird beim Drehen ausgeführt
        onChange: (dateWithinDay, turns) => {
          const targetDate = calculateTargetDate(baseDate, dateWithinDay, turns);
          setClockUI(targetDate, el);

          // 🌤 Hintergrund anpassen
          updateSkyColor(dateWithinDay);
        },

        // Wird nach dem Loslassen ausgeführt
        onIdle: (dateWithinDay, turns) => {
          const targetDate = calculateTargetDate(baseDate, dateWithinDay, turns);
          const entry = findEntryForDateTime(series, targetDate);
          setDataUI(entry, el);
        }
      });

      console.log("Dial erfolgreich initialisiert");
    } else {
      console.warn("Dial-Elemente nicht gefunden");
    }

  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    if (el.description) {
      el.description.textContent = "Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.";
    }
  } finally {
    // Loader verstecken nach dem Laden (erfolgreich oder mit Fehler)
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => loader.style.display = "none", 500);
    }
  }
});

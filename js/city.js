// Importiert die Dial-Funktion
import { initDial } from './dial.js';

// ===== HILFSFUNKTIONEN =====

/**
 * Wettercode in Text und Icon umwandeln
 */
function mapWeatherCode(code) {
  const map = {
    0: { label: "Klar", icon: "img/sun.png" },
    1: { label: "Überwiegend klar", icon: "img/sun.png" },
    2: { label: "Bewölkt", icon: "img/cloud.png" },
    3: { label: "Bedeckt", icon: "img/cloud.png" },
    45: { label: "Nebel", icon: "img/fog.png" },
    48: { label: "Reifnebel", icon: "img/fog.png" },
    51: { label: "Leichter Nieselregen", icon: "img/drizzle.png" },
    61: { label: "Leichter Regen", icon: "img/rain.png" },
    63: { label: "Mäßiger Regen", icon: "img/rain.png" },
    65: { label: "Starker Regen", icon: "img/rain.png" },
    71: { label: "Schneefall", icon: "img/snow.png" },
    80: { label: "Regenschauer", icon: "img/shower.png" },
    95: { label: "Gewitter", icon: "img/storm.png" },
  };
  return map[code] || { label: `Wettercode ${code}`, icon: "img/cloud.png" };
}

/**
 * Passt die Hintergrundfarbe (Himmel) basierend auf der Uhrzeit an.
 */
function updateSkyColor(date) {
  const hour = date.getHours();
  const min = date.getMinutes();
  const t = hour + min / 60; // z. B. 13.5 = 13:30 Uhr

  // Definiere wichtige Zeitpunkte des Tages
  const keyframes = [
    { time: 0,   color: [0, 20, 31] },    // Mitternacht
    { time: 5,   color: [80, 100, 150] }, // Morgendämmerung
    { time: 8,   color: [79, 195, 247] }, // Tag
    { time: 17,  color: [255, 182, 161] },// Abend
    { time: 20,  color: [10, 30, 70] },   // Nachtbeginn
    { time: 24,  color: [0, 20, 31] }     // zurück zu Mitternacht
  ];

  // Finde die zwei Keyframes, zwischen denen wir uns befinden
  let c1, c2;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (t >= keyframes[i].time && t < keyframes[i + 1].time) {
      c1 = keyframes[i];
      c2 = keyframes[i + 1];
      break;
    }
  }
  if (!c1) { c1 = keyframes[0]; c2 = keyframes[1]; }

  // Wie weit sind wir zwischen den beiden Zeitpunkten?
  const f = (t - c1.time) / (c2.time - c1.time);

  // Interpolierte Farbe berechnen (RGB-Mischung)
  const mix = (a, b) => Math.round(a + (b - a) * f);
  const [r, g, b] = [
    mix(c1.color[0], c2.color[0]),
    mix(c1.color[1], c2.color[1]),
    mix(c1.color[2], c2.color[2])
  ];

  const color = `rgb(${r}, ${g}, ${b})`;
  document.documentElement.style.setProperty("--bg-sky", color);
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
    console.warn("Keine Daten für diesen Zeitpunkt verfügbar");
    if (el.pm10) el.pm10.textContent = "-- PM10 μg/m³";
    if (el.temperature) el.temperature.textContent = "--°C";
    if (el.weather_icon) el.weather_icon.src = "img/cloud.png";
    return;
  }

  if (el.pm10) el.pm10.textContent = `${entry.pm10} PM10 μg/m³`;
  if (el.temperature) el.temperature.textContent = `${entry.temperature}°C`;
  
  const wc = mapWeatherCode(Number(entry.weather_code));
  if (el.weather_icon) el.weather_icon.src = wc.icon;
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
 * Zeit auf 15-Minuten-Raster snappen
 */
const snap15 = (date) => new Date(Math.round(date.getTime() / MS15) * MS15);

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
    console.log(`Nächstliegender Datensatz gefunden (${Math.round(bestDiff/60000)}min Unterschied):`, best);
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
  const params = new URLSearchParams(location.search);
  const cityKey = params.get("city");
  if (!cityKey) {
    console.error("Kein ?city Parameter in der URL");
    return;
  }

  // 2) DOM Elemente sammeln
  const el = {
    pageTitle: document.getElementById("pageTitle"),
    city_name_top: document.getElementById("city_name_top"),
    city_name: document.getElementById("city_name"),
    city_image: document.getElementById("city_image"),
    description: document.getElementById("description"),
    pm10: document.getElementById("pm10"),
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

    // === STARTZUSTAND: AKTUELLE ZEIT ===
    const now = new Date();
    const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Heutige Mitternacht
    const startMinutes = now.getHours() * 60 + Math.round(now.getMinutes() / 15) * 15; // Aktuelle Zeit in Minuten

    // Aktuelle Daten anzeigen
    const currentEntry = findEntryForDateTime(series, now);
    setClockUI(now, el);
    setDataUI(currentEntry, el);

    // === STATISTIKEN ===
    const pm10Values = series.map(d => Number(d.pm10)).filter(Number.isFinite);
    if (pm10Values.length) {
      if (el.record) el.record.textContent = `${Math.max(...pm10Values)} PM10 μg/m³`;
      if (el.average) el.average.textContent = `${Math.round(pm10Values.reduce((a,b)=>a+b,0)/pm10Values.length)} PM10 μg/m³`;
      if (el.lowest) el.lowest.textContent = `${Math.min(...pm10Values)} PM10 μg/m³`;
    }

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
          datasets: [{
            label: "PM10 μg/m³",
            data: chartData.map(d => Number(d.pm10)),
            borderWidth: 2,
            tension: 0.3,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true
          }]
        },
        options: {
          responsive: true,
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
              title: { display: true, text: 'PM10 μg/m³' }
            },
            x: { 
              title: { display: true, text: 'Datum/Zeit' }
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
  }
});
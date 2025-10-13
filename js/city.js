console.log("Kolkata JS geladen");

document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = `php/unload.php?city=${encodeURIComponent(cityKey)}&format=full`;

  // HTML-Elemente abrufen
  const el = {
    pageTitle: document.getElementById("pageTitle"),
    city_name: document.getElementById("city_name"),
    city_image: document.getElementById("city_image"),
    description: document.getElementById("description"),

    pm10: document.getElementById("pm10"),
    time: document.getElementById("time"),
    date: document.getElementById("date"),
    temperature: document.getElementById("temperature"),
    weathercode: document.getElementById("weathercode"),
    weathericon: document.getElementById("weathericon"),
    
    record: document.getElementById("record"),
    average: document.getElementById("average"),
    lowest: document.getElementById("lowest"),

    chartCanvas: document.getElementById("airQualityChart"),
  };

  try {
    // 1️⃣ Daten abrufen
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return;

    // 2️⃣ Neuester Datensatz (der erste, wenn PHP sortiert DESC)
    const latest = data[0];

    // 3️⃣ Werte ins HTML einfügen
    el.pm10.textContent = `${latest.pm10} PM10 μg/m³`;
    el.temperature.textContent = `${latest.temperature}°C`;
    el.weathercode.textContent = mapWeatherCode(latest.weather_code);

    // 4️⃣ Datum & Zeit anzeigen
    const dateObj = new Date(latest.datetimelocal);
    el.time.textContent = dateObj.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    el.date.textContent = dateObj.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    // 5️⃣ Statistiken berechnen (Record / Durchschnitt / Tiefstwert)
    const pm10Values = data.map(d => Number(d.pm10));
    const record = Math.max(...pm10Values);
    const lowest = Math.min(...pm10Values);
    const average = Math.round(pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length);

    el.record.textContent = `${record} PM10 μg/m³`;
    el.average.textContent = `${average} PM10 μg/m³`;
    el.lowest.textContent = `${lowest} PM10 μg/m³`;

    // 6️⃣ Chart zeichnen
    const labels = data.map(d => d.datetimelocal);
    const values = data.map(d => d.pm10);

    new Chart(el.chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "PM10 μg/m³",
          data: values,
          borderWidth: 2,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }
});

// einfache Wetterbeschreibung anhand Code
function mapWeatherCode(code) {
  // einfache Map (Open-Meteo / WMO-ähnlich); 80 = Regenschauer
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


document.addEventListener("DOMContentLoaded", async () => {
  // 1) Stadt aus der URL
  const params = new URLSearchParams(location.search);
  const cityKey = params.get("city");
  if (!cityKey) {
    console.error("Kein ?city Parameter in der URL");
    return;
  }

  // 2) API URL
  const API_URL = `php/unload.php?city=${encodeURIComponent(cityKey)}&format=full`;

  // 3) DOM Elemente
  const el = {
    pageTitle: document.getElementById("pageTitle"),
    city_name_badge: document.getElementById("city_name_badge"),
    city_name_title: document.getElementById("city_name_title"),
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
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    console.log("Daten geladen:", data);

    // Erwartete Struktur vom PHP
    // { meta: { city, description, imge }, timeseries: [...] }
    const meta = data.meta;
    const series = Array.isArray(data.timeseries) ? data.timeseries : [];

    // Titel und Meta
    el.pageTitle.textContent = meta.city;
    el.city_name_badge.textContent = meta.city;
    el.city_name_title.textContent = meta.city;
    el.description.textContent = meta.description || "";
    if (meta.imge) el.city_image.src = meta.imge;

    if (series.length === 0) {
      console.warn("Keine Zeitreihen Daten");
      return;
    }

    // Neueste Messung
    const latest = series[0];
    el.pm10.textContent = `${latest.pm10} PM10 μg/m³`;
    el.temperature.textContent = `${latest.temperature}°C`;

    const wc = mapWeatherCode(Number(latest.weather_code));
    el.weathercode.textContent = wc.label;
    if (el.weathericon) el.weathericon.src = wc.icon;

    const dateObj = new Date(latest.datetimelocal);
    el.time.textContent = dateObj.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
    el.date.textContent = dateObj.toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" });

    // Stats
    const pm10Values = series.map(d => Number(d.pm10)).filter(n => Number.isFinite(n));
    const record = Math.max(...pm10Values);
    const lowest = Math.min(...pm10Values);
    const average = Math.round(pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length);

    el.record.textContent = `${record} PM10 μg/m³`;
    el.average.textContent = `${average} PM10 μg/m³`;
    el.lowest.textContent = `${lowest} PM10 μg/m³`;

    // Chart
    const labels = series.map(d => d.datetimelocal);
    const values = series.map(d => d.pm10);

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

// Wetter Code Mapping
function mapWeatherCode(code) {
  const map = {
    0: { label: "Klar", icon: "img/sun.png" },
    1: { label: "Ueberwiegend klar", icon: "img/sun.png" },
    2: { label: "Bewoelkt", icon: "img/cloud.png" },
    3: { label: "Bedeckt", icon: "img/cloud.png" },
    45: { label: "Nebel", icon: "img/fog.png" },
    48: { label: "Reifnebel", icon: "img/fog.png" },
    51: { label: "Leichter Nieselregen", icon: "img/drizzle.png" },
    61: { label: "Leichter Regen", icon: "img/rain.png" },
    63: { label: "Maessiger Regen", icon: "img/rain.png" },
    65: { label: "Starker Regen", icon: "img/rain.png" },
    71: { label: "Schneefall", icon: "img/snow.png" },
    80: { label: "Regenschauer", icon: "img/shower.png" },
    95: { label: "Gewitter", icon: "img/storm.png" },
  };
  return map[code] || { label: `Wettercode ${code}`, icon: "img/cloud.png" };
}


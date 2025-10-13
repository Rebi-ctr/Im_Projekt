document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "php/unload.php";
  const CITY = "Kolkata";

  const el = {
    pm10: document.getElementById("pm10"),
    time: document.getElementById("time"),
    date: document.getElementById("date"),
    temperature: document.getElementById("temperature"),
    weathercode: document.getElementById("weathercode"),
    record: document.getElementById("record"),
    average: document.getElementById("average"),
    lowest: document.getElementById("lowest"),
    chartCanvas: document.getElementById("airQualityChartKolkata"),
  };

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log(data);

    // nur Daten für Kolkata
    const cityData = data.filter(d => d.city.toLowerCase() === "kolkata");

    if (cityData.length === 0) return;
    
    console.log(cityData);

    // neuester Datensatz
    const latest = cityData[0];
    el.pm10.textContent = `${latest.pm10} PM10 μg/m³`;
    el.temperature.textContent = `${latest.temperature}°C`;
    el.weathercode.textContent = mapWeatherCode(latest.weather_code);

    // Zeit + Datum anzeigen
    const dateObj = new Date(latest.datetimelocal);
    el.time.textContent = dateObj.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    el.date.textContent = dateObj.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    // Statistiken (Record, Average, Lowest)
    const pm10Values = cityData.map(d => Number(d.pm10));
    const record = Math.max(...pm10Values);
    const lowest = Math.min(...pm10Values);
    const average = Math.round(pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length);

    el.record.textContent = `${record} PM10 μg/m³`;
    el.average.textContent = `${average} PM10 μg/m³`;
    el.lowest.textContent = `${lowest} PM10 μg/m³`;

    // Chart mit Chart.js
    const labels = cityData.map(d => d.datetimelocal);
    const values = cityData.map(d => d.pm10);

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
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

  } catch (e) {
    console.error("Fehler beim Laden der Daten:", e);
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


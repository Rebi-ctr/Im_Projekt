document.addEventListener("DOMContentLoaded", async () => {
  // 1) Stadt aus der URL
  const params = new URLSearchParams(location.search);
  const cityKey = params.get("city");
  if (!cityKey) {
    console.error("Kein ?city Parameter in der URL");
    return;
  }

  // 2) API URLs
  const API_URL_Info = `php/unloadC.php?city=${encodeURIComponent(cityKey)}`;
  const API_URL_Data = `php/unloadW.php?city=${encodeURIComponent(cityKey)}`;

  // 3) DOM Elemente
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
    weathercode: document.getElementById("weathercode"),
    weather_icon: document.getElementById("weather_icon"),

    record: document.getElementById("record"),
    average: document.getElementById("average"),
    lowest: document.getElementById("lowest"),

    chartCanvas: document.getElementById("airQualityChart"),
  };

  try {
    console.log("Lade Stadt-Infos für:", cityKey);
    
    // === 1) ERSTE API-ABFRAGE: Stadt-Informationen ===
    const resInfo = await fetch(API_URL_Info);
    if (!resInfo.ok) throw new Error(`Info API HTTP ${resInfo.status}`);
    const meta = await resInfo.json();
    
    console.log("Stadt-Infos geladen:", meta);

    // Stadt-Meta-Daten setzen
    if (el.pageTitle) el.pageTitle.textContent = meta.city;
    if (el.city_name_top) el.city_name_top.textContent = meta.city.toUpperCase();
    if (el.city_name) el.city_name.textContent = meta.city.toUpperCase();
    if (el.description) el.description.textContent = meta.description || "";
    if (meta.image && el.city_image) el.city_image.src = meta.image; // Korrigiert: image statt imge

    // === 2) ZWEITE API-ABFRAGE: Wetter- und Luftqualitätsdaten ===
    console.log("Lade Zeitreihen-Daten für:", cityKey);
    
    const resData = await fetch(API_URL_Data);
    if (!resData.ok) throw new Error(`Data API HTTP ${resData.status}`);
    const series = await resData.json();
    
    console.log("Zeitreihen-Daten geladen:", series);

    // Prüfen ob Daten vorhanden sind
    if (!Array.isArray(series) || series.length === 0) {
      console.warn("Keine Zeitreihen-Daten verfügbar");
      return;
    }

    // === 3) AKTUELLE WERTE (neueste Messung) ===
    const latest = series[0]; // Neueste Messung (da DESC sortiert)
    
    if (el.pm10) el.pm10.textContent = `${latest.pm10} PM10 μg/m³`;
    if (el.temperature) el.temperature.textContent = `${latest.temperature}°C`;

    // Wettercode und Icon
    const wc = mapWeatherCode(Number(latest.weather_code));
    if (el.weathercode) el.weathercode.textContent = wc.label;
    if (el.weather_icon) el.weather_icon.src = wc.icon; // Korrigiert: weather_icon statt weathericon

    // Datum und Zeit
    const dateObj = new Date(latest.datetimelocal);
    if (el.time) el.time.textContent = dateObj.toLocaleTimeString("de-CH", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    if (el.date) el.date.textContent = dateObj.toLocaleDateString("de-CH", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    });

    // === 4) STATISTIKEN (Record, Average, Lowest) ===
    const pm10Values = series.map(d => Number(d.pm10)).filter(n => Number.isFinite(n));
    
    if (pm10Values.length > 0) {
      const record = Math.max(...pm10Values);
      const lowest = Math.min(...pm10Values);
      const average = Math.round(pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length);

      if (el.record) el.record.textContent = `${record} PM10 μg/m³`;
      if (el.average) el.average.textContent = `${average} PM10 μg/m³`;
      if (el.lowest) el.lowest.textContent = `${lowest} PM10 μg/m³`;
    }

    // === 5) CHART ERSTELLEN ===
    if (el.chartCanvas) {
      // Daten für Chart formatieren
      const labels = series.map(d => {
        const date = new Date(d.datetimelocal);
        return date.toLocaleDateString("de-CH", { 
          day: "2-digit", 
          month: "2-digit" 
        });
      });
      const values = series.map(d => Number(d.pm10));

      new Chart(el.chartCanvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "PM10 μg/m³",
            data: values,
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
              text: `Luftqualität in ${meta.city}`
            }
          },
          scales: { 
            y: { 
              beginAtZero: true,
              title: {
                display: true,
                text: 'PM10 μg/m³'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Datum'
              }
            }
          },
        },
      });
      
      console.log("Chart erfolgreich erstellt");
    }

  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    
    // Benutzerfreundliche Fehlermeldung anzeigen
    if (el.description) {
      el.description.textContent = "Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.";
    }
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
document.addEventListener("DOMContentLoaded", () => {
  // Beispielhafte Testdaten (simuliert)
  const data = {
    pm10: "90 PM10 μg/m³",
    time: "14:32",
    date: "9. Oktober 2025",
    temperature: "90°C",
    record: "30 PM10 μg/m³",
    average: "90 PM10 μg/m³",
    lowest: "20 PM10 μg/m³",
    weathercode: "23",
  };

  // Befülle alle HTML-Elemente
  for (const key in data) {
    const element = document.getElementById(key);
    if (element) element.textContent = data[key];
  }
});
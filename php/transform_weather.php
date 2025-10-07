<?php
// --- 1. Rohdaten einbinden (aus extract_weather.php)
$weatherdata = include('extract_weather.php');

// --- 2. Prüfen, ob Daten valide sind
if (!$weatherdata || !is_array($weatherdata)) {
    die("❌ Fehler: Keine gültigen Daten aus extract_weather.php erhalten.\n");
}

// --- 3. Städte-Mapping nach Koordinaten
function mapCity($lat, $lon)
{
    $cities = [
        ['name' => 'Mumbai',     'lat' => 19.0728, 'lon' => 72.8826],
        ['name' => 'Chennai',    'lat' => 13, 'lon' => 80.125],
        ['name' => 'Bangalore',  'lat' => 12.9719, 'lon' => 77.5937],
        ['name' => 'Delhi',      'lat' => 28.6214, 'lon' => 77.2148],
        ['name' => 'Kolkata',    'lat' => 22.5626, 'lon' => 88.363],
    ];

    foreach ($cities as $city) {
        if (abs($lat - $city['lat']) < 0.1 && abs($lon - $city['lon']) < 0.1) {
            return $city['name'];
        }
    }
    return 'Unknown';
}

// --- 4. Transformation der Daten
$transformedData = [];

// Prüfen, ob Datenstruktur gültig ist
if (isset($weatherdata['latitude']) && is_array($weatherdata['latitude'])) {

    // Die API gibt mehrere Standorte gleichzeitig zurück
    foreach ($weatherdata['latitude'] as $i => $lat) {
        $lon = $weatherdata['longitude'][$i] ?? null;
        $city = mapCity($lat, $lon);

        // Zeit: im Feld current -> time (z. B. "2025-10-06T18:15")
        $timeIso = $weatherdata['current']['time'] ?? null;
        $datetime = DateTime::createFromFormat('Y-m-d\TH:i', $timeIso);
        $datetimeLocal = $datetime ? $datetime->format('Y-m-d H:i:s') : null;

        // Temperatur und Weather-Code pro Stadt holen (gleich für alle Standorte)
        $temperature = $weatherdata['current']['temperature_2m'] ?? null;
        $weatherCode = $weatherdata['current']['weather_code'] ?? null;

        $transformedData[] = [
            'city' => $city,
            'temperature' => (float)$temperature,
            'weather_code' => (int)$weatherCode,
            'datetimelocal' => $datetimeLocal
        ];
    }
} else {
    // Alternative Struktur (z. B. wenn API-Daten verschachtelt sind)
    foreach ($weatherdata as $entry) {
        if (!isset($entry['latitude'], $entry['longitude'], $entry['current'])) continue;

        $city = mapCity($entry['latitude'], $entry['longitude']);
        $timeIso = $entry['current']['time'] ?? null;

        $datetime = DateTime::createFromFormat('Y-m-d\TH:i', $timeIso);
        $datetimeLocal = $datetime ? $datetime->format('Y-m-d H:i:s') : null;

        $transformedData[] = [
            'city' => $city,
            'temperature' => (float)($entry['current']['temperature_2m'] ?? 0),
            'weather_code' => (int)($entry['current']['weather_code'] ?? 0),
            'datetimelocal' => $datetimeLocal
        ];
    }
}

// --- 5. Kontrolle / Debug
// echo "<pre>";
// print_r($transformedData);
// echo "</pre>";

// --- 6. Rückgabe für load.php
return $transformedData;
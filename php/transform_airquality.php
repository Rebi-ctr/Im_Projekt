<?php

// --- 1. Rohdaten einbinden (z. B. aus extract.php)
$airdata = include('extract_airquality.php');

// --- 3. Prüfen, ob Daten valide sind
if (!$airdata || !is_array($airdata)) {
    die("❌ Fehler: Keine gültigen Daten aus extract.php erhalten.\n");
}

// --- 4. Städte-Mapping nach Koordinaten
function mapCity($lat, $lon)
{
    $cities = [
        ['name' => 'Mumbai',     'lat' => 19.099998, 'lon' => 72.90001],
        ['name' => 'Chennai',    'lat' => 13.099998, 'lon' => 80.30002],
        ['name' => 'Bangalore',  'lat' => 13.0,      'lon' => 77.600006],
        ['name' => 'Delhi',      'lat' => 28.599998, 'lon' => 77.20001],
        ['name' => 'Kolkata',    'lat' => 22.599998, 'lon' => 88.399994],
    ];

    foreach ($cities as $city) {
        if (abs($lat - $city['lat']) < 0.02 && abs($lon - $city['lon']) < 0.02) {
            return $city['name'];
        }
    }
    return 'Unknown';
}

// --- 5. Transformation der Daten
$transformedData = [];

foreach ($airdata as $entry) {
    $city = mapCity($entry['latitude'], $entry['longitude']);
    $timeIso = $entry['current']['time']; // z. B. "2025-10-06T18:15"

    // Zeitstring in DateTime-Objekt umwandeln und korrekt formatieren
    $datetime = DateTime::createFromFormat('Y-m-d\TH:i', $timeIso);
    $datetimeLocal = $datetime ? $datetime->format('Y-m-d H:i:s') : null;

    $transformedData[] = [
        'city' => $city,
        'pm10' => !empty($entry['current']['pm10']) ? (float) $entry['current']['pm10'] : null,
        'pm2_5' => !empty($entry['current']['pm2_5']) ? (float) $entry['current']['pm2_5'] : null,
        'datetimelocal' => $datetimeLocal
    ];
}

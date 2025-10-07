<?php

/* ============================================================================
   HANDLUNGSANWEISUNG (transform.php)
   0) Schau dir die Rohdaten genau an und plane exakt, wie du die Daten umwandeln möchtest (auf Papier)
   1) Binde extract.php ein und erhalte das Rohdaten-Array.
   2) Definiere Mapping Koordinaten → Anzeigename (z. B. Bern/Chur/Zürich).
   3) Konvertiere Einheiten (z. B. °F → °C) und runde sinnvoll (Celsius = (Fahrenheit - 32) * 5 / 9).
   4) Leite eine einfache "condition" ab (z. B. sonnig/teilweise bewölkt/bewölkt/regnerisch).
   5) Baue ein kompaktes, flaches Array je Standort mit den Ziel-Feldern.
   6) Optional: Sortiere die Werte (z. B. nach Zeit), entferne irrelevante Felder.
   7) Validiere Pflichtfelder (location, temperature_celsius, …).
   8) Kodieren: json_encode(..., JSON_PRETTY_PRINT) → JSON-String.
   9) GIB den JSON-String ZURÜCK (return), nicht ausgeben – für den Load-Schritt.
  10) Fehlerfälle als Exception nach oben weiterreichen (kein HTML/echo).
   ============================================================================ */


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
        'pm10' => (float)$entry['current']['pm10'],
        'pm2_5' => (float)$entry['current']['pm2_5'],
        'datetimelocal' => $datetimeLocal
    ];
}

// // --- 6. Ausgabe zur Kontrolle
// echo "<pre>";
// print_r($transformedData);
// echo "</pre>";
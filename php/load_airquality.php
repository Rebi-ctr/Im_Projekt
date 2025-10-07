<?php

// --- 1. Transformations-Skript einbinden
include 'transform_airquality.php';
print_r($transformedData);

// --- 2. Datenbankkonfiguration einbinden
require_once 'config.php';

try {
    // --- 3. PDO-Verbindung herstellen
    $pdo = new PDO($dsn, $username, $password, $options);

    // --- 4. SQL vorbereiten
    $sql = "INSERT INTO `AirQuality` (`city`, `pm10`, `pm2_5`, `datetimelocal`) 
            VALUES (:city, :pm10, :pm2_5, :datetimelocal)";


    $stmt = $pdo->prepare($sql);

    // --- 5. Daten einfügen
    foreach ($transformedData as $item) {
        $stmt->execute([
            ':city' => $item['city'],
            ':pm10' => $item['pm10'],
            ':pm2_5' => $item['pm2_5'],
            ':datetimelocal' => $item['datetimelocal'],
        ]);
    }

    echo "✅ Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("❌ Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}



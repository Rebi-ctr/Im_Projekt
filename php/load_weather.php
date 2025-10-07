<?php

// --- 1. Transformations-Skript einbinden
include 'transform_weather.php';
// print_r($transformedData);

// --- 2. Datenbankkonfiguration einbinden
require_once 'config.php';

try {
    // --- 3. PDO-Verbindung herstellen
    $pdo = new PDO($dsn, $username, $password, $options);

    // --- 4. SQL vorbereiten
    $sql = "INSERT INTO `weather_data_india` (`city`, `temperature`, `datetimelocal`, `weather_code`) 
            VALUES (:city, :temperature, :datetimelocal, :weather_code)";


    $stmt = $pdo->prepare($sql);

    // --- 5. Daten einfügen
    foreach ($transformedData as $item) {
        $stmt->execute([
            ':city' => $item['city'],
            ':temperature' => $item['temperature'],
            ':datetimelocal' => $item['datetimelocal'],
            ':weather_code' => $item['weather_code'],
        ]);
    }

    echo "✅ Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("❌ Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}



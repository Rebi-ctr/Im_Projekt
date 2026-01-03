<?php
// filepath: /Users/cpol-baumberger/Documents/GitHub/Im_Projekt/php/cleanup_chennai.php

require_once 'config.php';
header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // Beginne eine Transaktion für Sicherheit
    $pdo->beginTransaction();
    
    // 1. Alle "Unknown" Einträge in AirQuality zu "Chennai" ändern
    $updateAirQuality = $pdo->prepare("
        UPDATE AirQuality 
        SET city = 'Chennai' 
        WHERE city = 'Unknown'
    ");
    $updateAirQuality->execute();
    $airQualityUpdated = $updateAirQuality->rowCount();
    
    // 2. Alle "Unknown" Einträge in weather_data_india zu "Chennai" ändern
    $updateWeather = $pdo->prepare("
        UPDATE weather_data_india 
        SET city = 'Chennai' 
        WHERE city = 'Unknown'
    ");
    $updateWeather->execute();
    $weatherUpdated = $updateWeather->rowCount();
    
    // Transaktion bestätigen
    $pdo->commit();
    
    // Erfolgsmeldung
    $response = [
        'status' => 'success',
        'message' => 'Chennai Datenbank-Cleanup erfolgreich durchgeführt',
        'air_quality_updated' => $airQualityUpdated,
        'weather_updated' => $weatherUpdated,
        'total_updated' => $airQualityUpdated + $weatherUpdated
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    // Transaktion rückgängig machen bei Fehler
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Cleanup-Fehler: ' . $e->getMessage()
    ]);
}
?>
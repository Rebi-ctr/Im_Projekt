<?php

header('Access-Control-Allow-Origin: https://im3.mathis-tobler.ch');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type, Authorization');



require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist
 header('Content-Type: application/json; charset=utf-8');

$city = $_GET['city'] ?? null;

if (!$city) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing ?city']);
  exit;
}

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

  // --- 2) Zeitreihen-Daten (Air Quality + Wetter) ---
  $stmtData = $pdo->prepare("
    SELECT 
      a.datetimelocal,
      a.pm10,
      a.pm2_5,
      w.temperature,
      w.weather_code
    FROM AirQuality AS a
    JOIN weather_data_india AS w
      ON a.city = w.city
     AND a.datetimelocal = w.datetimelocal
    WHERE a.city = :city
    ORDER BY a.datetimelocal DESC
    LIMIT 100
  ");
  $stmtData->execute([':city' => $city]);
  $timeseries = $stmtData->fetchAll(PDO::FETCH_ASSOC);

  // --- 3) JSON-Ausgabe ---
  echo json_encode($timeseries, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
}


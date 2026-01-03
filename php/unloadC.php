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

  // Meta-Daten (aus city_description)
  $stmtMeta = $pdo->prepare("
    SELECT city, description, image
    FROM city_description
    WHERE city = :city
    LIMIT 1
  ");
  $stmtMeta->execute([':city' => $city]);
  $meta = $stmtMeta->fetch(PDO::FETCH_ASSOC);

  if (!$meta) {
    http_response_code(404);
    echo json_encode(['error' => 'Unknown city']);
    exit;
  }
  
// JSON-Ausgabe
echo json_encode($meta, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
}


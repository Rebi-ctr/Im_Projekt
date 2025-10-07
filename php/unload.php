<?php
/* ============================================================================
   HANDLUNGSANWEISUNG (unload.php)
   1) Setze Header: Content-Type: application/json; charset=utf-8.
   2) Binde 001_config.php (PDO-Config) ein.
   3) Lies optionale Request-Parameter (z. B. location, limit, from/to) und validiere.
   4) Baue SELECT mit PREPARED STATEMENT (WHERE/ORDER BY/LIMIT je nach Parametern).
   5) Binde Parameter sicher (execute([...]) oder bindValue()).
   6) Hole Datensätze (fetchAll) – optional gruppieren/umformen fürs Frontend.
   7) Antworte IMMER als JSON (json_encode) – auch bei leeren Treffern ([]) .
   8) Setze sinnvolle HTTP-Statuscodes (400 für Bad Request, 404 bei 0 Treffern (Detail), 200 ok).
   9) Fehlerfall: 500 + { "error": "..." } (keine internen Details leaken).
  10) Keine HTML-Ausgabe; keine var_dump in Prod.
   ============================================================================ */


require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // Beispielhafte SQL-Abfrage (passen Sie diese an Ihre Bedürfnisse an)
    $sql = "SELECT 
    a.city,
    a.datetimelocal,
    a.pm10,
    a.pm2_5,
    w.temperature,
    w.weather_code
FROM AirQuality AS a
JOIN weather_data_india AS w
    ON a.city = w.city
    AND a.datetimelocal = w.datetimelocal
ORDER BY a.city, a.datetimelocal DESC;";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Anweisung aus
    $stmt->execute();

    // Holt alle Ergebnisse
    $results_airpollution = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gibt die Ergebnisse als JSON aus
    echo json_encode($results_airpollution);
} catch (PDOException $e) {
    // Bei einem Fehler eine JSON-Fehlermeldung zurückgeben
    http_response_code(500);
    echo json_encode(["error" => "Datenbankfehler: " . $e->getMessage()]);
}

header('Content-Type: application/json');
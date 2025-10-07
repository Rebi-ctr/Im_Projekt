<?php

require_once 'config.php';

try {
    // Verbindung zur Datenbank herstellen
    // Wichtig: PDO nehmen und nicht mysqli (nicht so sicher wie PDO)
    $pdo = new PDO($dsn, $username, $password, $options);

    $sql = "SELECT * FROM `User`"; // SQL-Abfrage
    $stmt = $pdo->query($sql); // Abfrage ausführen

    $users = $stmt->fetchAll(); // Alle Ergebnisse holen aus der Datenbank

    foreach ($users as $user) { // durch alle Ergebnisse gehen
        echo "Vorname: " . $user['firstname'] .  "<br>";
        echo "Nachname: " . $user['lastname'] .  "<br>";
        echo "Email: " . $user['email'] .  "<br>";
        echo "------------------------------<br>";
    }

} catch (PDOException $e) {
    // wenn nichts kommt dann Fehlermeldung ausgeben
    echo "Verbindungsfehler: " . $e->getMessage();
}

<?php

function fetchWeatherData()
{
    $url = "https://api.open-meteo.com/v1/forecast?latitude=19.0728,13.0878,12.9719,28.6214,22.5626&longitude=72.8826,80.2785,77.5937,77.2148,88.363&current=temperature_2m,weather_code&timezone=auto";

    // Initialisiert eine cURL-Sitzung (wir machen den HTTP-Request, das heisst wir machen die Anfrage an die API, wir )
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Ich sage dem cURL, wie er die URL anschauen soll, Rückgabe des Transfers als String

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);// führe die Anfrage aus in der Variable $response werden die Daten gespeichert

    // echo "<br><br>";
    // print_r($data);

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    $data = json_decode($response, true);
    // echo "<br><br>";
    // print_r($data);
    return $data;// gibt die Daten zurück so dass wir sie sehen können
}

// Gibt die Daten zurück, wenn dieses Skript eingebunden ist
return fetchWeatherData();

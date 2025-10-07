<?php // Sagt dem Server, dass es sich um eine PHP-Datei handelt (sonst wird es als HTML interpretiert)
$name = "Rebi"; // Variable mit $
$alter = 17; // Integer
$jahrgang = 2001; // Integer
$groesse = 1.75; // Float
$istStudent = true; // Boolean
$hobbys = array("Lesen", "Schwimmen", "Programmieren"); // Array

echo $name; // Gibt den Variableninhalt aus

echo "mein Name ist " . $name . " und ich bin " . $alter . " Jahre alt."; // Verkettung mit . und Variablen
print_r($name); // besser für debugging 
var_dump($name); // zeigt den Typ der Variable an (string, int, float, boolean, array)

$alter = 2025 - $jahrgang; // Berechnung mit Variablen
echo "Ich bin " . $alter . " Jahre alt."; // (Punkt vor Variablen nimmt den Abstand weg)

if ($alter >= 18 || $istStudent) { // if-Bedingung mit oder (||) beide müssen stimmen (&&)
    echo "Du darfst alles bestellen.";
} elseif ($alter >= 16) { // elseif-Bedingung
    echo "Du darfst Bier und Wein trinken.";
} elseif ($alter >= 10) { // elseif-Bedingung
    echo "bitte hole deine Eltern dazu.";
} else { // else-Bedingung
    echo "Du darfst nur Saft trinken.";
}

//Funktionen helfen um Code zu strukturieren und wiederzuverwenden wenn abläufe mehrfach gebraucht werden
function alterberechnen ($jahrgang) { 
   return date("Y") - $jahrgang; // date("Y") gibt das aktuelle Jahr zurück
}   

echo alterberechnen(2001); // Aufruf der Funktion mit Parameter

// array mit Schleife durchlaufen
$früchte = array("Apfel", "Banane", "Orange");
foreach ($früchte as $key => $value) { // für jede Frucht im Array Frü
    echo "Frucht " . $key . ": " . $value . "<br>";
} 


?>
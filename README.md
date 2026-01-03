# Im_Projekt

## 📋 Kurzbeschrieb

In unserem Projekt haben wir die **Air-Quality API** mit der **Weather API** verbunden und versuchen so den Zusammenhang von Wetter/Temperatur und Feinstaub (PM 10, PM 2.5) in der Luft zu untersuchen. 

Da dies in der Schweiz nicht so spannend wäre, haben wir uns für die **5 größten Städte von Indien** entschieden. Dabei wollten wir die Website so gestalten, dass der Benutzer nicht nur mit einer Grafik über die Daten informiert wird, sondern die Zahlen **erlebbar** werden, indem man mit dem "Sonnenrad" durch die Vergangenheit reisen kann. 

### 🚗 TukTuk-Visualisierung
Pro **10 μg/m³ PM10** in der Luft wird ein TukTuk generiert. So kann man diese sehr abstrakte Zahl visuell auf einen Blick erfassen.

### 📊 Weitere Features
- Rekordzahl und kleinster Wert der Woche
- Interaktives Diagramm für genauere Entwicklungen
- Temperatur-Vergleich zum Feinstaub

## 🎓 Learnings

- **Datenbankdesign**: Wenn man selbst eine Datenbank macht und später noch weitere Daten (z.B. Niederschlagsmenge) haben will, kann man diese nicht einfach so noch einfügen. Eine ausgereifte Idee am Anfang ist sehr wichtig.
- **Analoges Planen**: Es war sehr hilfreich, sich Dinge analog aufzuzeichnen bei komplexen Abläufen, um zu verstehen, was nacheinander geschehen muss.
- **Schrittweise Umsetzung**: Diese Zusammenhänge haben bei der schrittweisen Umsetzung geholfen.

## 🚧 Schwierigkeiten

### Zeitrad-Implementierung
Wir hatten uns die Idee mit dem **drehenden Zeitrad** in den Kopf gesetzt und wussten: wenn wir das schaffen, können wir uns noch an die TukTuks wagen. Beides war komplex und hat viele Versuche erfordert - jedoch sind wir sehr stolz, dass wir es geschafft haben.

> **Note**: Die Drehfunktion und gewisse Aspekte der dazugehörigen Funktionen wurden durch große Unterstützung von KI umgesetzt. Bei der `dial.js` verstehen wir nicht genau, wie alles funktioniert, jedoch immer so weit, um einzugreifen und Änderungen zu unseren Zwecken zu machen.

### Chennai Datenbank Probleme
Bei der Stadt Chennai ist seit dem 12. Dez. irgendetwas nicht mehr ganz korrekt an der API und er liefert seither zwar die Daten aber verordnet die Stadt immer mit Unknown. Dies konnten wir nicht vollständig beheben und es mit einer zusätzlichen Php Datei die durch einen SQL befehl die Daten bereinigt. Da das Problem aber eingentlich an der Wurzel behoben werden muss, haben wir es nicht fix in den Datenbank befüllungs Prozess eingefügt sondern ausgelagert.

### Nicht umgesetzte Features
- **Abgas-Effekt**: Wollten, dass die TukTuks Abgas produzieren und den Screen zunehmend "verschmutzen" - jedoch nicht "hübsch" genug gelungen.

## 🛠️ Benutzte Ressourcen

### KI-Tools
- **Visual Studio Code Copilot** (Ask-Modus) - viel dazugelernt und unterschiedliche Herangehensweisen gesehen
- **ChatGPT** - vor allem beim Zeitrad eine große Hilfe

### Libraries & Frameworks
- **Chart.js** für Grafiken
- ~~**D3.js**~~ (anfänglich für TukTuks versucht, dann mit ChatGPT/Copilot gelöst)

### Weitere Quellen
- GitHub-Projekte
- YouTube-Tutorials

## 🏗️ Technische Details

### APIs
- Air Quality API
- Weather API

### Städte
1. Delhi
2. Mumbai
3. Bangalore
4. Kolkata
5. Chennai

### Datenvisualisierung
- Interaktives Zeitrad (dial.js)
- TukTuk-Animation basierend auf PM10-Werten
- Chart.js Diagramme für Trends

---

*Projekt für IM3 - Interaktive Medien von Mathis Tobler und Rebecca Baumberger MMP24b*

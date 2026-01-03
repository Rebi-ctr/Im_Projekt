# Im_Projekt
Kurzbeschrieb
In unserem Projekt haben wir die Air-Quality API mit der Weather API verbunden und versuchen so den Zusammenhang von Wetter/Temperatur und Feinstaub (PM 10,PM 2,5) in der Luft zu untersuchen. Da dies in der Schweiz nicht so spannend wäre, haben wir uns für die 5 grössten Städte von Indien entschieden. Dabei wollten wir die Website so gestalten, dass der Benutzer nicht nur mit einer Grafik über die Daten informiert wird, sondern die Zahlen erlebbar werden in dem man mit dem "Sonnenrad" durch die Vergangenheit reisen kann. Dabei werden pro 10 μg/m³ PM10 in der Luft wird ein TukTuk generiert. So kann man diese sehr abstrakte Zahl visuell auf einen Blick erfassen. 

Um diese Werte über eine Zeit zu beobachten, haben wir noch weitere Parameter wie Rekordzahl und kleinster Wert der Woche einfliessen lassen. Zudem kann man das Diagramm für genauere Entwicklungen analysieren und sieht da auch wie die Temperatur sich im Vergleich zu dem Feinstaub entwickelt.

Learnings
Was uns besonders bewusst wurde, dass wenn man selbst eine Datenbank macht und später noch weitere Daten (zB. Niederschlagsmenge) haben will, kann man diese nicht einfach so noch einfügen. Also ist eine ausgereifte Idee am Anfang sehr wichtig. Zudem war es immer wieder sehr hilfreich sich Dinge analog aufzuzeichnen bei komplexen Abläufen, um zu verstehen, was nacheinander geschehen muss, dass die Logik am Ende aufgeht. Diese Zusammenhänge haben dann auch in der Schrittweisen Umsetzung geholfen

Schwierigkeiten
Wir hatten uns die Idee mit dem Drehenden Zeitrad in den Kopf gesetzt und wussten, wenn wir das schaffen, können wir uns noch an die TukTuks wagen. Beides war komplex und hat viele Versuche erfordert. Jedoch sind wir sehr stolz haben wir es geschafft. Die Drehfunktion und gewisse Aspekte der dazugehörigen Funktionen wurden durch sehr grosse Unterstützung von KI umgesetzt, so dass wir bei der dial.js nicht genau verstehen, wie alles funktioniert, jedoch haben wir immer alles so weit verstanden, um einzugreifen und Änderungen zu unseren Zwecken zu machen. Ausserdem wollten wir, dass die TukTuks Abgas produzieren und den Screen zunehmend "verschmutzen" jedoch ist uns das nicht so gelungen, dass es "hübsch" genug war. 

benutzte Ressourcen
Wir haben sehr oft den Copiloten von Visual Studio Code genutzt im Ask-modus. So haben wir sehr viel dazugelernt und unterschiedliche Herangehensweisen gesehen. Auch Chat-CPT war vor allem beim Zeitrad eine grosse Hilfe und auch andere Projekte (Github) und tutorials auf YouTube. Wir haben Chart-js für unsere Grafik genutzt und auch anfänglich mit 3d.js für die TukTuks jedoch hat das nicht so funktioniert, wie wir das wollten und haben es dann mit Chat-CPT und Copilot gelöst.


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

*Projekt für IM3 - Interactive Media Design*

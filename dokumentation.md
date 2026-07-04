# 🎮 Projektname: Gaming-Tagebuch

## 1. Ziel

Es soll eine Art "digitales" Tagebuch sein, womit man bereits gespielte Videospiele eintragen kann;
Beim Eintrag selbst wird: Bild, Titel, Bewertung, Kurzes Fazit hinzugefügt
Die Webseite soll Einträge hinzufügen können

-

## 2. Features

### ✅ Muss (v1)

- Titel, Fazit, Bewertung ✅
- Einträge hinzufügen können, ✅
- Abspeichern der Einträge ✅

### 🔜 Bald (v2)

- Bearbeiten eines Eintrags
- Eintrag löschen können ✅
- Sortieren (nach Bewertung, Spieldauer..)

### 💡 Später / Ideen (v3+)

- ein "Ranking" aller Spiele
- Suchfunktion
- Logo von Plattform

## 3. Datenstruktur

| Feld      | Typ         | Pflicht | Beschreibung                                      |
| --------- | ----------- | ------- | ------------------------------------------------- |
| titel     | Text        | Ja      | Name des Spiels                                   |
| bewertung | Zahl (1-5)  | Ja      | Persönliche Bewertung                             |
| fazit     | Text (lang) | Nein    | Kurzes persönliches Fazit                         |
| end datum | date        | Nein    | Der Tag, andem das Spiel durchgespielt worden ist |

## 4. Technischer Aufbau

| Datei                 | Aufgabe                          |
| --------------------- | -------------------------------- |
| `websites/index.html` | Struktur der Seite               |
| `styles/styles.css`   | Design / Aussehen                |
| `scripts/script.js`   | Logik (Speichern, Anzeigen, ...) |
| `dokumentation.md`    | Diese Dokumentation              |

**Speicherung:**

<!-- z.B. Local Storage, später vielleicht Datenbank -->

-

## 5. Design-Ideen

| Element            | Idee / Wert                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| Hintergrundfarbe   | #1E1E2E (Midnight Navy)                                                 |
| Button /Akzente    | #E8294A (Crimson Red)                                                   |
| Button /Hover      | #C0235A (Deep Rose)                                                     |
| Karten / Container | etwas heller als Hintergrund, z.B. #2A2A3E                              |
| Schrift (Titel)    | #7B8BA5 (Steel Blue) /Rajdhani – kantig, technisch, sehr Gaming-typisch |
| Schrift (Text)     | #E8EAF0 (Ghost White) / Inter – der Klassiker, extrem gut lesbar, clean |

<!-- sowas vielleicht wäre schön: https://i.pinimg.com/736x/28/dd/f1/28ddf1d5d58836a0f12748bf0bc0662a.jpg-->

## 7. Changelog

<!-- Kurz dokumentieren, wann was geändert wurde -->

| Datum      | Änderung                                                                              |
| ---------- | ------------------------------------------------------------------------------------- |
| 28.06.2026 | Github account kreiert, datein in repo hinzugefügt, Dokumentation (mit Ki) ausgefüllt |
| 30.06.2026 | Eingabefelder mit Validierung, Array mit allen Spielen ins LocaleStorage gespeicher   |
| 01.07.2026 | Liste der Spiele wird in der Webseite angezeigt und Webseite zum großteil gestylt     |
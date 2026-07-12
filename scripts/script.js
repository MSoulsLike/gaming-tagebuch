let spiele =
  localStorage.getItem("spiele") !== null
    ? JSON.parse(localStorage.getItem("spiele"))
    : [];

let state = -1; //Wenn eins dann kann Nutzer neuen Eintrag hinzufügen, wenn er anders ist, ist es der Index von dem Eintrag der Bearbeitet werden soll
//Für sämtliche Sortierungen, damit nichts schiefgehen kann
let aktiverFilter = ""; //Plattform
let aktiveSuche = ""; //Suche
let aktiveSortierung = "standard"; //Sortierung der Liste

function init() {
  document.querySelector("#form-btn").addEventListener("click", validateInput);
  document.querySelector("#sortieren").addEventListener("change", handleSort); //change = wenn Nutzer was auswählt, wirds sofort ausgeführt
  document
    .querySelector("#sortierPlattform")
    .addEventListener("change", handleSortPlattform);
  document.querySelector("#suche").addEventListener("input", handleSearchGame);
  document
    .querySelector("#stat")
    .addEventListener("click", handleHideStatistik);
  if (spiele.length > 0) {
    //Überprüfen ob es mind. ein Spiel im Array existiert
    handleUpdateCounter();
    handleSortingOfArray();
  }
}

//#region Eingabe des Nutzer validieren
function validateInput() {
  //Auslesen der Daten
  let titel = document.querySelector("#titel").value;
  let bewertung = parseInt(document.querySelector("#bewertung").value);
  let fazit = document.querySelector("#fazit").value;
  let plattform = document.querySelector("#plattform").value;
  let datumanfang = document.querySelector("#datumanfang").value;
  let datumende = document.querySelector("#datumende").value;

  if (datumende === "") {
    datumende = new Date().toISOString().split("T")[0]; //Sonst ist der Wert in dem falschen Format
  }

  //Einzelne Daten validieren
  if (
    validateTitel(titel) &&
    validateBewertung(bewertung) &&
    plattform != "" &&
    validateDatum(datumanfang, datumende)
  ) {
    //Objekt erstellen
    let spiel = {
      titel: titel,
      bewertung: bewertung,
      fazit: fazit,
      plattform: plattform,
      beginn: datumanfang,
      ende: datumende,
    };

    //Eingabefelder löschen für den Swag
    document.querySelector("#titel").value = "";
    document.querySelector("#bewertung").value = "";
    document.querySelector("#fazit").value = "";
    document.querySelector("#plattform").value = "";
    document.querySelector("#datumanfang").value = "";
    document.querySelector("#datumende").value = "";

    if (state === -1) {
      //Spiel hinzufügen
      spiele.push(spiel);
    } else {
      document.querySelector("#form-btn").textContent = "Fertigstellen";
      spiele[state] = spiel;
      state = -1;
    }
    //Das Array abspeichern
    localStorage.setItem("spiele", JSON.stringify(spiele));

    //Spiele in der Webseite anzeigen
    handleUpdateCounter();
    handleSortingOfArray();
  } else {
    //Fehlermeldung
    alert("Ihre Eingaben sind Ungültig!!!");
  }
}

function validateTitel(titel) {
  return !(titel === "");
}

function validateBewertung(bewertung) {
  return bewertung === "" || isNaN(bewertung) || bewertung < 1 || bewertung > 5
    ? false
    : true; //NaN === NaN => false hammer logik
}

function validateDatum(anfang, ende) {
  if (anfang === "") {
    return true;
  }

  let dateAnfang = new Date(anfang);
  let dateEnde = new Date(ende);

  return dateAnfang > dateEnde ? false : true;
}

//#endregion

//#region displayFunktionen
function displaySpiele(spiele) {
  const box = document.querySelector("#BoxSpiele");
  box.innerHTML = ""; //Inhalt der Box leeren
  box.append(renderSpiele(spiele));
}
//#endregion

//#region renderFunktionen
function renderSpiele(spiele) {
  //Liste für die Spiele erstellen
  const liste = document.createElement("ul");
  liste.id = "spieleListe";
  let counter = 0;

  //Einträge des Arrays in die Liste bringen
  for (let spiel of spiele) {
    //Einzelne Spiele vom Array auswählen
    let eintrag = document.createElement("li");
    for (let key in spiel) {
      //Einzelne Eigenschaft von dem Spiel verwenden
      eintrag.textContent += `${key.toUpperCase()}: `;

      if (spiel[key] === "") {
        //Fazit oder Datumanfang sein
        eintrag.textContent += `----||---- `;
      } else if (key === "beginn" || key === "ende") {
        eintrag.textContent += `${new Date(spiel[key]).toLocaleDateString("de-DE")}`;
      } else {
        eintrag.textContent += `${spiel[key]}`;
      }

      if (key === "plattform") {
        eintrag.textContent += handleIconForGame(spiel[key]);
      }

      eintrag.textContent += "\n";
      eintrag.style.backgroundColor = handleColorOfGame(spiel["bewertung"]); //Farbe von Box ändern
    }

    //Lösch-Knopf hinzufügen
    const knopf = renderButton("löschen", "click", handleDelete);
    knopf.dataset.index = counter;
    eintrag.append(knopf);

    //Bearbeiten-Knopf hinzufügen
    const bearbeiten = renderButton("bearbeiten", "click", handleEdit);
    bearbeiten.dataset.index = counter;
    eintrag.append(bearbeiten);

    counter++;
    liste.append(eintrag);
  }

  return liste;
}

function renderButton(text, eventtype, func) {
  const button = document.createElement("button");
  button.textContent = text.toUpperCase();
  button.addEventListener(eventtype, func);
  return button;
}

//#endregion

//#region HandleFunktionnen
function handleDelete() {
  let index = event.target.dataset.index; //event.target ist der Knopf der gedrückt wurde
  spiele.splice(index, 1);
  localStorage.setItem("spiele", JSON.stringify(spiele));
  displaySpiele(spiele);
}

function handleEdit() {
  let index = event.target.dataset.index;
  let objekt = spiele[index];
  //die Keys vom Objekt auslesen und in die Inputfelder von der Formular mit die Daten des Objekts füllen
  document.querySelector("#titel").value = objekt["titel"];
  document.querySelector("#bewertung").value = objekt["bewertung"];
  document.querySelector("#fazit").value = objekt["fazit"];
  document.querySelector("#datumanfang").value = objekt["beginn"];
  document.querySelector("#datumende").value = objekt["ende"];
  document.querySelector("#plattform").value = objekt["plattform"];

  document.querySelector("#form-btn").textContent = "Aktualisieren";
  state = index;
}

function handleSort() {
  aktiveSortierung = event.target.value;
  handleSortingOfArray();
}

function handleIconForGame(plattform) {
  switch (
    plattform //ein paramter, mit dem überprüft wird übergeben
  ) {
    case "PC":
      return "🖥️";
    case "Nintendo":
      return "🔴";
    case "PlayStation":
      return "🎮";
    case "XBox":
      return "🟢";
  } //Alles eigentlich nur ein else if Block
}

function handleColorOfGame(bewertung) {
  if (bewertung <= 2) {
    return "rgba(76, 175, 80, 0.4)";
  } else if (bewertung === 3) {
    return "rgba(255, 193, 7, 0.4)";
  } else {
    return "rgba(232, 41, 74, 0.4)";
  }
}

function handleUpdateCounter() {
  document.querySelector("#zähler").textContent = `${spiele.length}`;
  if (spiele.length === 1) {
    //Nur damit die Webseite besser ausschaut, dies stört mit persönlich
    document.querySelector("#zähler").textContent += " Spiel eingetragen";
  } else {
    document.querySelector("#zähler").textContent += " Spiele eingetragen";
  }
}

//#region SortierFunktionen
function handleSortPlattform() {
  aktiverFilter = event.target.value;
  handleSortingOfArray();
}

function handleSearchGame() {
  aktiveSuche = event.target.value;
  handleSortingOfArray();
}

function handleSortingOfArray() {
  let kopie = [...spiele];
  //Filter
  if (aktiverFilter !== "") {
    kopie = kopie.filter((spiel) => spiel.plattform === aktiverFilter);
  }

  if (aktiveSuche !== "") {
    kopie = kopie.filter((spiel) =>
      spiel.titel.toLowerCase().includes(aktiveSuche),
    );
  }

  if (aktiveSortierung !== "") {
    switch (aktiveSortierung) {
      case "aufsteigend":
        kopie.sort((a, b) => a.bewertung - b.bewertung); // bewertung von Objekt - einer anderen Bewertung => positiv = b kommt vor a; negativ = a kommt vor b; 0 = nichts wird geändert
        break;
      case "absteigend":
        kopie.sort((a, b) => b.bewertung - a.bewertung);
        break;
      case "az":
        kopie.sort((a, b) => a.titel.localeCompare(b.titel)); // wird mit der Reihenfolge des Alphabets verglichen;  a kommt vor c
        break;
      case "za":
        kopie.sort((a, b) => b.titel.localeCompare(a.titel));
        break;
    }
  }

  displaySpiele(kopie);
}

//#endregion

//#region Statistik
function handleHideStatistik() {
  let box = document.querySelector("#statistik");
  box.innerHTML = "";
  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }

  if (spiele.length === 0) {
    let leerText = document.createElement("p");
    leerText.textContent = "Bitte trage ein Spiel ein!";
    box.append(leerText);
  } else {
    let funktionen = [
      berechenStatistik,
      zählePlattformen,
      zähleBewertungen,
      getBestesUndSchlechtestesSpiel,
      getGesamteSpielzeit,
      getDurchschnittlicheSpielzeitProPlattform,
    ];
    for (let funktion of funktionen) {
      box.append(makeTextForBox(funktion));
    }
  }
}

function makeTextForBox(func) {
  let text = document.createElement("p");
  text.textContent = func();
  return text;
}

function berechenStatistik() {
  if (spiele.length === 0) {
    //Sonst dividiert man mit 0
    return "Es existieren keine Einträge!!";
  } else {
    let ergebnis = spiele.reduce(
      (summe, spiel) => (summe += spiel.bewertung),
      0,
    ); //Dies ist am Ende des Tages eine kompakte Schreibweise für eine For-Schleife
    ergebnis /= spiele.length; //Durchschnitt berechnen
    ergebnis = ergebnis.toFixed(2);
    return `Die Durchschnittsbewertung aller Einträge beträgt: ${ergebnis}`;
  }
}

function zählePlattformen() {
  let zähler = {};
  for (let spiel of spiele) {
    zähler[spiel.plattform] = (zähler[spiel.plattform] || 0) + 1; // mit [] einen neuen Key setzen oder alten verwenden und den mit 1 addieren
  }
  //Schönen String bauen
  let max = 0;
  let maxString = "";
  for (let plattform in zähler) {
    if (max < zähler[plattform]) {
      max = zähler[plattform];
      maxString = plattform;
    }
  }
  return `Die Plattfrom mit den meisten eingetragenen Spiele ist: ${maxString} mit ${max} Spielen!`;
}

function zähleBewertungen() {
  let zähler = {};
  for (let spiel of spiele) {
    zähler[spiel.bewertung] = (zähler[spiel.bewertung] || 0) + 1;
  }

  //Schönen String machen
  let ergebnis = "";
  for (let bewertung in zähler) {
    ergebnis += `Note: ${bewertung}, ${zähler[bewertung]}`;
    if (zähler[bewertung] === 1) {
      ergebnis += " Spiel ";
    } else {
      ergebnis += " Spiele ";
    }
  }

  return ergebnis;
}

function getBestesUndSchlechtestesSpiel() {
  if (spiele.length === 1) {
    return `Es gibt nur ein Spiel: ${spiele[0].titel} – es ist automatisch das beste und schlechteste!`;
  } else {
    let zähler = {
      best: [],
      worst: [],
    };
    //Keys damit man später die Values setzen kann
    for (let spiel of spiele) {
      let neuesSpiel = {
        name: spiel.titel,
        note: spiel.bewertung,
      };
      //Wenn eine Stelle leer, dann sofort füllen (Überprüfen wäre sinnlos)
      //Nach || => Jedes Objekt innerhalb von den Arrays haben identische Bewertungen z.B: in best ist bewertung immer 1, in worst ist die Bewertung immer 4
      if (zähler.best.length === 0 || zähler.best[0].note === neuesSpiel.note) {
        zähler.best.push(neuesSpiel);
      } else if (
        zähler.worst.length === 0 ||
        zähler.worst[0].note === neuesSpiel.note
      ) {
        zähler.worst.push(neuesSpiel);
      } else if (zähler.best[0].note > neuesSpiel.note) {
        zähler.best = [];
        zähler.best.push(neuesSpiel);
      } else if (zähler.worst[0].note < neuesSpiel.note) {
        zähler.worst = [];
        zähler.worst.push(neuesSpiel);
      }
    }

    //Schönen String erschaffen
    let ergebnis = "";
    for (let key in zähler) {
      //Array von zähler auswählen
      let array = zähler[key];
      if (key === "best") {
        ergebnis +=
          array.length > 1
            ? "Die besten Spiele sind: "
            : "Das beste Spiel ist: ";
      } else {
        ergebnis +=
          array.length > 1
            ? "Die schlechtesten Spiele sind: "
            : "Das schlechteste Spiel ist: ";
      }

      for (let spiel of array) {
        ergebnis += `${spiel.name} `;
      }
      ergebnis += "\n";
    }
    return ergebnis;
  }
}

function getGesamteSpielzeit() {
  if (spiele.length === 1) {
    return "";
  }
  let summe = 0;
  for (let spiel of spiele) {
    if (spiel.beginn === "") continue; // continue überspringt das Objekt und geht zum nächsten
    summe += berechneSpielzeit(spiel);
  }

  return `Die Spielzeit aller Spiele beträgt: ${summe} Tage`;
}

function getDurchschnittlicheSpielzeitProPlattform() {
  let spielzeit = {};
  let plattfromAnzahl = {};

  for (let spiel of spiele) {
    spielzeit[spiel.plattform] = (spielzeit[spiel.plattform] || 0) + berechneSpielzeit(spiel);
    plattfromAnzahl[spiel.plattform] = (plattfromAnzahl[spiel.plattform] || 0) + 1;
  }

  //Schönen String machen
  let ergebnis = "";
  for (let key in spielzeit) { //ist egal welches Objekt man nimmt, haben die gleichen Keys
    ergebnis += `Die Durchschnittliche Spieldauer auf der Plattfrom ${key} beträgt ${(spielzeit[key]/plattfromAnzahl[key])} Tage \n`;
  }
  return ergebnis;

}

function berechneSpielzeit(spiel) {
  //In Objekte umwandeln
  let anfang = new Date(spiel.beginn);
  let ende = new Date(spiel.ende);
  let differenz = ende - anfang; //Das Ergebnis ist in Millisekunden
  let tag = Math.floor(differenz / (1000 * 60 * 60 * 24)); // 1 Sekunde = 1000 Millisekunden; 1 Minute = 60 Sekunden, 1 Stunde = 60 Minuten; 1 Tag = 24 Stunden
  return tag;
}

//#endregion

//#endregion

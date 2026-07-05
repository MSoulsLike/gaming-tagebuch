let spiele =
  localStorage.getItem("spiele") !== null
    ? JSON.parse(localStorage.getItem("spiele"))
    : [];

let state = -1; //Wenn eins dann kann Nutzer neuen Eintrag hinzufügen, wenn er anders ist, ist es der Index von dem Eintrag der Bearbeitet werden soll

function init() {
  document.querySelector("#form-btn").addEventListener("click", validateInput);
  document.querySelector("#sortieren").addEventListener("change", handleSort); //change = wenn Nutzer was auswählt, wirds sofort ausgefüght
  if (spiele.length > 0) {
    //Überprüfen ob es mind. ein Spiel im Array existiert
    displaySpiele(spiele);
  }
}

//#region Eingabe des Nutzer validieren
function validateInput() {
  //Auslesen der Daten
  let titel = document.querySelector("#titel").value;
  let bewertung = parseInt(document.querySelector("#bewertung").value);
  let fazit = document.querySelector("#fazit").value;
  let plattform = document.querySelector("#plattform").value;

  //Einzelne Daten validieren
  if (validateTitel(titel) && validateBewertung(bewertung) && plattform != "") {
    //Objekt erstellen
    let spiel = {
      titel: titel,
      bewertung: bewertung,
      fazit: fazit,
      plattform: plattform,
    };

    //Eingabefelder löschen für den Swag
    document.querySelector("#titel").value = "";
    document.querySelector("#bewertung").value = "";
    document.querySelector("#fazit").value = "";
    document.querySelector("#plattform").value = "";

    if (state === -1) {
      //Spiel hinzufügen
      spiele.push(spiel);
    } else {
      spiele[state] = spiel;
      state = -1;
    }
    //Das Array abspeichern
    localStorage.setItem("spiele", JSON.stringify(spiele));

    //Spiele in der Webseite anzeigen
    displaySpiele(spiele); //Array übergeben an Funktion ist leichter für mich im Kopf
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
      eintrag.textContent += `${key.toUpperCase()}: ${spiel[key]} `;
      if (key === "plattform") {
        eintrag.textContent += handleIconForGame(spiel[key]);
      }
      eintrag.textContent += "\n";
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

  state = index;
}

function handleSort() {
  let methode = event.target.value;

  //Kopie des Arrays erstellen
  let kopie = [...spiele]; //Damit wird eine tatsächliche Kopie gemacht; spiele != kopie

  switch (methode) {
    case "aufsteigend":
      kopie.sort((a, b) => a.bewertung - b.bewertung); // bewertung von Objekt - einer anderen Bewertung => positiv = b kommt vor a; negativ = a kommt vor b; 0 = nichts wird geändert
    case "absteigend":
      kopie.sort((a, b) => b.bewertung - a.bewertung);
    case "az":
      kopie.sort((a, b) => a.titel.localeCompare(b.titel)); // wird mit der Reihenfolge des Alphabets verglichen;  a kommt vor c
    case "za":
      kopie.sort((a, b) => b.titel.localeCompare(a.titel));
  }

  displaySpiele(kopie);
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

//#endregion

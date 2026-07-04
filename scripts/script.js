let spiele =
  localStorage.getItem("spiele") !== null
    ? JSON.parse(localStorage.getItem("spiele"))
    : [];

let state = -1; //Wenn eins dann kann Nutzer neuen Eintrag hinzufügen, wenn er anders ist, ist es der Index von dem Eintrag der Bearbeitet werden soll

function init() {
  document.querySelector("#form-btn").addEventListener("click", validateInput);
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

  //Einzelne Daten validieren
  if (validateTitel(titel) && validateBewertung(bewertung)) {
    //Objekt erstellen
    let spiel = {
      titel: titel,
      bewertung: bewertung,
      fazit: fazit,
    };

    //Eingabefelder löschen für den Swag
    document.querySelector("#titel").value = "";
    document.querySelector("#bewertung").value = "";
    document.querySelector("#fazit").value = "";

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
      eintrag.textContent += `${key.toUpperCase()}: ${spiel[key]}\n`;
    }

    //Lösch-Knopf hinzufügen
    const knopf = renderButton("löschen", "click", handleDelete);
    knopf.dataset.index = counter;
    eintrag.append(knopf);

    //Bearbeiten-Knopf hinzufügen
    const bearbeiten = renderButton("bearbeiten","click",handleEdit);
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
  document.querySelector('#titel').value = objekt['titel'];
  document.querySelector('#bewertung').value = objekt['bewertung'];
  document.querySelector('#fazit').value = objekt['fazit'];

  state = index;
}
//#endregion

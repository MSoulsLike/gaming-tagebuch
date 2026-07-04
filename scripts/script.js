let spiele =
  localStorage.getItem("spiele") !== null
    ? JSON.parse(localStorage.getItem("spiele"))
    : [];

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

    //Spiel hinzufügen
    spiele.push(spiel);

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
    eintrag.id = "eintrag" + counter.toString();
    counter++;
    liste.append(eintrag);
  }

  return liste;
}

//#endregion

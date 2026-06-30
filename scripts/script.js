let spiele = (localStorage.getItem("spiele") !== null) ?  JSON.parse(localStorage.getItem("spiele")) : [];

function init() {
    document.querySelector('#form-btn').addEventListener('click',validateInput);
}



//#region Eingabe des Nutzer validieren
function validateInput() {
    //Auslesen der Daten
   let titel = document.querySelector('#titel').value;
   let bewertung = parseInt(document.querySelector('#bewertung').value);
   let fazit = document.querySelector('#fazit').value;

   //Einzelne Daten validieren
    if (validateTitel(titel) && validateBewertung(bewertung)) {
        //Objekt erstellen
        let spiel  = {
            titel: titel,
            bewertung: bewertung,
            fazit: fazit
        };
        
        //Eingabefelder löschen für den Swag
        document.querySelector('#titel').value = '';
        document.querySelector('#bewertung').value = '';
        document.querySelector('#fazit').value = '';

        //Spiel hinzufügen
        spiele.push(spiel);

        //Das Array abspeichern
        localStorage.setItem("spiele",JSON.stringify(spiele));


    } else {
        //Fehlermeldung
        alert("Ihre Eingaben sind Ungültig!!!");
    }
}

function validateTitel(titel) {
    return (!(titel === ''));
}

function validateBewertung(bewertung) {
    return (bewertung === '' || isNaN(bewertung) || bewertung < 1 || bewertung > 5) ? false : true; //NaN === NaN => false hammer logik
}


//#endregion

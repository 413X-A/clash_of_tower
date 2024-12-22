let money = 50; // Startgeld
let seeds = 10; // Startanzahl an Samen
let fields = []; // Array, das die Felder enthält
let plantTime = 5000; // Zeit, bis eine Pflanze wächst (in Millisekunden)
let growTime = 5000; // Zeit, bis das Feld ausgewachsen ist (in Millisekunden)

const moneyDisplay = document.getElementById("money");
const seedsDisplay = document.getElementById("seeds");
const fieldsContainer = document.getElementById("fields");
const messageDisplay = document.getElementById("message");

function updateDisplay() {
    moneyDisplay.textContent = money;
    seedsDisplay.textContent = seeds;
}

function createField() {
    const field = document.createElement("div");
    field.classList.add("field");
    field.addEventListener("click", () => handleFieldClick(field));
    fieldsContainer.appendChild(field);
    fields.push({ element: field, planted: false, grown: false });
}

function plantSeed() {
    if (seeds > 0) {
        const emptyField = fields.find(f => !f.planted && !f.grown);

        if (emptyField) {
            emptyField.planted = true;
            emptyField.element.classList.add("planted");
            seeds--;
            updateDisplay();
            messageDisplay.textContent = "Samen wurde gepflanzt! Warte, bis es wächst...";

            setTimeout(() => {
                emptyField.grown = true;
                emptyField.element.classList.remove("planted");
                emptyField.element.classList.add("grown");
                messageDisplay.textContent = "Deine Pflanze ist gewachsen! Du kannst ernten.";

            }, plantTime);
        } else {
            messageDisplay.textContent = "Kein Platz mehr zum Pflanzen!";
        }
    } else {
        messageDisplay.textContent = "Du hast keine Samen mehr!";
    }
}

function handleFieldClick(field) {
    if (field.classList.contains("grown")) {
        harvestField(field);
    }
}

function harvestField(field) {
    field.classList.remove("grown");
    field.classList.add("crops");
    field.planted = false;
    field.grown = false;
    money += 20; // Ernte bringt 20 Münzen
    seeds++; // Du bekommst einen Samen zurück
    updateDisplay();
    messageDisplay.textContent = "Ernte abgeschlossen! Du hast 20 Münzen verdient.";

    // Optional: Felder zurücksetzen nach einer Ernte
    setTimeout(() => {
        field.classList.remove("crops");
        field.classList.remove("field");
        createField(); // Neues Feld hinzufügen
    }, 2000);
}

function harvestCrops() {
    const grownFields = fields.filter(f => f.grown);
    if (grownFields.length > 0) {
        grownFields.forEach(field => harvestField(field.element));
    } else {
        messageDisplay.textContent = "Keine ausgewachsenen Pflanzen zum Ernten!";
    }
}

// Felder initialisieren
for (let i = 0; i < 3; i++) {
    createField();
}

// Spiellogik
setInterval(() => {
    if (seeds < 10) {
        document.getElementById("plantSeedBtn").disabled = false;
    } else {
        document.getElementById("plantSeedBtn").disabled = true;
    }
}, 1000);

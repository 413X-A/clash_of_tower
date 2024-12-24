let gold = 0;
let towerHealth = 1000;
let selectedUnit = null;
let units = [];
let botUnits = [];
let gameCanvas = document.getElementById('gameCanvas');
let placementBar = document.getElementById('placementBar');
let goldDisplay = document.getElementById('goldDisplay');
let towerHealthDisplay = document.getElementById('towerHealth');
let unitButtons = document.querySelectorAll('.unit-button');

// Platzierungsbereich definieren
let placementArea = {
    x: 0,
    y: gameCanvas.offsetHeight - 50,
    width: gameCanvas.offsetWidth,
    height: 50
};

// Gold automatisch generieren
setInterval(() => {
    gold += 10;
    if (gold > 1000) gold = 1000;
    goldDisplay.textContent = `Gold: ${gold}`;
}, 1000);

// Einheit auswählen
unitButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedUnit = button.dataset.unit;
    });
});

// Einheit platzieren
gameCanvas.addEventListener('click', (event) => {
    if (selectedUnit && gold >= getUnitCost(selectedUnit)) {
        if (event.clientY >= placementArea.y) {
            placeUnit(event.clientX, event.clientY, 'player');
            gold -= getUnitCost(selectedUnit);
            selectedUnit = null;
        }
    }
});

function placeUnit(x, y, owner) {
    let unit = {
        x: x - 15,
        y: y - 15,
        owner: owner,
        type: selectedUnit,
        health: getUnitHealth(selectedUnit),
        damage: getUnitDamage(selectedUnit),
        speed: 1
    };

    units.push(unit);

    let unitElement = document.createElement('div');
    unitElement.classList.add('unit');
    if (owner === 'bot') unitElement.classList.add('bot-unit');
    unitElement.style.left = unit.x + 'px';
    unitElement.style.top = unit.y + 'px';
    gameCanvas.appendChild(unitElement);
    unit.element = unitElement;
}

// Einheit Kosten und Stats
function getUnitCost(type) {
    if (type === 'type1') return 50;
    if (type === 'type2') return 100;
    if (type === 'type3') return 150;
}

function getUnitHealth(type) {
    if (type === 'type1') return 100;
    if (type === 'type2') return 200;
    if (type === 'type3') return 300;
}

function getUnitDamage(type) {
    if (type === 'type1') return 10;
    if (type === 'type2') return 20;
    if (type === 'type3') return 30;
}

// Bewegung und Kampf
setInterval(() => {
    units.forEach(unit => {
        if (unit.owner === 'player') unit.y -= unit.speed;
        else unit.y += unit.speed;

        unit.element.style.top = unit.y + 'px';

        // Gegnerische Einheiten angreifen
        units.forEach(target => {
            if (unit.owner !== target.owner && isColliding(unit, target)) {
                target.health -= unit.damage;
                if (target.health <= 0) {
                    target.element.remove();
                    units.splice(units.indexOf(target), 1);
                }
            }
        });

        // Turm angreifen
        if (unit.owner === 'bot' && unit.y >= gameCanvas.offsetHeight - 30) {
            towerHealth -= 1;
            towerHealthDisplay.textContent = `Turm: ${towerHealth} HP`;
            if (towerHealth <= 0) endGame();
        }
    });
}, 100);

// Kollisionserkennung
function isColliding(unit1, unit2) {
    return (
        Math.abs(unit1.x - unit2.x) < 30 &&
        Math.abs(unit1.y - unit2.y) < 30
    );
}

// Bot-Logik
setInterval(() => {
    if (gold >= 50) {
        let botUnitType = gold >= 150 ? 'type3' : gold >= 100 ? 'type2' : 'type1';
        placeUnit(Math.random() * gameCanvas.offsetWidth, 30, 'bot');
        gold -= getUnitCost(botUnitType);
    }
}, 2000);

// Spiel beenden
function endGame() {
    alert('Spiel vorbei! Du hast verloren.');
    window.location.href = 'index.html';
}

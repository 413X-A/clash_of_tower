const gameCanvas = document.getElementById("gameCanvas");
const playerTower = document.getElementById("playerTower");
const botTower = document.getElementById("botTower");
const goldDisplay = document.getElementById("goldDisplay");

const playerUnits = [];
const botUnits = [];
let playerGold = 0;
let botGold = 0;
const maxGold = 1000;
const goldPerSecond = 10;

const unitTypes = {
    type1: { health: 20, damage: 5, speed: 1, cost: 50 },
    type2: { health: 50, damage: 3, speed: 0.5, cost: 100 },
    type3: { health: 10, damage: 10, speed: 1.5, cost: 75 }
};

let selectedUnitType = null;
let isPlacingUnit = false;

// Unit button logic
document.querySelectorAll(".unit-button").forEach(button => {
    button.addEventListener("click", (e) => {
        selectedUnitType = button.dataset.unit;
        isPlacingUnit = true;
    });
});

// Spawn a unit
function spawnUnit(x, y, isPlayer, type = "type1") {
    const unit = document.createElement("div");
    unit.classList.add("unit", type);
    unit.style.left = `${x}px`;
    unit.style.top = `${y}px`;
    gameCanvas.appendChild(unit);

    const newUnit = {
        element: unit,
        x: x,
        y: y,
        health: unitTypes[type].health,
        damage: unitTypes[type].damage,
        speed: unitTypes[type].speed,
        isPlayer: isPlayer,
        target: null
    };

    unit.textContent = newUnit.health;

    if (isPlayer) {
        playerUnits.push(newUnit);
    } else {
        botUnits.push(newUnit);
    }
}

// Handle unit placement
gameCanvas.addEventListener("click", (e) => {
    if (isPlacingUnit && selectedUnitType) {
        const x = e.clientX - 15;
        const y = e.clientY - 15;

        const playerTowerY = window.innerHeight - 70;

        // Ensure placement is within the allowed area
        if (y >= playerTowerY - 200 && y <= playerTowerY) {
            const unitCost = unitTypes[selectedUnitType]?.cost;

            if (playerGold >= unitCost) {
                playerGold -= unitCost;
                goldDisplay.textContent = `Gold: ${playerGold}`;

                spawnUnit(x, y, true, selectedUnitType);
                isPlacingUnit = false;
                selectedUnitType = null;
            } else {
                alert("Nicht genug Gold!");
            }
        } else {
            alert("Einheiten können nur nahe dem eigenen Turm platziert werden!");
        }
    }
});

// Update units
function updateUnits() {
    playerUnits.forEach((unit) => {
        if (!unit.target) {
            // Move towards bot tower
            unit.y -= unit.speed;
            unit.element.style.top = `${unit.y}px`;
        } else {
            // Attack target
            unit.target.health -= unit.damage;
            unit.target.element.textContent = unit.target.health;

            if (unit.target.health <= 0) {
                unit.target.element.remove();
                botUnits.splice(botUnits.indexOf(unit.target), 1);
                unit.target = null;
            }
        }
    });

    botUnits.forEach((unit) => {
        if (!unit.target) {
            // Move towards player tower
            unit.y += unit.speed;
            unit.element.style.top = `${unit.y}px`;
        } else {
            // Attack target
            unit.target.health -= unit.damage;
            unit.target.element.textContent = unit.target.health;

            if (unit.target.health <= 0) {
                unit.target.element.remove();
                playerUnits.splice(playerUnits.indexOf(unit.target), 1);
                unit.target = null;
            }
        }
    });
}

// Generate gold periodically
setInterval(() => {
    playerGold = Math.min(playerGold + goldPerSecond, maxGold);
    botGold = Math.min(botGold + goldPerSecond, maxGold);
    goldDisplay.textContent = `Gold: ${playerGold}`;
}, 1000);

// Game loop
setInterval(() => {
    updateUnits();
}, 20);

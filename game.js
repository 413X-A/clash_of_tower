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
    button.addEventListener("click", () => {
        selectedUnitType = button.dataset.unit;
        isPlacingUnit = true;
    });
});

// Spawn a unit
function spawnUnit(x, y, isPlayer, type = "type1") {
    const unit = document.createElement("div");
    unit.classList.add("unit", type);
    if (!isPlayer) {
        unit.classList.add("bot-unit");
    }
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
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left - 15;
        const y = e.clientY - rect.top - 15;

        const playerTowerY = gameCanvas.offsetHeight - 70;

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
            const targetY = botTower.offsetTop + 25;
            const targetX = botTower.offsetLeft + 25;

            const dx = targetX - unit.x;
            const dy = targetY - unit.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 30) {
                unit.x += (dx / distance) * unit.speed;
                unit.y += (dy / distance) * unit.speed;
                unit.element.style.left = `${unit.x}px`;
                unit.element.style.top = `${unit.y}px`;
            }
        }
    });

    botUnits.forEach((unit) => {
        if (!unit.target) {
            // Move towards player tower
            const targetY = playerTower.offsetTop + 25;
            const targetX = playerTower.offsetLeft + 25;

            const dx = targetX - unit.x;
            const dy = targetY - unit.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 30) {
                unit.x += (dx / distance) * unit.speed;
                unit.y += (dy / distance) * unit.speed;
                unit.element.style.left = `${unit.x}px`;
                unit.element.style.top = `${unit.y}px`;
            }
        }
    });
}

// Handle tower damage and unit attack
function handleDamage() {
    playerUnits.forEach(unit => {
        if (unit.target && unit.target.isPlayer !== unit.isPlayer) {
            unit.target.health -= unit.damage;
            unit.target.element.textContent = unit.target.health;

            if (unit.target.health <= 0) {
                unit.target.element.remove();
                if (unit.target.isPlayer) {
                    botUnits = botUnits.filter(botUnit => botUnit !== unit.target);
                } else {
                    playerUnits = playerUnits.filter(playerUnit => playerUnit !== unit.target);
                }
            }
        }
    });

    botUnits.forEach(unit => {
        if (unit.target && unit.target.isPlayer !== unit.isPlayer) {
            unit.target.health -= unit.damage;
            unit.target.element.textContent = unit.target.health;

            if (unit.target.health <= 0) {
                unit.target.element.remove();
                if (unit.target.isPlayer) {
                    botUnits = botUnits.filter(botUnit => botUnit !== unit.target);
                } else {
                    playerUnits = playerUnits.filter(playerUnit => playerUnit !== unit.target);
                }
            }
        }
    });
}

// Generate gold periodically
setInterval(() => {
    playerGold = Math.min(playerGold + goldPerSecond, maxGold);
    goldDisplay.textContent = `Gold: ${playerGold}`;
}, 1000);

// Game loop
setInterval(() => {
    updateUnits();
    handleDamage();
}, 20);

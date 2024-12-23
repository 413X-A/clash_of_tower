const gameCanvas = document.getElementById("gameCanvas");
const playerTower = document.getElementById("playerTower");
const botTower = document.getElementById("botTower");
const goldDisplay = document.getElementById("goldDisplay");

const playerUnits = [];
const botUnits = [];
const playerBuildings = [];
const botBuildings = [];

let playerTowerHealth = 100;
let botTowerHealth = 100;
let playerGold = 0;
let botGold = 0;
const maxGold = 1000;
const goldPerSecond = 10;

const unitTypes = {
    type1: { health: 20, damage: 5, speed: 1, cost: 50 },
    type2: { health: 50, damage: 3, speed: 0.5, cost: 100 },
    type3: { health: 10, damage: 10, speed: 1.5, cost: 75 }
};

const buildingTypes = {
    cannon: { health: 60, damage: 8, range: 100, cost: 150 },
    archerTower: { health: 40, damage: 5, range: 150, cost: 200 }
};

let selectedUnitType = null;
let isPlacingUnit = false;

document.querySelectorAll(".unit-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedUnitType = button.dataset.unit || button.dataset.building;
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
        isPlayer: isPlayer
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
            const unitCost = unitTypes[selectedUnitType]?.cost || buildingTypes[selectedUnitType]?.cost;

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

// Update units (fight until HP = 0)
function updateUnits() {
    playerUnits.forEach((unit) => {
        const target = botUnits.find(botUnit => distance(unit, botUnit) < 40) ||
                       botBuildings.find(building => distance(unit, building) < 40) ||
                       { x: botTower.offsetLeft + 25, y: 70, health: botTowerHealth };

        if (target) {
            target.health -= unit.damage;
            if (target === botTower) {
                botTowerHealth -= unit.damage;
                botTower.textContent = botTowerHealth;
                unit.health -= 5; // Damage to unit while attacking tower
            }

            if (target.health <= 0) {
                if (target === botTower) {
                    alert("You win!");
                    location.reload();
                }
                removeEntity(target);
            }
        }
    });

    botUnits.forEach((unit) => {
        const target = playerUnits.find(playerUnit => distance(unit, playerUnit) < 40) ||
                       playerBuildings.find(building => distance(unit, building) < 40) ||
                       { x: playerTower.offsetLeft + 25, y: window.innerHeight - 70, health: playerTowerHealth };

        if (target) {
            target.health -= unit.damage;
            if (target === playerTower) {
                playerTowerHealth -= unit.damage;
                playerTower.textContent = playerTowerHealth;
                unit.health -= 5; // Damage to unit while attacking tower
            }

            if (target.health <= 0) {
                if (target === playerTower) {
                    alert("Bot wins!");
                    location.reload();
                }
                removeEntity(target);
            }
        }
    });
}

// Remove an entity (unit or building)
function removeEntity(entity) {
    entity.element.remove();
    if (entity.isPlayer) {
        playerUnits.splice(playerUnits.indexOf(entity), 1);
    } else {
        botUnits.splice(botUnits.indexOf(entity), 1);
    }
}

// Calculate distance between two entities
function distance(entity1, entity2) {
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    return Math.sqrt(dx * dx + dy * dy);
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

// Bot logic
setInterval(() => {
    if (botGold >= 50) {
        const botX = Math.random() * (window.innerWidth - 30);
        const botType = ["type1", "type2", "type3"][Math.floor(Math.random() * 3)];
        const botCost = unitTypes[botType].cost;

        if (botGold >= botCost) {
            botGold -= botCost;
            spawnUnit(botX, 80, false, botType);
        }
    }
}, 2000);

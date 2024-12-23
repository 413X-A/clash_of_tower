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

// Unit properties
const unitTypes = {
    type1: { health: 20, damage: 5, speed: 1, cost: 50 },
    type2: { health: 50, damage: 3, speed: 0.5, cost: 100 },
    type3: { health: 10, damage: 10, speed: 1.5, cost: 75 }
};

// Building properties
const buildingTypes = {
    cannon: { health: 60, damage: 8, range: 100, cost: 150 },
    archerTower: { health: 40, damage: 5, range: 150, cost: 200 }
};

let selectedUnitType = "type1"; // Default unit type

// Select unit type
document.querySelectorAll(".unit-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedUnitType = button.dataset.unit || button.dataset.building;
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

// Spawn a building
function spawnBuilding(x, y, isPlayer, type = "cannon") {
    const building = document.createElement("div");
    building.classList.add("building", type);
    building.style.left = `${x}px`;
    building.style.top = `${y}px`;
    gameCanvas.appendChild(building);

    const newBuilding = {
        element: building,
        x: x,
        y: y,
        health: buildingTypes[type].health,
        damage: buildingTypes[type].damage,
        range: buildingTypes[type].range,
        isPlayer: isPlayer
    };

    building.textContent = newBuilding.health;

    if (isPlayer) {
        playerBuildings.push(newBuilding);
    } else {
        botBuildings.push(newBuilding);
    }
}

// Move and attack logic
function updateUnits() {
    // Update player units
    playerUnits.forEach((unit, unitIndex) => {
        let target = botUnits.find(botUnit => distance(unit, botUnit) < 40) ||
                     botBuildings.find(building => distance(unit, building) < 40);

        if (target) {
            // Attack the target
            target.health -= unit.damage;
            target.element.textContent = target.health;

            if (target.health <= 0) {
                target.element.remove();
                if (target.isPlayer) {
                    playerUnits.splice(playerUnits.indexOf(target), 1);
                } else {
                    botUnits.splice(botUnits.indexOf(target), 1);
                }
            }
        } else {
            // Move towards bot tower
            unit.y -= unit.speed;
            unit.element.style.top = `${unit.y}px`;

            // Check collision with bot tower
            if (unit.y <= 70) {
                botTowerHealth -= unit.damage;
                botTower.textContent = botTowerHealth;
                unit.element.remove();
                playerUnits.splice(unitIndex, 1);

                if (botTowerHealth <= 0) {
                    alert("You win!");
                    location.reload();
                }
            }
        }
    });

    // Update bot units
    botUnits.forEach((unit, unitIndex) => {
        let target = playerUnits.find(playerUnit => distance(unit, playerUnit) < 40) ||
                     playerBuildings.find(building => distance(unit, building) < 40);

        if (target) {
            // Attack the target
            target.health -= unit.damage;
            target.element.textContent = target.health;

            if (target.health <= 0) {
                target.element.remove();
                if (target.isPlayer) {
                    playerUnits.splice(playerUnits.indexOf(target), 1);
                } else {
                    botUnits.splice(botUnits.indexOf(target), 1);
                }
            }
        } else {
            // Move towards player tower
            unit.y += unit.speed;
            unit.element.style.top = `${unit.y}px`;

            // Check collision with player tower
            if (unit.y >= window.innerHeight - 70) {
                playerTowerHealth -= unit.damage;
                playerTower.textContent = playerTowerHealth;
                unit.element.remove();
                botUnits.splice(unitIndex, 1);

                if (playerTowerHealth <= 0) {
                    alert("Bot wins!");
                    location.reload();
                }
            }
        }
    });
}

// Calculate distance between two units
function distance(unit1, unit2) {
    const dx = unit1.x - unit2.x;
    const dy = unit1.y - unit2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Generate gold periodically
setInterval(() => {
    playerGold = Math.min(playerGold + goldPerSecond, maxGold);
    botGold = Math.min(botGold + goldPerSecond, maxGold);
    goldDisplay.textContent = `Gold: ${playerGold}`;
}, 1000);

// Bot logic to spawn units and buildings
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

// Game loop
setInterval(() => {
    updateUnits();
}, 20);

// Player spawns units or buildings by tapping
gameCanvas.addEventListener("click", (e) => {
    const unitCost = unitTypes[selectedUnitType]?.cost || buildingTypes[selectedUnitType]?.cost;
    if (playerGold >= unitCost) {
        playerGold -= unitCost;
        goldDisplay.textContent = `Gold: ${playerGold}`;

        const playerX = e.clientX - 15;
        const playerY = selectedUnitType in unitTypes ? window.innerHeight - 80 : e.clientY - 20;

        if (selectedUnitType in unitTypes) {
            spawnUnit(playerX, playerY, true, selectedUnitType);
        } else {
            spawnBuilding(playerX, playerY, true, selectedUnitType);
        }
    } else {
        alert("Nicht genug Gold!");
    }
});

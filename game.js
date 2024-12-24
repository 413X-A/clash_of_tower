const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Game variables
let gold = 0;
let selectedUnit = null;
const playerUnits = [];
const botUnits = [];
const tower = { x: 50, y: canvas.height / 2 - 50, width: 50, height: 100, hp: 5000 };
const botTower = { x: canvas.width - 100, y: canvas.height / 2 - 50, width: 50, height: 100, hp: 5000 };

// Gold generation
setInterval(() => {
  gold += 10;
  updateGoldDisplay();
}, 1000);

function updateGoldDisplay() {
  document.getElementById('gold-display').textContent = `Gold: ${gold}`;
}

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw towers
  ctx.fillStyle = 'gray';
  ctx.fillRect(tower.x, tower.y, tower.width, tower.height);
  ctx.fillRect(botTower.x, botTower.y, botTower.width, botTower.height);

  // Draw tower HP
  ctx.fillStyle = 'black';
  ctx.fillText(`HP: ${tower.hp}`, tower.x, tower.y - 10);
  ctx.fillText(`HP: ${botTower.hp}`, botTower.x, botTower.y - 10);

  // Draw units
  playerUnits.forEach(unit => drawUnit(unit));
  botUnits.forEach(unit => drawUnit(unit));
}

function drawUnit(unit) {
  ctx.fillStyle = unit.color;
  ctx.fillRect(unit.x, unit.y, unit.size, unit.size);
  ctx.fillStyle = 'black';
  ctx.fillText(unit.hp, unit.x, unit.y - 5);
}

// Game loop
function gameLoop() {
  updateUnits();
  checkCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

function updateUnits() {
  // Update player units
  playerUnits.forEach(unit => {
    unit.x += unit.speed;
  });

  // Update bot units
  botUnits.forEach(unit => {
    unit.x -= unit.speed;
  });
}

function checkCollisions() {
  // Check player units vs bot units
  playerUnits.forEach((playerUnit, i) => {
    botUnits.forEach((botUnit, j) => {
      if (isColliding(playerUnit, botUnit)) {
        fight(playerUnit, botUnit);

        // Remove dead units
        if (playerUnit.hp <= 0) playerUnits.splice(i, 1);
        if (botUnit.hp <= 0) botUnits.splice(j, 1);
      }
    });
  });

  // Check player units vs bot tower
  playerUnits.forEach((unit, i) => {
    if (isColliding(unit, botTower)) {
      botTower.hp -= unit.damage;
      playerUnits.splice(i, 1);
    }
  });

  // Check bot units vs player tower
  botUnits.forEach((unit, i) => {
    if (isColliding(unit, tower)) {
      tower.hp -= unit.damage;
      botUnits.splice(i, 1);
    }
  });

  // Check for game over
  if (tower.hp <= 0 || botTower.hp <= 0) {
    alert(tower.hp <= 0 ? 'Bot Wins!' : 'You Win!');
    resetGame();
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.size > b.x &&
    a.y < b.y + b.height &&
    a.y + a.size > b.y
  );
}

function fight(a, b) {
  a.hp -= b.damage;
  b.hp -= a.damage;
}

function resetGame() {
  playerUnits.length = 0;
  botUnits.length = 0;
  tower.hp = 5000;
  botTower.hp = 5000;
  gold = 0;
  updateGoldDisplay();
}

// Handle unit selection
document.querySelectorAll('.unit-button').forEach(button => {
  button.addEventListener('click', () => {
    selectedUnit = {
      cost: parseInt(button.dataset.cost),
      hp: parseInt(button.dataset.hp),
      damage: parseInt(button.dataset.damage),
      size: 20,
      speed: 1,
      color: 'blue',
    };
  });
});

// Handle unit placement
canvas.addEventListener('click', e => {
  if (!selectedUnit || gold < selectedUnit.cost) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Ensure placement is within player's area
  if (x < canvas.width / 2) {
    gold -= selectedUnit.cost;
    updateGoldDisplay();

    playerUnits.push({ ...selectedUnit, x, y });
  }
});

// Start the game loop
gameLoop();

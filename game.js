const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

// Game variables
let gold = 0;
let selectedUnit = null;
const playerUnits = [];
const botUnits = [];
const playerTower = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 50, hp: 5000 };
const botTower = { x: canvas.width / 2 - 25, y: 0, width: 50, height: 50, hp: 5000 };
const playerArea = { x: 0, y: canvas.height / 2, width: canvas.width, height: canvas.height / 2 };

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

  // Draw player area
  ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
  ctx.fillRect(playerArea.x, playerArea.y, playerArea.width, playerArea.height);

  // Draw towers
  ctx.fillStyle = 'gray';
  ctx.fillRect(playerTower.x, playerTower.y, playerTower.width, playerTower.height);
  ctx.fillRect(botTower.x, botTower.y, botTower.width, botTower.height);

  // Draw tower HP
  ctx.fillStyle = 'black';
  ctx.fillText(`HP: ${playerTower.hp}`, playerTower.x, playerTower.y + 65);
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
  botLogic();
  draw();
  requestAnimationFrame(gameLoop);
}

function updateUnits() {
  // Move player units
  playerUnits.forEach(unit => {
    if (!unit.target) {
      unit.y -= unit.speed;
    }
  });

  // Move bot units
  botUnits.forEach(unit => {
    if (!unit.target) {
      unit.y += unit.speed;
    }
  });
}

function checkCollisions() {
  // Player units vs bot units
  playerUnits.forEach((playerUnit, i) => {
    botUnits.forEach((botUnit, j) => {
      if (isColliding(playerUnit, botUnit)) {
        playerUnit.target = botUnit;
        botUnit.target = playerUnit;

        fight(playerUnit, botUnit);

        if (playerUnit.hp <= 0) playerUnits.splice(i, 1);
        if (botUnit.hp <= 0) botUnits.splice(j, 1);
      }
    });
  });

  // Player units vs bot tower
  playerUnits.forEach((unit, i) => {
    if (isColliding(unit, botTower)) {
      botTower.hp -= unit.damage;
      playerUnits.splice(i, 1);
    }
  });

  // Bot units vs player tower
  botUnits.forEach((unit, i) => {
    if (isColliding(unit, playerTower)) {
      playerTower.hp -= unit.damage;
      botUnits.splice(i, 1);
    }
  });

  // Game over check
  if (playerTower.hp <= 0 || botTower.hp <= 0) {
    alert(playerTower.hp <= 0 ? 'Bot Wins!' : 'You Win!');
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

  if (a.hp <= 0) a.target = null;
  if (b.hp <= 0) b.target = null;
}

function resetGame() {
  playerUnits.length = 0;
  botUnits.length = 0;
  playerTower.hp = 5000;
  botTower.hp = 5000;
  gold = 0;
  updateGoldDisplay();
}

// Bot logic
function botLogic() {
  const botGold = Math.random() * 100;
  if (botGold > 50 && botUnits.length < 3) {
    botUnits.push({
      x: Math.random() * (canvas.width - 20),
      y: 20,
      size: 20,
      hp: 200,
      damage: 20,
      speed: 1,
      color: 'red',
    });
  }
}

// Unit selection
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

// Unit placement
canvas.addEventListener('click', e => {
  if (!selectedUnit || gold < selectedUnit.cost) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (y > playerArea.y) {
    gold -= selectedUnit.cost;
    updateGoldDisplay();

    playerUnits.push({ ...selectedUnit, x, y });
  }
});

// Start the game loop
gameLoop();

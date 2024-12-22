const playerCards = [];
const botCards = [];
const playerTowerHealth = document.getElementById("player-tower-health");
const manaBar = document.getElementById("mana");
let playerMana = 10;
let gameInterval;

const cardsData = {
    warrior1: { mana: 3, damage: 5, health: 30 },
    warrior2: { mana: 5, damage: 8, health: 50 },
    warrior3: { mana: 8, damage: 12, health: 70 },
};

function updateMana() {
    manaBar.textContent = playerMana;
}

function deployCard(cardName) {
    if (playerMana >= cardsData[cardName].mana) {
        playerMana -= cardsData[cardName].mana;
        updateMana();

        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.textContent = cardName + "\n" + cardsData[cardName].damage + " dmg";
        cardElement.dataset.name = cardName;
        cardElement.dataset.health = cardsData[cardName].health;
        cardElement.dataset.damage = cardsData[cardName].damage;

        document.getElementById("player-cards").appendChild(cardElement);
        moveCard(cardElement, "player");
    }
}

function moveCard(cardElement, side) {
    let position = 0;
    const direction = side === "player" ? 1 : -1;
    const targetSide = side === "player" ? "bot" : "player";
    const battlefield = document.querySelector(`.${side}-cards`);

    const moveInterval = setInterval(() => {
        position += direction;
        cardElement.style.transform = `translateY(${position}px)`;

        if (position >= 300) { // Reached enemy tower
            if (side === "player") {
                const botTower = document.getElementById("player-tower-health");
                const newHealth = Math.max(0, parseInt(botTower.textContent) - cardElement.dataset.damage);
                botTower.textContent = newHealth;
                if (newHealth === 0) {
                    clearInterval(gameInterval);
                    alert("Spiel beendet! Du hast gewonnen!");
                }
            }
            clearInterval(moveInterval);
        }
    }, 20);
}

function gameLoop() {
    // Bot logic to deploy cards (for simplicity, random)
    const randomCard = Math.random() < 0.5 ? "warrior1" : Math.random() < 0.75 ? "warrior2" : "warrior3";
    deployBotCard(randomCard);
}

function deployBotCard(cardName) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.textContent = cardName + "\n" + cardsData[cardName].damage + " dmg";
    cardElement.dataset.name = cardName;
    cardElement.dataset.health = cardsData[cardName].health;
    cardElement.dataset.damage = cardsData[cardName].damage;

    document.getElementById("bot-cards").appendChild(cardElement);
    moveCard(cardElement, "bot");
}

gameInterval = setInterval(gameLoop, 3000); // Bot deploys cards every 3 seconds

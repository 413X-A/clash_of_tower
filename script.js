const playerCards = [];
const botCards = [];
const playerTowerHealth = document.getElementById("player-tower-health");
const manaBar = document.getElementById("mana");
let playerMana = 10;
let gameInterval;

// Kartendaten (Mana, Schaden, Leben)
const cardsData = {
    warrior1: { mana: 3, damage: 5, health: 30 },
    warrior2: { mana: 5, damage: 8, health: 50 },
    warrior3: { mana: 8, damage: 12, health: 70 },
};

// Mana aktualisieren
function updateMana() {
    manaBar.textContent = playerMana;
}

// Karte des Spielers einsetzen
function deployCard(cardName) {
    const card = cardsData[cardName];
    if (playerMana >= card.mana) {
        playerMana -= card.mana;
        updateMana();

        const cardElement = createCardElement(cardName, card);
        document.getElementById("player-cards").appendChild(cardElement);
        moveCard(cardElement, "player");
    }
}

// Karte des Bots einsetzen (bot setzt Karten zufällig ein)
function deployBotCard() {
    const randomCardName = getRandomCardName();
    const card = cardsData[randomCardName];
    const cardElement = createCardElement(randomCardName, card);
    document.getElementById("bot-cards").appendChild(cardElement);
    moveCard(cardElement, "bot");
}

// Hilfsfunktion: Erzeugt das Kartenelement
function createCardElement(cardName, card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.textContent = `${cardName}\n${card.damage} dmg`;
    cardElement.dataset.name = cardName;
    cardElement.dataset.health = card.health;
    cardElement.dataset.damage = card.damage;
    cardElement.dataset.position = 0;
    return cardElement;
}

// Hilfsfunktion: Zufällige Kartenauswahl für den Bot
function getRandomCardName() {
    const cardNames = Object.keys(cardsData);
    return cardNames[Math.floor(Math.random() * cardNames.length)];
}

// Karte bewegen
function moveCard(cardElement, side) {
    const direction = side === "player" ? 1 : -1;
    const targetSide = side === "player" ? "bot" : "player";
    const battlefield = document.querySelector(`.${side}-cards`);
    let position = 0;

    const moveInterval = setInterval(() => {
        position += direction;
        cardElement.style.transform = `translateY(${position * 2}px)`; // Bewegung nach oben/unten

        if (position >= 300) { // Wenn die Karte das Ziel erreicht
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

// Spiel-Loop (Bot setzt alle 3 Sekunden eine Karte)
function gameLoop() {
    deployBotCard();
}

// Spiel starten: Bot setzt Karten zufällig ein
gameInterval = setInterval(gameLoop, 3000);

// Mana für den nächsten Zug zurücksetzen
setInterval(() => {
    if (playerMana < 10) {
        playerMana += 1; // Mana regeneriert sich mit der Zeit
        updateMana();
    }
}, 1000);

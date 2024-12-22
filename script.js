let player1Mana = 10;
let player2Mana = 10;
let player1Health = 1000;
let player2Health = 1000;
let player1CardsInPlay = [];
let player2CardsInPlay = [];

const player1ManaElement = document.getElementById('playerMana');
const player1Tower = document.getElementById('player1Tower');
const player2Tower = document.getElementById('player2Tower');

// Karten mit Mana und Schaden
const player1CardData = [
    { mana: 3, damage: 50, health: 100 },
    { mana: 5, damage: 80, health: 150 },
    { mana: 7, damage: 120, health: 200 }
];

const player2CardData = [
    { mana: 3, damage: 50, health: 100 },
    { mana: 5, damage: 80, health: 150 },
    { mana: 7, damage: 120, health: 200 }
];

// Karte ausspielen
function deployCard(player, cardIndex) {
    if (player === 'player1' && player1Mana >= player1CardData[cardIndex - 1].mana) {
        player1Mana -= player1CardData[cardIndex - 1].mana;
        player1ManaElement.textContent = player1Mana;
        createCardOnBattlefield('player1', cardIndex);
    } else if (player === 'player2' && player2Mana >= player2CardData[cardIndex - 1].mana) {
        player2Mana -= player2CardData[cardIndex - 1].mana;
        createCardOnBattlefield('player2', cardIndex);
    }
}

// Karte auf dem Spielfeld erzeugen
function createCardOnBattlefield(player, cardIndex) {
    const cardElement = document.createElement('div');
    const cardData = player === 'player1' ? player1CardData[cardIndex - 1] : player2CardData[cardIndex - 1];
    
    cardElement.classList.add('card-deployed');
    cardElement.textContent = `Krieger ${cardIndex}`;
    cardElement.dataset.health = cardData.health;
    cardElement.dataset.damage = cardData.damage;

    const battlefield = document.querySelector('.battlefield');
    
    if (player === 'player1') {
        cardElement.style.bottom = '50px';
        cardElement.style.left = '120px';
        battlefield.appendChild(cardElement);
        moveCard(cardElement, player, cardData);
    } else {
        cardElement.style.top = '50px';
        cardElement.style.right = '120px';
        battlefield.appendChild(cardElement);
        moveCard(cardElement, player, cardData);
    }
}

// Karte bewegen
function moveCard(cardElement, player, cardData) {
    const targetTower = player === 'player1' ? player2Tower : player1Tower;
    const movementSpeed = 2;

    let cardMovement = setInterval(() => {
        let rect = cardElement.getBoundingClientRect();
        let towerRect = targetTower.getBoundingClientRect();

        // Spieler 1 bewegt sich nach oben, Bot nach unten
        if (player === 'player1') {
            cardElement.style.bottom = rect.bottom + movementSpeed + 'px';
        } else {
            cardElement.style.top = rect.top + movementSpeed + 'px';
        }

        // Wenn Karte auf Turm trifft
        if (Math.abs(rect.bottom - towerRect.top) < 10 || Math.abs(rect.top - towerRect.bottom) < 10) {
            clearInterval(cardMovement);
            if (player === 'player1') {
                player2Health -= cardData.damage;
                console.log(`Spieler 1 trifft Turm von Bot. Turm Gesundheit: ${player2Health}`);
            } else {
                player1Health -= cardData.damage;
                console.log(`Bot trifft Turm von Spieler 1. Turm Gesundheit: ${player1Health}`);
            }
            checkHealth();
        }

        // Kollisionslogik mit anderen Karten
        checkCardCollision(cardElement, player);
    }, 30);
}

// Überprüfen auf Kollisionen zwischen Karten
function checkCardCollision(cardElement, player) {
    const cardsInPlay = player === 'player1' ? player2CardsInPlay : player1CardsInPlay;

    cardsInPlay.forEach(enemyCard => {
        const enemyCardElement = enemyCard.element;
        const rect = cardElement.getBoundingClientRect();
        const enemyRect = enemyCardElement.getBoundingClientRect();

        // Wenn Karten kollidieren
        if (rect.bottom > enemyRect.top && rect.top < enemyRect.bottom) {
            enemyCard.health -= parseInt(cardElement.dataset.damage);
            cardElement.dataset.health -= parseInt(enemyCardElement.dataset.damage);
            console.log(`Kollision zwischen Karten: ${cardElement.textContent} und ${enemyCardElement.textContent}`);

            // Karten mit 0 Leben entfernen
            if (enemyCard.health <= 0) {
                enemyCardElement.remove();
            }
            if (cardElement.dataset.health <= 0) {
                cardElement.remove();
            }
        }
    });
}

// Überprüfen, ob ein Turm zerstört wurde
function checkHealth() {
    if (player1Health <= 0) {
        alert("Bot hat gewonnen!");
        resetGame();
    } else if (player2Health <= 0) {
        alert("Spieler 1 hat gewonnen!");
        resetGame();
    }
}

// Spiel zurücksetzen
function resetGame() {
    player1Health = 1000;
    player2Health = 1000;
    player1Mana = 10;
    player2Mana = 10;
    player1ManaElement.textContent = player1Mana;
    document.querySelector('.battlefield').innerHTML = '';
}

// Mana regenerieren und Bot spielen lassen
function regenerateMana() {
    if (player1Mana < 10) player1Mana++;
    if (player2Mana < 10) player2Mana++;
    player1ManaElement.textContent = player1Mana;

    botTurn();
}

// Bot macht einen Zug
function botTurn() {
    if (player2Mana >= 3) {
        const randomCard = Math.floor(Math.random() * 3) + 1;
        deployCard('player2', randomCard);
    }
}

// Spiel alle 2 Sekunden aktualisieren
setInterval(regenerateMana, 2000);

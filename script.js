// Initialisierungen der Spielvariablen
let player1Mana = 10;
let player1Health = 1000;
let player2Health = 1000;

const player1ManaElement = document.getElementById('player1Mana');
const player1Tower = document.getElementById('player1Tower');
const player2Tower = document.getElementById('player2Tower');
const player1HealthElement = document.getElementById('player1Health');
const player2HealthElement = document.getElementById('player2Health');

// Kartendaten (Mana, Schaden, Gesundheit)
const player1CardData = [
    { mana: 3, damage: 50, health: 100 },
    { mana: 5, damage: 80, health: 150 },
    { mana: 7, damage: 120, health: 200 }
];

// Karte ausspielen
function deployCard(player, cardIndex) {
    const cardData = player === 'player1' ? player1CardData[cardIndex - 1] : player1CardData[cardIndex - 1];

    if (player === 'player1' && player1Mana >= cardData.mana) {
        player1Mana -= cardData.mana;
        player1ManaElement.textContent = `Mana: ${player1Mana}`;
        createCardOnBattlefield('player1', cardData, cardIndex);
    }
}

// Karte auf dem Spielfeld erzeugen
function createCardOnBattlefield(player, cardData, cardIndex) {
    const cardElement = document.createElement('div');
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
    }
}

// Karte bewegen (mit transform)
function moveCard(cardElement, player, cardData) {
    const targetTower = player === 'player1' ? player2Tower : player1Tower;
    const movementSpeed = 2;

    let cardMovement = setInterval(() => {
        let rect = cardElement.getBoundingClientRect();
        let towerRect = targetTower.getBoundingClientRect();

        // Spieler 1 bewegt sich nach oben
        if (player === 'player1') {
            cardElement.style.transform = `translateY(${rect.top - movementSpeed}px)`;
        }

        // Wenn Karte auf Turm trifft
        if (Math.abs(rect.bottom - towerRect.top) < 10) {
            clearInterval(cardMovement);
            if (player === 'player1') {
                player2Health -= cardData.damage;
                player2HealthElement.textContent = `Health: ${player2Health}`;
            }
            checkHealth();
        }

    }, 30);
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
    player1ManaElement.textContent = `Mana: ${player1Mana}`;
    player1HealthElement.textContent = `Health: ${player1Health}`;
    player2HealthElement.textContent = `Health: ${player2Health}`;
    document.querySelector('.battlefield').innerHTML = '';
}

// Mana regenerieren und Bot spielen lassen
function regenerateMana() {
    if (player1Mana < 10) player1Mana++;
    player1ManaElement.textContent = `Mana: ${player1Mana}`;
}

// Spiel alle 2 Sekunden aktualisieren
setInterval(regenerateMana, 2000);

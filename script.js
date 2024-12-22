let player1Cards = [5, 5, 5]; // Kosten der Karten von Spieler 1
let player2Cards = [5, 5, 5]; // Kosten der Karten von Spieler 2 (Bot)
let player1Mana = 10;
let player2Mana = 10;
let player1Health = 1000;
let player2Health = 1000;
let player1CardsInPlay = [];
let player2CardsInPlay = [];

const player1ManaElement = document.getElementById('playerMana');
const player2ManaElement = document.getElementById('botMana');
const player1Tower = document.getElementById('player1Tower');
const player2Tower = document.getElementById('player2Tower');

// Karte ausspielen
function deployCard(player, cardIndex) {
    if (player === 'player1' && player1Mana >= player1Cards[cardIndex - 1]) {
        player1Mana -= player1Cards[cardIndex - 1];
        player1ManaElement.textContent = player1Mana;
        createCardOnBattlefield('player1', cardIndex);
    } else if (player === 'player2' && player2Mana >= player2Cards[cardIndex - 1]) {
        player2Mana -= player2Cards[cardIndex - 1];
        player2ManaElement.textContent = player2Mana;
        createCardOnBattlefield('player2', cardIndex);
    }
}

// Karte auf dem Spielfeld erzeugen
function createCardOnBattlefield(player, cardIndex) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-deployed');
    cardElement.textContent = `Karte ${cardIndex}`;
    
    const battlefield = document.querySelector('.battlefield');
    if (player === 'player1') {
        cardElement.style.left = '120px';
        cardElement.style.bottom = '50px';
        battlefield.appendChild(cardElement);
        moveCard(cardElement, player, cardIndex);
    } else {
        cardElement.style.right = '120px';
        cardElement.style.bottom = '50px';
        battlefield.appendChild(cardElement);
        moveCard(cardElement, player, cardIndex);
    }
}

// Karte bewegen
function moveCard(cardElement, player, cardIndex) {
    let targetTower = player === 'player1' ? player2Tower : player1Tower;
    let cardMovement = setInterval(() => {
        let rect = cardElement.getBoundingClientRect();
        let towerRect = targetTower.getBoundingClientRect();

        if (player === 'player1') {
            cardElement.style.left = rect.left + 5 + 'px';
        } else {
            cardElement.style.right = rect.right + 5 + 'px';
        }

        if (Math.abs(rect.left - towerRect.left) < 10) {
            clearInterval(cardMovement);
            if (player === 'player1') {
                player2Health -= 50; // Schaden am Turm
                console.log('Spieler 1 trifft Turm von Bot');
                checkHealth();
            } else {
                player1Health -= 50; // Schaden am Turm
                console.log('Bot trifft Turm von Spieler 1');
                checkHealth();
            }
        }
    }, 30);
}

// Mana regenerieren und Bot spielen lassen
function regenerateMana() {
    if (player1Mana < 10) player1Mana++;
    if (player2Mana < 10) player2Mana++;
    player1ManaElement.textContent = player1Mana;
    player2ManaElement.textContent = player2Mana;

    botTurn();
}

// Bot macht einen Zug
function botTurn() {
    if (player2Mana >= 5) {
        const randomCard = Math.floor(Math.random() * 3) + 1;
        deployCard('player2', randomCard);
    }
}

// Überprüfen, ob ein Turm zerstört wurde
function checkHealth() {
    if (player1Health <= 0) {
        alert("Spieler 2 (Bot) hat gewonnen!");
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
    player2ManaElement.textContent = player2Mana;
    player1CardsInPlay = [];
    player2CardsInPlay = [];
    document.querySelector('.battlefield').innerHTML = '';
}

// Spiel alle 2 Sekunden aktualisieren
setInterval(regenerateMana, 2000);

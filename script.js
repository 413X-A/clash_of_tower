let playerTowerHealth = 100;
let botTowerHealth = 100;

// Funktion, um die Lebenspunkte des Turms zu aktualisieren
function updateTowerHealth() {
    document.getElementById("player-tower-health").textContent = playerTowerHealth;
    document.getElementById("bot-tower-health").textContent = botTowerHealth;
}

// Funktion, um den Schaden zu berechnen, wenn zwei Karten kollidieren
function handleCollision(playerCard, botCard) {
    let playerDamage = parseInt(playerCard.dataset.damage);
    let botDamage = parseInt(botCard.dataset.damage);
    
    // Schaden auf die Karten anwenden
    let playerHealth = parseInt(playerCard.dataset.health) - botDamage;
    let botHealth = parseInt(botCard.dataset.health) - playerDamage;
    
    // Wenn eine Karte zerstört wird
    if (playerHealth <= 0) {
        playerCard.remove();
    } else {
        playerCard.dataset.health = playerHealth;
    }

    if (botHealth <= 0) {
        botCard.remove();
    } else {
        botCard.dataset.health = botHealth;
    }

    // Wenn eine Karte den Turm erreicht
    if (!playerCard.parentElement) {
        botTowerHealth -= parseInt(botCard.dataset.damage);
        if (botTowerHealth <= 0) {
            alert("Spieler gewinnt!");
            location.reload();
        }
    } else if (!botCard.parentElement) {
        playerTowerHealth -= parseInt(playerCard.dataset.damage);
        if (playerTowerHealth <= 0) {
            alert("Bot gewinnt!");
            location.reload();
        }
    }

    updateTowerHealth();
}

// Kartenbewegung und Interaktionen
function moveCards() {
    let playerCards = document.querySelectorAll('#player-cards .card');
    let botCards = document.querySelectorAll('#bot-cards .card');

    playerCards.forEach(card => {
        let currentPosition = parseInt(card.style.top) || 0;
        if (currentPosition < 400) {
            card.style.top = currentPosition + 5 + "px";
        }

        botCards.forEach(botCard => {
            let botPosition = parseInt(botCard.style.top) || 0;
            if (Math.abs(currentPosition - botPosition) < 50) {
                handleCollision(card, botCard);
            }
        });
    });

    botCards.forEach(card => {
        let currentPosition = parseInt(card.style.top) || 0;
        if (currentPosition < 400) {
            card.style.top = currentPosition + 5 + "px";
        }
    });
}

// Spiel starten
setInterval(moveCards, 100);

// Karten auswählen
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
});

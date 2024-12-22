* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
}

.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    height: 100vh;
}

.player-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.mana {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.player-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
    margin: 5px 0;
    text-align: center;
}

.card:hover {
    background-color: #2980b9;
}

.battlefield {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 500px;
}

.tower {
    width: 100px;
    height: 200px;
    background-color: #e74c3c;
    border-radius: 10px;
    position: absolute;
}

.player1-tower {
    top: 50px;
}

.player2-tower {
    bottom: 50px;
}

.card-deployed {
    position: absolute;
    background-color: #3498db;
    color: white;
    padding: 10px;
    border-radius: 5px;
    transition: transform 2s linear;
}

.card-health {
    font-size: 12px;
    color: white;
    margin-top: 5px;
}

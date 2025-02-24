const categories = {
    space: ["🛸", "🚀", "👾", "👨‍🚀", "🛸", "🚀", "👾", "👨‍🚀"],
    tech: ["🤖", "🛠️", "🦾", "🌐", "🤖", "🛠️", "🦾", "🌐"],
    crypto: ["🪙", "📈", "💰", "💸", "🪙", "📈", "💰", "💸"],
    stars: ["💫", "🌕", "⭐", "✨", "💫", "🌕", "⭐", "✨"],
    planets: ["🌍", "🌕", "⭐", "🪐", "🌍", "🌕", "⭐", "🪐"],
    flags: ["🏳️‍🌈", "🏁", "🚩", "🏳️", "🏳️‍🌈", "🏁", "🚩", "🏳️"],
};

let gameBoard = document.getElementById("game-board");
let scoreDisplay = document.getElementById("score");
let timerDisplay = document.getElementById("timer");
let selectedCards = [];
let matchedPairs = 0;
let score = 0;
let timer;
let timeLeft = 30;

const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const gameOverSound = document.getElementById("game-over-sound");
const bgMusic = document.getElementById("bg-music");

// Start Game Function
function startGame(category) {
    let shuffledCards = shuffle([...categories[category]]);
    gameBoard.innerHTML = "";
    selectedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreDisplay.innerText = score;
    clearInterval(timer); // Reset Timer Before Starting
    timeLeft = 30;
    timerDisplay.innerText = timeLeft;

    shuffledCards.forEach(symbol => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.innerHTML = "?";
        card.addEventListener("click", () => flipCard(card));
        gameBoard.appendChild(card);
    });

    startTimer();
    bgMusic.play();
}

// Timer Function
function startTimer() {
    clearInterval(timer); // Stop any previous timers
    timeLeft = 30; // Reset Time
    timerDisplay.innerText = timeLeft;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
        } else {
            clearInterval(timer);
            gameOverSound.play();
            bgMusic.pause();
            alert("⏳ Time's Up! Game Over!");
            disableAllCards(); // Disable further moves
        }
    }, 1000);
}

// Disable All Cards When Time Runs Out
function disableAllCards() {
    let allCards = document.querySelectorAll(".card");
    allCards.forEach(card => {
        card.removeEventListener("click", flipCard);
    });
}

// Shuffle Cards Randomly
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Flip Card Logic
function flipCard(card) {
    if (selectedCards.length < 2 && !card.classList.contains("flipped")) {
        flipSound.play();
        card.classList.add("flipped");
        card.innerHTML = card.dataset.symbol;
        selectedCards.push(card);

        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Check for Matching Cards
function checkMatch() {
    let [card1, card2] = selectedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchSound.play();
        matchedPairs++;
        score += 10;
        card1.classList.add("matched");
        card2.classList.add("matched");
    } else {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.innerHTML = "?";
        card2.innerHTML = "?";
    }

    selectedCards = [];
    scoreDisplay.innerText = score;

    if (matchedPairs === 4) {
        clearInterval(timer);
        bgMusic.pause();
        alert("🎉 Congratulations! You won!");
    }
}

// Restart Game Function
function restartGame() {
    clearInterval(timer);
    bgMusic.pause();
    startGame("fruits"); // Default to "fruits"
}

// Automatically Start Game on Page Load
startGame("fruits");
const cardImages = [
    "images/image1.png", "images/image1.png",
    "images/image2.png", "images/image2.png",
    "images/image3.png", "images/image3.png",
    "images/image4.png", "images/image4.png",
    "images/image5.png", "images/image5.png",
    "images/image6.png", "images/image6.png"
];

let timer;
let seconds = 0;
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let scoreList = []; 
let gameTimer; 

// Create cards 
function createCards() {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';   // empty the container 
    shuffle(cardImages).forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        card.innerHTML = `<img src="${image}" alt="Card Image">`;
        card.addEventListener('click', flipCard);
        cardContainer.appendChild(card);
    });
    seconds = 0;  // Reset time 
    clearInterval(timer); 
    startTimer(); 
    startGameTimer(); 
    document.getElementById('final-score').style.display = 'none'; 
    document.getElementById('restart-button').style.display = 'none'; 
}

// Shuffle the cards  
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Flip the cards  
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

// Check if the cards match  
function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }

    // Check if all the cards are matched  
    if (document.querySelectorAll('.flipped').length === cardImages.length) {
        endGame(true);   
    }
}

// Deactivate matching cards  
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Unflip the cards if they don't match  
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

// Reset the board  
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Start timer  
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer').innerText = `Temps: ${seconds}s`;
    }, 1000);
}

// Start timer for 60 seconds  
function startGameTimer() {
    gameTimer = setTimeout(() => {
        endGame(false); // End game after 60 seconds  
    }, 60000); // 60 seconds in milliseconds 
}

// End of game  
function endGame(won) {
    clearInterval(timer); // Stop timer  
    clearTimeout(gameTimer); // Stop 60-second timer  
    document.getElementById('game-screen').style.display = 'block'; // Show game screen  
    document.getElementById('final-score').style.display = 'block'; // Show the score 
    let resultText = won ? "Gagné !" : "Perdu !";   
    document.getElementById('final-score').innerText = `Résultat: ${resultText}, Temps: ${seconds}s`; // Display score with result  
    document.getElementById('card-container').style.display = 'none'; // Hide cards

    // Add score to board 
    scoreList.push({ time: seconds, result: resultText }); 
    updateScoreList();  
    document.getElementById('restart-button').style.display = 'block'; 
}

// Update score list  
function updateScoreList() {
    const scoreListElement = document.getElementById('score-list');
    scoreListElement.innerHTML = scoreList.map(score => `<li>${score.result}, ${score.time}s</li>`).join(''); // Show score list  
}

// Event listeners 
document.getElementById('start-game').addEventListener('click', () => {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    createCards();
});

document.getElementById('view-scores').addEventListener('click', () => {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('scores-screen').style.display = 'block';
    updateScoreList(); 
});

document.getElementById('back-to-home').addEventListener('click', () => {
    document.getElementById('scores-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
});

// Event listener for "restart-button" 
document.getElementById('restart-button').addEventListener('click', () => {
    scoreList = []; // Reset score board  
    document.getElementById('score-list').innerHTML = ''; // Empty score list 
    document.getElementById('game-screen').style.display = 'none'; // Hide game screen  
    document.getElementById('home-screen').style.display = 'block';  
    createCards(); // Start a new game  
});

// Event listener for the "View Rules" button  
document.getElementById('view-rules').addEventListener('click', () => {
    document.getElementById('rules-screen').style.display = 'block'; // Show the rules screen  
});

// Event listener for the "Close" button  
document.getElementById('close-rules').addEventListener('click', () => {
    document.getElementById('rules-screen').style.display = 'none'; // Hide the rules screen  
});
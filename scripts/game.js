let timer = document.getElementById('timer');
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let ok = document.getElementById('accept');
let totalTime = 300;
let interval;

function updateTime() {
    if (totalTime <= 0) {
        clearInterval(interval);

        alert('Время вышло!');
        return;
    }

    totalTime--;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', startGame);

stopBtn.addEventListener('click', stopGame);

ok.addEventListener('click', () => {
    localStorage.setItem('gameComplited', 'true');
    accepting();
});

const cardValues = {
    easy: {
        values: ['1', '1', '2', '2', '3', '3'],
        style: {
            width: '198px',
            height: '198px',
        },
    },
    medium: {
        values: ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6'], // 12 значений для 4x3
        style: {
            width: '168px',
            height: '168px',
        },
    },
    hard: {
        values: [
            '1',
            '1',
            '2',
            '2',
            '3',
            '3',
            '4',
            '4',
            '5',
            '5',
            '6',
            '6',
            '7',
            '7',
            '8',
            '8',
            '9',
            '9',
            '10',
            '10',
        ],
        style: {
            width: '128px',
            height: '128px',
        },
    },
};

let flippedCards = [];
let matchedCards = [];
let lockBoard = false;

let pairsFound = 0;
let errors = 0;
let seriesCount = 0;

const memoryGame = document.getElementById('memory-game');
const finalTime = document.getElementById('winTime');
const scoreDisplay = document.getElementById('score');
const scoreMiss = document.getElementById('misstakes');

let selectedCardBack =
    localStorage.getItem('selectedCardBack') || '/picture/backcard.png';
let selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'medium';

document.getElementById('setcards').value = selectedCardBack;
document.getElementById('setdif').value = selectedDifficulty;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    memoryGame.innerHTML = '';
    const cards = shuffle([...cardValues[selectedDifficulty].values]);
    const cardStyle = cardValues[selectedDifficulty].style;

    let columns;

    if (selectedDifficulty === 'easy') {
        columns = 3;
    } else if (selectedDifficulty === 'medium') {
        columns = 4;
    } else {
        columns = 5;
    }

    memoryGame.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cards.forEach((value) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-framework', value);
        card.innerHTML = `
            <div class="color-overlay"></div>
            <img class="front-face" src="/picture/${value}.jpg" alt="${value}">
            <img class="back-face" src="${selectedCardBack}" alt="card-game">`;
        card.style.width = cardStyle.width;
        card.style.height = cardStyle.height;

        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

function flipCard() {
    if (
        lockBoard ||
        this.classList.contains('flipped') ||
        matchedCards.includes(this)
    )
        return;

    this.classList.add('flipped');
    this.style.transition = 'box-shadow 0.1s ease-out';
    this.style.boxShadow = 'none';
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
    }

    setTimeout(() => {
        this.style.boxShadow = '1px 4px 4px rgba(0, 0, 0, 0.5)';
    }, 300);
}
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (
        firstCard.getAttribute('data-framework') ===
        secondCard.getAttribute('data-framework')
    ) {
        matchedCards.push(firstCard, secondCard);
        pairsFound++;
        seriesCount++;
        firstCard.classList.add('correct');
        secondCard.classList.add('correct');

        setTimeout(() => {
            resetFlippedCards();
            checkForWin();
        }, 300);
    } else {
        errors++;
        seriesCount = 0;
        firstCard.classList.add('incorrect');
        secondCard.classList.add('incorrect');
        setTimeout(() => {
            resetCardColors(firstCard, secondCard);
            resetFlippedCards();
        }, 300);
    }
}

function resetCardColors(firstCard, secondCard) {
    firstCard.classList.remove('flipped', 'incorrect');
    secondCard.classList.remove('flipped', 'incorrect');
}

function resetFlippedCards() {
    flippedCards = [];
    lockBoard = false;
}

function calculateScore() {
    const remainingTime = totalTime;
    let bonus = 0;
    if (seriesCount >= 2) {
        bonus = 50 * (seriesCount - 1);
    }
    const score = pairsFound * 100 + remainingTime * 10 - errors * 5 + bonus;
    console.log(bonus);
    return score;
}

function startGame() {
    pairsFound = 0;
    errors = 0;
    seriesCount = 0;
    totalTime = 300;
    matchedCards = [];
    lockBoard = false;
    createBoard();
    startBtn.style.display = 'none';
    document.getElementById('stop').style.display = 'inline-block';
    clearInterval(interval);
    timer.textContent = '05:00';

    memoryGame.querySelectorAll('.memory-card').forEach((card) => {
        card.classList.add('flipped');
    });

    setTimeout(() => {
        memoryGame.querySelectorAll('.memory-card').forEach((card) => {
            card.classList.remove('flipped');
        });
        interval = setInterval(updateTime, 1000);
        updateTime();
    }, 1500);
}

function stopGame() {
    clearInterval(interval);
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    lockBoard = true;
}

function checkForWin() {
    if (matchedCards.length === cardValues[selectedDifficulty].values.length) {
        WinMes();
    }
}

function WinMes() {
    clearInterval(interval);
    console.log(totalTime);
    console.log(seriesCount);

    const winmes = document.getElementById('win-message');
    winmes.style.display = 'flex';

    const score = calculateScore();
    scoreDisplay.textContent = `${score.toString()}`;
    scoreMiss.textContent = `${errors.toString()}`;
    updateHighScore(parseInt(scoreDisplay.textContent));
    localStorage.setItem('score', score);
    const elapsedTime = 300 - totalTime;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
function updateHighScore(currentScore) {
    const currentHighScore = parseInt(localStorage.getItem('highScore')) || 0;
    if (currentScore > currentHighScore) {
        localStorage.setItem('highScore', currentScore);
    }
}

function accepting() {
    const winmes = document.getElementById('win-message');
    winmes.style.display = 'none';
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

startBtn.style.display = 'inline-block';

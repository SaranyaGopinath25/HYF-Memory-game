


const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let firstCard = null;
let secondCard = null;
let lockBoard = false;  

let score = 0;
let matchedPairs = 0;
let totalPairs = 0;

let timer = 0;
let timerInterval = null;
let timerStarted = false;

const startTimer = () => {
    timerInterval = setInterval(() => {
        timer++;
        timeDisplay.textContent = timer;
    }, 1000);
}

const stopTimer = () => {
    clearInterval(timerInterval);
}


// Card Image Setup
function setUpCardImages(cardElement){
    if(lockBoard) return; // Prevent clicking when board is locked
    if(cardElement === firstCard) return; // Prevent clicking the same card twice

    console.log('setting up card images');
    cardElement.classList.toggle('flipped');
    // const backCard = document.getElementById('cardImg');
    // backCard.src = './assets/cool.png';

    if(!timerStarted){
        startTimer();
        timerStarted = true;
    }

    if(!firstCard){
        firstCard = cardElement;
        return;
    } else {
        secondCard = cardElement;

        score++;   
        scoreDisplay.textContent = score;

        lockBoard = true;
        setTimeout(checkForMatch, 1000); 
    }    
}


// Game board creation ----- 

const params = new URLSearchParams(window.location.search);
const level = params?.get('level');
const player = params?.get('playerName');

const linkElements = document.querySelectorAll(".level-page");
linkElements.forEach(link => {
    link.href = `../levels/levels.html?playerName=${player}`;
});

console.log("Selected level : "+level);

const levelConfig = {
    easy : {
        rows : 4,
        columns : 3
    },
    medium : {
        rows : 4,
        columns : 4
    },
    hard : {
        rows : 4,
        columns : 5
    }
    }

console.log("Cards R & C ::: "+levelConfig[level]?.rows);

const board= document.querySelector(".game-board");
const templateCard = document.querySelector('.card')?.cloneNode(true);
const buttons = document.querySelectorAll("[data-rows]");
createGameBoard(levelConfig[level]?.rows, levelConfig[level]?.columns);


// Fetching Emojis from API
async function fetchEmojis(category = "smileys and people") {
   try { const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${category}`); 
   if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const emojis = await response.json();
    return emojis;
    } catch (error) {
        console.error("Failed to fetch emojis:", error); 
        return [];
    }
}

// Random Emoji pairs Assignment

async function assignEmojisToCards(count , category= "smileys and people") {
    const allEmojis= await fetchEmojis(category);
    const shuffled= allEmojis.sort(() => 0.5 - Math.random());
    // prevent duplicate emojis in the selected pairs
    const selectedEmojis=[];
    for (let i=0; i<shuffled.length && selectedEmojis.length < count / 2; i++) {
        const alreadySelected = selectedEmojis.some(emoji => emoji.name === shuffled[i].name);
        if (!alreadySelected) {
            selectedEmojis.push(shuffled[i]);
        }
    }

    const emojiPairs= [...selectedEmojis, ...selectedEmojis];
    return emojiPairs.sort(() => 0.5 - Math.random());
}   


async function createGameBoard(rows, columns) {
    firstCard = null;
    secondCard = null;
    lockBoard = false;  

    score = 0;
    matchedPairs = 0;
    timer = 0;
    timerStarted = false;
    stopTimer();

    scoreDisplay.textContent = 0;
    timeDisplay.textContent = 0;

    board.style.setProperty('--rows', rows);
    board.style.setProperty('--columns', columns);
    
    const totalCards= rows * columns; 
    totalPairs = totalCards / 2;

    document.getElementById("victory-overlay").classList.add("hidden");

    board.innerHTML = '';

    const emojiPairs= await assignEmojisToCards(totalCards);

    for (let i=0; i< totalCards; i++) {
        const card = templateCard.cloneNode(true);
        card.style.visibility = 'visible';
        const emoji = emojiPairs[i];
        card.dataset.emojiName = emoji.name;

        const imgElement = card.querySelector('#cardImg');
        imgElement.innerHTML = emoji.htmlCode[0];
        imgElement.removeAttribute("src");

        const cardInner = card.querySelector('.card-inner');
        cardInner.classList.remove('flipped');

        board.appendChild(card);
    }
}

// card matching logic
function checkForMatch() {
    const isMatch = firstCard.closest('.card').dataset.emojiName === secondCard.closest('.card').dataset.emojiName;

    if(isMatch){
        disappearCards();
    } else {
       unFlipCards();
    }
}

function disappearCards() {
    firstCard.closest('.card').style.visibility = 'hidden';
    secondCard.closest('.card').style.visibility = 'hidden';

    matchedPairs++;

    if(matchedPairs === totalPairs){
        stopTimer();

        setTimeout(() => {
            document.getElementById("final-score").textContent = score;
            document.getElementById("final-time").textContent = timer;
            document.getElementById("player-name-victory").textContent = player ? player+"!" : "Player!";

            document.getElementById("victory-overlay").classList.remove("hidden");
        }, 500);
    }

    resetBoard();
}

function unFlipCards() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
}   

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}   
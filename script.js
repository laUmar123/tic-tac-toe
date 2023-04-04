'use strict'

const resultPopup = document.querySelector('.result-popup');
const homePage = document.querySelector('.home-container');
const gamePage = document.querySelector('.page-container');
const cells = document.querySelectorAll('.cell');
const aiBtn = document.querySelector('.ai-bot-btn');
const twoPlayersBtn = document.querySelector('.two-player-btn');
const restartBtn = document.querySelector('.restart-button');
const nextRountBtn = document.querySelector('.next-round-btn');
const quitBtn = document.querySelector('.quit-btn');
const oScore = document.getElementById('current-score-o');
const tieScore = document.getElementById('current-score-tie');
const xScore = document.getElementById('current-score-x');
const activePlayerSymbol = document.querySelector('.active-user-symbol');

//stores the index of various winning positions
const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

//an array that has 9 values, each value being the index of each cell
let cellValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];


/**
 * Sets up the game page for the AI version of the game
 */
function displayGamePage() {
    setActivePlayer('letter-x.svg'); //sets activePlayerDisplay to the X logo
    updateGameScore(); //ensures the score display is back to 0 for each player and tie
    if (!homePage.classList.contains('hide')) homePage.classList.toggle('hide');
    if (gamePage.classList.contains('hide')) gamePage.classList.toggle('hide');
    cells.forEach(individualCell => individualCell.removeEventListener('click', cellClickTwoPlayers)); //if the user is going from the two player mode to the ai mode, it will remove the two player logic from each cell
    startGame();
};

/**
 * Sets up the game page for the two player version of the game
 */
function displayGamePageTwoPlayers() {
    setActivePlayer('letter-x.svg');
    activePlayer = user1; //activePlayer set to user1 as X always has the first turn
    updateGameScore();
    if (!homePage.classList.contains('hide')) homePage.classList.toggle('hide');
    if (gamePage.classList.contains('hide')) gamePage.classList.toggle('hide');
    startGameTwoPlayers();
};


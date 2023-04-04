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

/**
 * Updates the game score display to show 0 for player X, tie score and player O
 */
function updateGameScore() {
    xScore.innerHTML = 0;
    tieScore.innerHTML = 0;
    oScore.innerHTML = 0;
};

/**
 * clears the tic-tac-toe board so the all X's and O's are removed from the board
 */
function clearBoardDisplay() {
    cells.forEach(individualCell => {
        if (individualCell.classList.contains('X')) individualCell.classList.remove('X');
        if (individualCell.classList.contains('O')) individualCell.classList.remove('O');
    });
};

/**
 * changes the active user symbol on top of the page to the specified path
 * @param {string} path 
 */
async function setActivePlayer(path) {
    activePlayerSymbol.src = await path;
};

/**
 * removes the gamePage screen and shows the homepage
 */
function displayHomePage() {
    homePage.classList.toggle('hide');
    gamePage.classList.toggle('hide');
};

/**
 * Displays the result pop up after a round has been completed, showings a description of what the outcome of the round is
 * @param {object} player passed as an argument so the correct player is shown if they win the round
 */
function displayResultPopup(player) {
    const message = document.querySelector('.round-information');
    if (resultPopup.classList.contains('hide')) resultPopup.classList.toggle('hide'); //if the result popup is hidden then we want to remove the hide class from it
    message.innerHTML = `${player.getName()} TAKES THE ROUND`; //shows the correct player that won the round
    player.incrementScore(); //increments the player's score by 1
    if (player === user1) xScore.innerHTML = player.getScore(); //updates 'player-x' display
    else if (player === user2 || player === user3) oScore.innerHTML = player.getScore(); //updates the 'player-O/Computer' score
    gamePage.classList.add('darken-background');
};

/**
 * removes the result popup message and removes the background color from the winning cells
 */
function removeResultsPopup() {
    if (!resultPopup.classList.contains('hide')) resultPopup.classList.toggle('hide');
    if (gamePage.classList.contains('darken-background')) gamePage.classList.toggle('darken-background');
    cells.forEach(individualCell => {
        if (individualCell.classList.contains('winning-background-color')) individualCell.classList.remove('winning-background-color');
    });
};

/**
 * removes any result popup, clears the tic-tac-toe board, resets all scores and takes the user to the home screen
 */
function quitGame() {
    removeResultsPopup();
    clearBoardDisplay();
    user1.resetScore();
    user2.resetScore();
    user3.resetScore();
    displayHomePage();
};

/**
 * starts the game again and resets the scores of users and updates the display
 */
function restartGame() {
    startGame(); //resets the array that stores values of each cell so no need to do this here
    user1.resetScore();
    user2.resetScore();
    user3.resetScore();
    updateGameScore();
};



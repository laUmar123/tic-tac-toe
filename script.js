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

/**
 * Logic for what should happen in the AI mode of the game, adds an 'X' on the cell the user clicked and then generates a spot for the bot
 * @param {object} event object that contains information of the element the user's click event
 */
function cellClick(event) {
    if (Number.isFinite(cellValues[event.target.dataset.cell])) { //if the cell the user clicked on has a number, it means the cell hasn't been clicked on before and so it is a valid cell
        clickResult(event.target.dataset.cell, user1); //adds 'X' symbol on that cell
        if (!checkIfWon(cellValues, user1) && !checkTie()) clickResult(bestSpot(), user2); //checks if the game is not over, and then generates a spot for the bot
    }
};

/**
 * Logic for the two player version of the game, where each user chooses a cell and their turns keep switching
 * @param {object} event 
 */
function cellClickTwoPlayers(event) {
    if (emptyCells().length === 9) activePlayer = user1; //if the length of cellValues is 9 it means this is the start of the game, and so user1 should always be the active player at the start
    if (Number.isFinite(cellValues[event.target.dataset.cell])) {
        clickResult(event.target.dataset.cell, activePlayer);
        if (activePlayer === user1) {
            activePlayer = user3;
            activePlayerSymbol.src = 'letter-o.svg'
        } else {
            activePlayer = user1;
            activePlayerSymbol.src = 'letter-x.svg'
        }
    }
};

/**
 * this function places the correct symbol on the cell and checks if the game is won or tied after placing the symbol.
 * @param {number} cellNum the number of the index of the cell that the user clicked on, this value is taken from the data-cell value attached to each div
 * @param {object} player the object of the player who clicked the cell
 */
function clickResult(cellNum, player) {
    cellValues[cellNum] = player.getSymbol();
    document.getElementById(`cell-${cellNum}`).classList.add(`${player.getSymbol()}`);
    let gameisWon = checkIfWon(cellValues, player);
    if (gameisWon) gameOver(gameisWon);
    if (checkTie()) gameTie();
};

/**
 * adds the correct call back function to each cell to each cell and clears the board
 * @param {function} clickLogic the call back function that will be used to specify what happens when setting the initial game up
 */
function logic(clickLogic) {
    cells.forEach(individualCell => {
        clearBoardDisplay();
        individualCell.addEventListener('click', clickLogic);
    });
};

/**
 * this function is called when resetting or going into the different modes, it sets everything up by default for the ai mode
 */
function startGame() {
    removeResultsPopup();
    cellValues = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //resets cellValues
    // activePlayer = user1;
    logic(cellClick);
    activePlayerSymbol.src = 'letter-x.svg';
};

/**
 * this function is called when resetting or going into the different modes, it sets everything up by default for the two players mode
 */
function startGameTwoPlayers() {
    removeResultsPopup();
    cellValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    logic(cellClickTwoPlayers);
};

/**
 * checks if a certain user has won the game
 * @param {array} boardValues an array of the state of each cell
 * @param {object} player an object of the player that clicked the cell
 * @returns null if no one won or an object of the index of the winning cells and the player who won.
 */
function checkIfWon(boardValues, player) {
    //finds every index the player has played in and places it into an array
    let plays = boardValues.reduce((arr, cellValue, i) => (cellValue === player.getSymbol()) ? arr.concat(i) : arr, []);
    let gameIsWon = null;
    for (let [index, value] of winningCombos.entries()) {
        if (value.every(element => plays.indexOf(element) > -1)) { //checks if the elements stored in plays match that of the winningCombos array
            gameIsWon = { index, player }; //index stores the index of the element that matches the winning sequence, so we can target that index specifically
            break;
        }
    }
    return gameIsWon;
};

/**
 * this function is called after someone wins the round, and it colors the winning cells and gives a popup, while also removing the cellClick event listener from each cell
 * @param {object} gameWon this is the object returned from the checkIfWon function 
 */
function gameOver(gameWon) {
    for (let index of winningCombos[gameWon.index]) {
        document.getElementById(`cell-${index}`).classList.toggle('winning-background-color');
    };
    displayResultPopup(gameWon.player);
    cells.forEach(individualCell => individualCell.removeEventListener('click', cellClick)); //removed incase the user goes from the AI mode to the two players mode
};

/**
 * the function called if there is a tie round, so a different popup is displayed and the tiescore is incremented
 */
function gameTie() {
    const message = document.querySelector('.round-information');
    if (resultPopup.classList.contains('hide')) resultPopup.classList.toggle('hide');
    message.innerHTML = `TIE ROUND`;
    tieScore.innerHTML = Number(tieScore.innerHTML) + 1;
    gamePage.classList.add('darken-background');
    cells.forEach(individualCell => individualCell.removeEventListener('click', cellClick));
};

/**
 * checks if there is a tie by checking if the number of empty cells is 0
 * @returns a boolean value based on whether there is a tie or not
 */
function checkTie() {
    if (emptyCells().length === 0) {
        cells.forEach(individualCell => individualCell.removeEventListener('click', cellClick));
        return true;
    }
    return false;
};

/**
 * checks the each cell and places the empty cells into an array 
 * @returns an array that contains all the empty cells
 */
function emptyCells() {
    let arrEmptyCells = [];
    for (let [index, value] of cellValues.entries()) {
        if (Number.isFinite(value)) arrEmptyCells.push(index);
    };
    return arrEmptyCells;
};

/**
 * calls the index property from the minmax function
 * @returns the value of the index property from the minmax function
 */
function bestSpot() {
    return minmax(cellValues, user2).index;
};

/**
 * recursive function that retrieves the best move based on playing each situation after a certain move
 * @param {array} newBoard an array of the values of each cell
 * @param {object} player object that contains information about the player
 * @returns an object that contains the best move
 */
function minmax(newCellValues, player) {
    //finds all the empty cells on the board
    let availableCells = emptyCells(newCellValues);

    //base cases to check if there is a tie or if anyone won
    if (checkIfWon(newCellValues, user1)) {
        return { score: -10 }; //if the player wins score is -10
    } else if (checkIfWon(newCellValues, user2)) {
        return { score: 10 }; //if computer wins then 10
    } else if (availableCells.length === 0) {
        return { score: 0 } //if tie then 0
    }


    let moves = [];
    for (let i = 0; i < availableCells.length; i++) { //loops through empty cells
        let move = {}; //stores each empty cell index
        move.index = newCellValues[availableCells[i]];
        newCellValues[availableCells[i]] = player.getSymbol(); //adds the symbol to the empty cell

        if (player == user2) {
            let result = minmax(newCellValues, user1); //recursively call minmax to get the score property
            move.score = result.score;
        } else {
            let result = minmax(newCellValues, user2);
            move.score = result.score;
        }

        //once terminal state is found then push index into the array
        newCellValues[availableCells[i]] = move.index;
        moves.push(move); //stores each possible move
    }


    let bestMove;
    //choose the highest score in the array for the computer
    if (player === user2) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        //chooses the worst rated move for the user
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    //returns the object that was chosen as the best move
    return moves[bestMove];
};

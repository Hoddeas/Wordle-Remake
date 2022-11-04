// Wordle Remake

// Words List
import { words } from "./words.js";

// Global Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuess = [];
let letterPosition = 0;
let correctGuessString = words[Math.floor(Math.random()*words.length)];

// Function to create the board
function createBoard() {
    let gameboard = document.getElementById("gameboard");
    
    // Loop to create 6 rows
    for (let i = 0; i < 6; i++) {
        let gameboardRow = document.createElement("div");
        gameboardRow.className = "gameboard-row";
        
        // Loop to create 5 boxes for each row
        for (let j = 0; j < 5; j++) {
            let gameboardBox = document.createElement("div");
            gameboardBox.className = "gameboard-box";
            gameboardRow.appendChild(gameboardBox);
        }

        gameboard.appendChild(gameboardRow);
    }
}

createBoard();


// Function to check key pressed
document.addEventListener("keydown", function(inputKey) { 
    if (guessesRemaining === 0) {
        return;
    };

    let pressedKey = String(inputKey.key);

    if (pressedKey === "Backspace" && letterPosition !== 0) {
        deleteLetter();
    };
    
    if (pressedKey === "Enter") {
        checkGuess();
    };

    let keyFound = pressedKey.match(/[a-z]/gi);

    if (!keyFound === true || keyFound.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    };
});

// Letter Functions

// Insert a letter
function insertLetter(pressedKey) {
    if (letterPosition === 5) {
        return;
    };

    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let box = row.children[letterPosition];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    letterPosition += 1;
};

// Delete a letter
function deleteLetter() {
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let box = row.children[letterPosition - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    letterPosition -= 1;
};

/* 
Convert currentGuess array to a string
*/
function checkGuess() {
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let guessString = "";
    let rightGuess = Array.from(correctGuessString);

    for (const eachLetter of currentGuess) {
        guessString += eachLetter;
    };

};
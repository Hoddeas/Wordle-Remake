// Wordle Remake

// Words List
import { words } from "./words.js";

// Global Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuess = [];
let nextLetter = 0;
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


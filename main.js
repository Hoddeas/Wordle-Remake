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
    let board = document.getElementById("game-board");
    
    // Loop to create 6 rows
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div");
        row.className = "row";
        
        // Loop to create 5 boxes for each row
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

createBoard();


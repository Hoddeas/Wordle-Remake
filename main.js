// Wordle Remake

// Words List
import { wordlist } from "./words.js";

// Global Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuessArray = [];
let letterPosition = 0;
let correctGuessString = wordlist[Math.floor(Math.random() * wordlist.length)];

// Function to check key pressed
document.addEventListener("keydown", function(inputKey) { 
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(inputKey.key);

    if (pressedKey === "Backspace" && letterPosition !== 0) {
        deleteLetter();
    }
    
    if (pressedKey === "Enter") {
        checkGuess();
    }

    let keyFound = pressedKey.match(/[a-z]/gi);

    if (!keyFound === true || keyFound.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
});

// Function to check the guess
function checkGuess() {

    console.log(correctGuessString);  
    let currentGuessString = currentGuessArray.join("");
    let correctGuessArray = Array.from(correctGuessString);

    if (currentGuessString.length != 5) {
        toast.warning("Not enough letters");
        return;
    }

    if (!wordlist.includes(currentGuessString)) {
        toast.warning("Not in word list");
        return;
    }

    let remainingLettersInAnswer = correctGuessString;

    // Change letters in the correct place green
    for (let i = 0; i < 5; i++) {
        if (currentGuessArray[i] === correctGuessArray[i]) {
            remainingLettersInAnswer = remainingLettersInAnswer.replace(currentGuessArray[i], "_");
            addBoxColor("green", i);
            shadeKeyboard("green", currentGuessArray[i]);
        } else {
            addBoxColor("grey", i);
            shadeKeyboard("grey", currentGuessArray[i]); 
        }
    }

    // Change remaining letters in the word but in the wrong place yellow
    for (let i = 0; i < 5; i++) {
        if (remainingLettersInAnswer.includes(currentGuessArray[i])) {
            remainingLettersInAnswer = remainingLettersInAnswer.replace(currentGuessArray[i], "_");
            addBoxColor("yellow", i);
            shadeKeyboard("yellow", currentGuessArray[i]); 
        }
        
    }
    
    // If the word is correct end the game, if not remove a guess
    if (currentGuessString === correctGuessString) {
        toast.success("You Win!");
        return;
    } else {
        guessesRemaining--;
        currentGuessArray = [];
        letterPosition = 0;
    }

    // Ends the game if no guesses are left
    if (guessesRemaining === 0) {
        toast.error("Game Over.")
        return;
    }
}

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
    currentGuessArray.push(pressedKey);
    letterPosition += 1;
}

// Delete a letter
function deleteLetter() {
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let box = row.children[letterPosition - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuessArray.pop();
    letterPosition -= 1;
}

// Function to change box color
function addBoxColor(color, position) {
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let box = row.children[position];
    let oldColor = box.getAttribute("data-boxcolor");
    if (oldColor === "green-box") {
        return;
    } else {
        box.setAttribute("data-boxcolor", `${color}-box`);
    }
}

// Function to shade keyboard
function shadeKeyboard (color, letter) {
    for (const element of document.getElementsByClassName("keyboard-button")) {
        if (element.textContent === letter) { 
            let oldColor = element.getAttribute("data-keyboardcolor");
            if (oldColor === "green") {
                return;
            } else {
                element.setAttribute("data-keyboardcolor", `${color}`);
            }
        }
    }
}
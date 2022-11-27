// Wordle Remake

// Words List
import { wordlist } from "./words.js";

// Global Variables
let isAnimating = false;
let startFlip = false;

// Guess Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuessArray = [];
let correctGuessString = wordlist[Math.floor(Math.random() * wordlist.length)];

// Gameboard Variables
let rowIndex = 0;
let boxIndex = 0;
let boxColorArray = [];

// Function to check key pressed
document.addEventListener("keydown", function(inputKey) { 
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(inputKey.key);

    if (pressedKey === "Backspace" && boxIndex !== 0) {
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
        shakeRow();
        return;
    }

    if (!wordlist.includes(currentGuessString)) {
        toastr.warning("Not in word list");
        shakeRow();
        return;
    }

    let remainingLettersInAnswer = correctGuessString;

    // Change letters in the correct place green
    for (let i = 0; i < 5; i++) {
        if (currentGuessArray[i] === correctGuessArray[i]) {
            remainingLettersInAnswer = remainingLettersInAnswer.replace(currentGuessArray[i], "_");
            boxColorArray.splice(i, 1, "green");
            shadeKeyboard("green", currentGuessArray[i]);
        } else {
            boxColorArray.splice(i, 1, "grey");
            shadeKeyboard("grey", currentGuessArray[i]); 
        }
    }

    // Change remaining letters in the word but in the wrong place yellow
    for (let i = 0; i < 5; i++) {
        if (remainingLettersInAnswer.includes(currentGuessArray[i])) {
            remainingLettersInAnswer = remainingLettersInAnswer.replace(currentGuessArray[i], "_");
            boxColorArray.splice(i, 1, "yellow");
            shadeKeyboard("yellow", currentGuessArray[i]); 
        }
    }

    for (let i = 0; i < 5; i++) {
        flipBoxes(i);
    }

    console.log(boxColorArray);

    // If the word is correct end the game, if not remove a guess
    
        if (currentGuessString === correctGuessString) {
            toast.success("You Win!");
            return;
        } else {
            rowIndex++;
            guessesRemaining--;
            currentGuessArray = [];
            boxIndex = 0;
        }

        // Ends the game if no guesses are left
        if (guessesRemaining === 0) {
            toast.error("Game Over.")
            return;
        }

        console.log("done")
}

// Letter Functions

// Insert a letter
function insertLetter(pressedKey) {
    if (boxIndex === 5) {
        return;
    };

    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("gameboard-row")[rowIndex];
    let box = row.children[boxIndex].firstElementChild;
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    box.setAttribute("data-animation", "pop");
    box.addEventListener("animationend", () => {
        box.setAttribute("data-animation", "");
    });
    currentGuessArray.push(pressedKey);
    boxIndex += 1;
}

// Delete a letter
function deleteLetter() {
    let row = document.getElementsByClassName("gameboard-row")[rowIndex];
    let box = row.children[boxIndex - 1].firstElementChild;
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuessArray.pop();
    boxIndex -= 1;
}

// Function to change box color
function addBoxColor(color, position) {
    let row = document.getElementsByClassName("gameboard-row")[rowIndex - 1];
    let box = row.children[position].firstElementChild;
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

// Function to flip boxes when answer is checked
function flipBoxes(boxNumber) {
    let row = document.getElementsByClassName("gameboard-row")[rowIndex];
    let box = row.children[boxNumber].firstElementChild;
    console.log(boxNumber)
    box.setAttribute("data-animation", "flip-in");
    box.addEventListener("animationend", () => {
        addBoxColor(boxColorArray[boxNumber], boxNumber);
        box.setAttribute("data-animation", "flip-out");
        box.addEventListener("animationend", () => {
            box.setAttribute("data-animation", "");
        });
    });
}

// Shake row if word is too short or not in word list
function shakeRow() {
    let row = document.getElementsByClassName("gameboard-row")[rowIndex];
    if (isAnimating) {
        return;
    } else {
        isAnimating = true;
        row.classList.add("shake");
        row.addEventListener("animationend", () => {
            row.classList.remove("shake");
            isAnimating = false;
        });
    }
}
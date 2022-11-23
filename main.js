// Wordle Remake

// Words List
import { wordlist } from "./words.js";

// Global Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuessArray = [];
let letterPosition = 0;
let correctGuessString = wordlist[Math.floor(Math.random() * wordlist.length)];
let isAnimating = false;
let startFlip = false;

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
        flipBoxes();
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
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let box = row.children[letterPosition];
    let currentGuessString = currentGuessArray.join("");
    let correctGuessArray = Array.from(correctGuessString);
    

    if (currentGuessString.length != 5) {
        if (isAnimating) {
            return;
        } else {
            isAnimating = true;
            row.classList.add("shake");
            setTimeout(() => {
                row.classList.remove("shake");
                isAnimating = false;
            }, 600);
        }
        return;
    }

    if (!wordlist.includes(currentGuessString)) {
        toastr.warning("Not in word list");
        if (isAnimating) {
            return;
        } else {
            isAnimating = true;
            row.classList.add("shake");
            setTimeout(() => {
                row.classList.remove("shake");
                isAnimating = false;
            }, 600);
        }
        return;
    }

    // Flip animation when guess is entered
    for (let i = 0; i < 5; i++) {
            flipBoxes(i);
    }


/*

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
    
*/

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
    box.setAttribute("data-animation", "pop");
    setTimeout(() => {
        box.setAttribute("data-animation", "");
    }, 100);
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

// Function to flip boxes when answer is checked
function flipBoxes(boxNumber) {
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    row.children[boxNumber].setAttribute("data-animation", "flip-in");
    row.children[boxNumber].addEventListener("animationend", () => {
        row.children[boxNumber].setAttribute("data-animation", "flip-out");
        row.children[boxNumber].addEventListener("animationend", () => {
            row.children[boxNumber].setAttribute("data-animation", "");
        });
    });
}
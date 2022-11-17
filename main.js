// Wordle Remake

// Toastr Notification Settings
toastr.options = {
    positionClass: "toast-top-center",
    timeOut: 500
};

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



/* 
Check if currentGuess string is 5 words
Check if currentGuess string is a word in the word list
Check letter in the currentGuess array is in the correctGuess array
If above is true, 

*/
function checkGuess() {

    console.log(correctGuessString);  
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let currentGuessString = currentGuessArray.join("");
    let correctGuessArray = Array.from(correctGuessString);

    if (currentGuessString.length != 5) {
        toastr.warning("Not enough letters");
        return;
    }

    if (!wordlist.includes(currentGuessString)) {
        toastr.warning("Not in word list");
        return;
    }

    let remainingLetters = correctGuessString;

    for (let i = 0; i < 5; i++) {

        // If letter in the right place
        if (currentGuessArray[i] === correctGuessArray[i]) {
            remainingLetters = remainingLetters.replace(currentGuessArray[i], "_");
            addBoxColor("green", i);
            shadeKeyboard("green", currentGuessArray[i]);
            console.log(remainingLetters);
        } else {
            addBoxColor("grey", i);
            shadeKeyboard("grey", currentGuessArray[i]); 
        }
    }

    for (let i = 0; i < 5; i++) {
        if (remainingLetters.includes(currentGuessArray[i])) {
            addBoxColor("yellow", i);
            shadeKeyboard("yellow", currentGuessArray[i]); 
        }
    }

    
    if (currentGuessString === correctGuessString) {
        toastr.success("You Win!");
        return;
    } else {
        guessesRemaining--;
        currentGuessArray = [];
        letterPosition = 0;

        if (guessesRemaining === 0) {
            toastr.error("Game Over.")
            return;
        }
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

    box.setAttribute("data-boxcolor", `${color}-box`);
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
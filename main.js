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
Convert currentGuess array to a string
Check if the guess is 5 words
Check if word is in word list (if it is not in word list, flip returned false to true so if function can run)
Check each letter of the guess array and match it to the correct guess array

*/
function checkGuess() {

    console.log(correctGuessString);  
    let row = document.getElementsByClassName("gameboard-row")[6 - guessesRemaining];
    let currentGuessString = "";
    let correctGuessArray = Array.from(correctGuessString);

    for (const eachLetter of currentGuessArray) {
        currentGuessString += eachLetter;
    }

    if (currentGuessString.length != 5) {
        toastr.warning("Not enough letters");
        return;
    }

    if (!wordlist.includes(currentGuessString)) {
        toastr.warning("Not in word list");
        return;
    }

    for (let i = 0; i < correctGuessArray.length; i++) {
        let box = row.children[i];
        let letter = currentGuessArray[i];

        let letterPosition = correctGuessArray.indexOf(currentGuessArray[i]);

        // If letter is not found
        if (letterPosition === -1) {
            addBoxColor("grey", i);
            shadeKeyboard("grey", letter);

        // If letter is found and is in the right place
        } else if (currentGuessArray[i] === correctGuessArray[i]) {
            addBoxColor("green", i);
            shadeKeyboard("green", letter);
            correctGuessArray.pop[i];

        // If letter is found but not in the right place
        } else {
            addBoxColor("yellow", i);
            shadeKeyboard("yellow", letter);
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
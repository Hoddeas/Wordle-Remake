// Wordle Remake

// Words List
import { wordlist } from "./words.js";

// Toast Global Notification Variables
let toastContainer = document.getElementById("toast-container");
let toastIndex = -1;

// Global Variables
let isAnimatingShake = false;
let isAnimatingFlip = false;
let isAnimatingBounce = false;

// Guess Global Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuessArray = [];
let correctGuessString = wordlist[Math.floor(Math.random() * wordlist.length)];

console.log(correctGuessString);

// Gameboard Global Variables
let rowIndex = 0;
let boxIndex = 0;
let boxColorArray = [];

// Keyboard Global Variables
let keyboard = document.getElementById("keyboard");

// Event listener for pressed keys
document.addEventListener("keydown", (inputKey) => { 
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

// Event listener for clicked keys
keyboard.addEventListener("click", (inputKey) => {
    let isButton = inputKey.target.nodeName === "BUTTON";
    let isBackspace = inputKey.target.id === "backspace";

    if (!isButton) {
        return;
    }

    if (guessesRemaining === 0) {
        return;
    }

    let clickedKey = inputKey.target.textContent;

    if (isBackspace && boxIndex !== 0) {
        deleteLetter();
    }
    
    if (clickedKey === "Enter") {
        checkGuess();
    }

    if (clickedKey.length > 1 || isBackspace) {
        return;
    } else {
        insertLetter(clickedKey);
    }

})

// Function to check the guess
function checkGuess() {
    let currentGuessString = currentGuessArray.join("");
    let correctGuessArray = Array.from(correctGuessString);

    if (currentGuessString.length != 5) {
        createToast("Not enough letters");
        shakeRow();
        return;
    }

    if (!wordlist.includes(currentGuessString)) {
        createToast("Not in word list");
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

    let doneAnimationConfirmation = 0;
    let row = document.getElementsByClassName("gameboard-row")[rowIndex];

    // Flip boxes then check guess only if boxes aren't already flipping or bouncing

    if (isAnimatingFlip || isAnimatingBounce) {
        return;
    } else {
        isAnimatingFlip = true;
        doneAnimationConfirmation = 0;
        for (let i = 0; i < 5; i++) {
            let box = row.children[i].firstElementChild;
            setTimeout(() => {
                box.setAttribute("data-animation", "flip-in");
                box.addEventListener("animationend", () => {
                    addBoxColor(boxColorArray[i], i);
                    box.setAttribute("data-animation", "flip-out");
                    box.addEventListener("animationend", () => {
                        box.setAttribute("data-animation", "");
                        doneAnimationConfirmation++;
                        if (doneAnimationConfirmation === 5) {
                            // If the word is wrong, remove a guess, if it is correct, end the game.
                            if (currentGuessString === correctGuessString) {
                                isAnimatingBounce = true;
                                for (let i = 0; i < 5; i++) {
                                    row.children[i].classList.add("win");
                                }
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
                            isAnimatingFlip = false;
                        }
                    });
                });
            }, i * 500);
        }
    }
}


// Letter Functions

// Insert a letter
function insertLetter(pressedKey) {
    if (boxIndex === 5) {
        return;
    };

    if (isAnimatingFlip || isAnimatingBounce) {
        return;
    }

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

    if (isAnimatingFlip || isAnimatingBounce) {
        return;
    }

    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuessArray.pop();
    boxIndex -= 1;
}

// Function to change box color
function addBoxColor(color, position) {
    let row = document.getElementsByClassName("gameboard-row")[rowIndex];
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

// Shake row if word is too short or not in word list
function shakeRow() {
    let row = document.getElementsByClassName("gameboard-row")[rowIndex];
    if (isAnimatingShake) {
        return;
    } else {
        isAnimatingShake = true;
        row.classList.add("shake");
        row.addEventListener("animationend", () => {
            row.classList.remove("shake");
            isAnimatingShake = false;
        });
    }
}

// Toast Notification Functions

// Create toast notification
function createToast(message) {
    let toastNotif = document.createElement("div");
    toastNotif.className = "toast-notif";
    toastNotif.textContent = `${message}`;
    toastContainer.insertBefore(toastNotif, toastContainer.children[0]);
    setTimeout(() => {
        toastContainer.lastChild.classList.add("toast-notif-fade");
    }, 1000);
    setTimeout(() => {
        toastContainer.removeChild(toastContainer.lastElementChild);
    }, 2000);
}
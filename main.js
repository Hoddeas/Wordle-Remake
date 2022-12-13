// Wordle Remake

// Word List and Target Words
import { wordList } from "./wordList.js";
import { targetWords } from "./targetWords.js";

// Toast Global Notification Variables
let toastContainer = document.getElementById("toast-container");

// Global Variables
let isAnimatingShake = false;
let isAnimatingFlip = false;
let isAnimatingBounce = false;

// Guess Global Variables
let numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuessArray = [];
let correctWordString = targetWords[Math.floor(Math.random() * targetWords.length)];

console.log(correctWordString);
console.log(document.getElementsByClassName("gameboard-box"))

// Gameboard Global Variables
let rowIndex = 0;
let boxIndex = 0;
let boxColorArray = [];

// Keyboard Global Variables
let keyboard = document.getElementById("keyboard");

// Reset Button and Button Container
let resetButton = document.getElementById("reset-button");
let resetButtonContainer = document.getElementById("button-container");

// Event listener for reset button clicked to reset game
resetButton.addEventListener("click", () => {
    location.reload();
});

// Event listener for pressed keys
document.addEventListener("keydown", (inputKey) => { 
    if (inputKey.repeat) {
        return;
    }

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
    let correctWordArray = Array.from(correctWordString);

    if (currentGuessString.length != 5) {
        createToast("Not enough letters");
        shakeRow();
        return;
    }

    if (!wordList.includes(currentGuessString)) {
        createToast("Not in word list");
        shakeRow();
        return;
    }

    let remainingLettersInAnswer = correctWordString;

    // Change letters in the correct place green
    for (let i = 0; i < 5; i++) {
        if (currentGuessArray[i] === correctWordArray[i]) {
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
                            if (currentGuessString === correctWordString) {
                                isAnimatingBounce = true;
                                for (let i = 0; i < 5; i++) {
                                    row.children[i].classList.add("win");
                                }
                                switch (rowIndex) {
                                    case 0:
                                        createToast("Genius", null);
                                        break;
                                    case 1:
                                        createToast("Magnificent", null);
                                        break;
                                    case 2:
                                        createToast("Impressive", null);
                                        break;
                                    case 3:
                                        createToast("Splendid", null);
                                        break;
                                    case 4:
                                        createToast("Great", null);
                                        break;
                                    case 5:
                                        createToast("Phew", null);
                                        break;
                                }
                                setTimeout(() => {
                                    resetButtonContainer.style.display = "flex";
                                }, 2000);
                                return;
                            } else {
                                rowIndex++;
                                guessesRemaining--;
                                currentGuessArray = [];
                                boxIndex = 0;
                            }

                            // Ends the game if no guesses are left
                            if (guessesRemaining === 0) {
                                createToast(correctWordString.toUpperCase(), null);
                                setTimeout(() => {
                                    resetButtonContainer.style.display = "flex";
                                }, 2000);
                                return;
                            }
                            isAnimatingFlip = false;
                        }
                    });
                });
            }, i * 250);
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
    let oldColor = box.getAttribute("data-box-color");
    if (oldColor === "green") {
        return;
    } else {
        box.setAttribute("data-box-color", color);
    }
}

// Function to shade keyboard
function shadeKeyboard (color, letter) {
    for (const element of document.getElementsByClassName("keyboard-button")) {
        if (element.textContent === letter) { 
            let oldColor = element.getAttribute("data-keyboard-color");
            if (oldColor === "green") {
                return;
            } else {
                element.setAttribute("data-keyboard-color", color);
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
function createToast(message, duration = 1000) {
    let toastNotif = document.createElement("div");
    toastNotif.textContent = message;
    toastNotif.classList.add("toast-notif")
    toastContainer.insertBefore(toastNotif, toastContainer.children[0]);
    if (duration == null) {
        return;
    }

    setTimeout(() => {
        toastNotif.classList.add("toast-notif-fade");
        toastNotif.addEventListener("transitionend", () => {
            toastNotif.remove();
        });
    }, duration);
}

// Wordle Remake

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


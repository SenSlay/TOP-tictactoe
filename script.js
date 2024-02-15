const game = (() => {
    // The gameboard represents the state of the game
    function gameboard() {
        const board = [];
    
        // Create a 2D array that will reperesent the game board
        for (let i = 0; i < 3; i++) {
            board[i] = []
            for (let j = 0; j < 3; j++) {
                board[i].push(cell());
            }
        }
    
        // Getter function to retrieve the board through closure
        const getBoard = () => board;
    
        // Add player's token to the board
        const addMove = (x, y, player, gameState) => {
            const cell = board[x][y];
    
            // Check if cell is empty or game is ongoing
            if (cell.getValue() === 0 & gameState === 0) {
                cell.addToken(player);
                return true;
            }
            
            return false;
        };
    
        // Print board to console
        const printBoard = () => {
            const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
            console.log(boardWithCellValues);
        };

        // Reset the board
        const resetBoard = () => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j].clearCell();
                }
            }
        }
    
        return {
            addMove,
            getBoard, 
            printBoard,
            resetBoard
        };
    }
    
    /*
    A cell represents a box in the game board and can have one of three values:
    0: Box is empty
    1: Player 1's token
    2: Player 2's token
    */
    function cell() {
        let value = 0;
      
        // Accept a player's token to change the value of the cell
        const addToken = (player) => {
          value = player;
        };
      
        // Retrieve the current value of this cell through closure
        const getValue = () => value;
      
        // Clear the cell of tokens by setting value to 0
        const clearCell = () => {
            value = 0;
        }

        return {
          addToken,
          getValue,
          clearCell
        };
    }
    
    // Check if there is a winner or a tie             
    // gameState = 0 - Game is ongoing
    // gameState = 1 - Player one won
    // gameState = 2 - Player two won
    // gameState = 3 - Tie
    function checkGameState(board) {
        let emptyBoxCount = 0;
    
        for (let i = 0; i < 3; i++) {
            // Updates counter for available boxes left
            for (let j = 0; j < 3; j++) {
                emptyBoxCount += board[i][j].getValue() === 0 ? 1 : 0;
            }
    
            // Check rows
            if (checkLine(board[i][0].getValue(), board[i][1].getValue(), board[i][2].getValue())) return board[i][0].getValue();
            // Check columns
            if (checkLine(board[0][i].getValue(), board[1][i].getValue(), board[2][i].getValue())) return board[0][i].getValue();
        }
    
        // Check diagonals
        if (checkLine(board[0][0].getValue(), board[1][1].getValue(), board[2][2].getValue())) return board[0][0].getValue();
        if (checkLine(board[0][2].getValue(), board[1][1].getValue(), board[2][0].getValue())) return board[0][2].getValue();
    
        // Check for available boxes
        if (emptyBoxCount === 0) return 3;

        // Game continues
        return 0;
    }
    
    // Check if a line of tokens are matching
    function checkLine(a, b, c) {
        return a !== 0 && a === b && b === c;
    }
    
    // The gameController controls flow of the game
    function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
        const board = gameboard();
        let status = 0;
    
        const players = [
            {
                name: playerOneName,
                token: 1,
                score: 0
            },
            {
                name: playerTwoName,
                token: 2,
                score: 0
            }
        ];
    
        let activePlayer = players[0];
    
        // Get current active player
        const getActivePlayer = () => activePlayer;
    
        // Switch player turn
        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };

        // Add player score
        const addPlayerScore = (player) => {
            players[player].score++;
        };

        // Get current game status
        const getGameStatus = () => status;

        // Get players' scores
        const getPlayersScores = () => [players[0].score, players[1].score];
    
        const playRound = (x, y) => {
            let gameState = checkGameState(board.getBoard()); 
            
            // Check if a move is valid
            if (!board.addMove(x, y, getActivePlayer().token, gameState)) return;

            // Check for a winner or tie after making move
            gameState = checkGameState(board.getBoard());

            const statusContainer = document.querySelector(".status");

            // Check if status is 0 (game ongoing) or 1 (game ended)
            if (status == 0) {
                // Check for a tie or winner
                if (gameState === 1 || gameState === 2) {
                    console.log(`${players[gameState - 1].name} has won!`);
                    addPlayerScore(gameState - 1);
                    status = 1;
                    statusContainer.textContent = `${players[gameState - 1].name} Won!`
                }
                else if (gameState === 3) {
                    console.log("Tie!");
                    status = 1;
                    statusContainer.textContent = "Tie!";
                }

                switchPlayerTurn();
                board.printBoard();
            }

            return;
        }

        const reset = () => {
            board.resetBoard();
            status = 0;
        }
    
        board.printBoard();
        
        return {
            playRound,
            getActivePlayer,
            switchPlayerTurn,
            getBoard: board.getBoard,
            getPlayersScores,
            getGameStatus,
            reset
        };
    }
    
    return gameController();
})();

function displayController() {
    const boardContainer = document.querySelector(".game-board");
    const statusContainer = document.querySelector(".status");

    const updateDisplay = () => {
        // Clear Board
        boardContainer.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn if status is 0
        // status = 0 - Game ongoing
        // status = 1 - Game stopped; there is a tie or winner
        if (game.getGameStatus() == 0) {
            statusContainer.textContent = `${activePlayer.name}'s turn...`;
        }

        // ID counter for unique ID per cell
        let idCounter = 0;
        // Iterate through each item in board array and display cell
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.textContent = `${cell.getValue()}`;

                if (cell.getValue() === 1) {
                    cellButton.innerHTML = `<i class="fa-solid fa-x"></i>`;
                }
                else if (cell.getValue() === 2) {
                    cellButton.innerHTML = `<i class="fa-solid fa-o"></i>`;
                }
                else {
                    cellButton.textContent = "";
                }

                // Assign cell ID and data attributes
                cellButton.id = `cell-${idCounter++}`
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.col = colIndex;

                boardContainer.appendChild(cellButton);
            })
        });

        // Display players' scores
        const playerOneScore = game.getPlayersScores()[0];
        const playerTwoScore = game.getPlayersScores()[1];

        const playerOneScoreContainers = document.querySelectorAll(".player-one-score");
        const playerTwoScoreContainers = document.querySelectorAll(".player-two-score");

        // Display player one's score
        playerOneScoreContainers.forEach(container => {
            container.textContent = playerOneScore;
        });

        // Display player two's score
        playerTwoScoreContainers.forEach(container => {
            container.textContent = playerTwoScore;
        });
    }

    // Add click handler for the board's event listener
    function cellClickHandler(e) {
        const x = e.target.dataset.row;
        const y = e.target.dataset.col;

        game.playRound(x, y);
        updateDisplay();
    }
    boardContainer.addEventListener("click", cellClickHandler);

    // Reset game click handler
    function resetGame() {
        game.reset();

        // If active player is player two, switch player turn
        if (game.getActivePlayer().token === 2) {
            game.switchPlayerTurn();
        }

        updateDisplay();
    }
    document.querySelector(".reset-btn").onclick = resetGame;

    return updateDisplay();
}

displayController();
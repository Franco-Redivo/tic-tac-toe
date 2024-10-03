function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const drawMark = (column, row, player) => {
        const choseenCell = board[row][column].getValue();

        if(choseenCell !== 0) return;

        board[row][column].addMark(player);
    }

    return{
        getBoard,
        drawMark,
    };
};

function cell(){
    let value = 0;

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    return{
        addMark,
        getValue
    };
}

function gameController(){
    const board = Gameboard();

    const currentBoard = board.getBoard();

    const player1 = createPlayer("PlayerOne","x");
    const player2 = createPlayer("PlayerTwo","o");

    const players = [player1,player2];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        if(activePlayer === players[0]){
            activePlayer = players[1];
        }else{
            activePlayer = players[0];
        }
    }

    const getActivePlayer = () => activePlayer;

    const getBoard = () => board;

    let result = '';
   
    const playRound = (row, column) => {
        board.drawMark(column, row, getActivePlayer().symbol);
        
        

        //verify rows
        const playerSymbol = getActivePlayer().symbol
        
        for(let i = 0; i<3; i++){
            if(
                currentBoard[i][0].getValue() === playerSymbol &&
                currentBoard[i][1].getValue() === playerSymbol &&
                currentBoard[i][2].getValue() === playerSymbol
            ){
                result = "win";
                return;
            }
            
        }

        //verify columns
        for(let i = 0; i<3; i++){
            if(
                currentBoard[0][i].getValue() === playerSymbol &&
                currentBoard[1][i].getValue() === playerSymbol &&
                currentBoard[2][i].getValue() === playerSymbol
            ){
                result = "win";
                return;
            }
            
        }

         // Verify diagonals
         if (
            currentBoard[0][0].getValue() === getActivePlayer().symbol &&
            currentBoard[1][1].getValue() === getActivePlayer().symbol &&
            currentBoard[2][2].getValue() === getActivePlayer().symbol
        ) {
            result = "win";
            return;
        }

        if (
            currentBoard[0][2].getValue() === getActivePlayer().symbol &&
            currentBoard[1][1].getValue() === getActivePlayer().symbol &&
            currentBoard[2][0].getValue() === getActivePlayer().symbol
        ) {
            result = "win";
            return;
        }

        const emptyCells = currentBoard.flat().filter((cell) => cell.getValue() === 0);

        if(emptyCells.length === 0){
            result = "tie";
            return;
        }

        switchPlayerTurn();
    }

    const getResult = () => result;

    const resetGame = () => {
        result = '';
        activePlayer = players[0];

        currentBoard.forEach(row => {
            row.forEach(cell => cell.addMark(0));
        });
    }

    return{
        getBoard,
        playRound,
        getActivePlayer,
        getResult,
        resetGame
    };

}

function createPlayer(name, symbol){
    return{name, symbol};
}



function displayController(){
    const game = gameController();
    const gameboard = document.querySelector(".gameboard");
    const scoreboard = document.querySelector(".scoreboard");
    const resetBtn = document.querySelector(".reset-button");

    const updateScreen = () => {
        const currentPlayer = game.getActivePlayer();
        const board = game.getBoard().getBoard();

        gameboard.textContent = "";

        if(game.getResult() === "win"){
            scoreboard.textContent = `${currentPlayer.name} wins`;
        }else if(game.getResult() === "tie"){
            scoreboard.textContent = `It's a TIE`;
        }else{
            scoreboard.textContent = `${currentPlayer.name}'s turn`;
        }

        board.forEach((row, rowIndex)=> {
            row.forEach((cell,columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
                gameboard.appendChild(cellButton);
            })
        })

    }

    const handleClick = (event) => {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;
        const board = game.getBoard().getBoard();

        if(!row || !column) return;

        
        if (game.getResult() === "win" || game.getResult() === "tie") {
            return;
        }

        const choseenCell = board[row][column].getValue();
        if(choseenCell !== 0) return;

        game.playRound(row, column);
        updateScreen();
    }

    const resetGame = () => {
        game.resetGame();
        updateScreen();
    }
    updateScreen();

    gameboard.addEventListener("click", handleClick);
    resetBtn.addEventListener("click", resetGame);
}

displayController();







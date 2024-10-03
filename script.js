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

    const printBoard = () => {
        const boardWithCells = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCells);
    }

    return{
        getBoard,
        drawMark,
        printBoard
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

function gameController(playerOne = "Player One", playerTwo = "Player two"){
    const board = Gameboard();

    const currentBoard = board.getBoard();

    const player1 = createPlayer("PlayerOneName","x");
    const player2 = createPlayer("PlayerTwoName","o");

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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const printWinMessage = (player) => {
        console.log(`${player.name} has won`);
    }


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
                printNewRound();
                printWinMessage(getActivePlayer());
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
                printNewRound();
                printWinMessage(getActivePlayer());
                return;
            }
            
        }

         // Verify diagonals
         if (
            currentBoard[0][0].getValue() === getActivePlayer().symbol &&
            currentBoard[1][1].getValue() === getActivePlayer().symbol &&
            currentBoard[2][2].getValue() === getActivePlayer().symbol
        ) {
            printNewRound();
            printWinMessage(getActivePlayer());
            return;
        }

        if (
            currentBoard[0][2].getValue() === getActivePlayer().symbol &&
            currentBoard[1][1].getValue() === getActivePlayer().symbol &&
            currentBoard[2][0].getValue() === getActivePlayer().symbol
        ) {
            printNewRound();
            printWinMessage(getActivePlayer());
            return;
        }

        const emptyCells = currentBoard.flat().filter((cell) => cell.getValue() === 0);

        if(emptyCells.length === 0){
            printNewRound();
            console.log("It's a tie");
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return{
        playRound,
        getActivePlayer
    };

}

function createPlayer(name, symbol){
    return{name, symbol};
}

const game = gameController();

game.playRound(0,0);
game.playRound(1,0);
game.playRound(0,1);
game.playRound(1,1);
game.playRound(0,2);


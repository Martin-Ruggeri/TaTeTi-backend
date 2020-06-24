let repositoryGame = require('../repository/repositoryGame.js');

function thereIsWin(game, board) {
    if ((board.casillas[0] != 0) &&
        ((board.casillas[0] === board.casillas[1] && board.casillas[0] === board.casillas[2]) ||
            (board.casillas[0] === board.casillas[3] && board.casillas[0] === board.casillas[6]) ||
            (board.casillas[0] === board.casillas[4] && board.casillas[0] === board.casillas[8]))) {
        if (board.casillas[0] === game.user1.token) {aumentarContador(game , game.user1.name); return game.user1.name;}
        if (board.casillas[0] === game.user2.token) {aumentarContador(game , game.user2.name); return game.user2.name;}
    }

    if ((board.casillas[4] != 0) &&
        ((board.casillas[2] === board.casillas[4] && board.casillas[4] === board.casillas[6]) ||
            (board.casillas[1] === board.casillas[4] && board.casillas[4] === board.casillas[7]) ||
            (board.casillas[3] === board.casillas[4] && board.casillas[4] === board.casillas[5]))) {
        if (board.casillas[4] === game.user1.token) {aumentarContador(game , game.user1.name); return game.user1.name;}
        if (board.casillas[4] === game.user2.token) {aumentarContador(game , game.user2.name); return game.user2.name;}
    }

    if ((board.casillas[8] != 0) &&
        ((board.casillas[2] === board.casillas[5] && board.casillas[5] === board.casillas[8]) ||
            (board.casillas[6] === board.casillas[7] && board.casillas[7] === board.casillas[8]))) {
        if (board.casillas[8] === game.user1.token) {aumentarContador(game , game.user1.name); return game.user1.name;}
        if (board.casillas[8] === game.user2.token) {aumentarContador(game , game.user2.name); return game.user2.name;}
    }

    // Verificar si hay empate
    for (var i = 0; i < board.casillas.length; i++) {
        if (board.casillas[i] == 0) break;

        if (i === 8) {
            return "Empate";
        }
    }

    return null;    // Si no hay ganador y no hay empate retorna null
}



function aumentarContador(game, userWin) {
    if (game.user1.name == userWin) {
        game.winUser1++;
    } else {
        game.winUser2++;
    }
    const bodyGame = { winUser1: game.winUser1, winUser2: game.winUser2 }
    repositoryGame.put(game.id, bodyGame); // Guarda el Game modificado
}



function jugarMaquina(game, board) {
    // Movimiento que hace la maquina
    for (var i = 0; i < board.casillas.length; i++) {
        if (board.casillas[i] == 0) {
            console.log(game.user2)
            board.casillas[i] = game.user2.token;           // El user2 es la maquina.
            return board.casillas;
        }
    }
}


module.exports = {
    thereIsWin,
    jugarMaquina,
}
const router = require('express').Router();
const response = require('../response/response.js').response;
const repository = require('../repository/repositoryBoard.js');
const repositoryGame = require('../repository/repositoryGame.js');
const logic = require('../logic/tateti.js');



// GET ALL
router.get('/', async (req, res) => {
    try {
        const idGame = req.originalUrl.split('/')[2];
        const token = req.headers.authorization;

        // Validar que Game exista
        const game = await repositoryGame.getId(idGame);

        // Validar que el token sea de uno de los jugadores permitidos en el Game
        validateToken(game, token);     // En caso de error, retorna throw con el mensaje del error

        const result = await repository.getAll(idGame);
        res.json(response(result));
    } catch (err) {
        res.json(response(null, err));
    }
});


// GET
router.get('/:id', async function (req, res) {
    try {
        const id = req.params['id'];
        const idGame = req.originalUrl.split('/')[2];
        const token = req.headers.authorization;

        // Validar que Game exista
        const game = await repositoryGame.getId(idGame);

        // Validar que el token sea de uno de los jugadores permitidos en el Game
        validateToken(game, token);     // En caso de error, retorna throw con el mensaje del error

        const result = await repository.getId(idGame, id);
        res.json(response(result));
    } catch (err) {
        res.json(response(null, err));
    }
});


// POST
router.post('/', async function (req, res) {
    /* El metodo POST del Board crea el tablero y actualiza atributo ultBoard del game:
    Board{
        idBoard = autocalculable
        casillas = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        turno = user1
        win = null			
    }
  */
    try {
        const idGame = req.originalUrl.split('/')[2];
        const body = req.body;
        const token = req.headers.authorization;

        // Validar que Game exista
        const game = await repositoryGame.getId(idGame);

        // Validar que el token sea de uno de los jugadores permitidos en el Game
        validateToken(game, token);     // En caso de error, retorna throw con el mensaje del error


        // Completar los campos del game
        body.casillas = [0, 0, 0, 0, 0, 0, 0, 0, 0];     // Tablero inicializado en 0
        body.turno = game.user1.token;  // Se le setea el turno al user 1


        // Se crea el Board
        const result = await repository.post(idGame, body);

        // Se actualiza el atributo ultBoard del Game
        const bodyGame = { ultBoard: result.id }
        await repositoryGame.put(game.id, bodyGame)

        res.json(response(result));
    } catch (err) {
        res.json(response(null, err));
    }
});


// PUT
router.put('/:id', async function (req, res) {
    /* El metodo PUT del Board se utiliza al hacer click en una de las 9 casillas del Tateti				
    Board{
        idBoard = autocalculable
        casillas = [0, tokenUser1, 0, 0, 0, tokenUser2, 0, 0, 0]
        turno = user1
        win = null || nameUser				
    }
  */
    try {
        const id = req.params['id'];
        const idGame = req.originalUrl.split('/')[2];
        const body = req.body;
        const token = req.headers.authorization;
        const casilla = body.casilla;

        // Validar que Game exista
        const game = await repositoryGame.getId(idGame);

        // Validar que Board exista
        const board = await repository.getId(idGame, id);


        // Validaciones necesarias antes de marcar una casilla 
        validacionesPut(game, board, casilla, token);       // En caso de error, retorna throw con el mensaje del error


        // Llenar el tablero con la casilla marcada
        body.casillas = board.casillas
        body.casillas[casilla] = token


        // Verificar si hay ganador
        const userWin = logic.thereIsWin(game, body);  // thereIsWin retorna el name del user ganador, o retorna Empate, en otro caso retorna null
        if (userWin != null) body.win = userWin;


        // Si juega contra la maquina, esta realiza su jugada
        if (game.vsMaquina === 'true') jugarMaquina(game, body);


        // Cambiar turno
        body.turno = cambiarTurno(game, board);  // cambiarTurno retorna el token del jugador que tiene turno


        delete body.casilla;     // En la base de datos no es necesario guardar la casilla que se marco, ya que se guarda en el array de casillas
        const result = await repository.put(idGame, id, body);
        res.json(response(result));
    } catch (err) {
        res.json(response(null, err));
    }
});


// DELETE
router.delete('/:id', async function (req, res) {
    try {
        const id = req.params['id'];
        const idGame = req.originalUrl.split('/')[2];
        const token = req.headers.authorization;

        // Validar que Game exista
        const game = await repositoryGame.getId(idGame);

        // Validar que el token sea de uno de los jugadores permitidos en el Game
        validateToken(game, token);

        const result = await repository.delete(idGame, id);
        res.json(response(result));
    } catch (err) {
        res.json(response(null, err));
    }
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------
// -----  Funciones  ------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------

function validateToken(game, token) {
    if (game.user1 && game.user2) {
        if (token != game.user1.token && token != game.user2.token) throw (`User doesn't have permissions in this game`);
    } else {
        if (token != game.user1.token) throw (`User doesn't have permissions in this game`);
    }
}



function validacionesPut(game, board, casilla, token) {
    // Validar que el token sea de uno de los jugadores permitidos en el Game
    validateToken(game, token);

    // Validar que el token sea del jugador que tiene el turno
    if (token != board.turno) throw (`It's not your turn`);

    // Validar que el juego no haya terminado
    if (board.win) throw (`Game over`);

    // Validar que la casilla que esta marcando este libre
    if (isNaN(casilla) || casilla === "") throw (`Enter a number`);
    if (casilla < 0 || casilla > 8) throw (`Enter valid box [0,1,2,3,4,5,6,7,8]`);
    if (board.casillas[casilla] != 0) throw (`Box already checked`);

}



function jugarMaquina(game, body) {
    if (!body.win) {
        body.casillas = logic.jugarMaquina(game, body); // JugarMaquina retorna el tablero con las 9 casillas

        // Verificar si gano la maquina
        const userWin = logic.thereIsWin(game, body);  // thereIsWin retorna el name del user ganador, o retorna Empate, en otro caso retorna null
        if (userWin != null) body.win = userWin;
    }
}



function cambiarTurno(game, board) {
    if (game.vsMaquina == 'true') return game.user1.token;

    if (board.turno == game.user1.token) {
        return game.user2.token;  // Turno del jugador 2
    } else {
        return game.user1.token;  // Turno del jugador 1
    }
}

module.exports = {
    router,
}
const router = require('express').Router();
const response = require('../response/response.js').response;
let repository = require('../repository/repositoryGame.js');
let repositoryUser = require('../repository/repositoryUser.js');
const serviceToken = require('../services/token.js');

// GET
router.get('/:id', async function (req, res) {
  try {
    const id = req.params['id'];
    const token = req.headers.authorization;

    const result = await repository.getId(id);

    // Validar que el token sea de uno de los jugadores permitidos en el Game
    validateToken(result, token);


    res.json(response(result));
  } catch (err) {
    res.json(response(null, err));
  }
});


// POST
router.post('/', async function (req, res) {
  /* El metodo POST del Game crea el game inicialmente con un solo jugador:
    Game{
      idGame = autocalculable
      user1 = user1
      user2 = null
      winUser1 = 0
      winUser2 = 0
      vsMaquina = true o false
      ultBoard = null
    }
  */
  try {
    const body = req.body;

    // Si no existe body.vsMaquina lo setea en false
    if (!body.vsMaquina) body.vsMaquina = false;

    // Validar si el token pertenece a un user existente
    const user = await repositoryUser.findByToken(req.headers.authorization);

    // Completar los campos del game
    body.user1 = user.id;
    body.winUser1 = 0;  // La cantidad de veces que gano el user 1
    body.winUser2 = 0;  // La cantidad de veces que gano el user 2
    if (body.vsMaquina == true) body.user2 = (await cargarUserMaquina()).id;  // Si juega contra la maquina, se cargan los 2 users

    // Crea el game
    const result = await repository.post(body);
    res.json(response(result, null));
  } catch (err) {
    res.json(response(null, err));
  }
});


// PUT
router.put('/:id', async function (req, res) {
  /* El metodo PUT del Game une al jugador 2 al game,
    idGame = autocalculable
    user1 = user1
    user2 = user2
    winUser1 = 0
    winUser2 = 0
    vsMaquina = true o false
    ultBoard = null
  }

  URL: http://IP:PORT/game/idGame
  headers: {authorization: token}
  result: Game
*/

  try {
    const id = req.params['id'];

    // Verificar que el juego exista
    const game = await repository.getId(id);

    // Verificar que el juego solo posee un jugador y no esta ya completo (user1 = token1 y user2 = null)
    if (game.user1 != undefined && game.user2 != undefined) throw (`the Game ${id} already has 2 players`);


    // Validar si el token pertenece a un user existente
    const user2 = await repositoryUser.findByToken(req.headers.authorization);


    // Completar los campos del game
    let body = req.body;
    body.user2 = user2.id;


    // Modifica el game
    await repository.put(id, body);

    // Devuelve el game completo
    const result = await repository.getId(id);
    res.json(response(result, null));
  } catch (err) {
    res.json(response(null, err));
  }


});


// DELETE
router.delete('/:id', async function (req, res) {
  try {
    const id = req.params['id'];
    const token = req.headers.authorization;

    // Validar que Game exista
    const game = await repository.getId(id);

    // Validar que el token sea de uno de los jugadores permitidos en el Game
    validateToken(game, token);

    const result = await repository.delete(id);
    res.json(response(result, null));
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


async function cargarUserMaquina() {
  try {

    const user2 = await repositoryUser.findByName("IA");   // Busca al user 2
    return user2;

  } catch (error) {
    try {

      bodyUser = { name: "IA", token: serviceToken.createToken("IA") }
      const user2 = await repositoryUser.post(bodyUser);   // Si el user 2 no existe, lo crea.
      return user2;

    } catch (error) {
      throw (error);
    }
  }

}


module.exports = {
  router,
}

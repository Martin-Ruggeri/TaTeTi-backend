const router = require('express').Router();
const response = require('../response/response.js').response;
let repository = require('../repository/repositoryUser');
const serviceToken = require('../services/token.js');


// GET ALL
router.get('/', async (req, res) => {
  try {
    const result = await repository.getAll();
    res.json(response(result));
  } catch (err) {
    res.json(response(null, err));
  }
});

//GET TOKEN (Obtiene el user que pasa el token por el headers)
router.get('/whoami', async function (req, res) {
  try {
    const result = await repository.findByToken(req.headers.authorization);
    res.json(response(result));
  } catch (err) {
    res.json(response(null, err));
  }
});


// GET USER
router.get('/:id', async function (req, res) {
  try {
    const id = req.params['id'];

    const result = await repository.getId(id);
    res.json(response(result));
  } catch (err) {
    res.json(response(null, err));
  }
});


// POST USER
router.post('/', async function (req, res) {
  try {
    const body = req.body;

    // Validar que el name sea valido
    await validarUser(body.name);

    // Crear token
    body.token = serviceToken.createToken(body.name);


    // Guardar el usuario
    const result = await repository.post(body);
    res.json(response(result));
  } catch (err) {
    res.json(response(null, err));
  }
});


// PUT
router.put('/:id', async function (req, res) {
  try {
    const id = req.params['id'];
    const body = req.body;

    // Validar que el name sea valido
    await validarUser(body.name);

    // Crear token
    body.token = serviceToken.createToken(body.name);

    // Modifica el usuario
    const result = await repository.put(id, body);
    res.json(response(result));
  } catch (err) {
    res.json(response(null, err));
  }
});


// DELETE
router.delete('/:id', async function (req, res) {
  try {
    const id = req.params['id'];

    const result = await repository.delete(id);
    res.json(response(result, null));
  } catch (err) {
    res.json(response(null, err));
  }
});


// ------------------------------------------------------------------------------------------------------------------------------------------------------
// -----  Funciones  ------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------


async function validarUser(name) {
  // Validar que name no sea vacio
  if (!name) throw (`empty name`);


  // Valida que no exista otro usuario con el mismo nombre
  const users = await repository.getAll();
  for (const user of users) {
    if (user.name == name) {
      throw (`Name ${name} already exists`);
    }
  };

}




module.exports = {
  router,
}
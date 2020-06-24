let redis = require('../BD/redis.js');


// EXIST (si el objeto existe retorna true, si no existe retorna false)
function exist(idGame,id) {
    return redis.exist(`game${idGame}-board#${id}`);
}


// POST 
async function post(idGame, body) {

    // Valida que el game exista
    if (!await redis.exist(`game#${idGame}`)) throw (`there isn't Game ${idGame}`);
    body.casillas = body.casillas.join(); // Me transforma el array a string ya que redis solo acepta string
    const result = await redis.save(`game${idGame}-board#`, body);
    result.casillas = result.casillas.split(','); // Me transforma el string a un array.
    return result;
}


// GET ALL 
async function getAll(idGame) {
    return redis.findAll(`game${idGame}-board#`);
}


// GET 
async function getId(idGame,id) {
    // Valida que el game exista
    if (!await redis.exist(`game#${idGame}`)) throw (`there isn't Game ${idGame}`);

    const result = await redis.findId(`game${idGame}-board#${id}`);
    result.casillas = result.casillas.split(','); // Me transforma el string a un array.
    return result;
}


// PUT 
async function put(idGame,id,body) {
    body.id = id;
    body.casillas = body.casillas.join(); // Me transforma el array a string ya que redis solo acepta string
    const result = await redis.edit(`game${idGame}-board#${id}`, body);
    result.casillas = result.casillas.split(','); // Me transforma el string a un array.
    return result;
}


// DELETE 
async function delet(idGame,id) {
    try {
        await redis.delete(`game${idGame}-board#${id}`);
        return `Board ${id} of game ${idGame} delete`;
    } catch (error) {
        return error;
    }
}


// EXPORT repositoryClient
module.exports = {
    exist,
    post,
    put,
    getAll,
    getId,
    delete: delet,
};


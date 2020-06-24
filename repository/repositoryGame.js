let redis = require('../BD/redis.js');
const repositoryUser = require('./repositoryUser.js');

// EXIST (si el objeto existe retorna true, si no existe retorna false)
function exist(id) {
    return redis.exist(`game#${id}`);
}


// POST 
async function post(body) {
    const result = await redis.save(`game#`, body);

    // Obtiene los users para devolver el objeto completo y no el ID solamente (ya que la BD solo permite obtener string no objetos)
    if (result.user1) result.user1 = await repositoryUser.getId(result.user1);
    if (result.user2) result.user2 = await repositoryUser.getId(result.user2);

    return result;
}


// GET 
async function getId(id) {
    const result = await redis.findId(`game#${id}`);

    // Obtiene los users para devolver el objeto completo y no el ID solamente (ya que la BD solo permite obtener string no objetos)
    if (result.user1) result.user1 = await repositoryUser.getId(result.user1);
    if (result.user2) result.user2 = await repositoryUser.getId(result.user2);

    return result;
}


// PUT 
async function put(id, body) {
    const result = redis.edit(`game#${id}`, body);

    // Obtiene los users para devolver el objeto completo y no el ID solamente (ya que la BD solo permite obtener string no objetos)
    if (result.user1) result.user1 = await repositoryUser.getId(result.user1);
    if (result.user2) result.user2 = await repositoryUser.getId(result.user2);

    return result;
}


// DELETE 
async function delet(id) {
    try {
        await redis.delete(`game#${id}`);
        return `Game ${id} delete`;
    } catch (error) {
        return error;
    }
}


// EXPORT repositoryClient
module.exports = {
    exist,
    post,
    put,
    getId,
    delete: delet,
};


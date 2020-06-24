const port = process.env.REDIS_PORT;
const host = process.env.REDIS_IP;

const redis = require('redis').createClient(port,host);
const { promisify } = require("util");

const keysAsync = promisify(redis.keys).bind(redis);
const delAsync = promisify(redis.del).bind(redis);
const hgetAsync = promisify(redis.hgetall).bind(redis);
const existAsync = promisify(redis.exists).bind(redis);
const hmsetAsync = promisify(redis.hmset).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
const getAsync = promisify(redis.get).bind(redis);

// Capturar los errores de Redis
redis.on('error', function (err) {
    console.log('Error ' + err);
});



// EXIST (si el objeto existe retorna true, si no existe retorna false)
async function exist(key){
    const validation = await existAsync(key);   // Valida que el objeto exista
    if (validation != `1`) return false;
    return true;
}


// POST 
async function save(key , value) {

    let id = await getNextId(key);     // Obtiene el ultimo id registrado en la BD

    value.id = id;

    const result = await hmsetAsync(key+id , value);   // Guarda el object en la BD
    if (result != `OK`) throw(`ERROR save(), save error ${value}`);
    
    await addNextId(key);              // Incrementa el ultimo id registrado en la BD

    return value;
}


// GET ALL 
async function findAll(key) {

    let objectArray = [];
    
    const objectKeys = await keysAsync(`${key}*`);      // Busca en la BD todas las Keys de object
    if (objectKeys.length  == 0) return objectArray;

    for (const element of objectKeys) {
        const objec = await hgetAsync(element);      // Busca en la BD el object i
        if (objec == null) throw(`ERROR loading the ${key} ${element}`);
        objectArray.push(objec);
    }

    return objectArray;
}


// GET 
async function findId(key) {

        const result = await hgetAsync(key);      // Busca en la BD un objeto en especifico
        if (result == null) throw(`ERROR findId(), there isn't ${key}`);

        return result;
}


// PUT 
async function edit(key, value) {

    if (!exist(key)) throw(`ERROR already exists ${key}`);
    const result = await hmsetAsync(key , value);   // Modifica en la BD un objeto
    if (result != `OK`) throw(`ERROR edit(), could not modify the ${key}`);
    return value;
}


// DELETE 
async function delet(key) {

    if (!exist(key)) throw(`ERROR there isn't ${key}`);

    const result = await delAsync(key);   // Eliminar en la BD
    if (result != `1`) throw(`ERROR delete(), error deleting ${key}`);

    return true;
}

/* ------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------  */


// Variable netxClientId para el autoincremento en los id.

// Devuelve el id actual
async function getNextId(key) {
    const validation = await existAsync(`netx${key}Id`);   // Si no existe la variable, la crea en 0
    if (validation != `1`) await initNextID(key);

    const result = await getAsync(`netx${key}Id`);
    if (result == null) throw(`ERROR getNextId(), error getting netx${key}Id`);

    return result;
}

// Incrementa en 1 el id
async function addNextId(key) {
    let idActual = await getNextId(key);
    idActual = parseInt(idActual);

    const result = await setAsync(`netx${key}Id`, (idActual + 1));
    if (result == null) throw(`ERROR getNextId(), error increasing netx${key}Id`);

    return result;
}

// Inicializa el id en 0
async function initNextID(key) {
    const result = await setAsync(`netx${key}Id`, 0);
    if (result == null) throw(`ERROR getNextId(), error initializing netx${key}Id`);

    return result;
}


// EXPORT repositoryClient
module.exports = {
    exist,
    save,
    findAll,
    findId,
    edit,
    delete: delet,
};
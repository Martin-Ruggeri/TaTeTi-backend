let redis = require('../BD/redis.js');

// EXIST (si el objeto existe retorna true, si no existe retorna false)
function exist(id){
    return redis.exist(`user#${id}`);
}


// POST 
async function post(body) {
    return redis.save(`user#` , body);
}


// GET ALL 
async function getAll() {
    return redis.findAll(`user#`);
}


// GET 
async function getId(id) {
    return redis.findId(`user#${id}`);
}

// GET por tocken
async function findByToken(token) {
    if(!token) throw(`empty token`);

    const users = await getAll();

    for (const user of users) {
        if(user.token == token) return user;
    }
    
    throw(`tocken not found`);
}

// GET por name
async function findByName(name) {
    if(!name) throw(`empty name`);

    const users = await getAll();

    for (const user of users) {
        if(user.name == name) return user;
    }
    
    throw(`name not found`);
}



// PUT 
async function put(id, body) {
    body.id = id;
    return redis.edit(`user#${id}` , body);
}


// DELETE 
async function delet(id) {
    try {
        await redis.delete(`user#${id}`);
        return `User ${id} delete`;
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
    findByToken,
    findByName,
};


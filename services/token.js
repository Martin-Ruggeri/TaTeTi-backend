const jwt = require('jwt-simple');

// Esta funcion crea un token a partir del nombre y de una clave secreta
function createToken(name){
    const payload = {
        sub: name,
    }

    return jwt.encode(payload, process.env.ENCODE_USER);
}


module.exports = {
    createToken,
}
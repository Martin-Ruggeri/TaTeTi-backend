function response(resultado, error) {
    if (resultado)
        return { status: "OK", response: { result: resultado } };
    else
        return { status: "ERROR", response: { err: error } };
}


// EXPORT Response
module.exports = {
    response
};
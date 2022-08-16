
const jwt = require('jsonwebtoken');
//Chequeo si el usuario tiene el token (proteger rutas)
module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Acceso denegado');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err){
        res.status(400).send('token invalido');
    }
}
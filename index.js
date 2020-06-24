const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('autoenv');

const routerBoard = require('./router/routerBoard.js').router;
const routerGame = require('./router/routerGame.js').router;
const routerUser = require('./router/routerUser.js').router;



// ATRIBUTOS
const host = process.env.HOST;
const port = process.env.PORT;;

// Correr server
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

// Para manipular el body
app.use(bodyParser.json());
app.use(express.json()); 

// logger de peticiones
app.use(morgan('dev'));

// Para que las peticiones de los clientes con distintos dominios puedan acceder
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

 
// ROUTERS
app.use(`/user`, routerUser);
app.use(`/game`, routerGame);
app.use(`/game/:idGame/board`, routerBoard);

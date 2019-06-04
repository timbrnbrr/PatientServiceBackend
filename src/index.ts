//To use express
import * as express from "express";
import * as bodyParser from "body-parser"

// http = require('http');
//const fs = require('fs');
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('../../public/swagger.json');



const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//To use functionality from the controller
const controller = require('./controller');



/* POST service*/
app.post('/question/:id', controller.createQuestionnaire);

/* Put element service */
app.put('/question/:id', controller.updateQuestionnaire);

/*GET Element service*/
app.get('/question/:id', controller.getQuestionnaire);

/* GET all Element service*/
app.get('/question', controller.getAllQuestionnaire);


export = server;
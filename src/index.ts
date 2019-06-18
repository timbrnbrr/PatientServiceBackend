//To use express
import * as express from "express";
import * as bodyParser from "body-parser"
const webdav = require('webdav-server').v2;

const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

// JavaScript
const webserver = new webdav.WebDAVServer({
    port: 1900
});

webserver.afterRequest((arg, next) => {
    // Display the method, the URI, the returned status code and the returned message
    console.log('>>', arg.request.method, arg.requested.uri, '>', arg.response.statusCode, arg.response.statusMessage);
    // If available, display the body of the response
    console.log(arg.responseBody);
    next();
});

webserver.autoLoad((e) => {
    if(e)
    { // Couldn't load the 'data.json' (file is not accessible or it has invalid content)
        webserver.rootFileSystem().addSubTree(webserver.createExternalContext(), {
            'folder1': {                                // /folder1
                'file1.txt': webdav.ResourceType.File,  // /folder1/file1.txt
                'file2.txt': webdav.ResourceType.File   // /folder1/file2.txt
            },
            'file0.txt': webdav.ResourceType.File       // /file0.txt
        })
    }

    webserver.start(() => console.log('READY'));
})

app.use(webdav.extensions.express('/my/sub/path', webserver))

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

app.get('/timeSlot/:praxis/:datum',  controller.getAllTimeSlots);

app.post('/appointment',  controller.createAppointment);

app.get('/appointment', controller.getAllAppointments);

app.post('/login', controller.getLogin)

app.post('/register', controller.register)

app.delete('/user/:id', controller.deleteUserAndAll)

app.get('/my/sub/path',
    function(req,res)
    {
        console.log(webserver.rootFileSystem());
        res.send("express");
    }
);

export = server;
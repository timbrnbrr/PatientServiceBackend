//To use express
import * as express from "express";
import * as bodyParser from "body-parser"
import * as User from "./userModel";
const cors = require('cors');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const webdav = require('webdav-server').v2;

//To use functionality from the controller
const controller = require('./controller');

const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

app.use(cors());
/* ----------------------------------------------------------------------------------------------------------------- */

// Passport

require('https').globalAgent.options.rejectUnauthorized = false;

app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

let userId;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: '548678070406-nbl0cuhi768lnlgabdrtocoscp0v4qh2.apps.googleusercontent.com',
        clientSecret: 'nIxI9LP5WPOOPpi4BMHWKI33',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
        userId = profile.id;
        controller.afterRedirectFromGoogle(token, tokenSecret, profile, done);
    })
);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('true');
        return next();
    }
    res.redirect('/auth/google')
}

/* ----------------------------------------------------------------------------------------------------------------- */

//WebDav
// JavaScript

const userManager = new webdav.SimpleUserManager();
const user = userManager.addUser('test', 'test', true);

// Privilege manager (tells which users can access which files/folders)
const privilegeManager = new webdav.SimplePathPrivilegeManager();
privilegeManager.setRights(user, '/', [ 'all' ]);

const webserver = new webdav.WebDAVServer({
    port: 1900,
   // httpAuthentication: new webdav.HTTPDigestAuthentication(userManager, 'Default realm'),
   // privilegeManager: privilegeManager,
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
    {
        webserver.rootFileSystem().addSubTree(webserver.createExternalContext(), {
            'folder1': {                                // /folder1
                'data.txt': webdav.ResourceType.File,  // /folder1/file1.txt
            }
        })
        controller.fillDataTxt();
    }
    webserver.start(() => console.log('READY'));
})

app.use(webdav.extensions.express('/my/sub/path', webserver))

/* ----------------------------------------------------------------------------------------------------------------- */

const server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/* POST service*/
app.post('/question', controller.createQuestionnaire);

/* Put element service */
// app.put('/question/:id', controller.updateQuestionnaire);

/*GET Element service*/
app.get('/question/:id', controller.getQuestionnaire);

app.delete('/question/:id', controller.deleteQuestionnaire);

/* GET all Element service*/
app.get('/question', controller.getAllQuestionnaire);

app.get('/timeSlot/:praxis/:datum', controller.getAllTimeSlots);

app.post('/appointment',  controller.createAppointment);

app.get('/appointment/:id', controller.getAllAppointments);

app.get('/user/:id', controller.getUserAndAll);

/*app.get('/my/sub/path',
    function(req,res)
    {
        console.log(webserver.rootFileSystem());
        res.send("express");
    }
);*/

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile'],
    session: false } ));
   /* function(req, res, next) {
    passport.authenticate('google',  { scope: ['profile'] })});
   // passport.authenticate('google', { scope: ['profile'] }));*/

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login' }),
    function(req, res) {
        console.log("reached2")
        //res.redirect('/');
        res.status(200).redirect('http://localhost:4000/user/' + userId);
    });


//iCal API
app.get('/api/calendar/subscribe/:id',controller.getICalFile);

export = server;
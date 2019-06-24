import * as Questionnaire from './model';
import * as Termine from './terminModel';
import {Request, Response} from 'express';
import * as User from "./userModel";
const request = require('request');
const mongoose = require('mongoose');
const ical = require('ical-generator');
/**
 * Controller Module
 * @class Controller
 *
 */

//Tells mongoose the name of the db where it should connect to
mongoose.connect("mongodb://localhost/dB");
mongoose.set('debug', true);

/*POST controller**/
/**
 * Author: Tobias Dahlke
 *
 * POST controller
 *
 * This method creates a new Questionnaire and store it in the database.
 * @method createQuestionnaire
 * @param req: {Questionnaire}
 * @param res: {Questionnaire}
 * @author Tobias Dahlke
 */
let createQuestionnaire = function (req: Request, res: Response): void {
    console.log(req.body);

    let newQuestionnaire = new Questionnaire(req.body);

    newQuestionnaire.save((err) => {
        if (err) {
            res.json(err);
            return;
        }
        res.json(newQuestionnaire);
    });
};

let deleteQuestionnaire = function (req: Request, res: Response): void {
    console.log(req.body);

    let query = {id: req.params.id};

    Questionnaire.remove(query, function (err) {
        if (err) {
            res.json({info: 'error at delete request', error: err});
            return;
        };

        res.json({message: 'Deleted'})
    });
};

/**
 * Author: Tobias Dahlke
 *
 * Update Questionaire Controller
 *
 * Updates the Questionaire with the given Id to the new given Body.
 * @method updateQuestionaire
 * @param req {Questionaire} New Questionaire Body, {String} ID of Questionaire to Update
 * @param res Status Message
 * @author Tobias Dahlke
 */
let updateQuestionnaire = function (req: Request, res: Response): void {

    let query = {id: req.params.id};

    Questionnaire.findOne(query, function (err, questionnaire) {

        if (err) {
            res.send(err);
            return;
        }

        let update = {
            // TODO Einmal alles abtippen
        };

        questionnaire.update(update, function (err) {
            if (questionnaire) {
                questionnaire.update(update, function (err) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    res.json({message: 'Updated'})
                });
            } else {
                res.status(404);
                res.json({info: 'No such Questionnaire found with id:' + req.params.id});
            }
        });
    });
};


/**
 * Author: Tobias Dahlke
 *
 * GET Element Controller
 *
 * This Method searches a database entry by id.
 * @method getQuestionnaire
 * @param req {String} Questionnaire ID
 * @param res {Questionnaire}
 * @author Tobias Dahlke
 */
let getQuestionnaire = function (req: Request, res: Response): void {
    let query = {id: req.params.id};

    Questionnaire.findOne(query, {_id: 0}, function (err, Element) {
        if (err) {
            res.json({info: 'error at get request', error: err});
            return;
        }
        ;
        if (Element) {
            res.json({data: Element});
        } else {
            res.status(404);
            res.json({info: 'No such Questionnaire found with id:' + req.params.id});
        }

    });
};
/**
 * Author: Tobias Dahlke
 *
 * GET all Element controller
 *
 * @method getAllQuestionnaires
 * @param req {}
 * @param res {[Questionnaire]}
 * @Author Tobias Dahlke
 */
let getAllQuestionnaire = function (req: Request, res: Response): void {
    Questionnaire.find({}, {_id: 0}, (err, Questionnaires) => {
        if (err) {
            res.json({info: 'error during find Questionnaires', error: err});
            return;
        }
        res.json({data: Questionnaires});
    });
};

// Alle Termine für einen speziellen Kalendar Tag
let getAllTimeSlots = function (req: Request, res: Response): void {

    console.log(req.params.datum);
    console.log(req.params.praxis);


    /*let query = {datum: req.params.datum, praxis: req.params.praxis};
    console.log(req.params.datum);
    console.log(req.params.praxis);

    Termine.findOne(query, {_id: 0}, function (err, Element) {
        if (err) {
            res.json({info: 'error at get request', error: err});
            return;
        }
        if (Element) {
            res.json({data: Element});
        } else {
            res.status(404);
            res.json({info: 'No such Timeslot found'});
        }
    });*/

    //Rufe Daten für GET-Request aus Parameter ab
    //console.log(req.query.json);

    //Gebe freie Time Slots zurück
    let timeSlots = {data: ["8:30","10:00","16:30"]};

    res.json(timeSlots);
};

let createAppointment = function (req: Request, res: Response): void {

    console.log(req.body);

    let newAppointment = new Termine(req.body);

    newAppointment.save((err) => {
        if (err) {
            res.json(err);
            return;
        }
        res.json(newAppointment);
        res.end("success");
    });
};

let getAllAppointments = function (req: Request, res: Response): void {
    let query = {userId: req.params.id};

    Termine.find(query, {_id: 0}, (err, Termine) => {
        if (err) {
            res.json({info: 'error during find Termine', error: err});
            return;
        }
        console.log(Termine);
        res.json({data: Termine});
    });
    //res.json({data: [{id: 123, status: 1, praxis: "Neurologie Dr. Herbert Obst", datum: "12.07.2019", timeSlot: "10:30", betreff:"Schmerzen in Knie", bemerkung:""}, {id: 123, status: 2, praxis: "Dermatologie Dr. Bianca Herber", datum: "12.07.2019", timeSlot: "10:30", betreff:"Schmerzen in Arm", bemerkung:""}]});
};

let deleteUserAndAll =  function (req: Request, res: Response): void {
    console.log(req.body.id)

    User.remove ({id: req.body.id}, {_id: 0}, function () {
        Questionnaire.remove ({userId: req.body.id}, {_id: 0}, function () {
            Termine.remove ({userId: req.body.id}, {_id: 0}, function (err) {
                if (err) {
                    res.status(500);
                    res.json({info: 'error at delete request', error: err});
                    return;
                }
                if (Element) {
                    res.json({info: 'Successfully deleted in.'});
                } else {
                    res.status(404);
                    res.json({info: 'No such Userdata found'});
                }
            });
        });
    });
}

let afterRedirectFromGoogle =  function (token, tokenSecret, profile, done): void {
    User.findOrCreate({ id: profile.id }, function (err, user) {
        User.find({}, {_id: 0}, (err, User) => { // Just to see User
            if (err) {
                return;
            }
            console.log(User);
        });
    return done(err, user);
})};

let fillDataTxt = function () {

    Termine.find({}, {_id: 0}, (err, Termine) => {
        if (err) {
            return;
        }

        const clientServerOptions = {
            uri: 'http://localhost:3000/my/sub/path/folder1/data.txt',
            body: Termine.toString(),
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            }
        }

        request(clientServerOptions, function (error, response) {
            console.log(Termine);
            return;
        });
    });
}

let getICalFile = function (req: Request, res: Response): void {
    const cal = ical({domain: 'localhost', name: 'Smart Patient Appointments'});

    let query = {userId: req.params.id};

    Termine.find(query, {_id: 0}, (err, Termine) => {

        if (err) {
            res.json({info: 'error during find Termine', error: err});
            return;
        }

        Termine.forEach(function(appointment){
            console.log(appointment);

            let dateString = appointment.datum.split(".");
            let timeString = appointment.timeSlot.split(":");
            let appointmentDate = new Date(dateString[2], dateString[1] - 1, dateString[0], timeString[0], timeString[1]);

            cal.createEvent({
                start: appointmentDate,
                end: new Date(appointmentDate.getTime() + 30*60000), //Dauer von Termin 30 Minuten
                summary: appointment.praxis,
                description: appointment.betreff
            });



        });

       cal.serve(res);
    });
}

module.exports = {
    createQuestionnaire: createQuestionnaire,
    updateQuestionnaire: updateQuestionnaire,
    getQuestionnaire: getQuestionnaire,
    deleteQuestionnaire: deleteQuestionnaire,
    getAllQuestionnaire: getAllQuestionnaire,
    getAllTimeSlots:getAllTimeSlots,
    createAppointment:createAppointment,
    getAllAppointments:getAllAppointments,
    deleteUserAndAll : deleteUserAndAll,
    afterRedirectFromGoogle: afterRedirectFromGoogle,
    fillDataTxt: fillDataTxt,
    getICalFile: getICalFile
};
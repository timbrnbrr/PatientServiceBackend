import * as Questionnaire from './model';
import {Request, Response} from 'express';
const mongoose = require('mongoose');
/**
 * Controller Module
 * @class Controller
 *
 */

//Tells mongoose the name of the db where it should connect to
mongoose.connect("mongodb://localhost/awpDB");
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
    let newQuestionnaire = new Questionnaire(req.body);
    newQuestionnaire.id = req.params.id;

    newQuestionnaire.save((err) => {
        if (err) {
            res.json(err);
            return;
        }
        res.json(newQuestionnaire);
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
            level: req.body.level,
            pos: req.body.pos,
            parent: req.body.parent,
            icon: req.body.icon,
            data: req.body.data
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

module.exports = {
    createQuestionnaire: createQuestionnaire,
    updateQuestionnaire: updateQuestionnaire,
    getQuestionnaire: getQuestionnaire,
    getAllQuestionnaire: getAllQuestionnaire,
};

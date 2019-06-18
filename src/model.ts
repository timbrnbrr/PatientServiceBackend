import * as mongoose from "mongoose";

//Define beautifyUnique for better unique Validation error
let beautifyUnique = require('mongoose-beautiful-unique-validation');

const questionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: 'Another Element with this ID already exists'
    },
    name: String, //Nachname
    firstname: String, //Vorname
    birthdate: String, //Geburtstag
    street: String, //Straße
    plz: Number, //PLZ
    city: String, //Stadt
    telnumber: String, //Telefonnummer
    email: String, //E-Mail
    insuranceCompany: String, //Versicherung
    profession: String, //Beruf
    size: Number, //Größe
    weight: Number, //Gewicht
    children: Number, //Anzahl Kinder
    pregnancies: Number, //Anzahl Schwangerschaften
    births: Number, //Anzahl Geburten
    alcoholUsage: String, //Alkoholkonsum
    smoking: String, //Raucher
    otherMeans: String, //Andere Drogen
    chronicDiseases: String, //Chronische Krankheiten
    operations: String, //Bisherige Operationen
    allergies: String, //Allergien
    medication: String, //Medikamente
},{versionKey: false});

//Enable the beautifyUnique Plugin
questionSchema.plugin(beautifyUnique);

let Questionnaire  = module.exports= mongoose.model("Questionaire", questionSchema);

export = Questionnaire;


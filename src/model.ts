import * as mongoose from "mongoose";

//Define beautifyUnique for better unique Validation error
let beautifyUnique = require('mongoose-beautiful-unique-validation');

const questionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: 'Another Element with this ID already exists'
    },
    name: String,
    firstname: String,
    birthdate: Date,
    street: String,
    plz: Number,
    telnumber: Number,
    email: String,
    insuranceCompany: String,
    privateInsuranceType: String,
    profession: String,
    martialStatus: String,
    size: Number,
    weight: Number,
    children: Number,
    pregnancies: Number,
    births: Number,
    alcoholUsage: String,
    smoking: String,
    smokingQuantity: Number,
    smokingType: String,
    otherMeans: String,
    chronicDiseases: String,
    operations: String,
    allergies: String,
    medication: String,
    childrenDiseases: String,
    familyIllness: String,
    healthExamination: String,
    cancerScreening: String,
    lastDoctor: String,
    lastDoctorFindings: Boolean,
    wantToBeReminded: Boolean
},{versionKey: false});

//Enable the beautifyUnique Plugin
questionSchema.plugin(beautifyUnique);

let Questionnaire  = module.exports= mongoose.model("Questionaire", questionSchema);

export = Questionnaire;


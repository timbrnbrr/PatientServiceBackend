import * as mongoose from "mongoose";

//Define beautifyUnique for better unique Validation error
let beautifyUnique = require('mongoose-beautiful-unique-validation');

const terminSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: 'Another Element with this ID already exists'
    },
    status: String,
    betreff: String,
    bemerkung: String,
    userId: String,
    praxis: String,
    datum: String,
    timeSlot: String,
},{versionKey: false});

//Enable the beautifyUnique Plugin
terminSchema.plugin(beautifyUnique);

let Termine        = module.exports= mongoose.model("Termine", terminSchema);

export = Termine;


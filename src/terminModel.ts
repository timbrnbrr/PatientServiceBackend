import * as mongoose from "mongoose";

//Define beautifyUnique for better unique Validation error
let beautifyUnique = require('mongoose-beautiful-unique-validation');

const terminSchema = new mongoose.Schema({
    userId: String,
    status: String,
    betreff: String,
    bemerkung: String,
    praxis: String,
    datum: String,
    timeSlot: String,
},{versionKey: false});

//Enable the beautifyUnique Plugin
terminSchema.plugin(beautifyUnique);

let Termine        = module.exports= mongoose.model("Termine", terminSchema);

export = Termine;


import * as mongoose from "mongoose";

const findOrCreate = require('mongoose-find-or-create');
//Define beautifyUnique for better unique Validation error
let beautifyUnique = require('mongoose-beautiful-unique-validation');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: 'Another Element with this ID already exists'
    },
    password: String
},{versionKey: false});

//Enable the beautifyUnique Plugin
userSchema.plugin(beautifyUnique);

userSchema.plugin(findOrCreate);

let User = module.exports= mongoose.model("User", userSchema);

export = User;


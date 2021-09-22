const mongoose = require('mongoose')
const Joi = require("joi");

const Genre = mongoose.model('Genre',new mongoose.Schema({
    name: {type:String, required:true, minlength:5, maxlength:50},
    author: String,
    tags: [String],
    date: {type:Date,default: Date.now},
    isPublished: Boolean
    //If you need to talk to a database or a remote service to perform the validation, you need to create an async validator
}))

function validateGenre(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        id: Joi.number()
    });
    return schema.validate(body)
}

exports.Genre = Genre;
exports.validate = validateGenre();

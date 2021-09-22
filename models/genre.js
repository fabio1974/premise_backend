const mongoose = require('mongoose')
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    name: {type:String, required:true, minlength:5, maxlength:50},
})
const Genre = mongoose.model('Genres',genreSchema)

function validateGenre(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
    });
    return schema.validate(body)
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre();

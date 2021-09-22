const mongoose = require('mongoose')
const Joi = require("joi");
const {genreSchema} = require('./genre')

const Movie = mongoose.model('Movies',new mongoose.Schema({
    title: {type:String, required:true, minlength:2, maxlength:255},
    genre: {type: genreSchema, required:true},
    popularity:{type:Number, required:true, min:0},
    voteAverage:{type:Number, required:true, min:0},
    posterPath:{type:String},
}))

function validateMovie(body) {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(255),
        genreId: Joi.string().required(),
        popularity:Joi.number().required().min(0),
        voteAverage:Joi.string().required().min(0),
        posterPath:Joi.string(),
    });
    return schema.validate(body)
}

exports.Movie = Movie;
exports.validate = validateMovie();

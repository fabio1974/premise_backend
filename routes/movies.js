const express = require('express');
const auth = require('../middleware/auth')
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre")
const router = express.Router();
const debug = require('debug')('app:routes')

router.get('/',auth,async(req,res)=>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

router.get('/:id', auth,async(req,res)=>{
    const movie = await Movie.findById(req.params.id)
    if(!movie)
        return res.status(404).send('Code no found')
    res.send(movie)
})

router.post('/',auth,async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const genre  = await Genre.findById(req.body.genreId)
    if(!genre)
        return res.status(400).send('Genre invalid');

    let movie = new Movie({
        title: req.body.title,
        genre: {_id: genre._id,name:genre.name},
        popularity:req.body.popularity,
        voteAverage:req.body.voteAverage,
        posterPath:req.body.posterPath
    });

    movie = await movie.save();
    res.send(movie)
})

router.put('/:id', auth,async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {name: req.body.name},
        {new:true})
    if (!Movies)
        return res.status(404).send('The movie with the given ID was not in the database')
    res.send(movie);
});

router.delete('/:id', auth,async (req, res) => {
    const Movies = await Movies.findByIdAndDelete(req.body.id);
    if (!Movies)
        return res.status(404).send('The movie with the given ID was not in the database')
    res.send(Movies)
});

module.exports = router;

const express = require('express');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre")
const router = express.Router();


router.get('/',auth,async(req,res)=>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

router.get('/:id',auth, async(req,res)=>{
    try {
        const movie = await Movie.findById(req.params.id)
        if(movie)
            res.send(movie)
    }catch (e) {
        return res.status(404).send('Code no found')
    }
})

router.post('/',[auth,admin],async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let movie = await Movie.findOne({ title: req.body.title });
    if (movie)
        return res.status(400).send("Movie with the same title already registered.");

    movie = Movie(req.body);
    movie = await movie.save();
    res.send(movie)
})

router.put('/:id', auth,async (req, res) => {

    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const genre  = await Genre.findById(req.body.genreId)
    if(!genre)
        return res.status(400).send('Genre invalid');

    movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if (!movie)
        return res.status(404).send('The movie with the given ID was not in the database')
    res.send(movie);
});

router.delete('/:id',[auth,admin],async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie)
        return res.status(404).send('The movie with the given ID was not in the database')
    res.send(movie)
});




module.exports = router;

const express = require('express');
const auth = require('../middleware/check_auth')
const {Genre, validate} = require("../models/genre");
const router = express.Router();



router.get('/',async(req,res)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres);
})

router.get('/:id', auth,async(req,res)=>{
    const genre = await Genre.findById(req.body.id)
    if(!genre)
        return res.status(404).send('Code no found')
    res.send(genre)
})

router.post('/',auth,async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let genre = new Genre({name: req.body.name});
    genre = await genre.save();
    res.send(genre)
})

router.put('/:id', auth,async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id,
        {name: req.body.name},
        {new:true})
    if (!genre)
        return res.status(404).send('The genre with the given ID was not in the database')
    res.send(genre);
});

router.delete('/:id', auth,async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.body.id);
    if (!genre)
        return res.status(404).send('The genre with the given ID was not in the database')
    res.send(genre)
});

module.exports = router;

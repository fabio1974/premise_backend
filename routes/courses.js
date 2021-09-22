const express = require('express');
const router = express.Router();

const Joi = require("joi");
const mongoose = require("mongoose");
const courses = [
    {id:1, name: 'coruse1'},
    {id:2, name: 'coruse2'},
    {id:3, name: 'coruse4'},
    {id:4, name: 'coruse3'}
]


const courseSchema = new mongoose.Schema({
    name: {type:String, required:true},
    author: String,
    tags: [String],
    date: {type:Date,default: Date.now},
    isPublished: Boolean
})
const Course = mongoose.model('Course',courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Fabio',
        tags: ['angular', 'frontend'],
        isPublished: true
    });
    const result = await course.save();
    //debug(result)
}

async function getCourses(){
    const courses = await Course.find({_id:'614ab9dabfe453df97cecd65'});
    debug(courses)
}

async function updateCourse(_id, course){
    const result = await Course.findByIdAndUpdate(
        { _id: _id },
        {$set: { name: course.name }},
        { new: true }
    );
}

async function deleteCourse(_id){
    const course = await Course.findByIdAndRemove(id);
    debug(courses)
}




function validateCourse(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        id: Joi.number()
    });
    return schema.validate(body)
}


router.get('/',(req,res)=>{
    res.send([1,2,3,4,5]);
})

router.get('/:id', (req,res)=>{
    let course =  courses.find(it=> it.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('Code no found')
    res.send(course)
})

router.post('/', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let course = {id: courses.length + 1, name: req.body.name};
    courses.push(course)
    res.send(course)
})


router.put('/:id', (req, res) => {
    let course = courses.find(it => it.id === parseInt(req.params.id))
    if (!course)
        return res.status(404).send('The course with the given ID was not in the database')

    const {error} = validateCourse(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
})

module.exports = router;

const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json())
const courses = [
    {id:1, name: 'coruse1'},
    {id:2, name: 'coruse2'},
    {id:3, name: 'coruse4'},
    {id:4, name: 'coruse3'}
]

function validateCourse(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        id: Joi.number()
    });
    return schema.validate(body)
}

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

app.get('/',(req,res)=>{
    res.send('Hello World 2');
});

app.get('/api/courses',(req,res)=>{
    res.send([1,2,3,4,5]);
})

app.get('/api/courses/:id', (req,res)=>{
    let course =  courses.find(it=> it.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('Code no found')
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let course = {id: courses.length + 1, name: req.body.name};
    courses.push(course)
    res.send(course)
})


app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(it => it.id === parseInt(req.params.id))
    if (!course)
        return res.status(404).send('The course with the given ID was not in the database')

    const {error} = validateCourse(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
})
const config = require('config')  //for environment variables
//console.log('Application name'+ config.get('name'))
//console.log('Application mail server'+ config.get('mail.host'))
//console.log('Application mail password '+ config.get('mail.password'))


//const startupDebugger = require('debug')('app:startup');  //for log filtering
const debug = require('debug')('app:db')   //for log filtering

const courses = require('./routes/courses');
const genres = require('./routes/genres')
const loadDataService = require('./services/importInicialData')


const express = require('express');
const morgan = require("morgan");  //for logging
const helmet = require("helmet"); //for what?
const mongoose = require('mongoose')


mongoose.connect(config.get('mongoUrl'))
    .then(()=> debug('Mongo connected...'))
    .catch(err=> debug('Could not connect to mongo',err))


//createCourse()
//getCourses()

const app = express();

loadDataService()


app.use(morgan('tiny'))
app.use(express.json())  //parse
app.use(express.static('public'))  //publish static files on server
app.use(express.urlencoded({extended:true})) // requests with URL-encoded payload
app.use(helmet()) //for what?


app.use('/api/courses',courses);
app.use('/api/genres',genres);




if(app.get('env')==='development') {
    app.use(morgan('tiny')) //for logging
    //startupDebugger('Morgan enabled...')
}
//dbDebugger('Connected to the database...')

const PORT = process.env.PORT || 3900
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

const config  = require('config')  //for environment variables
const debug   = require('debug')('app:startup')   //for debug filtering
const express = require('express');
const morgan  = require("morgan");  //for logging
const mongoose= require('mongoose')
const helmet  = require('helmet')

mongoose.connect(config.get('mongoUrl'))
    .then(()=> debug('Mongo connected...'))
    .catch(err=> debug('Could not connect to mongo',err))

const loadData = require('./services/loadInitialDataOnMongo')


const app = express();
app.use(morgan('tiny'))
app.use(express.json())  //parse
app.use(express.static('public'))  //publish static files on server
app.use(express.urlencoded({extended:true})) // requests with URL-encoded payload
app.use(helmet()) //for what?
if(app.get('env')==='development') {
    app.use(morgan('tiny')) //for logging
}

const PORT = process.env.PORT || 3900
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

Promise.all([
    loadData.loadGenresFromJsonFiles(),
    loadData.loadMoviesFromExternalService()])
    .then(result => debug("Dadabase loaded..."))

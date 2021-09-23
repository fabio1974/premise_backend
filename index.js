const config  = require('config')  //for environment variables
const express = require('express');
const morgan  = require("morgan");  //for logging
const mongoose= require('mongoose')
const helmet  = require('helmet')
//const debug   = require('debug')('app:startup')   //for debug filtering



if(!config.get('mongoUrl')) {
    console.log('FATAL ERROR: MONGO_URL environment variable is not defined')
    process.exit(1);
}

mongoose.connect(config.get('mongoUrl'))
        .then(() => console.log('Mongo connected...'))
        .catch(err => console.log('Could not connect to mongo', err))


const loadData = require('./services/loadInitialDataOnMongo')
const movies = require('./routes/movies')
const genres = require('./routes/genres')
const users = require('./routes/users')
const auth= require('./routes/auth')


const app = express();
require('./security/cors')(app);
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
    loadData.loadAdmin(),
    loadData.loadGenresFromJsonFiles(),
    loadData.loadMoviesFromExternalService()])
    .then(result => console.log("Dadabase loaded..."))

app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/auth', auth);

const config  = require('config')  //for environment variables
const express = require('express');
const morgan  = require("morgan");  //for logging
const mongoose= require('mongoose')
const helmet  = require('helmet')


if(!config.get('mongoUrl')) {
    console.log('FATAL ERROR: MONGO_URL environment variable is not defined')
    process.exit(1);
}

console.log("MONGO_URL=>"+config.get('mongoUrl'))

mongoose.connect(config.get('mongoUrl'))
        .then(() => console.log('Mongo connected...'))
        .catch(err => console.log('Could not connect to mongo', err))


const loadData = require('./services/loadInitialDataOnMongo')
const movies = require('./routes/movies')
const genres = require('./routes/genres')
const users = require('./routes/users')
const auth= require('./routes/auth')


const app = express();

const debug   = require('debug')('app:startup')   //for debug filtering


require('./security/cors')(app);
app.use(morgan('tiny'))
app.use(express.json())  //parse
app.use(express.static('public'))  //publish static files on server
app.use(express.urlencoded({extended:true})) // requests with URL-encoded payload
app.use(helmet()) //for what?
if(app.get('env')==='development') {
    console.log('it is running in a dev config env')
    app.use(morgan('tiny')) //for logging
}

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));


loadData.loadAdmin()
     .then(()=>loadData.loadGenresFromJsonFiles())
     .then(()=>loadData.loadMoviesFromExternalService())
     .then(()=>console.log("Dadabase loaded..."));


app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/auth', auth);

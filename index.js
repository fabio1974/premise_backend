const express = require('express');

const movies = require('./routes/movies')
const genres = require('./routes/genres')
const users = require('./routes/users')
const auth= require('./routes/auth')

const app = express();

require('./security/cors')(app);
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
require('./services/logging')(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/auth', auth);

require('./services/connectToMongo')()
require('./services/loadInitialData')()

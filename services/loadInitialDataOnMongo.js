const axios = require("axios")
const config = require('config')
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre")
const {User} = require("../models/user")
const fs = require('fs');
const bcrypt = require("bcrypt");
const debug = require('debug')('app:db')


module.exports.loadAdmin = async () => {
    let count = await User.findOne({'email':'premise@andela.com'})
    const salt = await bcrypt.genSalt(10);
    let password = "12345"
    let user = new User({
        "name": "Premise@Andela",
        "email": "premise@andela.com",
        "password": await bcrypt.hash(password, salt),
        "isAdmin":true
    });
    if(count<1)
        user.save()
    console.log("user admin="  + user.email + " password="+ password + " inserted")
}


module.exports.loadGenresFromJsonFiles = async () => {
    let count = await Genre.count()
    if(count<10) {
        let json = fs.readFileSync('./services/genres.json');
        let genres = JSON.parse(json);
        const result = await Genre.insertMany(genres)
        console.log("Load Genres first load with size = " + result.length)
    }else
        console.log("Genre already loaded with size " + count)
}


module.exports.loadMoviesFromExternalService = async ()=>{
    try {
        let count = await Movie.count()
        if(count===0) {
            movies = await getMoviesFromWebService()
            let countSaveds = await saveMoviesOnMongo(movies)
            console.log(`...loading more ${countSaveds} movies on the database`);
        }else
            console.log("Movies already loaded with size " + count)
    } catch (err) {
        console.log({ message: err });
    }
}

async function getMoviesFromWebService(){
    let url = `${config.get('moviesServiceUrl')}/?api_key=${config.get('movieApiKey')}`
    const {data} = await axios.get(url)
    let genres = await Genre.find()
    return data.results.map(it => {
        let genre = genres[Math.floor(Math.random() * genres.length)]
        return new Movie({
            "title":it.title,
            "genreId": genre._id,
            "popularity": it.popularity,
            "voteAverage": it.vote_average,
            "posterPath": it.poster_path
        })
    });
}

async function saveMoviesOnMongo(movies){
    let count = 0;
    movies.forEach(movie=>{
        try{
            Movie.validate(movie)
            movie.save()
            count++
        }catch (e) {
            console.log("Validation Error ===>", e)
        }
    })
    return count
}

// async function saveMovie(data) {
//     let movie = new Movie();
//     movie = await movie.save();
// }




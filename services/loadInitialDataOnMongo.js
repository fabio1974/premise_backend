const axios = require("axios")
const config = require('config')
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre")
const fs = require('fs');
const debug = require('debug')('app:db')


module.exports.loadGenresFromJsonFiles = async () => {
    let count = await Genre.count()
    if(count<10) {
        let json = fs.readFileSync('./services/genres.json');
        let genres = JSON.parse(json);
        const result = await Genre.insertMany(genres)
        debug("Load Genres first load with size = " + result.length)
    }else
        debug("Genre already loaded with size " + count)
}


module.exports.loadMoviesFromExternalService = async ()=>{
    try {
        let count = await Movie.count()
        if(count<20) {
            movies = await getMoviesFromWebService()
            let countSaveds = await saveMoviesOnMongo(movies)
            debug(`...loading more ${countSaveds} movies on the database`);
        }else
            debug("Movies already loaded with size " + count)
    } catch (err) {
        console.log({ message: err });
    }
}

async function getMoviesFromWebService(){
    let url = `${config.get('moviesServiceUrl')}/?api_key=${config.get('apiKey')}`
    debug(url)
    const {data} = await axios.get(url)
    let genres = await Genre.find()
    return data.results.map(it => {
        let genre = genres[Math.floor(Math.random() * genres.length)]
        return Movie({"title":it.title,
            "genre": {_id: genre._id, name: genre.name},
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
            debug("Validation Error ===>", e)
        }
    })
    return count
}

async function saveMovie(data) {
    let movie = new Movie();
    movie = await movie.save();
}




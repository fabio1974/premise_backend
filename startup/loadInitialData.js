const axios = require("axios")
const config = require('config')
const {Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre")
const {User} = require("../models/user")
const fs = require('fs');
const bcrypt = require("bcrypt");

module.exports = async () => {
    await loadAdmin()
    await loadGenresFromJsonFiles()
    await loadMoviesFromExternalService();
    console.log("Dadabase loaded...");
}

async function loadAdmin(){
    let email = "premise@andela.com"
    let password = "12345"
    if(!await User.exists({'email':'premise@andela.com'})) {
        const salt = await bcrypt.genSalt(10);
        let user = new User({
            "name": "Premise@Andela",
            "email": email,
            "password": await bcrypt.hash(password, salt),
            "isAdmin": true
        });
        await user.save()
        console.log("user admin inserted !!!")
    }
    console.log(`Admin=> email:${email}  password:${password}`)
}


async function loadGenresFromJsonFiles() {
    let count = await Genre.count()
    if(count<10) {
        let json = fs.readFileSync('./services/genres.json');
        let genres = JSON.parse(json);
        const result = await Genre.insertMany(genres)
        console.log("Load Genres first load with size = " + result.length)
    }else
        console.log("Genre already loaded with size " + count)
}


async function loadMoviesFromExternalService(){
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

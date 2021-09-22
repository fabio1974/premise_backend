const axios = require("axios")
async function loadDataService(){
    try {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/popular/?api_key=cead72f0ce836c05d97430a769039ae3")
        console.log(data.results);
    } catch (err) {
        console.log({ message: err });
    }
}

module.exports = loadDataService

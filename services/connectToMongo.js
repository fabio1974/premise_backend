const config = require("config");
const mongoose = require("mongoose");

module.exports = ()=>{

    if(!config.get('mongoUrl')) {
        console.log('FATAL ERROR: MONGO_URL environment variable is not defined')
        process.exit(1);
    }

    console.log("MONGO_URL=>"+config.get('mongoUrl'))

    mongoose.connect(config.get('mongoUrl'))
        .then(() => console.log('Mongo connected...'))
        .catch(err => console.log('Could not connect to mongo', err))
}


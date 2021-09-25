const morgan = require("morgan");
const debug= require('debug')('app-logging')

module.exports = (app)=>{
    if(app.get('env')==='development') {
        debug(' You are in a development environment')
        console.log('it is running in a dev config env')
        app.use(morgan('tiny')) //for logging
    }
}

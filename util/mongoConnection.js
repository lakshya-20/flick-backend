const mongoose = require('mongoose');
var {mongourl}= require('../config/key');
const logger= require('./winstonLogger');

module.exports=async ()=>{
    try{
        await mongoose.connect(mongourl,{
            useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
        });        
        logger.info(`Mongodb Connected to ${mongourl}...`);
    }catch(err){
        logger.error(""+err);
        process.exit(1);
    }
}
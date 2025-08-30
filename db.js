const mongoose = require('mongoose');


// define the mongoDB connection url
const mongoURL = 'mongodb://127.0.0.1:27017/hotels';


// set up MongoDb connection
mongoose.connect(mongoURL,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})


//get the default connection
//mongoose maintains a default connection when we use mongoose.connect
const db= mongoose.connection;


// define event listeners for database connection

db.on('connected',()=>{
    console.log("connected to mongoDb server");
});


db.on('error',(err)=>{
    console.log("MongoDB connection error",err);
});


db.on('disconnected', ()=>{
    console.log("mongoDB disconnected");
});


// export the database connection
module.exports=db;

const mongoose = require('mongoose');  // imports the Mongoose library into the Node.js project

require('dotenv').config(); 

// define the mongoDB connection url
//const mongoURL = process.env.MONGODB_URL_LOCAL;     // when we connect to mongoDb server using mongosh there appears a the url like this and hotels is the name of the database we are using //local url for local database
const mongoURL =process.env.MONGODB_URL;  // for online database clustor
// set up MongoDb connection
// it is a function that we call to tell mongoose to connect to a MongoDb server
//analogy: dialing a phone number -> you start the call

mongoose.connect(mongoURL,{                    // this creates a connection between our Node.js app and out MongoDb database
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})


//get the default connection
//mongoose maintains a default connection when we use mongoose.connect
//mongoose.connection is a property (object) that represents the default connection created by mongoose.connect().
//analogy: the phone call that is established after dialing the number
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

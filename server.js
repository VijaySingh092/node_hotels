const express =require('express');  //“Import the Express library into my project, and store its exported function in a variable named express so I can use it to create a web application.”
//“Go to the express package in node_modules.”
//“Load whatever it exports (which is a function).”
//“Store that function in a variable named express.”


//require('express') returns a function (the Express function).
//You save that function in a variable named express.
//Then you call that function with express().
//So express is just a label (variable name) pointing to the function you imported.


const app = express();
//Call the express function we just loaded.
//That function builds an application object (called app).
// app is what we use to create routes (app.get, app.post) and start the server (app.listen).



const db=require('./db');   // this will ensure thtat db.js is loaded 
//we save the exported value of db.js into a variable called db
//this will ensure that the code in db.js is executed and the database connection is established when we run server.js


require('dotenv').config();

// body-parser is a middleware that helps to parse the incoming request body
// it read the request body (data sent by client) and convert it into a usable object (req.body).

// need: When a client sends data (like JSON or form data) in the body of a request (for example with a POST request), by default Node/Express doesn’t know how to parse it.

const bodyParser = require('body-parser'); // import the body-parser library into our project and store it in a variable named bodyParser


// we use app.use to add this middleware to our Express application
app.use(bodyParser.json());  
// here bodyParser.json() returns a middleware function that can parse JSON request bodies

// this means that for every incoming request, this middleware will run and parse the JSON body (if present) before it reaches any route handlers 

// what does the middleware do
//If someone sends JSON data in the request body (e.g., POST /person with { "name": "Vijay" }),
//This middleware reads that JSON,
//Converts it into a normal JavaScript object,
// And puts it inside req.body.

// Literal meaning:
// Load the body-parser package. Tell Express to use its json() middleware so that any JSON sent in requests will be automatically converted into a JavaScript object and stored in req.body.



const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Hello welcome to my hotel!!!')
})



// imports the router files
const personRoutes = require('./routes/personRoutes');//“For any request that starts with /person, forward it to the personRoutes router.”
app.use('/person',personRoutes);

const menuItemRoutes = require('./routes/menuItemRoutes');
app.use('/menuItem',menuItemRoutes);





app.listen(PORT,()=>{  //Start the server and wait for incoming requests on port 3000.    
//Create an HTTP server using this Express app.”
// “Make it listen on port 3000 of your machine.”
// When the server successfully starts, run the callback and print the message.”
    console.log("server started at port 3000");
})


const express = require('express');
const router = express.Router();     //function of  Express that manages the routes

const Person = require('./../models/person');
// Go to the models folder, open the person.js file, and run it.
//Whatever that file exports using module.exports = ... will be returned.


// POST route to add a person

// a route is basically an endpoint that the client can call to perform some action or get some data
// a route is basically a pathe(URL)+an HTTP method (GET,POST,PUT,DELETE,...)+ a handler function 

// route is what makes our API accessible . it tells our server, when a client sends a request to a specific URL , with a specific method (GET/POST/PUT/DELETE), what should i do
// without routes our server wouldn't know how to respond to request.

// app → your Express application.
// .get → HTTP method (GET request).
// '/person' → path (part of the URL).
// (req, res) => { ... } → handler function (what to do when someone visits that route).
 router.post('/',async(req,res)=>{
try{
        const data = req.body  // Assuming the request body contains the person data
        //req.body contains the data that the client sent in the body of the request (usually in a POST or PUT request)
        //const data = req.body it copies the request body into a variable called data
        // so now instead of writing req.body.name , req.body.age evertwhere you can just use  data.name  data.age
    
    // create a new person document using the mongoose model
    const newperson= new Person(data);
    // here Person is the mongoose model we created
    // It creates a new document(object) on the Person schema , filled with the data you pass
    // but at this point it's just a javascript object in the memory- it's not yet saved to the database.

    // save the new Person to the database
    const response =   await newperson.save(); // mongoose sends theat object to MongoDb and stores it in the people collection
    // here .save() is asynchronous(it takes time to talk to MongoDb)
    // await pauses your function until MongoDB confirms the save is done
    // Without await your code might move ahead before the data is actually stored
    
    // literal meaning : wait until MongoDB finishes saving the newperson document and store the saved version (with _is and other database fields) inside the variable response

    console.log('data saved');
    res.status(200).json(response);
    // we use res to send something back to whoever made the request (Postman, browser, frontend app etc)
    // 200 is the HTTP status code - it means "ok, request was successful"
    //.json() converts our js object into JSON format and sends it back in the response
    // literal meaning :  Send back a successful (200 OK) response to the client, with the saved document as JSON.

}catch(err){
console.log(err);  // Prints the actual error details in your server console.  only developer can see .But the client cannot see it
res.status(500).json({error:'Internal server error'});
} // this sends an http response back to the client .it tells the client Status code500 - the server had a problem and Json - a simple safe message
})

// get method to get the person details
router.get('/',async(req,res)=>{
    try{
const data = await Person.find();    //Person.find()=Person collection me jitne bhi documents hai wo mil jaye
console.log('data fetched');
res.status(200).json(data);
    }catch(err){
console.log(err);
res.status(500).json({error:'Internal server error'});
    }
})





// get method for worktype
router.get('/:workType',async(req,res)=>{    // :workType is just a placeholder. When the real request comes in Express replaces it with whatever value is in the URL and makes it availabe at req.params.workType 
//  Example request: GET /person/chef
// then req.params.workType = "chef"
    try{
        const workType=req.params.workType;  // this assigns works values like chef waiter that we pass in the request like : http://localhost:3000/person/chef to the workType variable
        //This means: take the workType property from the params object and store it in the variable workType.
        // this literally means “grab whatever value the user typed in the URL in place of :workType and save it into a variable.”
        // ex: if the client vists  /person/chef/delhi
        //   than   req.params = { workType: "chef", location: "delhi" }


//This checks if the value of workType (from req.params.workType) is one of the allowed job roles.
        if(workType=='Chef'||workType=='Waiter'||workType=='Manager'||workType=='Cleaner'||workType=='Owner'){
            const response = await Person.find({work:workType})   //  .find({ work: workType }) searches the collection for all documents where the work field matches the given workType.
            console.log('response fetched');
            //Prints a message in the Node.js console (for debugging).
//Lets the developer know the DB query succeeded.
            res.status(200).json(response);
 }else{
    res.status(404).json({error: 'Internal Server type'});
 }

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

// to update
router.put('/:id',async(req,res)=>{
    try{
        const personId = req.params.id; // Extract the id from the URL parameter
        const updatedPersonData = req.body; // whatever json data the client sends in the body of the request , save it as updatedPersonData

        const response = await Person.findByIdAndUpdate(personId,updatedPersonData,{
            new:true,
            runValidators:true
        }); // go to the database and find the document with _id = personId
        // Update it using the new data (updatedPersonData)
        // new: true means return the updated version , not the old one
        // runValidators: true means check the schema rules(like required fields, allowed values)before saving




        //If the database didn’t find any person with that id (so nothing got updated), then stop here and reply with status code 404 (Not Found). Also send the message { error: 'Person not found' }
            if(!response){
            return res.status(404).json({error:'Person not found'});
        }


        console.log('data updated');
        res.status(200).json(response);

    
    }catch(err){
        console.log(err);
     res.status(500).json({error:'Internal Server Error'})
    }
})



// for delete

router.delete('/:id',async(req,res)=>{
    try{ 
        const personId = req.params.id; // Extract the id from the URL parameter
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error:'Person not found'});
        }

        console.log('data deleted');
        res.status(200).json({message:'person Deleted Successfully'});
    }catch(err){
         console.log(err);
     res.status(500).json({error:'Internal Server Error'})
    }
})
 


module.exports = router;
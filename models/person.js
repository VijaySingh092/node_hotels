// we use mongoose to define the schema and model
// this defines the shape of Person document in MongoDb


const mongoose = require('mongoose');  // using require to load the Mongoose library , which lets you define schemas and work with MongoDB using models
const bcrypt = require('bcrypt');  // loads bcrypt , a library for hashing and verifying passwords

// define the person schema
const personSchema = new mongoose.Schema({  
    // creates a new schema object(blueprint) for Person documents. 
    name:{   // field : name
        type:String,  // the value of the field must be String
    required:true,     // field is required , so MongoDB won't allow saving without them
    },
    age:{  
    type: Number
    },
    work:{
        type:String,
        enum:['Chef','Waiter','Manager','Cleaner','Owner'],  //only these exact values are allowed
        required:true
    },
    mobile:{
        type:String,   // phone numbers, shouldn't be Number to avoid stripping leading zeroes
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true  // unique : true creates a unique index in MongoDb, it's not a validator . if you insert a duplicate , mongoDb throws an E11000 duplicate key error
    },
    address:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
});



// Registers a pre-save middleware (hook) that runs before doc.save() writes to the database
// pre('save) is a Mongoose middleware hook that runs before saving a document
// this refers to the current Person being saved
// SYNTAX:  schema.pre(event, callback)
// event = the action you want to hook into
// callback = a function that will run before that action
personSchema.pre('save',async function(next){
    const person=this;   // this refers to the document being saved 
    if(!person.isModified('password')) return next();   // person.isModified('password) checks if the password field is new or updated. this prevents hasing the password again if we save the document later
    // if password wasn't touched no nedd to re-hash . So in that case: skip everything and call next() immediately

    //hash the password only if it has been modified (or is new) 
    try{
        // hash password generation


        const salt = await bcrypt.genSalt(10); //// genSalt function is not built into Js, it lives inside the bcrypt library
        // await bcrypt.genSalt(10) generates a random salt (adds randomness) with 10 rounds of processing
        //salt ensures that even if two users have the same password ,their hashes will look different

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt); 
        
        // takes the plaintext password and the salt , then produces a hashed version
        // hashes the password with that salt 

        person.password = hashedPassword;  // repalces the plain password i the document with the haseed one. NOW the database will never see the real password
        next();  // after hasing, the hook is done and tells Mongoose continue with the nornal save process
    }
    catch(err){   // if bcrypt fails (rare ,but possible) it passes the error to Mongoose
return next(err);   // it means something went wrong ,stop saving and pass this error back
// return here is to just exit the function immediately after calling next(err) so nothing else run.s
    }
})



// mongoose gives us a way to attach custom methods to schema documents using .methods
// personSchema.methods is just an object where you define functions
personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        //use bcrypt to compare the provided password with the hashed password
        // bcrypt takes the plain text password (candidatePassword) 
        // this.password stored the hashedPassword
        // bcrypt hashes the plain password using the same algorithm and salt that were used when storing it
        //compares the newly hashed value with the stored hash(this.password)
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;  // returns true if match(the  user typed the correct password) else false they don't match(wrong password)
    }
    catch(err){
        throw err;
    }
}

// create the person model
const Person= mongoose.model('Person',personSchema);

module.exports=Person;
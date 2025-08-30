// we use mongoose to define the schema and model

const mongoose = require('mongoose');

// define the person schema
const personSchema = new mongoose.Schema({
    name:{ 
        type:String,
    required:true,
    },
    age:{
    type: Number
    },
    work:{
        type:String,
        enum:['Chef','Waiter','Manager','Cleaner','Owner'],
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    }
});


// create the person model
const Person= mongoose.model('Person',personSchema);

module.exports=Person;
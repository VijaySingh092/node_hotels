// we use mongoose to define the schema and model

const mongoose = require('mongoose');

// define the menu items schema
const menuItemsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    taste:{
        type:String,
        enum:['Sweet','Plain','Sour','Spicy','Bitter','Salty'],
        required:true
    },
    is_drink:{
        type:Boolean,
        default:false
    },
    ingredients:{
        type:[String],
        default:[]
    },
    num_sales:{
        type:Number,
        default:0
    }
})

const MenuItem = mongoose.model('MenuItem',menuItemsSchema);    //  “Hey Mongoose, create (or fetch if it already exists) a model named ItemMenu and use the structure defined in menuItemsSchema for it. and store it in the variable named MenuItem”

module.exports= MenuItem;    // this MenuItem is the one which we have declared as const MenuItem
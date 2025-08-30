const express = require('express');
const router = express.Router();     //function of  Express that manages the routes

const MenuItem = require('./../models/MenuItem');



// POST route to add a menu item
router.post('/',async(req,res)=>{
    try{
        const data = req.body
        const newmenuitem = new MenuItem(data);

        const response = await newmenuitem.save();
        console.log("menu item added");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

// get method to get the menu item details

router.get('/',async(req,res)=>{
    try{
        const data = await MenuItem.find();
        console.log("menu item fetched");
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})



// taste

router.get('/:tasteType',async(req,res)=>{
try{
const tasteType = req.params.tasteType;
if(tasteType=='Spicy'||tasteType=='Plain'||tasteType=='Sweet'||tasteType=='Sour'||tasteType=='Bitter'||tasteType=='Salty'){
     const response = await MenuItem.find({taste:tasteType})
    console.log("Response feteched");
     res.status(200).json(response);
}else{
    res.status(404).json({error:'Internal server type'});
}
}catch(err){
  console.log(err);
        res.status(500).json({error:'Internal server error'});
}
})


module.exports=router;
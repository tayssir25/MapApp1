const router =require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
//----Register
router.post("/register", async (req, res)=>{
    try{
        //generate new pwd
        const salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(req.body.password, salt);
        //create new user
        const newUser = new User({
            username: req.body.username,
            password: hashedpwd,
        })
        //response
        const user = await newUser.save();
        res.status(200).json(user._id);

    }catch(err){
        res.status(500).json(err)
    }
})
//----Login
router.post("/login", async (req,res)=> {
    try{
        //find user by username
        const user = await User.findOne({username: req.body.username});
        !user && res.status(400).json("please verify your username and password !");
        //password valid
        const pwd = await bcrypt.compare(req.body.password, user.password);
        !pwd && res.status(400).json("please verify your username and password !");
        //if all good
        res.status(200).json({_id: user._id, username:user.username});
    }catch(err){
        res.status(500).json(err);
    }
})
  
  module.exports = router;
  
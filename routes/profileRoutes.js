const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const profile = require("../models/profile");
require("dotenv/config")

const protection = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.secretKey, (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.redirect("/login");
        } else {
          return next();
        }
      });
     
    } else {
      res.redirect("/login");
    }
  };

//main profile
router.get("/main-profile",(req,res)=>{
    res.render("main-profile")
})






//pre-profile

router.get("/", protection,async (req,res)=>{
    const profiles= await profile.find()
    

    if(profiles){
        return res.render("pre-profile",{profiles})
    }
    else{

       return  res.render("pre-profile")
    }
});

router.post("/",protection,async (req,res)=>{
    const {username,name,dob,cgpa,projects,image} = req.body
    try{
    
    const user= await profile.create({username,name,dob,cgpa,projects,image})
    if(user){

        console.log("user created")
        return res.redirect("/pre-profile/main-profile")
    }
    }
    catch(err){
        console.log(err);
    }
    
});
module.exports = router;

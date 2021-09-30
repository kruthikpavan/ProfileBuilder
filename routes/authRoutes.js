const express = require('express');
const router= express.Router();
const authController= require('../controllers/authController');
const jwt= require("jsonwebtoken")
require("dotenv/config")
const User= require("../models/users")

//middlewares
// jwt
const protection= (req,res,next)=>{
    const token= req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.secretKey,(err,decodedToken)=>{
            if(err){
                console.log(err)
                res.redirect("/login")
            }
            else{
                next()
            }
        })
        next()

    }
    else{
        res.redirect("/login")
    }
}


//checkUser
const checkUser=(req,res,next)=>{
    const token= req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.secretKey,async (err,decodedToken)=>{
            if(err){
                console.log(err)
                res.locals.user= null

                next()
            }
            else{
                let user= await  User.findById(decodedToken.id)
                if(user){
                    res.locals.user= user
                }
                
                next()
            }
        })
      

    }
    else{
        res.locals.user= null
        next()
    }
}





router.get("*",checkUser)

router.get('/', (req, res) => res.render('home'));
router.get('/profile', protection,(req, res) => res.render('profile'));

//signup

router.get('/signup',authController.signup_get)
router.post('/signup',authController.signup_post)

//login
router.get('/login',authController.login_get)
router.post('/login',authController.login_post)

//logout
router.get("/logout",authController.logout_get)



//forgotPassword
router.get('/login/forgotPass',authController.fg_get)
router.post('/login/forgotPass',authController.fg_post)




module.exports=router;
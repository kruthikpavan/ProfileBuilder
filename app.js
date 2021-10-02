const express = require('express');
const mongoose = require('mongoose');
const cookieParser= require("cookie-parser")
require("dotenv/config")

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}));

// view engine
app.set('view engine', 'ejs');

// database connection



  mongoose.connect(process.env.DB_CONNECTION,()=>{
    console.log("connected to db");
})

//import  routes

const authRoutes= require('./routes/authRoutes');
app.use("/",authRoutes)

const profileRoutes= require('./routes/profileRoutes')
app.use("/pre-profile",profileRoutes)





//listen
app.listen(3000,()=>{
    console.log("listening to server");
})



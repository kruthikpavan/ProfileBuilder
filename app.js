const express = require('express');
const mongoose = require('mongoose');
const cookieParser= require("cookie-parser")
require("dotenv/config")

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection



  mongoose.connect(process.env.DB_CONNECTION,()=>{
    console.log("connected to db");
})

//import  routes

const Routes= require('./routes/authRoutes');
app.use("/",Routes)





//listen
app.listen(3000,()=>{
    console.log("listening to server");
})



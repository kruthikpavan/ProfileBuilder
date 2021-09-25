const mongoose = require('mongoose');
const { isEmail} = require("validator")

const userSchema= new mongoose.Schema({
  email:{

    type: String,
    required: [true,'please enter an email'],
    unique: [true, "the email already exists in the database"],
    lowercase: true,
    validate: [isEmail,"please enter valid email"]



  },
  password:{

    type: String,
    required: [true,'please enter a password'],
    minlength:[5, "minimum password length is 5 characters"]
  }



})

const user= mongoose.model("user",userSchema)
module.exports= user

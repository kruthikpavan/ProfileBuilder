const mongoose = require('mongoose');
const { isEmail} = require("validator")
const bcrypt= require('bcrypt')
const userSchema= new mongoose.Schema({
  email:{

    type: String,
    required: [true,'please enter a username'],
    unique: [true, "the username  already exists in the database"],
    lowercase: true,
    validate: [(email)=>{
        if(email.charAt(2)==="-"){
            
            if(email.slice(0,3)!="sd-"){
                return false;
            }
            else{
                return true;
            }
        }
        return false;
        
    },"The username is not in valid format"]



  },
  password:{

    type: String,
    required: [true,'please enter a password'],
    minlength:[5, "minimum password length is 5 characters"]
  }



})


//fire a function before document saved in database

userSchema.pre("save",async function (next){

    const salt= await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt)
    next()

}
)

const user= mongoose.model("user",userSchema)
module.exports= user

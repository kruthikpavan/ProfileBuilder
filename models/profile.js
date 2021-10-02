const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
  username:{

    type: String,
    required: [true,'please enter a username'],
    unique: true

  


  },
  name:{

    type: String,
    required: [true,'please enter a name'],
    
  },
  dob:{

    type: String,
    required: [true,'please enter a dob'],
    
  },
  cgpa:{

    type: String,
    required: [true,'please enter cgpa'],
    
  },
  projects:{

    type: String,
    required: [true,'please enter projects'],
    
  },
  image:{

    type: String,
    required: [true,'please enter link'],
    
  },



})



const profile= mongoose.model("profile",userSchema)
module.exports= profile

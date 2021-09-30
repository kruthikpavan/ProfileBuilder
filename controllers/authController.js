const User= require("../models/users")
const jwt= require("jsonwebtoken")
const bcrypt= require('bcrypt')

const maxAge= 3*24*60*60

//handle errors
const handleErrors= (err)=>{

    let errors= {email:'',password:''}
    
    //duplicate mail error
    if(err.code===11000){
        errors.email="email already exists"
        return errors
    }

    if(err.message==="Incorrect Email"){
        errors.email="That email does not exist"
        return errors
    }
    
    if(err.message==="Incorrect Password"){
        errors.password="Incorrect Password"
        return errors
    }
    
    
    //validation error
    Object.values(err.errors).forEach((error)=>{
        errors[error.properties.path]=error.properties.message
        
    })
    return (errors)

}

//token creation
const createToken= (id)=>{
    return jwt.sign({id},process.env.secretKey,{expiresIn: maxAge })
}






//signup routes

module.exports.signup_get= (req,res)=>{
    res.render("signup")

}
module.exports.signup_post= async (req,res)=>{
    const {email,password}= req.body;
  
    
    try{
        const user= await User.create({email,password})
        const token= createToken(user._id)
        res.cookie("jwt",token,{maxAge: maxAge*1000,httpOnly:true})
        res.status(201).json({user:user._id})

    }

    catch(err){
        const errors=handleErrors(err)
        res.status(400).json({errors})
    }
    
}

//login routes
module.exports.login_get= (req,res)=>{
    res.render("login")

}
module.exports.login_post= async (req,res)=>{
    const {email,password}= req.body;
   
    try{
    const user= await User.findOne({email})
   
     if(user){
      
        const auth= await bcrypt.compare(password,user.password)
        if(auth){
            const token= createToken(user._id)
         res.cookie("jwt",token,{maxAge: maxAge*1000,httpOnly:true})
            res.status(200).json(user)
        }
        else{
        throw Error("Incorrect Password")

        }
        
       
    }
    else{

        throw Error("Incorrect Email")
    }

    
}

catch(err){
    const errors= handleErrors(err)
    res.status(400).json({errors})
}
   

}

//logout

module.exports.logout_get= (req,res)=>{
    res.cookie("jwt","",{maxAge:1})
    res.redirect("/")
}




//fg routes
module.exports.fg_get= (req,res)=>{
    res.render("forgotPass")


}
module.exports.fg_post= (req,res)=>{
    res.send("forgot password")

}
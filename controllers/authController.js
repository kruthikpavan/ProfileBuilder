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
     if(err.message==="password length short"){
        errors.password="password length short"
        return errors
    }
    if(err.message==="Incorrect Password"){
        errors.password="Incorrect Password"
        return errors
    }
    if(err.message==="repeat Password"){
        errors.password="Passwords dont match"
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
module.exports.fg_post= async (req,res)=>{
  
    const {username,password,password2,otp}= req.body;
    
    

    try{
        const user2= await User.findOne({email:username})
    
         if(user2){
            if(password.length<5){
                throw Error("password length short")
            }
            else{

                if(password.trim()==password2.trim()){
                    console.log("passwords matched")
                    
                    const token= createToken(user2._id)
                    res.cookie("jwt",token,{maxAge: maxAge*1000,httpOnly:true})
                    const salt= await bcrypt.genSalt();
                    const newPassword= await bcrypt.hash(password2,salt)
                    const item= {
                        email: username,
                        password: newPassword
                    }
                    const updated= await User.updateOne({"email":username},{$set:item})



                 
                   
                    
                       res.status(200).json(user2)

                
                }
                else{
              
                    throw Error("repeat Password")}
            }

    
            
            
           
        }
        else{
            
        throw Error("Incorrect Email")
        }
    
        
    }
    
    catch(err){
        console.log(err.message)
        const errors= handleErrors(err)
        res.status(400).json({errors})
    }
  
}
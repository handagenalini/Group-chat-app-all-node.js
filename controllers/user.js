const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


function isstringinvalid(string){
    if(string == undefined || string.length === 0){
         return true
    }
    else{
        return false
    }
}
exports.signup = async(req,res,next)=>{
 try{
    const {name, email, phonenumber, password} = req.body;
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(phonenumber) || isstringinvalid(password)){
        return res.status(400).json({error:"All fields are required"})
    }
    const signupuser = await User.findAll({where: {email}})
    if(signupuser.length>0){
        console.log(signupuser);
        res.status(401).json({message: 'User already exits, please login'});
    }
    else{
     const saltround = 10;
    
     bcrypt.hash(password, saltround, async(err, hash)=>{
        console.log(err);
        await User.create({name, email, phonenumber, password: hash})
        res.status(201).json({message: 'User created successfully'})
     })
    }

 }catch(err){
   console.log(err)
    res.status(500).json({error: err})
 }
}

function generateToken(id,name){
    return jwt.sign({userid:id,name:name},process.env.TOKEN_SECRET);
  }
  
exports.login= async (req,res,next)=>{
    try{
         const {email,password }=req.body
         
        if(isstringinvalid(email) || isstringinvalid(password)){
          return res.status(400).json({error:"All fields are required"})
          }

        const user=await User.findAll({where : {email}})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
             if(err){
               res.status(500).json({  message:"something went wrong"})
             }
             else if(result===true){
             res.status(201).json({ success: true, message:"user logged successfully",token:generateToken(user[0].id,user[0].name)})
             }
             else{
             res.status(401).json({ success: false, message:"incorrect password"})
                }
             }
           )}
        else{
          res.status(404).json({success:false, message: "User not found"})
        }
       
    }
    catch(err){
        console.log(err)
       res.status(500).json({message: err, success:false})
    }
}

exports.getuser= async(req,res,next)=>{
  try{
     const signupuser=await User.findAll()
     res.status(201).json({message: 'Succesfully signup',users:signupuser});
  }
  catch(err){
     res.status(500).json({error: err})
  }
}


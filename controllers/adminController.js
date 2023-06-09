const Admin=require('../models/admin_users');
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');

const create_token=async(id)=>{
    try{
      
         const token=await jwt.sign({_id:id},config.sessionSecret);
         return token;


    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// secure password
const securePassword=async(password)=>{
    try{

       const passwordHash=await bcrypt.hash(password,10)
       return passwordHash;

    }
    catch(err)
    {
        console.log(err.message);
    }
}


// admin user

const insertUser=async(req,res)=>{
    try{
            const spassword=await securePassword(req.body.password);
            const user=new Admin({
                username:req.body.username,
                password:spassword,
                name:req.body.name,
                mobile:req.body.mobile,
                email:req.body.email,
                address:req.body.address,
                profile_photo:'',
                
        })
            const userData=await user.save();

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"your registration has been successfully."})
            }
            else
            {
                res.status(200).send({success:false,msg:"your registration has been failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}

// verify admin login

const verifyLogin=async(req,res)=>{
    try{
        const username=req.body.username;
        const password=req.body.password;
        const userData=await Admin.findOne({username:username});
        if(userData){

           const passwordMatch=await bcrypt.compare(password,userData.password);

           if(passwordMatch)
           {
                
                const tokenData=await create_token(userData._id);

            const userResult={
                _id:userData._id,
                username:userData.username,
                password:userData.password,
                name:userData.name,
                mobile:userData.mobile,
                email:userData.email,
                address:userData.address,
                profile_photo:userData.profile_photo,
                token:tokenData

            }

            const response={
                success:true,
                msg:"user details",
                data:userResult
            }
            res.status(200).send(response)
                
            }

           else{
            
            res.status(200).send({msg:"username and password is incorrect"})
           }

        }
        else{
            res.status(200).send({msg:"username and password is incorrect"})
        }

    }
    catch(err){
        res.status(400).send(err.message);
    }
}


module.exports={
    verifyLogin,
    insertUser,
}


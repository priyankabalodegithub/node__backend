
const Business=require('../models/tbl_business_opportunities');
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



//add business opportunity
const businessOpportunity=async(req,res)=>{
    try{
            
            const business=new Business({
                title:req.body.title,
                is_active:req.body.is_active,         
                
        })
            const userData=await business.save();

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }
}

// business exist
const businessExist=async(req,res)=>{

    try{
    
       Business.find({title:req.query.title})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'business alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'business not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// business opportunity list

const businessList=async(req,res)=>{
    try{

        const userData=await Business.find({ type:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// delete Business
const deleteBusiness=async(req,res)=>{
    try{

        const id=req.query.id;
        await Business.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"business can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// business profile edit & update

const editBusinessLoad=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Business.findById({_id:id});

       if(userData){

        
        res.status(200).send({success:true,business:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update profile

const updateBusiness=async(req,res)=>{
    try{

       const userData= await Business.findByIdAndUpdate({_id:req.params.id},{$set:
        {title:req.body.title,
            is_active:req.body.is_active}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",business:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports={
    businessOpportunity,
    businessList,
    deleteBusiness,
    editBusinessLoad,
    updateBusiness,
    businessExist
}


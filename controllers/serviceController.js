
const Service=require('../models/tbl_service_offered')
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const Country=require('../models/country');
const State=require('../models/state');
const City=require('../models/city')
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

//add service Offered
const serviceOffered=async(req,res)=>{
    try{
            
            const service=new Service({
                title:req.body.title,
                is_active:req.body.is_active,         
                
        })
            const userData=await service.save();

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

// service exist
const serviceExist=async(req,res)=>{

    try{
        Service.find({title:req.query.title})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'Service alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'Service not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
// service offered list

const serviceList=async(req,res)=>{
    try{

        const userData=await Service.find({ type:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// delete service
const deleteService=async(req,res)=>{
    try{

        const id=req.query.id;
        await Service.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"business can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// service edit & update

const editserviceLoad=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Service.findById({_id:id});

       if(userData){

        
        res.status(200).send({success:true,group:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update Service

const updateService=async(req,res)=>{
    try{

       const userData= await Service.findByIdAndUpdate({_id:req.params.id},{$set:{title:req.body.title,is_active:req.body.is_active}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports={
    serviceOffered,
    serviceList,
    deleteService,
    editserviceLoad,
    updateService,
    serviceExist
}



const Sector=require('../models/tbl_businessSector');


//add business sector
const businessSector=async(req,res)=>{
    try{
            
            const business=new Sector({
                name:req.body.name,       
                
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

const sectorList=async(req,res)=>{
    try{

        const userData=await Sector.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// delete Business
const deleteBusinessSector=async(req,res)=>{
    try{

        const id=req.query.id;
        await Sector.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"business can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// business profile edit & update

const editBusinessSector=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Sector.findById({_id:id});

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

const updateBusinessSector=async(req,res)=>{
    try{

       const userData= await Sector.findByIdAndUpdate({_id:req.params.id},{$set:
        {name:req.body.name}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",business:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports={
    businessSector,
    sectorList,
    deleteBusinessSector,
    editBusinessSector,
    updateBusinessSector,
    businessExist
}


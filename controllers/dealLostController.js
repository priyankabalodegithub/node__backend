
const DealLost=require('../models/tbl_dealLostReason')


//add service Offered
const addDealLostReason=async(req,res)=>{
    try{
            
            const deal=new DealLost({
                dealLostReason:req.body.dealLostReason,       
                
        })
            const userData=await deal.save();

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
// reasonList list

const reasonList=async(req,res)=>{
    try{

        const userData=await DealLost.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// delete reason
const deleteReason=async(req,res)=>{
    try{

        const id=req.query.id;
        await DealLost.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"reason can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
// update deal
const updateDeal=async(req,res)=>{
    try{

       const userData= await DealLost.findByIdAndUpdate({_id:req.params.id},{$set:
        { 
            dealLostReason: req.body.dealLostReason
        }});
       res.status(200).send({sucess:true,msg:"sucessfully updated",deal:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports={
    addDealLostReason,
    reasonList,
    deleteReason,
    updateDeal
}


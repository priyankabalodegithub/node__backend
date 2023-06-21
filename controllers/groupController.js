
const Group=require('../models/tbl_group');
// const Members=require('../models/tbl_allGroupMember');
const GroupContact=require('../models/tbl_groupContact');

const Blob = require('blob');
const config=require("../config/config");

const jwt=require('jsonwebtoken');
const Country=require('../models/country');
const State=require('../models/state');
const City=require('../models/city')
const excelJS=require("exceljs");
const getCountries=async(req,res)=>{
    try{
        const countries=await Country.find({})
        res.status(200).send(countries)
    }
    catch(error){
        res.status(400).send({msg:error.message})
    }
}

const getStates=async(req,res)=>{
    try{
        const states=await State.find({country_short_name:req.body.country_short_name})
        res.status(200).send(states)
    }
    catch(error){
        res.status(400).send({msg:error.message})
    }
}

const getCities=async(req,res)=>{
    try{
        const cities=await City.find({state_name:req.body.state_name})
        res.status(200).send(cities)
    }
    catch(error){
        res.status(400).send({msg:error.message})
    }
}



// Add group


const addGroup=async(req,res)=>{
    try{
            
            const group=new Group({
                group_name:req.body.group_name,
                group_description:req.body. group_description,
                status:req.body.status,
                members:req.body.members   
                
        })
            const userData=await group.save()
          
            .then(async (userData) => {
                // console.log("userData", userData);
                if(userData.members && userData.members.length>0){
              
                for(var i=0;i<userData.members.length;i++){
                    const all = new GroupContact({
                        contact_id:userData.members[i],
                        group_id:userData._id
                       
                    })
                        const sendMembers = await all.save()
            }
        }

            });

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"group data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
        
    }

}


// update group member
const updateGroupMember=async(req,res)=>{
    try{
        console.log(req.params.id, req.body);
        const groupData= await Group.findByIdAndUpdate({_id:req.params.id},
            {
                $set:{
                    members:req.body.members
                }
            }).then(async (groupData) => {
                console.log("groupData", groupData);
                await GroupContact.deleteMany({ group_id: groupData._id });
                if(req.body.members && req.body.members.length >0){
              
                    for(var i=0;i<req.body.members.length;i++){
                        const all = new GroupContact({
                            contact_id:req.body.members[i],
                            group_id:groupData._id
                        
                        })
                        const groupMembers = await all.save()
                    }
                }
            });

            if(groupData)
            {   
                res.status(200).send({success:true,data:groupData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"group member data failed"})
            }
    }
    catch(error)
    {   
        res.status(400).send(error.message);
    }
}

// group total
const grouptotal=async(req,res)=>
{
    try{

        const userData=await Group.find({ is_group:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }

}
const allGroupList=async(req,res)=>{
    // try{

    //     const userData=await Group.find();
    // res.status(200).send({success:true,data:userData});

    // }
    // catch(err){
    //     res.status(400).send(err.message);
    // }
    try {
        let query = {};
        let search = '';
        if (req.query.search) {
            search = req.query.search;
            query = {
                $or: [
                    { group_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                   
                ]
            }
        }
        // console.log(req.query.search, query);
        const userData = await Group.find(query)
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}


// group list
const groupList=async(req,res)=>{
    
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        var search='';
        if(req.query.search){
            search=req.query.search
        }
      
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Group.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Group.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Group.find()
        // .sort("-_id")
        .sort(sortObject)
        .find({
            $or:[
                {group_name:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
        .skip(startIndex)
        .limit(limit)
        .exec();
      result.rowsPerPage = limit;
      return res.send({ msg: "Posts Fetched successfully", data: result});

    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// delete group
const deleteGroup=async(req,res)=>{
    try{
        const userData=await Group.findById({_id:req.query.id})
        if(userData.count==0){
            const id=req.query.id;
            await Group.deleteOne({_id:id});
        res.status(200).send({success:true,msg:"Group can be deleted"}) 
        }
        else{
            res.status(200).send({success:false,msg:"you don't have delete these group"}) 
        }
    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// user profile edit & update

const editProfileLoad=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Group.findById({_id:id});

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

// update profile

const updateProfile=async(req,res)=>{
    try{

       const userData= await Group.findByIdAndUpdate({_id:req.params.id},{$set:{group_name:req.body.group_name, group_description:req.body.group_description,
        status:req.body.status,
        // members:req.body.members  
    }});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// export users data
const exportContacts=async(req,res)=>{
    try{
      
      const userData=await Group.find({is_group:1})
   
      try {
        
            res.status(200).send({ msg: "User Group Data", data: userData});
    
    
      } catch (err) {
        res.send({
          status: "error",
          message: "Something went wrong",
        });
      }
    }
    catch(err){
      console.log(err.message);
    }
  }
  
//   group exist
const groupExist=async(req,res)=>{

    try{
        Group.find({group_name:req.query.group_name})
        .then(async resp=>{
        //   console.log(resp)
         if(resp.length!=0){
        
           return res.status(200).send({success:false,msg:'group alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'group not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
module.exports={

    addGroup,
    groupList,
    deleteGroup,
    editProfileLoad,
    updateProfile,
    getCountries,
    getStates,
    getCities,
    grouptotal,
    exportContacts,
    groupExist,
    allGroupList,
    updateGroupMember
    
}

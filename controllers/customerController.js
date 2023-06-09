
// const Customer=require('../models/tbl_customer');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const Country=require('../models/country');
const State=require('../models/state');
const City=require('../models/city')
const Group=require('../models/tbl_group');
const ContactManagement=require('../models/tbl_contactManagement');
const csv=require('csvtojson')
const GroupContact=require('../models/tbl_groupContact');

const ContactGroup = require('../models/tbl_allGroupMember');

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



// add customer
const addCustomer=async(req,res)=>{
    try{
            
            const customer=new ContactManagement({
                first_name:req.body.first_name,
                last_name:req.body. last_name,
                designation:req.body.designation,
                company_name:req.body.company_name,
                email:req.body.email,
                primary_contact_number:req.body.primary_contact_number,
                secondary_contact_number:req.body.secondary_contact_number,
                service_offered:req.body.service_offered,
                group:req.body.group,
                contact_source:req.body.contact_source,
                buisness_sector:req.body.buisness_sector,
                status:req.body.status,
                address1:req.body.address1,
                address2:req.body.address2,
                taluka:req.body.taluka,
                village:req.body.village,
                zipcode:req.body.zipcode,
                city:req.body.city, 
                state:req.body.state,
                country:req.body.country,
                type:req.body.type 
                
        })
            const userData=await customer.save().then(async (userData) => {
                // console.log("userData", userData);
                if(userData.group && userData.group.length>0){
              
                for(var i=0;i<userData.group.length;i++){
                    const all = new ContactGroup({
                        contact_id: userData._id,
                        group_id: userData.group[i]
                       
                    })
                        const sendMembers = await all.save()
            }
        }
    })
            //     const historyData = await all.save()
            //     // console.log(historyData)
            //     const groupCountData=await Group.findById({_id:req.body.group[i]})
            //    const count=groupCountData.count+1;
            //    const userData1= await Group.findByIdAndUpdate({_id:req.body.group[i]},{$set:{count:count}});
            // }
            // });

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"contact data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }
}
const emailExist=async(req,res)=>{

    try{
        ContactManagement.find({email:req.query.email})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'Email alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'Email not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
// contact exist

const contactExist=async(req,res)=>{

    try{
       
        ContactManagement.find({primary_contact_number:req.query.primary_contact_number})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'contact alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'contact not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// all customer list
const allCustomer=async(req,res)=>{
    try{

        const userData=await ContactManagement.find({type:'customer'});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// customer list
const customerList=async(req,res)=>{
    
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        var search='';
        if(req.query.search){
            search=req.query.search
        }
         var serviceFilters=[];
         
      
    if(req.query.serviceFilters){
        serviceFilters=req.query.serviceFilters.split(',');            
    }
    const query = {};

    query.type = 'customer';
    

    if (serviceFilters.length > 0) {
        query.service_offered = { $in: serviceFilters }
    } 
    if(req.query.daysFilter){
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - req.query.daysFilter);
        // console.log(lastWeek);
        query.updatedAt = { $gte: lastWeek }
    }

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await ContactManagement.countDocuments(query).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await ContactManagement.countDocuments(query).exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await ContactManagement.find(query)
        .populate('group service_offered contact_source buisness_sector')
        .find({
            $or:[
                {first_name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}},
                {primary_contact_number:{$regex:'.*'+search+'.*',$options:'i'}},

            ]
        })
        .sort(sortObject)
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

// delete customer
const deleteCustomer=async(req,res)=>{
    try{

        const id=req.query.id;
        await ContactManagement.deleteOne({_id:id});
        const deleteCustomer= await GroupContact.deleteMany({contact_id:id});
    res.status(200).send({success:true,msg:"Customer can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
// customer edit & update

const editCustomer=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await ContactManagement.findById({_id:id}).populate('group service_offered contact_source buisness_sector');

       if(userData){

        
        res.status(200).send({success:true,customer:userData})

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

const updateCustomer=async(req,res)=>{
    try{

       const userData= await ContactManagement.findByIdAndUpdate({_id:req.params.id},{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
        company_name:req.body.company_name,email:req.body.email,primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,service_offered:req.body.service_offered,
        group:req.body.group,contact_source:req.body.contact_source,buisness_sector:req.body.buisness_sector,status:req.body.status,address1:req.body.address1,address2:req.body.address2,taluka:req.body.taluka,village:req.body.village,zipcode:req.body.zipcode,
        city:req.body.city,state:req.body.state,country:req.body.country
    }}).then(async (userData) => {
        const id=userData._id;
        const userData1= await GroupContact.deleteMany({contact_id:id});
        return userData;
        
    }).then(async (userData) => {
        for(var i=0;i<req.body.group.length;i++){
        const all = new GroupContact({
            contact_id:req.params.id,
            group_id:req.body.group[i]
           
        })
        const data = await all.save()
    }
    });
   
   res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData});

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


// import customer
const importCustomer=async(req,res)=>{
    try{
    
        var userData=[];
    
       csv()
       .fromFile(req.file.path)
       .then(async(response)=>{
       
         for(var x=0;x<response.length;x++){
            userData.push({
                first_name:response[x].first_name,
                last_name:response[x].last_name,
                designation:response[x].designation,
                company_name:response[x].company_name,
                primary_contact_number:response[x].primary_contact_number,
                email:response[x].email,
                secondary_contact_number:response[x].secondary_contact_number,
                group:response[x].group,
                service_offered:response[x].service_offered,
                status:response[x].status,
                address1:response[x].address1,
                address2:response[x].address2,
                taluka:response[x].taluka,
                village:response[x].village,
                zipcode:response[x].zipcode,
                city:response[x].city,
                state:response[x].state,
                country:response[x].country,
                type:'customer'
            })
    
         }
         await ContactManagement.insertMany(userData)
    
       })
        res.send({success:true,msg:"CSV imported"})
    
    
    }catch(error){
        res.send({success:false,msg:error.message})
    }
    }
    
    // export customer data
const exportCustomer=async(req,res)=>{
    try{
      
      
          const userData=await ContactManagement.find({type:"customer"})
       
      
          try {
            
                res.status(200).send({ msg: "User contact Data", data: userData});
         
        
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
  // update customer group
const updateCustomerGroup=async(req,res)=>{
    try{
        console.log(req.params.id, req.body);
        const groupData= await ContactManagement.findByIdAndUpdate({_id:req.params.id},
            {
                $set:{
                    group:req.body.group
                }
            }).then(async (groupData) => {
                console.log("groupData", groupData);
                await ContactGroup.deleteMany({ contact_id: groupData._id });
                if(req.body.group && req.body.group.length >0){
              
                    for(var i=0;i<req.body.group.length;i++){
                        const all = new ContactGroup({
                            group_id:req.body.group[i],
                            contact_id:groupData._id
                        
                        })
                        const groupgroup = await all.save()
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

module.exports={
    addCustomer,
    customerList,
    deleteCustomer,
    updateCustomer,
    editCustomer,
    getCountries,
    getStates,
    getCities,
    emailExist,
    contactExist,
    allCustomer,
    importCustomer,
    exportCustomer,
    updateCustomerGroup
    
}

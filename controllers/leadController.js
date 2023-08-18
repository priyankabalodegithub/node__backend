
// const Lead=require('../models/tbl_lead');
const Group=require('../models/tbl_group');
const ContactManagement=require('../models/tbl_contactManagement');
const csv=require('csvtojson');
const ContactGroup = require('../models/tbl_allGroupMember');
const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const Country=require('../models/country');
const State=require('../models/state');
const City=require('../models/city')

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

// add lead

const addLead=async(req,res)=>{
    try{
            
            const lead=new ContactManagement({
                first_name:req.body.first_name,
                last_name:req.body. last_name,
                designation:req.body.designation,
                company_name:req.body.company_name,
                email:req.body.email,
                primary_contact_number:req.body.primary_contact_number,
                secondary_contact_number:req.body.secondary_contact_number,
                business_opportunity:req.body.business_opportunity,
                contact_source:req.body.contact_source,
                 buisness_sector:req.body.buisness_sector,
                group:req.body.group,
                status:req.body.status,
                Lead_Status:req.body.Lead_Status,
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
            const userData=await lead.save() .then(async (userData) => {
                // console.log("userData", userData);
                if(userData.group && userData.group.length>0){
              
                for(var i=0;i<userData.group.length;i++){
                    const all = new ContactGroup({
                        contact_id: userData._id,
                        group_id: userData.group[i]
                       
                    })
                        const sendMembers = await all.save()
                        // const groupCountData=await Group.findById({_id:req.body.group[i]})
                        //    const count=groupCountData.count+1;
                        //    const userData1= await Group.findByIdAndUpdate({_id:req.body.group[i]},{$set:{count:count}});
            }
        }
    })
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
// email exist

const emailExist=async(req,res)=>{

    try{
       
        ContactManagement.find({email:req.query.email,is_deleted:0})
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

// email exist

const contactExist=async(req,res)=>{

    try{
       
        ContactManagement.find({primary_contact_number:req.query.primary_contact_number,is_deleted:0})
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

// all lead list
const allLead=async(req,res)=>{
    try{

        const userData=await ContactManagement.find({type:'lead',is_deleted:0});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// lead list

const leadList=async(req,res)=>{
   
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype :'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection :-1;
        sortObject[stype] = sdir;

        
        var search='';
        if(req.query.search){
            search=req.query.search
        }
        
        var businessFilters=[];
        var businessFilters=[];
        var leadStatusFilters=[];
        var salesFilters=[];
        if(req.query.businessFilters){
            businessFilters=req.query.businessFilters.split(',');            
        }
        if(req.query.leadStatusFilters){
            leadStatusFilters=req.query.leadStatusFilters.split(',');            
        }
        if(req.query.salesFilters){
            salesFilters=req.query.salesFilters.split(',');            
        }
        
        const query = {};
 
        query.type = 'lead';
        query.is_deleted=0
        
        // console.log(businessFilters);
        if (businessFilters.length > 0) {
            query.business_opportunity = { $in: businessFilters }
        } 
        if (leadStatusFilters.length > 0) {
            query.leadStatus = { $in: leadStatusFilters }
        } 
        if (salesFilters.length > 0) {
            query.sales_phase = { $in: salesFilters }
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
        .populate('group business_opportunity contact_source buisness_sector')
        .find({
            $or:[
                {first_name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
        .sort(sortObject)
        .skip(startIndex)
        .limit(limit)
        .exec();
        const leadLists = await Promise.all(
          
            result.data?.map(async (lst) => {
                const leadStatusList= []
                const salesPhaseList = []
                  let tasks = await Task.find({
                    selected_list: lst._id,
                    
                  }).populate('sales_phase').exec()
                 .then((result)=>{
                     for(i=0;i<result.length;i++)
                        {
                          if(result[i].lead_status===1){
                          leadStatusList.push("Cold Lead");
                          }else if(result[i].lead_status===2){
                            leadStatusList.push("Warm Lead");
                          }else if(result[i].lead_status===3){
                            leadStatusList.push("Hot Lead");
                          }
                          for(j=0;j<result[i].sales_phase.length;j++){
                          salesPhaseList.push(result[i].sales_phase[j].name);
                          }
                        }
                        
                      });
                      
                  const {_doc: leadList} = lst;
              
              return {
                ...leadList,
                leadStatus: leadStatusList.join(', '),
                sales_phase: salesPhaseList.join(', '),
              };
            })
          );
          let totcold = await Task.find({
            add_task_for:'lead',
            lead_status:1
            
          }).countDocuments()
       
          let totwarm = await Task.find({
            add_task_for:'lead',
            lead_status:2
            
          }).countDocuments()

          let tothot = await Task.find({
            add_task_for:'lead',
            lead_status:3
            
          }).countDocuments()
                
      result.rowsPerPage = limit;
      return res.send({ msg: "Posts Fetched successfully",  data: { ...result, data: leadLists},totcold:totcold,totwarm:totwarm,tothot:tothot});
       
    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// update lead group
const updateLeadGroup=async(req,res)=>{
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
                        const groupCountData = await Group.findById({ _id: req.body.group[i] })
                        const count = groupCountData.count + 1;
                        const userData1 = await Group.findByIdAndUpdate({ _id: req.body.group[i] }, { $set: { count: count } });
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

// delete lead
const deleteLead=async(req,res)=>{
    try{

        const id=req.query.id;
        await ContactManagement.deleteOne({_id:id});
        const deleteCustomer= await ContactGroup.deleteMany({contact_id:id});
        res.status(200).send({success:true,msg:"Lead can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// undo lead
const undoLead=async(req,res)=>{
    try{
      
       const userData= await ContactManagement.findByIdAndUpdate({_id:req.params.id},{$set:{is_deleted:0}});
       await ContactGroup.deleteMany({ contact_id: userData._id });
       if(userData.group && userData.group.length >0){
     
           for(var i=0;i<userData.group.length;i++){
               const all = new ContactGroup({
                   group_id:userData.group[i],
                   contact_id:userData._id
               
               })
               const groupgroup = await all.save()
               
           }
         
       }
       res.status(200).send({success:true,msg:"Lead can be undo"})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// soft delete 
const softDeleteLead=async(req,res)=>{
    try{
       
       const userData= await ContactManagement.findByIdAndUpdate({_id:req.params.id},{$set:{is_deleted:1}});
  
       await ContactGroup.deleteMany({ contact_id: userData._id });
       if(req.body.group && req.body.group.length >0){
     
           for(var i=0;i<req.body.group.length;i++){
               const all = new ContactGroup({
                   group_id:req.body.group[i],
                   contact_id:userData._id
               
               })
               const groupgroup = await all.save()
               
           }
         
       }
       res.status(200).send({success:true,msg:"Lead can be deleted"})
        }

    catch(error){
        res.status(400).send(error.message);
    }
}

// lead edit & update

const editLead=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await ContactManagement.findById({_id:id }).populate('group business_opportunity contact_source buisness_sector');
       const taskHistory = await TaskHistory.find({ selected_list: req.query.id,is_deleted:0  }).populate('sales_phase action business_opportunity task_id assign_task_to');
       const task = await Task.find({ selected_list: req.query.id,is_deleted:0  }).populate('sales_phase action business_opportunity assign_task_to contact_source')
       
       let { _doc: userDetails } = userData;
        // console.log(userDetails)
        const taskList = {
            ...userDetails,
               task,
                taskHistory       
        }

       if(userData){

        
        res.status(200).send({success:true,lead:taskList})

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

const updateLead=async(req,res)=>{
    try{

       const userData= await ContactManagement.findByIdAndUpdate({_id:req.params.id },
        {$set:
            {first_name:req.body.first_name, 
             last_name:req.body.last_name,
             designation:req.body.designation,
             company_name:req.body.company_name,
             email:req.body.email,
             primary_contact_number:req.body.primary_contact_number,
             secondary_contact_number:req.body.secondary_contact_number,
             business_opportunity:req.body.business_opportunity,
             contact_source:req.body.contact_source,
            buisness_sector:req.body.buisness_sector,
            group:req.body.group,
            status:req.body.status,
            address1:req.body.address1,
            address2:req.body.address2,
            taluka:req.body.taluka,
            village:req.body.village,
            zipcode:req.body.zipcode,
           city:req.body.city,
           state:req.body.state,
           country:req.body.country
        }})
        .then(async (groupData) => {
                   
            await ContactGroup.deleteMany({ contact_id: groupData._id });
            if(req.body.group && req.body.group.length >0){
          
                for(var i=0;i<req.body.group.length;i++){
                    const all = new ContactGroup({
                        group_id:req.body.group[i],
                        contact_id:groupData._id
                    
                    })
                    const groupgroup = await all.save()
                    
                    // const alls = new GroupContact ({
                    //     group_id:req.body.group[i],
                    //     contact_id:groupData._id
                    
                    // })
                    // const groupgroups = await alls.save()
                }
              
            }
        });

       
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})
      

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// export lead data
const exportLeads=async(req,res)=>{
    try{
      
      
          const userData=await ContactManagement.find({type:"lead",is_deleted:0}).populate('group business_opportunity')
       
      
          try {
            
                res.status(200).send({ msg: "User Lead Data", data: userData});
         
        
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
  
// import lead
const importLead=async(req,res)=>{
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
                business_opportunity:response[x].business_opportunity,
                status:response[x].status,
                address1:response[x].address1,
                address2:response[x].address2,
                taluka:response[x].taluka,
                village:response[x].village,
                zipcode:response[x].zipcode,
                city:response[x].city,
                state:response[x].state,
                country:response[x].country,
                type:'lead'
            })
    
         }
         await ContactManagement.insertMany(userData)
    
       })
        res.send({success:true,msg:"CSV imported"})
    
    
    }catch(error){
        res.send({success:false,msg:error.message})
    }
    }
module.exports={

    addLead,
    leadList,
    deleteLead,
    updateLead,
    editLead,
    getCountries,
    getStates,
    getCities,
    emailExist,
    contactExist,
    allLead,
    importLead,
    exportLeads,
    updateLeadGroup,
    undoLead,
    softDeleteLead
}
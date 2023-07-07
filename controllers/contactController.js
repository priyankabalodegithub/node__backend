
const Group = require('../models/tbl_group');
const Contact = require('../models/tbl_contacts');
const randomstring = require('randomstring');
const GroupContact=require('../models/tbl_groupContact');
const config = require("../config/config");
// const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');
const Country = require('../models/country');
const State = require('../models/state');
const City = require('../models/city');
const ContactGroup = require('../models/tbl_allGroupMember');
const ContactManagement = require('../models/tbl_contactManagement');
const csv = require('csvtojson')
const excelToJson = require('convert-excel-to-json');
const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history')


const Joi = require('joi'); 

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find({})
        res.status(200).send(countries)
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

const getStates = async (req, res) => {
    try {
        const states = await State.find({ country_short_name: req.body.country_short_name })
        res.status(200).send(states)
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

const getCities = async (req, res) => {
    try {
        const cities = await City.find({ state_name: req.body.state_name })
        res.status(200).send(cities)
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}




// add contact
const addContact = async (req, res) => {
    try {

        const contact = new ContactManagement({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            designation: req.body.designation,
            company_name: req.body.company_name,
            primary_contact_number: req.body.primary_contact_number,
            secondary_contact_number: req.body.secondary_contact_number,
            email: req.body.email,
            group: req.body.group,
            contact_source:req.body.contact_source,
            buisness_sector:req.body.buisness_sector,
            status: req.body.status,
            address1: req.body.address1,
            address2: req.body.address2,
            taluka: req.body.taluka,
            village: req.body.village,
            zipcode: req.body.zipcode,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            type: req.body.type

        })
        const userData = await contact.save()
        
        .then(async (userData) => {
            // console.log("userData", userData);
            if(userData.group && userData.group.length>0){
          
            for(var i=0;i<userData.group.length;i++){
                const all = new ContactGroup({
                    contact_id: userData._id,
                    group_id: userData.group[i]
                   
                })
                    const sendMembers = await all.save()
                    
                const groupCountData = await Group.findById({ _id: req.body.group[i] })
                const count = groupCountData.count + 1;
                const userData1 = await Group.findByIdAndUpdate({ _id: req.body.group[i] }, { $set: { count: count } });
        }
    }
   
//     if(userData.group && userData.group.length>0){
          
//         for(var i=0;i<userData.group.length;i++){
//             const all = new GroupContact({
//                 contact_id: userData._id,
//                 group_id: userData.group[i]
               
//             })
//                 const sendMembers = await all.save()
//     }
// }
    
})

        if (userData) {
            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })

        }
        else {
            res.status(200).send({ msg: "contact data failed" })
        }
    }
    catch (error) {

        res.status(400).send(error.message);
    }

}

// email exist

const emailExist = async (req, res) => {

    try {

        ContactManagement.find({ email: req.query.email,is_deleted:0 })
            .then(async resp => {
                if (resp.length != 0) {
                    return res.status(200).send({ success: false, msg: 'Email alredy exist' })

                } else {
                    return res.status(200).send({ success: true, msg: 'Email not exist' })
                }
            })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// contact exist

const contactExist = async (req, res) => {

    try {

        ContactManagement.find({ primary_contact_number: req.query.primary_contact_number,is_deleted:0 })
            .then(async resp => {
                if (resp.length != 0) {
                    return res.status(200).send({ success: false, msg: 'contact alredy exist' })

                } else {
                    return res.status(200).send({ success: true, msg: 'contact not exist' })
                }
            })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// all contact list

const allContact = async (req, res) => {
    try {

        const userData = await ContactManagement.find({ type: 'contact',is_deleted:0 });
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}
const common = async (req, res) => {
    try {
        let query = {};
        query.is_deleted=0
        let search = '';
        if (req.query.search) {
            search = req.query.search;
            query = {
                $or: [
                    { first_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { last_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { company_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            }
        }
        // console.log(req.query.search, query);
        const userData = await ContactManagement.find(query).populate('group');
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

// contact list
const contactList = async (req, res) => {
    try {
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        var search = '';
        if (req.query.search) {
            search = req.query.search
        }
        var groupFilters=[];
      
        if(req.query.groupFilters){
            groupFilters=req.query.groupFilters.split(',');            
        }
        const query = {};

        query.type = 'contact';
        query.is_deleted = 0;
        if (groupFilters.length > 0) {
            query.group = { $in: groupFilters }
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
            .populate('group contact_source buisness_sector')
            .find({
                $or: [
                    { first_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { primary_contact_number: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            })
            .sort(sortObject)
            .skip(startIndex)
            .limit(limit)
            .exec();
            const permissionList = await Promise.all(
                result.data?.map(async (lst) => {
                  let sales = await Task.find({
                    selected_list: lst._id,
                  }) 
                    .exec();
                  console.log(sales)
                    // let tasks = await Task.find({
                    //     selected_list: lst._id,
                    //   }).exec();
                    //   const taskAssignList = []
                    //   tasks = tasks.map((task) => {
                    //     task.selected_list.map((selected_contact_list) => {
                    //       ContactManagement.findById({
                    //         _id: selected_contact_list,
                    //       }).exec().then((result)=>{
                    //         if(result){
                    //           taskAssignList.push(result.first_name);
                    //         }
                    //       });
                    //     })
                    //   });
          
                  
                  return {
                    // ...staffDetails,
                    // taskAssigned: taskAssignList
                   
                  };
                })
              );
        result.rowsPerPage = limit;
        return res.send({ msg: "Posts Fetched successfully", data: result });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// update group member
const updateContactGroup=async(req,res)=>{
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
                        
                        // const alls = new GroupContact ({
                        //     group_id:req.body.group[i],
                        //     contact_id:groupData._id
                        
                        // })
                        // const groupgroups = await alls.save()
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
// delete contact
const deleteContact = async (req, res) => {

    try {
        const id = req.query.id;
        const userData = await ContactManagement.deleteOne({ _id: id });
        const deleteContact = await ContactGroup.deleteMany({ contact_id: id })
        res.status(200).send({ success: true, msg: "Contact can be deleted" })


    }
    catch (err) {
        res.status(400).send(err.message)
    }
}
// undo contact
const undoContact=async(req,res)=>{
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
       res.status(200).send({success:true,msg:"Contact can be undo"})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// soft delete 
const softDeleteContact=async(req,res)=>{
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
       res.status(200).send({success:true,msg:"Contact can be deleted"})
        }

    catch(error){
        res.status(400).send(error.message);
    }
}
// contact edit & update

const editContact = async (req, res) => {
    try {

        const id = req.query.id;

        const userData = await ContactManagement.findById({ _id: id }).populate('group contact_source buisness_sector');
        const taskHistory = await TaskHistory.find({ selected_list: req.query.id,is_deleted:0 }).populate('sales_phase action business_opportunity task_id assign_task_to');
        const task = await Task.find({ selected_list: req.query.id,is_deleted:0 }).populate('sales_phase action business_opportunity assign_task_to contact_source')
       
        let { _doc: userDetails } = userData;
        // console.log(userDetails)
        const taskList = {
            ...userDetails,
               task,
                taskHistory      
            
        }

        if (userData) {

            res.status(200).send({ success: true, contact:taskList})

        }
        else {

            res.status(200).send({ success: false })
        }

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// update profile

const updateContact = async (req, res) => {
    try {

        const userData = await ContactManagement.findByIdAndUpdate({ _id: req.params.id },
            {
                $set:
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    designation: req.body.designation,
                    company_name: req.body.company_name,
                    primary_contact_number: req.body.primary_contact_number,
                    secondary_contact_number: req.body.secondary_contact_number,
                    email: req.body.email,
                    group: req.body.group,
                    business_opportunity: req.body.business_opportunity,
                    contact_source:req.body.contact_source,
                    buisness_sector:req.body.buisness_sector,
                    status: req.body.status,
                    address1: req.body.address1,
                    address2: req.body.address2,
                    taluka: req.body.taluka,
                    village: req.body.village,
                    zipcode: req.body.zipcode,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country
                }
            })
            .then(async (groupData) => {
                  
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
              const abc= await ContactGroup.find();
              for(i=0;i<abc.length;i++){
                const aaa= await ContactGroup.find({contact_id:req.params.id}).countDocuments();
                const userData1 = await Group.findByIdAndUpdate({ _id:req.params.id }, { $set: { count: aaa } });
              }
              
    
        res.status(200).send({ sucess: true, msg: "sucessfully updated", group: userData })

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// import user
const importUser = async (req, res) => {
    try {
        const response = excelToJson({
            sourceFile: req.file.path,
            columnToKey: {
                '*': '{{columnHeader}}'
            }
        });
        // console.log(response);
        let listUpdated = response.sheet1.slice(1).map(async (data) => {
            let resData = await checkImportedDataValidation(data);
            return resData;
        })
        
        Promise.all(listUpdated).then((data)=> {
            let totalRecord = data.length;
            let totalValidRecord = data.filter(record => record.isValid === true).length;
            let totalInvalidRecord = data.filter(record => record.isValid === false).length;
            res.send({ success: true, msg: "CSV imported", totalRecord: totalRecord, totalValidRecord:totalValidRecord, totalInvalidRecord:totalInvalidRecord, data: data});
        })
    } catch (error) {
        res.send({ success: false, msg: error.message, error: error })
    }
}

async function checkImportedDataValidation(contactData){    
    const schema = Joi.object().options({ abortEarly: false }).keys({ 
        s_no: Joi.any(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        designation: Joi.string(),
        company_name: Joi.string(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        primary_contact_number: Joi.any().required(),
        secondary_contact_number: Joi.any(), //.allow(null, ''),
        // business_opportunity: Joi.string(),
        status: Joi.string(),
        address1: Joi.string(),
        address2: Joi.string(),
        taluka: Joi.string(),
        village: Joi.string(),
        zipcode: Joi.any(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        type: Joi.string(),
    }); 

    const result = schema.validate(contactData); 
    // console.log(result);
    const { value, error } = result; 
    const valid = error == null; 
    if (!valid) { 
        return {isValid: false, data: value, error: error.details };
    } else {
        const exist = await ContactManagement.findOne({ email: contactData.email });
        // console.log(exist);
        if(exist){
            const existPrimaryContactNumber = await ContactManagement.findOne({ 'email': {$ne : exist.email}, primary_contact_number: contactData.primary_contact_number });
            if (existPrimaryContactNumber) {
                return {isValid: false, data: contactData, error1: 'primary_contact_number exist' };
            }
        }else{
            const existPrimaryContactNumber = await ContactManagement.findOne({ primary_contact_number: contactData.primary_contact_number });
            if (existPrimaryContactNumber) {
                return {isValid: false, data: contactData, error1: 'primary_contact_number exist' };
            }
        }
        return {isValid: true, data: contactData };
    } 
}

// add update bulk records
const addUpdateBulkRecords = async (req, res) => {
    try {
        // console.log(req.body);
        let reqData = req.body;
        let listAddUpdated = reqData.map(async (record) => {
            let data = record.data;
            // console.log(data);
            if(record.isValid){
                const _data = data;
                const exist = await ContactManagement.findOne({ email: _data.email });
               
                if(exist){
                    // console.log('if');
                    const existPrimaryContactNumber = await ContactManagement.findOne({ 'email': {$ne : exist.email}, primary_contact_number: _data.primary_contact_number });
                    if (!existPrimaryContactNumber) {
                        const updateddata  = await ContactManagement.findByIdAndUpdate({ _id: exist._id },
                            { $set: _data });
                    }
                }else{
                    // console.log('else');
                    const existPrimaryContactNumber = await ContactManagement.findOne({ primary_contact_number: _data.primary_contact_number });
                    if (!existPrimaryContactNumber) {
                        const contact = new ContactManagement(_data)
                        let svedData =  await contact.save();
                    }
                }
            }
        })

        Promise.all(listAddUpdated).then((data)=> {
            res.send({ success: true, msg: "CSV data successfully imported", total: reqData.length})
        })
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// export contact data
const exportContact=async(req,res)=>{
    try{
      
      
          const userData=await ContactManagement.find({type:"contact",is_deleted:0})
       
      
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

module.exports = {

    addContact,
    contactList,
    deleteContact,
    editContact,
    updateContact,
    getCountries,
    getStates,
    getCities,
    emailExist,
    contactExist,
    allContact,
    common,
    importUser,
    exportContact,
    addUpdateBulkRecords,
    updateContactGroup,
    undoContact,
    softDeleteContact 
}
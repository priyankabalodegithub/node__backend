
const Source = require('../models/tbl_contactSource');
const Contact = require('../models/tbl_contacts');
const Lead = require('../models/tbl_lead');
const Customer = require('../models/tbl_customer');
const Sales = require('../models/tbl_salesPhase');
const Action = require('../models/tbl_taskAction');
const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history')
const nodemailer=require('nodemailer');
const ContactManagement = require('../models/tbl_contactManagement');
const fs = require('fs');

// add contact source
const contactSource = async (req, res) => {
    try {

        const source = new Source({
            name: req.body.name,

        })
        const userData = await source.save();

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "data failed" })
        }

    }
    catch (error) {

        res.status(400).send(error.message);
    }
}


// contact source list

const sourceList = async (req, res) => {
    try {

        const userData = await Source.find();
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

// add sales phase
const salesPhase = async (req, res) => {
    try {

        const sales = new Sales({
            name: req.body.name,

        })
        const userData = await sales.save();

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "data failed" })
        }

    }
    catch (error) {

        res.status(400).send(error.message);
    }
}


// sales phase list

const salesList = async (req, res) => {
    try {

        const userData = await Sales.find();
        console.log(userData)
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}
// edit sales phase
const editSales=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Sales.findById({_id:id});

       if(userData){

        res.status(200).send({success:true,sales:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update action
const updateSales=async(req,res)=>{
    try{

       const userData= await Sales.findByIdAndUpdate({_id:req.params.id},{$set:
        { name: req.body.name
        }});
       res.status(200).send({sucess:true,msg:"sucessfully updated",sales:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// add action
const addAction = async (req, res) => {
    try {

        const action = new Action({
            action: req.body.action,

        })
        const userData = await action.save();

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "data failed" })
        }

    }
    catch (error) {

        res.status(400).send(error.message);
    }
}

// action already exist

const actionExist = async (req, res) => {

    try {

        Action.find({ action: req.query.action })
            .then(async resp => {
                if (resp.length != 0) {
                    return res.status(200).send({ success: false, msg: 'action alredy exist' })

                } else {
                    return res.status(200).send({ success: true, msg: 'action not exist' })
                }
            })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// action list

const actionList = async (req, res) => {
    try {

        const userData = await Action.find();
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}
// delete Business
const deleteAction=async(req,res)=>{
    try{

        const id=req.query.id;
        await Action.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"action can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// update action
const updateAction=async(req,res)=>{
    try{

       const userData= await Action.findByIdAndUpdate({_id:req.params.id},{$set:
        { action: req.body.action
        }});
       res.status(200).send({sucess:true,msg:"sucessfully updated",action:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


// Add task

const addTask = async (req, res) => {
    try {
        const salesData = await Sales.find().exec();
        const selectedPhase = salesData.find((data) => data._id.equals(req.body.sales_phase));
        
        const task = new Task({
            subject: req.body.subject,
            add_task_for: req.body.add_task_for,
            set_task_priority: req.body.set_task_priority,
            reason_to_change_task_priority: req.body.reason_to_change_task_priority,
            estimated_date: req.body.estimated_date,
            reason_to_change_estimated_date: req.body.reason_to_change_estimated_date,
            contact_source: req.body.contact_source,
            selected_list: req.body.selected_list,
            business_opportunity: req.body.business_opportunity,
            sales_phase: req.body.sales_phase,
            action: req.body.action,
            action_date: req.body.action_date,
            remarks: req.body.remarks,
            assign_task_to: req.body.assign_task_to,
            budget: req.body.budget,
            client_firstName: req.body.client_firstName,
            client_lastName: req.body.client_lastName,
            client_contactNumber: req.body.client_contactNumber,
            client_email: req.body.client_email,
            level_of_urgency: req.body.level_of_urgency,
            lead_status:selectedPhase.name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
            task_status:req.body.task_status,
            task_completed:req.body.task_completed,
            // is_archive:(req.body.is_archive) ? req.body.is_archive : 0
            // is_completed:req.body.is_completed,
            // note:req.body.note,
            // reason_for_dealLost:req.body.reason_for_dealLost
        })
        const userData = await task.save().then(async (userData) => {
            const history = new TaskHistory({
                task_id: userData._id,
                sales_phase: userData.sales_phase,
                action: userData.action,
                action_date: userData.action_date,
                business_opportunity:userData.business_opportunity,
                remarks: userData.remarks,
                assign_task_to: userData.assign_task_to,
                budget: userData.budget,
                task_status: userData.task_status,
                client_firstName:userData.client_firstName,
                client_lastName:userData.client_lastName,
                client_contactNumber:userData.client_contactNumber,
                client_email:userData.client_email,
                level_of_urgency: userData.level_of_urgency,
                reason_for_dealLost: userData.reason_for_dealLost,
                lead_status:userData.lead_status,
                selected_list:userData.selected_list,
                // lead_status:selectedPhase.name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
                is_completed:req.body.is_completed,
                note:req.body.note,
                reason_for_dealLost:req.body.reason_for_dealLost,
                task_completed:userData.task_completed,
               
                // is_archive:userData.task.is_archive
            })
            const historyData = await history.save()
            return historyData
            
        }).then(async (historyData) => {
            if(historyData.sales_phase && req.body.add_task_for=='contact' && selectedPhase.name !=='Initial Contact')
            {
              const contactData = new ContactManagement({
               first_name:req.body.client_firstName,
               last_name:req.body.client_lastName,
               primary_contact_number:req.body.client_contactNumber,
               email:req.body.client_email,
               type:'contact'

            })
          
            const Data = await contactData.save()

        }else if(historyData.sales_phase && req.body.add_task_for=='lead' && selectedPhase.name !=='Initial Contact')
        {
            const leadData = new ContactManagement({
               first_name:req.body.client_firstName,
               last_name:req.body.client_lastName,
               primary_contact_number:req.body.client_contactNumber,
               email:req.body.client_email,
               type:'lead'

            })
           
            const Data = await leadData.save()
            
        }
        else if(historyData.sales_phase && req.body.add_task_for=='customer' && selectedPhase.name !=='Initial Contact')
        {
             const customerData = new ContactManagement({
               first_name:req.body.client_firstName,
               last_name:req.body.client_lastName,
               primary_contact_number:req.body.client_contactNumber,
               email:req.body.client_email,
               type:'customer'

            })
            const Data = await customerData.save()
        }
           
        })

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ success: false,msg: "contact data failed" })
        }
    }
    catch (error) {
        // console.log(error);
        res.status(400).send(error.message);
    }

}
const allTask=async(req,res)=>{
    try{

        const userData=await Task.find();

    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// add next action

const addnextAction=async(req,res)=>{
    try{
        const salesData = await Sales.find().exec();
        // console.log(salesData);
        const selectedPhase = salesData.find((data) => data._id.equals(req.body.sales_phase));
        const history = new TaskHistory({
                task_id: req.body._id,
                sales_phase: req.body.sales_phase,
                action: req.body.action,
                business_opportunity:req.body.business_opportunity,
                action_date:req.body.action_date,
                remarks: req.body.remarks,
                assign_task_to: req.body.assign_task_to,
                budget: req.body.budget,
                task_status: req.body.task_completed === '1' ? 3 : 2,
                level_of_urgency: req.body.level_of_urgency,
                reason_for_dealLost: req.body.reason_for_dealLost,
                lead_status:selectedPhase.name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
                is_completed:req.body.is_completed,
                selected_list: req.body.selected_list,
                next_action:1,
                note:req.body.note,
                reason_for_dealLost:req.body.reason_for_dealLost,
                task_completed:req.body.task_completed,
                client_firstName: req.body.client_firstName,
                client_lastName: req.body.client_lastName,
                client_contactNumber:req.body.client_contactNumber,
                client_email: req.body.client_email,
        })
        const updateAllHistoryData = await TaskHistory.updateMany({
            task_id: req.body._id
        }, {
        $set: {
            next_action: 0,
        }
        }).then(async (updateRes) =>{

            const historyData = await history.save().then(async (historyDetails) => {
                
               const task= await Task.findByIdAndUpdate(
                    {
                        _id: req.body._id
                    }, {
                    $set: {
                        sales_phase:req.body.sales_phase,
                        lead_status:selectedPhase.name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
                        task_status: req.body.task_completed === '1' ? 3 : 2,
                        task_completed: req.body.task_completed === '1' ? 1 : 0,
                        action: req.body.action,
                        action_date:req.body.action_date,
                        remarks: req.body.remarks,
                        assign_task_to: req.body.assign_task_to,
                        note:req.body.note,
                        reason_for_dealLost:req.body.reason_for_dealLost,
                        budget: req.body.budget,
                        level_of_urgency: req.body.level_of_urgency,
                        client_firstName: req.body.client_firstName,
                        client_lastName: req.body.client_lastName,
                        client_contactNumber: req.body.client_contactNumber,
                        client_email: req.body.client_email,
                       
                    }
                })
                const taskData = await task.save();
                return historyDetails;
            })

            return historyData;
        })

            if(updateAllHistoryData)
            {   
                res.status(200).send({success:true,data:updateAllHistoryData,msg:"Data save successfully."})
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
// task list

const taskList = async (req, res) => {

    try {
        console.log(req.query);
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;


        var search = '';
        if (req.query.search) {
            search = req.query.search
        }
        var priorityFilter=[];
        var taskstatusFilters=[];
        var actionFilters=[];
        var businessFilters=[];
        var salesFilters=[];

        if(req.query.priorityFilter){
            priorityFilter=req.query.priorityFilter.split(',');            
        }
        if(req.query.taskstatusFilters){
            taskstatusFilters=req.query.taskstatusFilters.split(',');            
        }
        if(req.query.actionFilters){
            actionFilters=req.query.actionFilters.split(',');            
        }
        if(req.query.businessFilters){
            businessFilters=req.query.businessFilters.split(',');            
        }
        if(req.query.salesFilters){
            salesFilters=req.query.salesFilters.split(',');            
        }
        

        const query = {};

    
        if (priorityFilter.length > 0) {
            query.set_task_priority = { $in: priorityFilter }
        } 
        
        if (taskstatusFilters.length > 0) {
            query.task_status = { $in: taskstatusFilters }
        } 
        
        if (actionFilters.length > 0) {
            query.action = { $in: actionFilters }
        } 
        if (businessFilters.length > 0) {
            query.business_opportunity = { $in: businessFilters }
        }
        if (salesFilters.length > 0) {
            query.sales_phase = { $in: salesFilters }
        } 

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Task.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await Task.countDocuments().exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }

        //  const query = {};
         if (req.query.is_archive) {
            query.is_archive = req.query.is_archive
        } 

        var actionDateFilter = '';
        var estimationDateFilters = '';
        var fromDate = '';
        var toDate = '';
        if (req.query.actionDateFilters) {
            const today = new Date();
            // today.setHours(0, 0, 0, 0);
            actionDateFilter = req.query.actionDateFilters;
            if(actionDateFilter == 'Today'){
                query.action_date = { $eq: today.toISOString() }
            }
            if(actionDateFilter == 'This Week'){
                const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Calculate the start of the current week
                const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // Calculate the end of the current week
                query.action_date = { $gte: startOfWeek.toISOString(), $lt: endOfWeek.toISOString() }
            }
            if(actionDateFilter == 'This Month'){
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Calculate the start of the current month
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Calculate the end of the current month
                query.action_date = { $gte: startOfMonth.toISOString(), $lt: endOfMonth.toISOString() }
            }
            if(actionDateFilter == 'Custom Range' && req.query.fromDate && req.query.toDate){
                const fromDate = new Date(req.query.fromDate);
                const toDate = new Date(req.query.toDate);
                query.action_date = { $gte: fromDate.toISOString(), $lt: toDate.toISOString() }
            }
        }
        if (req.query.estimationDateFilter) {
            const today = new Date();
            // today.setHours(0, 0, 0, 0);
            estimationDateFilters = req.query.estimationDateFilter;
            if(estimationDateFilters == 'Today'){
                query.estimated_date = { $eq: today.toISOString() }
            }
            if(estimationDateFilters == 'This Week'){
                const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Calculate the start of the current week
                const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // Calculate the end of the current week
                query.estimated_date = { $gte: startOfWeek.toISOString(), $lt: endOfWeek.toISOString() }
            }
            if(estimationDateFilters == 'This Month'){
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Calculate the start of the current month
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Calculate the end of the current month
                query.estimated_date = { $gte: startOfMonth.toISOString(), $lt: endOfMonth.toISOString() }
            }
            if(estimationDateFilters == 'Custom Range' && req.query.fromDate && req.query.toDate){
                const fromDate = new Date(req.query.fromDate);
                const toDate = new Date(req.query.toDate);
                query.estimated_date = { $gte: fromDate.toISOString(), $lt: toDate.toISOString() }
            }
        }
        // console.log(query);

        result.data = await Task.find(query)
            .populate('contact_source action business_opportunity sales_phase')
            .populate({

                path: "assign_task_to",
                model: "Tbl_Staff",

            })

            .find({
                $or: [
                    { subject: { $regex: '.*' + search + '.*', $options: 'i' } },
                   
                ]
            })
            .find(query)
            .sort(sortObject)
            .skip(startIndex)
            .limit(limit)
            .exec();
       

        //     .exec();
       
        const list = await Promise.all(result.data.map(async (data) => {
            // console.log('data', data);
            let query;
            if (data && data.add_task_for && data.add_task_for === 'customer') {
                query = ContactManagement.find({ _id: data.selected_list }).populate('service_offered group')
            }
            if (data && data.add_task_for && data.add_task_for === 'contact') {
                query = ContactManagement.find({ _id: data.selected_list }).populate('group')
            }
            if (data && data.add_task_for && data.add_task_for === 'lead') {
                query = ContactManagement.find({ _id: data.selected_list }).populate('business_opportunity group')
            }

            // console.log('query', query);
            let taskHistory = await TaskHistory.find({task_id:data._id})
            

            let selected_list = query ? query.exec() : [];
            const { _doc: _result } = data;
            // console.log(_result);

           
           
            return {
                ..._result,
                
                taskHistory,
                // task_status:taskHistory[0].task_status,
                action: _result.action[0].action,
                assign_task_to: {
                    ..._result.assign_task_to,
                    fullName: _result.assign_task_to.first_name + ' ' + _result.assign_task_to.last_name
                },
                sales_phase:(_result.sales_phase && _result.sales_phase.length > 0) ? _result.sales_phase[0].name : {},
                selected_list: selected_list && selected_list.length > 0 ? selected_list[0] : {},
               
            }

        }))

        const newData = await Task.find({task_status:1}).countDocuments();
        const progressData = await Task.find({task_status:2}).countDocuments();
        const completeData = await Task.find({task_status:3}).countDocuments();
        
        result.rowsPerPage = limit;
        return res.send({ msg: "Posts Fetched successfully", data: { ...result, data: list, newData:newData, progressData:progressData,
            completeData:completeData} });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// delete task
const deleteTask = async (req, res) => {
    try {

        const id = req.query.id;
        await Task.deleteOne({ _id: id });
        await TaskHistory.deleteMany({task_id:id})
        res.status(200).send({ success: true, msg: "Task can be deleted" })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}
// edit task

const editTask = async (req, res) => {
    try {
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        const id = req.query.id;
        const userData = await Task.findById({ _id: id }).populate('contact_source action business_opportunity sales_phase selected_list')
            .populate({

                path: "assign_task_to",
                model: "Tbl_Staff",

            })
            // console.log(sortObject);
        const taskHistory = await TaskHistory.find({
            task_id: id,
            
        }).populate('sales_phase action assign_task_to')
        .sort(sortObject)
            .exec();
        let { _doc: userDetails } = userData;
        // console.log(userDetails)
        const taskList = {
            ...userDetails,
            taskHistory
        }

        return res.send({
            msg: " fetch data successfully",
            task: taskList,
        });

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
// update task
const updateTask = async (req, res) => {
    try {
        const salesData = await Sales.find().exec();
        // console.log(salesData);
        const selectedPhase = salesData.find((data) => data._id.equals(req.body.sales_phase));
        let _promise = Promise.resolve();
        _promise.then(async () => {
            await Task.findByIdAndUpdate(
                {
                    _id: req.params.id
                }, {
                $set: {
                    subject: req.body.subject,
                    add_task_for: req.body.add_task_for,
                    set_task_priority: req.body.set_task_priority,
                    reason_to_change_task_priority: req.body.reason_to_change_task_priority,
                    estimated_date: req.body.estimated_date,
                    reason_to_change_estimated_date: req.body.reason_to_change_estimated_date,
                    contact_source: req.body.contact_source,
                    selected_list: req.body.selected_list,
                    business_opportunity: req.body.business_opportunity,
                    sales_phase: req.body.sales_phase,
                    action: req.body.action,
                    action_date: req.body.action_date,
                    remarks: req.body.remarks,
                    assign_task_to: req.body.assign_task_to,
                    // lead_status:selectedPhase.name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
                    budget: req.body.budget,
                    client_firstName: req.body.client_firstName,
                    client_lastName: req.body.client_lastName,
                    client_contactNumber: req.body.client_contactNumber,
                    client_email: req.body.client_email,
                    level_of_urgency: req.body.level_of_urgency,
                    // task_status:req.body.task_status,
                    // is_completed:req.body.is_completed,
                    // note:req.body.note,
                    // reason_for_dealLost:req.body.reason_for_dealLost
                }
            })

            const userData = await Task.find(
                {
                    _id: req.params.id
                }
            )
            return userData;
        }).then(async ([userData]) => {
            console.log(userData);
            // Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
            //     console.log( post );
            //   });
            await TaskHistory.findOneAndUpdate(
                { "task_id": req.params.id },
               
               {
                        sales_phase: userData.sales_phase,
                        action: userData.action, 
                        action_date: userData.action_date, 
                        remarks: userData.remarks,
                        assign_task_to: userData.assign_task_to, 
                        budget: userData.budget,
                        level_of_urgency: userData.level_of_urgency,
                        lead_status:userData.lead_status, 
                        business_opportunity: userData.business_opportunity,
                        // task_status:userData.task_status,
                        is_completed:req.body.is_completed,
                        note:req.body.note,
                        reason_for_dealLost: req.body.reason_for_dealLost,
                        next_action:req.body.next_action,
                        budget: req.body.budget,
                        client_firstName: userData.client_firstName,
                        client_lastName: userData.client_lastName,
                        client_contactNumber: userData.client_contactNumber,
                        client_email: userData.client_email,
                        level_of_urgency: userData.level_of_urgency,
                      
                    },
                    {sort: { 'action_date' : -1 }}
                );
            const updateHistory = await TaskHistory.find(
                { task_id: req.params.id }
            )
            console.log(updateHistory);
            return {
                userData,
                updateHistory
            }
        }).then((data) => {
            res.send({
                msg: " update data successfully",
                data
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                msg: 'data not updated',
                err: err
            });
        })

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// add note
const updateNote = async (req, res) => {
    try {
        let _promise = Promise.resolve();
        _promise.then(async () => {
            await TaskHistory.findOneAndUpdate(
                { "_id": req.body.task_history_id },               
                {
                    note:req.body.note,
                    is_completed:req.body.is_completed,
                  
                },
                {sort: { 'action_date' : -1 }}
            );
            const updateHistory = await TaskHistory.find(
                { task_id: req.params.id }
            );
            console.log(updateHistory);
            return {
                // userData,
                updateHistory
            }
        }).then((data) => {
            res.send({
                msg: " update data successfully",
                data
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                msg: 'data not updated',
                err: err
            });
        })

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// // edit Indivisual

const editTaskInfo=async(req,res)=>{
    // console.log(req);
    try{

   
    const userData= await TaskHistory.findByIdAndUpdate({_id:req.params.id},
        {$set:
            {
                sales_phase:req.body.sales_phase,
                 action:req.body.action,
                 action_date:req.body.action_date,
                 remarks:req.body.remarks,
                 assign_task_to:req.body.assign_task_to,
                 reason_for_dealLost:req.body.reason_for_dealLost,
                 budget: req.body.budget,
                 client_firstName: req.body.client_firstName,
                 client_lastName: req.body.client_lastName,
                 client_contactNumber: req.body.client_contactNumber,
                 client_email: req.body.client_email,
                 level_of_urgency: req.body.level_of_urgency,
       }}).then(async (updateRes) =>{
            
           const task= await Task.findByIdAndUpdate(
                {
                    _id:updateRes.task_id
                }, {
                $set: {
                   
                    sales_phase:req.body.sales_phase,
                    action:req.body.action,
                    action_date:req.body.action_date,
                    remarks:req.body.remarks,
                    assign_task_to:req.body.assign_task_to,
                    budget: req.body.budget,
                    client_firstName: req.body.client_firstName,
                    client_lastName: req.body.client_lastName,
                    client_contactNumber: req.body.client_contactNumber,
                    client_email: req.body.client_email,
                    level_of_urgency: req.body.level_of_urgency,
                   
                   
                }
            })
        })
       res.status(200).send({sucess:true,msg:"sucessfully updated",task:userData})
    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update individual
const updateIndivisual=async(req,res)=>{
    try{

       const userData= await TaskHistory.findByIdAndUpdate({_id:req.params.id,},
        {$set:
            {
                sales_phase:req.body.sales_phase,
                 action:req.body.action,
                 action_date:req.body.action_date,
                 remarks:req.body.remarks,
                 assign_task_to:req.body.assign_task_to,
                 reason_for_dealLost:req.body.reason_for_dealLost,
                 
       }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",task:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// export message data
const exportTask=async(req,res)=>{
    try{
      
      
          const userData=await Task.find()
       
      
          try {
            
                res.status(200).send({ msg: "User task Data", data: userData});
         
        
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

  const getTaskHistoryByID=async(req,res)=>{
    try{

        const id=req.query.id;
        const taskHistoryData=await TaskHistory.findById({_id:id}).populate('sales_phase action assign_task_to');
 
        if(taskHistoryData){ 
         res.status(200).send({success:true,data:taskHistoryData}) 
        }
        else{        
         res.status(200).send({success:false})
        } 
     }
     catch(error){
         res.status(400).send(error.message);
     }
}

// send invoice data
const sendInvoiceData=async(req,res)=>{
    try{
        console.log(req.body, req.file, 'abc');

        const email = req.body.recipient.split(",");
        console.log(email);
        const transporter= nodemailer.createTransport({
            service:'gmail',
            requireTLS:true,
            auth:{
                user:'balodepriyanka0@gmail.com',
                pass:'fpoaokmqbvgkgflt'
            },            
        });

        const attachment = {
            filename: req.file.filename,
            content: fs.createReadStream(req.file.path)
        };
        
        const mailOptions={
            from:'balodepriyanka0@gmail.com',
            to: email,
            subject: 'Invoice',
            text: 'Please find the invoice attachment.',
            attachments: [attachment]
        }

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
                res.status(200).send({success:false, message: "Invoice sending failed"})
            }else{
                let _promise = Promise.resolve();
                _promise.then(async () => {
                    await TaskHistory.findOneAndUpdate(
                        { "_id": req.body.task_history_id },               
                        {
                            invoice_file:(Object.keys(req.file).length > 0) ? req.file.filename : null
                        },
                        {sort: { 'action_date' : -1 }}
                    );
                    
                    const updateHistory = await TaskHistory.find(
                        { _id: req.body.task_history_id }
                    );
                    console.log(updateHistory);
                    return {
                        // userData,
                        updateHistory
                    }

                }).then((data) => {
                    res.status(200).send({success:true, message: "Invoice send successfully",data:data}) 
                }).catch(err => {
                    console.log(err);
                    res.status(200).send({success:false, message: "Invoice sending failed"})
                })
            }
        });
     }
     catch(error){
         res.status(400).send(error.message);
     }
}

// send quotation data
const sendQuotationData=async(req,res)=>{
    try{
        console.log(req.body, req.file, 'abc');

        const email = req.body.recipient.split(",");
        console.log(email);
        const transporter= nodemailer.createTransport({
            service:'gmail',
            requireTLS:true,
            auth:{
                user:'balodepriyanka0@gmail.com',
                pass:'fpoaokmqbvgkgflt'
            },            
        });

        const attachment = {
            filename: req.file.filename,
            content: fs.createReadStream(req.file.path)
        };
        
        const mailOptions={
            from:'balodepriyanka0@gmail.com',
            to: email,
            subject: 'Quotation',
            text: 'Please find the Quotation attachment.',
            attachments: [attachment]
        }

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
                res.status(200).send({success:false, message: "Quotation sending failed"})
            }else{
                let _promise = Promise.resolve();
                _promise.then(async () => {
                    await TaskHistory.findOneAndUpdate(
                        { "_id": req.body.task_history_id },               
                        {
                            quotation_file:(Object.keys(req.file).length > 0) ? req.file.filename : null
                        },
                        {sort: { 'action_date' : -1 }}
                    );
                    
                    const updateHistory = await TaskHistory.find(
                        { _id: req.body.task_history_id }
                    );
                    console.log(updateHistory);
                    return {
                        // userData,
                        updateHistory
                    }

                }).then((data) => {
                    res.status(200).send({success:true, message: "Quotation send successfully",data:data}) 
                }).catch(err => {
                    console.log(err);
                    res.status(200).send({success:false, message: "Quotation sending failed"})
                })
            }
        });
     }
     catch(error){
         res.status(400).send(error.message);
     }
}
// task archive unarchive
const updateTaskArchiveUnarchive=async(req,res)=>{
    try{

       const userData= await Task.findByIdAndUpdate({_id:req.params.id},
        {$set:{
            is_archive:req.body.is_archive
        }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",updateData:userData})
    }
    catch(error){        
        res.status(400).send(error.message);
    }
}

module.exports = {
    contactSource,
    sourceList,
    salesPhase,
    salesList,
    addAction,
    actionList,
    addTask,
    actionExist,
    taskList,
    editTask,
    updateTask,
    deleteTask,
    editSales,
    addnextAction,
    editTaskInfo,
    // editIndivisual,
    updateIndivisual,
    updateNote,
    deleteAction,
    updateAction,
    updateSales,
    allTask,
    exportTask,
    getTaskHistoryByID,
    sendInvoiceData,
    sendQuotationData,
    updateTaskArchiveUnarchive
}


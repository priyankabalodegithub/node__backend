const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history');
const Source=require('../models/tbl_contactSource');
const DealLost=require('../models/tbl_dealLostReason');
const Sales = require('../models/tbl_salesPhase');
const Action = require('../models/tbl_taskAction');
const Staff=require('../models/tbl_staff');
const BusinessOpportunity=require('../models/tbl_business_opportunities');

// contact source graph

const contactSourceGraph=async(req,res)=>{
    try{
        const sourceData =await Source.find();
        const allData = sourceData.map(async({_id, name}) => {
            const data =  await Task.find({contact_source: _id});

            return {
                name,
                count: data?.length
            }
        })
         
        Promise.all(allData).then((data) => {
            var tot=0
            for(i=0;i<data.length;i++){
                var count=data[i].count
                tot=tot+count
            }
           
            res.status(200).send({success:true,data:data,tot:tot});
        })
       

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// audiance behavior pattern graph

const audiencePattern=async(req,res)=>{
    try{
        const audienceData =await DealLost.find();
        const allData = audienceData.map(async({_id, dealLostReason}) => {
            const data =  await TaskHistory.find({reason_for_dealLost: dealLostReason});

            return {
                dealLostReason,
                count: data?.length
            }
        })
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
      

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}



// sales overview

const salesoverview=async(req,res)=>{
    try{
        const query = {};
       
        var businessFilters=[];
        var staffFilters=[];
       
        if(req.query.businessFilters && req.query.businessFilters != "null"){
            businessFilters=req.query.businessFilters.split(',');   
        }
        if(req.query.staffFilters && req.query.staffFilters != "null" ){
            staffFilters=req.query.staffFilters.split(',');   
                
        }
        if (businessFilters.length > 0 && req.query.businessFilters != "null") {
            query.business_opportunity = { $in: businessFilters }
        }
        if (staffFilters.length > 0 && req.query.staffFilters != "null") {
            query.assign_task_to = { $in: staffFilters }
        }   

        const salesData =await Sales.find();
       if(req.query.businessFilters===''&& (req.query.staffFilters===''||req.query.staffFilters==='undefined'||req.query.staffFilters==='null')){
        const allData = salesData.map(async({_id, name}) => {
            const data =  await Task.find({sales_phase: _id});
            return {
                name,
                count: data?.length,
               
            }
        })
    
        const totcoldData=await Task.find({lead_status:1}).countDocuments();
        const completecoldData=await Task.find({lead_status:1,task_completed:1}).countDocuments();;
        const coldAvarage= completecoldData>0 && totcoldData>0 ? (completecoldData/totcoldData)*100:0;

        const totwarmData=await Task.find({lead_status:2}).countDocuments();
        const completewarmData=await Task.find({lead_status:2,task_completed:1}).countDocuments();
        const warmAvarage=completewarmData>0 && totwarmData>0 ? (completewarmData/totwarmData)*100:0;

        const tothotData=await Task.find({lead_status:3}).countDocuments();
        const completehotData=await Task.find({lead_status:3,task_completed:1}).countDocuments();
        const hotAvarage= completehotData>0 && tothotData>0 ?(completehotData/tothotData)*100:0;
    
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data,cold:coldAvarage,warm:warmAvarage,hot:hotAvarage,totCold:totcoldData,
            totWarm:totwarmData,totHot:tothotData});
        })
    
    }else if(req.query.staffFilters===''|| req.query.staffFilters==='undefined'||req.query.staffFilters==='null'){
        const allData = salesData.map(async({_id, name}) => {
            const data =  await Task.find({sales_phase: _id,business_opportunity:query.business_opportunity});
            return {
                name,
                count: data?.length,
               
            }
        })
    
        const totcoldData=await Task.find({lead_status:1,business_opportunity:query.business_opportunity}).countDocuments();
        const completecoldData=await Task.find({lead_status:1,task_completed:1,business_opportunity:query.business_opportunity}).countDocuments();;
        const coldAvarage= completecoldData>0 && totcoldData>0 ? (completecoldData/totcoldData)*100:0;

        const totwarmData=await Task.find({lead_status:2,business_opportunity:query.business_opportunity}).countDocuments();
        const completewarmData=await Task.find({lead_status:2,task_completed:1,business_opportunity:query.business_opportunity}).countDocuments();
        const warmAvarage=completewarmData>0 && totwarmData>0 ? (completewarmData/totwarmData)*100:0;

        const tothotData=await Task.find({lead_status:3,business_opportunity:query.business_opportunity}).countDocuments();
        const completehotData=await Task.find({lead_status:3,task_completed:1,business_opportunity:query.business_opportunity}).countDocuments();
        const hotAvarage= completehotData>0 && tothotData>0 ?(completehotData/tothotData)*100:0;
    
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data,cold:coldAvarage,warm:warmAvarage,hot:hotAvarage,totCold:totcoldData,
            totWarm:totwarmData,totHot:tothotData});
        })
    }else if((req.query.businessFilters===''||req.query.businessFilters==='undefined'||req.query.businessFilters==='null')){

        const allData = salesData.map(async({_id, name}) => {
            const data =  await Task.find({sales_phase: _id,assign_task_to:query.assign_task_to});
            return {
                name,
                count: data?.length,
               
            }
        })
    
        const totcoldData=await Task.find({lead_status:1,assign_task_to:query.assign_task_to}).countDocuments();
        const completecoldData=await Task.find({lead_status:1,task_completed:1,assign_task_to:query.assign_task_to}).countDocuments();;
        const coldAvarage= completecoldData>0 && totcoldData>0 ? (completecoldData/totcoldData)*100:0;

        const totwarmData=await Task.find({lead_status:2,assign_task_to:query.assign_task_to}).countDocuments();
        const completewarmData=await Task.find({lead_status:2,task_completed:1,assign_task_to:query.assign_task_to}).countDocuments();
        const warmAvarage=completewarmData>0 && totwarmData>0 ? (completewarmData/totwarmData)*100:0;

        const tothotData=await Task.find({lead_status:3,assign_task_to:query.assign_task_to}).countDocuments();
        const completehotData=await Task.find({lead_status:3,task_completed:1,assign_task_to:query.assign_task_to}).countDocuments();
        const hotAvarage= completehotData>0 && tothotData>0 ?(completehotData/tothotData)*100:0;
    
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data,cold:coldAvarage,warm:warmAvarage,hot:hotAvarage,totCold:totcoldData,
            totWarm:totwarmData,totHot:tothotData});
        })
    }else if((req.query.staffFilters!==''|| req.query.staffFilters!=='undefined'||req.query.staffFilters!=='null')&&(req.query.staffFilters!==''|| req.query.staffFilters!=='undefined'||req.query.staffFilters!=='null')){
        const allData = salesData.map(async({_id, name}) => {
            const data =  await Task.find({sales_phase: _id,business_opportunity:query.business_opportunity,assign_task_to:query.assign_task_to});
            return {
                name,
                count: data?.length,
               
            }
        })
    
        const totcoldData=await Task.find({lead_status:1,assign_task_to:query.assign_task_to,business_opportunity:query.business_opportunity}).countDocuments();
        const completecoldData=await Task.find({lead_status:1,task_completed:1,assign_task_to:query.assign_task_to,business_opportunity:query.business_opportunity}).countDocuments();;
        const coldAvarage= completecoldData>0 && totcoldData>0 ? (completecoldData/totcoldData)*100:0;

        const totwarmData=await Task.find({lead_status:2,assign_task_to:query.assign_task_to,business_opportunity:query.business_opportunity}).countDocuments();
        const completewarmData=await Task.find({lead_status:2,task_completed:1,assign_task_to:query.assign_task_to,business_opportunity:query.business_opportunity}).countDocuments();
        const warmAvarage=completewarmData>0 && totwarmData>0 ? (completewarmData/totwarmData)*100:0;

        const tothotData=await Task.find({lead_status:3,assign_task_to:query.assign_task_to,business_opportunity:query.business_opportunity}).countDocuments();
        const completehotData=await Task.find({lead_status:3,task_completed:1,assign_task_to:query.assign_task_to,business_opportunity:query.business_opportunity}).countDocuments();
        const hotAvarage= completehotData>0 && tothotData>0 ?(completehotData/tothotData)*100:0;
    
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data,cold:coldAvarage,warm:warmAvarage,hot:hotAvarage,totCold:totcoldData,
            totWarm:totwarmData,totHot:tothotData});
        })
    }

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// task overview
const taskOverview=async(req,res)=>{
    try{
        const actionData =await Action.find();
        
        const query = {};
       
        var businessFilters=[];
        var staffFilters=[];
        if(req.query.businessFilters && req.query.businessFilters != "null"){
            businessFilters=req.query.businessFilters.split(',');   
                
        }
        if(req.query.staffFilters && req.query.staffFilters != "null" ){
            staffFilters=req.query.staffFilters.split(',');   
                
        }
        if (businessFilters.length > 0 && req.query.businessFilters != "null") {
            query.business_opportunity = { $in: businessFilters }
        }  
        if (staffFilters.length > 0 && req.query.staffFilters != "null") {
            query.assign_task_to = { $in: staffFilters }
        }    
        
      if(req.query.businessFilters==''&& req.query.staffFilters==''){
        const allData = actionData.map(async({_id, action}) => {
            const New =  await TaskHistory.find({action: _id,task_status:1,is_completed:0,});
            const progress =  await TaskHistory.find({action: _id,task_status:2,is_completed:0,});
            const completed =  await TaskHistory.find({action: _id,task_status:3,is_completed:0,task_completed:1,});

            return {
               New:{
                name:action,
                count: New?.length
                },
                Progress:{
                    name:action,
                    count:progress?.length
                },
                completed:{
                    name:action,
                    count:completed?.length

                },
                
            }
        })
       
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
    }else  if(req.query.staffFilters===''){
       
            const allData = actionData.map(async({_id, action}) => {
                const New =  await TaskHistory.find({action: _id,task_status:1,is_completed:0,business_opportunity:query.business_opportunity});
                const progress =  await TaskHistory.find({action: _id,task_status:2,is_completed:0,business_opportunity:query.business_opportunity});
                const completed =  await TaskHistory.find({action: _id,task_status:3,is_completed:0,task_completed:1,business_opportunity:query.business_opportunity});
    
                return {
                   New:{
                    name:action,
                    count: New?.length
                    },
                    Progress:{
                        name:action,
                        count:progress?.length
                    },
                    completed:{
                        name:action,
                        count:completed?.length
    
                    },
                    
                }
            })
           
            Promise.all(allData).then((data) => {
                res.status(200).send({success:true,data:data});
            })
        
          
    }else if(req.query.businessFilters===''){
        const allData = actionData.map(async({_id, action}) => {
            const New =  await TaskHistory.find({action: _id,task_status:1,is_completed:0,assign_task_to:query.assign_task_to});
            const progress =  await TaskHistory.find({action: _id,task_status:2,is_completed:0,assign_task_to:query.assign_task_to});
            const completed =  await TaskHistory.find({action: _id,task_status:3,is_completed:0,task_completed:1,assign_task_to:query.assign_task_to});

            return {
               New:{
                name:action,
                count: New?.length
                },
                Progress:{
                    name:action,
                    count:progress?.length
                },
                completed:{
                    name:action,
                    count:completed?.length

                },
                
            }
        })
       
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
    
    }else if(req.query.businessFilters!=''&& req.query.staffFilters!=''){
        const allData = actionData.map(async({_id, action}) => {
            const New =  await TaskHistory.find({action: _id,task_status:1,is_completed:0,business_opportunity:query.business_opportunity,assign_task_to:query.assign_task_to});
            const progress =  await TaskHistory.find({action: _id,task_status:2,is_completed:0,business_opportunity:query.business_opportunity,assign_task_to:query.assign_task_to});
            const completed =  await TaskHistory.find({action: _id,task_status:3,is_completed:0,task_completed:1,business_opportunity:query.business_opportunity,assign_task_to:query.assign_task_to});

            return {
               New:{
                name:action,
                count: New?.length
                },
                Progress:{
                    name:action,
                    count:progress?.length
                },
                completed:{
                    name:action,
                    count:completed?.length

                },
                
            }
        })
       
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
    
    }
      
      

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}
// lead conversion rate

const leadConversion=async(req,res)=>{
    try{
        console.log(req.query);
        // if (req.query.search) {
        // {_id: '642ac1ac1076a151c761e9ae'}
        let query = {};
        if(req.query.staff_id){
            query._id = req.query.staff_id;
        }
        console.log(query);
        const staffData = await Staff.find(query);
        const allData = staffData.map(async({_id, first_name, last_name}) => {
            const task_query = {};
            var businessFilters=[];
            if(req.query.business_filters && req.query.business_filters != "null"){
                businessFilters=req.query.business_filters.split(',');
                // console.log(businessFilters);
                if (businessFilters.length > 0) {
                    task_query.business_opportunity = { $in: businessFilters }
                } 
            }
            
            if(req.query.start_date && req.query.end_date){
                task_query.createdAt = {$gte: req.query.start_date, $lte: req.query.end_date };
            }
            console.log("task_query", task_query);
            let totalTasks = await Task.find(task_query).countDocuments({ assign_task_to: _id });
            let taskCount = 0;
            if(req.query.conversation_for){
                if(req.query.conversation_for == 'top-five'){
                    taskCount = await Task.find(task_query).countDocuments({ assign_task_to: _id, task_status: 3, task_completed: 1 });
                }else{
                    taskCount = await Task.find(task_query).countDocuments({ assign_task_to: _id, task_completed: 0 });
                }
            }

            let conversionRate = (taskCount / totalTasks) * 100;
            conversionRate = (conversionRate) ? Math.round(conversionRate.toFixed(2)) : 0;
            let fullName = first_name +" "+last_name;
            let rating = 0;
            if(conversionRate >= 1 && conversionRate <=20){
                rating = 1;
            }else if(conversionRate > 20 && conversionRate <=40){
                rating = 2;
            }else if(conversionRate > 40 && conversionRate <=60){
                rating = 3;
            }else if(conversionRate > 60 && conversionRate <=80){
                rating = 4;
            }else if(conversionRate > 80 && conversionRate <=100){
                rating = 5;
            }

            return { fullName, conversionRate, rating, totalTasks, taskCount };
        });

        Promise.all(allData).then((data) => {
            const filteredArray = data.filter(value => value.conversionRate > 0);
            // console.log(filteredArray);

            const sortedArray = filteredArray.sort((a, b) => b.conversionRate - a.conversionRate);

            let topFive = sortedArray.slice(0, 5);

            // topFive = topFive.sort( function ( a, b ) { return b.conversionRate - a.conversionRate; } );
            res.status(200).send({success:true,data:topFive});
        })
    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// STAFF PERFORMANCE
const satffPerformanceGraph=async(req,res)=>{
    try{
        let query = {};
        let business_query = {};
        if(req.query.staff_id){
            query._id = req.query.staff_id;
        }
        
        const staffData = await Staff.find(query);
        const allData = staffData.map(async({_id, first_name, last_name}) => {
            const task_query = {};
            var businessFilters=[];
            if(req.query.business_filters && req.query.business_filters != "null"){
                businessFilters=req.query.business_filters.split(',');
                if (businessFilters.length > 0) {
                    task_query.business_opportunity = { $in: businessFilters }
                } 
            }
            
            if(req.query.start_date && req.query.end_date){
                task_query.createdAt = {$gte: req.query.start_date, $lte: req.query.end_date };
            }

            let totalTasks = await Task.find(task_query).countDocuments({ assign_task_to: _id });
            let completedTaskCount = await Task.find(task_query).countDocuments({ assign_task_to: _id, task_status: 3, task_completed: 1 });
            
            return { totalTasks, completedTaskCount };
        });

        const allPromise = await Promise.all(allData);
        // console.log('allPromise', allPromise);
        let totalTasks = 0;
        let completedTaskCount = 0;

        allPromise.forEach(value => {
            totalTasks += value.totalTasks;
            completedTaskCount += value.completedTaskCount;
        });
        
        let conversionRate = (completedTaskCount / totalTasks) * 100;
        conversionRate = (conversionRate) ? Math.round(conversionRate.toFixed(2)) : 0;

        var businessFilters=[];
        if(req.query.business_filters && req.query.business_filters != "null"){
            businessFilters=req.query.business_filters.split(',');
            if (businessFilters.length > 0) {
                business_query._id = { $in: businessFilters }
            } 
        }
        
        const businessOpportunityData = await BusinessOpportunity.find(business_query);
        const allBusinessOpportunityData = businessOpportunityData.map(async({_id, title}) => {
            const task_query = {};
            
            task_query.business_opportunity = { $in: _id }

            if(req.query.staff_id){
                task_query.assign_task_to =  req.query.staff_id;
            }
            console.log(task_query);
            let totalTasks = await Task.find(task_query).countDocuments();
            // let completedTaskCount = await Task.find(task_query).countDocuments({ assign_task_to: _id, task_status: 3, task_completed: 1 });
            
            const name = title;
            const y = 17000 * totalTasks;
            const z = 92;
            return { _id, name, y, z, totalTasks };
        });

        const seriesData = await Promise.all(allBusinessOpportunityData);
        console.log('allBusinessOpportunityPromise', seriesData);
        const staffPerformanceOptions = [
                {
                    minPointSize: 10,
                    innerSize: '20%',
                    zMin: 0,
                    name: 'business Opportunity',
                    data: seriesData
                }
            ];
        
        let response = { conversionRate, staffPerformanceOptions }
        res.status(200).send({success:true,data:response});
    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

module.exports={
 contactSourceGraph,
 audiencePattern,
 salesoverview,
 taskOverview,
 leadConversion,
 satffPerformanceGraph
   
}
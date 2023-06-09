const express=require('express');
const dashboard_route=express();
const session=require('express-session');

const config=require('../config/config');

dashboard_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
dashboard_route.use(bodyParser.json());
dashboard_route.use(bodyParser.urlencoded({extended:true}));


const dashboardController=require('../controllers/dashboardController');
const jwtHelper=require('../config/jwtHelper')

// business opportunity route
dashboard_route.get('/contact-graph',dashboardController.contactSourceGraph);
dashboard_route.get('/audience-graph',dashboardController.audiencePattern);
dashboard_route.get('/sales-graph',dashboardController.salesoverview);
dashboard_route.get('/task-graph',dashboardController.taskOverview);
dashboard_route.get('/lead-conversion',dashboardController.leadConversion);
dashboard_route.get('/staff-performance',dashboardController.satffPerformanceGraph);

dashboard_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=dashboard_route;
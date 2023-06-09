const express=require('express');
const service_route=express();
const session=require('express-session');

const paginate=require('jw-paginate')
const config=require('../config/config');

service_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
service_route.use(bodyParser.json());
service_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

service_route.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'),function(error,success){
            if(error) throw error
        });
    },

    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name,function(error1,success1){
            if(error1) throw error1
        })
    }
});

const upload=multer({storage:storage});


const serviceController=require('../controllers/serviceController');
// const auth=require("../middleware/auth")
const jwtHelper=require('../config/jwtHelper')

// service Offered route
service_route.post('/add_service',serviceController.serviceOffered);
service_route.get('/service-list',serviceController.serviceList);
service_route.get('/delete-service',serviceController.deleteService);
service_route.get('/edit-service',serviceController.editserviceLoad);
service_route.put('/edit-service/:id',serviceController.updateService);
service_route.get('/exist-service',serviceController.serviceExist);

service_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=service_route;
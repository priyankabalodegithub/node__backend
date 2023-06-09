const express=require('express');
const business_route=express();
const session=require('express-session');

const paginate=require('jw-paginate')
const config=require('../config/config');

business_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
business_route.use(bodyParser.json());
business_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

business_route.use(express.static('public'));

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


const businessController=require('../controllers/businessController');
const jwtHelper=require('../config/jwtHelper')

// business opportunity route
business_route.post('/add_business',businessController.businessOpportunity);
business_route.get('/business-list',businessController.businessList);
business_route.get('/delete-business',businessController.deleteBusiness);
business_route.get('/edit-business',businessController.editBusinessLoad);
business_route.put('/edit-business/:id',businessController.updateBusiness);
business_route.get('/exist-business',businessController.businessExist);

business_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=business_route;
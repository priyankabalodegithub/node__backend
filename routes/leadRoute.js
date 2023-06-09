const express=require('express');
const lead_route=express();
const session=require('express-session');

const paginate=require('jw-paginate')
const config=require('../config/config');

lead_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
lead_route.use(bodyParser.json());
lead_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

lead_route.use(express.static(path.resolve(__dirname,'public')));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads')
    },

    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});

const upload=multer({storage:storage});


const leadController=require('../controllers/leadController');
// const auth=require("../middleware/auth")
const jwtHelper=require('../config/jwtHelper')



lead_route.get('/get-countries',leadController.getCountries);
lead_route.get('/get-states',leadController.getStates);
lead_route.get('/get-cities',leadController.getCities)


// lead route
lead_route.post('/import-lead',upload.single('file'),leadController.importLead);
lead_route.post('/add_lead',leadController.addLead);
lead_route.get('/allLead-list',leadController.allLead);
lead_route.get('/lead-list',leadController.leadList);
lead_route.get('/delete-lead',leadController.deleteLead);
lead_route.get('/edit-lead',leadController.editLead);
lead_route.put('/edit-lead/:id',leadController.updateLead);
lead_route.get('/exist-leadEmail',leadController.emailExist);
lead_route.get('/exist-leadContact',leadController.contactExist);

lead_route.get('/export-lead',leadController.exportLeads);
lead_route.put('/update-leadtGroup/:id',leadController.updateLeadGroup)

lead_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=lead_route;
const express=require('express');
const contact_route=express();
const session=require('express-session');

const paginate=require('jw-paginate')
const config=require('../config/config');

contact_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
contact_route.use(bodyParser.json());
contact_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

contact_route.use(express.static(path.resolve(__dirname,'public')));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads')
    },

    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});

const upload=multer({storage:storage});


const contactController=require('../controllers/contactController');
// const auth=require("../middleware/auth")
const jwtHelper=require('../config/jwtHelper')

// contact route
contact_route.post('/importUser',upload.single('file'),contactController.importUser);
contact_route.post('/add_contact',contactController.addContact);
contact_route.get('/all-contact',contactController.allContact);
contact_route.get('/contact-list',contactController.contactList);
contact_route.get('/common-list',contactController.common);
contact_route.get('/delete-contact',contactController.deleteContact);
contact_route.get('/edit-contact',contactController.editContact);
contact_route.put('/edit-contact/:id',contactController.updateContact);
contact_route.get('/exist-email',contactController.emailExist);
contact_route.get('/exist-contact',contactController.contactExist);

contact_route.get('/get-countries',contactController.getCountries);
contact_route.get('/get-states',contactController.getStates);
contact_route.get('/get-cities',contactController.getCities);

contact_route.get('/export-contact',contactController.exportContact);

contact_route.put('/update-contactGroup/:id',contactController.updateContactGroup)

contact_route.post('/add-update-bulk-records',contactController.addUpdateBulkRecords );

contact_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=contact_route;
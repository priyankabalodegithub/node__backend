const express=require('express');
const group_route=express();
const session=require('express-session');

const paginate=require('jw-paginate')
const config=require('../config/config');

group_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
group_route.use(bodyParser.json());
group_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

group_route.use(express.static('public'));

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

const groupController=require('../controllers/groupController');
const jwtHelper=require('../config/jwtHelper')

group_route.post('/add_group',groupController.addGroup);

group_route.get('/group-list',groupController.groupList);
group_route.get('/allGroup-list',groupController.allGroupList);
group_route.get('/total-list',groupController.grouptotal);

group_route.get('/delete-group',groupController.deleteGroup);

group_route.get('/edit-user',groupController.editProfileLoad);

group_route.put('/edit-user/:id',groupController.updateProfile);

group_route.put('/undo-group/:id',groupController.undoUser);

group_route.put('/group-delete/:id',groupController.softDeleteGroup);

group_route.get('/get-countries',groupController.getCountries);
group_route.get('/get-states',groupController.getStates);
group_route.get('/get-cities',groupController.getCities)

group_route.get('/export_group',groupController.exportContacts)

group_route.put('/update-groupMember/:id',groupController.updateGroupMember)

group_route.get('/exist-group',groupController.groupExist);

group_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=group_route;
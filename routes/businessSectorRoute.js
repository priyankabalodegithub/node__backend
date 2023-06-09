const express=require('express');
const sector_route=express();
const session=require('express-session');

const paginate=require('jw-paginate')
const config=require('../config/config');

sector_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
sector_route.use(bodyParser.json());
sector_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

sector_route.use(express.static('public'));

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


const sectorController=require('../controllers/businessSectorController');
const jwtHelper=require('../config/jwtHelper')

// business opportunity route
sector_route.post('/add-sector',sectorController.businessSector);
sector_route.get('/sector-list',sectorController.sectorList);
sector_route.get('/delete-sector',sectorController.deleteBusinessSector);
sector_route.get('/edit-sector',sectorController.editBusinessSector);
sector_route.put('/edit-sector/:id',sectorController.updateBusinessSector);
sector_route.get('/exist-sector',sectorController.businessExist);

sector_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=sector_route;
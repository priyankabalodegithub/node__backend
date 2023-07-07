const express=require('express');
const customer_route=express();
const session=require('express-session');

const config=require('../config/config');

customer_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
customer_route.use(bodyParser.json());
customer_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");


customer_route.use(express.static(path.resolve(__dirname,'public')));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads')
    },

    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});


const upload=multer({storage:storage});


const customerController=require('../controllers/customerController');
// const auth=require("../middleware/auth")
const jwtHelper=require('../config/jwtHelper')

// customer route
customer_route.post('/importCustomer',upload.single('file'),customerController.importCustomer);
customer_route.post('/add_customer',customerController.addCustomer);
customer_route.get('/allCustomer-list',customerController.allCustomer);
customer_route.get('/customer-list',customerController.customerList);
customer_route.get('/delete-customer',customerController.deleteCustomer);
customer_route.get('/edit-customer',customerController.editCustomer);
customer_route.put('/edit-customer/:id',customerController.updateCustomer);
customer_route.get('/exist-customerEmail',customerController.emailExist);
customer_route.get('/exist-customerContact',customerController.contactExist);

customer_route.get('/export-customer',customerController.exportCustomer);
customer_route.put('/update-customertGroup/:id',customerController.updateCustomerGroup);

customer_route.put('/undo-customer/:id',customerController.undoCustomer);
customer_route.put('/customer-delete/:id',customerController.softDeleteCustomer);


customer_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=customer_route;
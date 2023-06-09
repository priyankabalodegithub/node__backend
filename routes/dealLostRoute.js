const express=require('express');
const dealLost_route=express();
const config=require('../config/config');


const bodyParser=require('body-parser');
dealLost_route.use(bodyParser.json());
dealLost_route.use(bodyParser.urlencoded({extended:true}));

const dealController=require('../controllers/dealLostController');

// dealLost route
dealLost_route.post('/add_dealLostreason',dealController.addDealLostReason);
dealLost_route.get('/dealLostreason-list',dealController.reasonList);
dealLost_route.get('/delete-reason',dealController.deleteReason);
dealLost_route.put('/edit-deal/:id',dealController.updateDeal);


module.exports=dealLost_route;
const mongoose=require('mongoose')
require('dotenv').config();


//mongoose.connect("mongodb://127.0.0.1:27017/CRMSETUP")
mongoose.connect(process.env.MONGO_URI)

const express=require("express");
const app=express();
const paginate=require('express-paginate')


app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept");
    next();
})

const cors=require('cors');
app.use(cors({
}))

// for admin router
const adminRoute=require('./routes/adminRoutes');
app.use('/api',adminRoute);

// for group router
const groupRoute=require('./routes/groupRoute');
app.use('/api',groupRoute);

// for contact router
const contactRoute=require('./routes/contactRoute');
app.use('/api',contactRoute);

// for lead router
const leadRoute=require('./routes/leadRoute');
app.use('/api',leadRoute);

// for customer router
const customerRoute=require('./routes/customerRoute');
app.use('/api',customerRoute);

// for business router
const businessRoute=require('./routes/businessRoute');
app.use('/api',businessRoute);

// for business sector router
const sectorRoute=require('./routes/businessSectorRoute');
app.use('/api',sectorRoute);

// for service router
const serviceRoute=require('./routes/serviceRoute');
app.use('/api',serviceRoute);

// for staff router
const staffRoute=require('./routes/staffRoutes');
app.use('/api',staffRoute);

// for task router
const sourceRoute=require('./routes/taskRoute');
app.use('/api',sourceRoute);

// for dealLost router
const dealRoute=require('./routes/dealLostRoute');
app.use('/api',dealRoute);

// for message router
const messageRoute=require('./routes/messageRoutes');
app.use('/api',messageRoute);

// for template router
const templateRoute=require('./routes/templateRoute');
app.use('/api',templateRoute);

// for dashboard router
const dashboardRoutes=require('./routes/dashboardRoutes');
app.use('/api',dashboardRoutes);

app.use(express.static('public'));
app.use('/image', express.static('image'));
app.use('/document', express.static('document'));
// for user router
// const userRoute=require('./routers/userRoute')
// app.use('/api',userRoute);

// const  Country=require('country-state-city').Country;
// const  State=require('country-state-city').State;
// const  City=require('country-state-city').City;

// console.log(State.getAllStates())
// const MongoClient=require('mongodb').MongoClient
// MongoClient.connect('mongodb://127.0.0.1:27017/',function(err,db){
// if(err) throw err;
// var dbo=db.db('CRMSETUP');

// // country inserted
// var countriesBulk=dbo.collection('countries').initializeOrderedBulkOp();
// var countries=Country.getAllCountries();
// countries.forEach(country=>{
//     countriesBulk.insert({name:country.name,short_name:country.isoCode})
// });
// countriesBulk.execute();
// console.log('Country inserted')

// // state inserted
// var statesBulk=dbo.collection('states').initializeOrderedBulkOp();
// var states=State.getAllStates();
// states.forEach(state=>{
//     statesBulk.insert({name:state.name,country_short_name:state.countryCode})
// });
// statesBulk.execute();
// console.log('state inserted')

// //  city inserted
// var citiesBulk=dbo.collection('cities').initializeOrderedBulkOp();
// var cities=City.getAllCities();
// cities.forEach(city=>{
//     citiesBulk.insert({name:city.name,state_name:city.stateCode})
// });
// citiesBulk.execute();
// console.log('city inserted')
// })


app.listen(5000,function(){
    console.log("server is running")
})

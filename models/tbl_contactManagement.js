const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')
const validateEmail=function(email){
   const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   return regex.test(email)
}

const contactManagementSchema=new mongoose.Schema({
  
 first_name:{
    type:String,
    required:true
 },
 last_name:{
    type:String,
    required:true
 },

 designation:{
    type:String,
   //  required:true
 },
 company_name:{
    type:String,
   //  required:true
 },
 primary_contact_number:{
    type:String,
    required:true,
    unique:true
 },
 secondary_contact_number:{
    type:String,
   
 },
 email:{
    type:String,
    required:true,
    validate:[validateEmail],
    unique:true,
  

 },
 business_opportunity:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Business_Opportunity',
    //  required:true
 }],
  
  group:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
   //   required:true
 }],
 service_offered:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Service_Offered',
    //  required:true
 }],
  status:{
   type:Boolean,
   default:true
    
 },
 Lead_Status:{
   type:String,
   
    
 },
 contact_source:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Tbl_ContactSource',
   // required:true       
}],
buisness_sector:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Tbl_BusinessSector',
   // required:true       
}],
 address1:{
    type:String,
   //  required:true
 },
 address2:{
    type:String,
  
 },
 taluka:{
    type:String,
   
 },
 village:{
    type:String,
   
 },
 zipcode:{
    type:String,
   //  required:true
 },
 
 city: {
   type:String,
   // required:true
},
state:{
   type:String,
   // required:true
},
country:{
   type:String,
   // required:true
},
 
type:{
   type:String,
  
},
customerType:{
  type:String,
  default:"Existing"
  
},
is_deleted:{
   type:Number,
   default:0
}
  
},
{timestamps:true}
);


module.exports=mongoose.model('Tbl_ContactManagement',contactManagementSchema)
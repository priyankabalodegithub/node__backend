const mongoose=require('mongoose')
const staffSchema=new mongoose.Schema({
  
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
    required:true
 },
 
 primary_contact_number:{
    type:String,
    required:true
 },
 secondary_contact_number:{
    type:String,
   
 },
 email:{
    type:String,
    required:true
 },
 password:{
   type:String,
   required:true
},
confirm_password:{
   type:String,
},
 
user_type:{
   type:String,
   default:'user'
},
token:{
   type:String,
   default:''
 },
//  title:[{
//    type:mongoose.Schema.Types.ObjectId,
//    ref:'Tbl_Right',  
//    // required:true      
// }],
},
{timestamps:true});
module.exports=mongoose.model('Tbl_Staff',staffSchema)
const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')

const contactSchema=new mongoose.Schema({
  
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
    required:true
 },
 secondary_contact_number:{
    type:String,
   
 },
 email:{
    type:String,
    unique:true,
    required:true,

 },
  group:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
   //   required:true
 }],
  status:{
    type:Boolean,
    default:true
 },
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
   type:Number,
   default:1
}
  
});

contactSchema.plugin(uniqueValidator,{message:'{PATH} is already exists'});

module.exports=mongoose.model('Tbl_Contact',contactSchema)
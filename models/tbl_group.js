const mongoose=require('mongoose')
const groupSchema=new mongoose.Schema({
 group_name:{
    type:String,
    required:true
 },
 group_description:{
    type:String,

 },
 
 status:{
   type:Boolean,
   default:true
   
},
members:[{
   type:mongoose.Schema.Types.ObjectId,ref:'Tbl_ContactManagement',
   

 }],

is_group:{
   type:Number,
   default:1
},
count:{
   type:Number,
   default:0
}
  
},
{timestamps:true}
);
module.exports=mongoose.model('Tbl_Group',groupSchema)


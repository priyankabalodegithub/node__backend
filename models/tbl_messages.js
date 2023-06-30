const mongoose=require('mongoose')
const messageSchema=new mongoose.Schema({
    message:{
       type:String,
       
    },
    language:{
       type:String,
    },
   
    template_name:{
       type:String,
      //  required:true
    },
    
    template_id:[{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Template',
      //  required:true
   }],
    
    group_id:[{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
     
   }],
   media:{
    type:String
   },
    
   is_send:{
      type:Number,
      default:0
   },
   when_to_send:{
    type:Date,
   
 },
 is_archive:{
  type:Number,
  default:0
},
 media:{
  type:String
 },
 contact_count:{
   type:Number,
   default:0

 },
 members:[{
   type:mongoose.Schema.Types.ObjectId,ref:'Tbl_ContactManagement',

 }],
 date_time:{
   type:Date,
   default:new Date()
 }
     
   },
   {timestamps:true}
   );
   module.exports=mongoose.model('Tbl_Message',messageSchema)
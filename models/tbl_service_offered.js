const mongoose=require('mongoose')
const service_offeredSchema=new mongoose.Schema({
 title:{
    type:String,
    required:true
 },
 
 is_active:{
   type:Boolean,
   default:true
},

type:{
   type:Number,
   default:1
}
  
});
module.exports=mongoose.model('Tbl_Service_Offered',service_offeredSchema)
const mongoose=require('mongoose')
const permissionSchema=new mongoose.Schema({
  
staff_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_Staff'
 },
 rights_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_Right'  
      
 },
 right_detail:{
    type:String
 },
 permission:{
    type:Boolean
 }

}
 
);
module.exports=mongoose.model('Staff_Permission',permissionSchema)
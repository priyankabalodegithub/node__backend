const mongoose=require('mongoose')
const allcontactSchema=new mongoose.Schema({
  
     contact_id:{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Contact',
      required:true
   },

  group_id:{
  type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
   required:true
},

  
});
module.exports=mongoose.model('Tbl_AllGroupMembers',allcontactSchema)
const mongoose=require('mongoose')
const msgSendSchema=new mongoose.Schema({
    msg_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Message',
        //  required:true
     },
     contact_id:{
      //   type:mongoose.Schema.Types.ObjectId,ref:'Tbl_GroupContact',
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_ContactManagement',
     }

  
});
module.exports=mongoose.model('Tbl_MsgToSend',msgSendSchema)
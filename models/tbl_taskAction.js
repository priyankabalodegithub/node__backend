const mongoose=require('mongoose')
const taskActionSchema=new mongoose.Schema({
 action:{
    type:String,
    required:true
 },

  
});
module.exports=mongoose.model('Tbl_TaskAction',taskActionSchema)
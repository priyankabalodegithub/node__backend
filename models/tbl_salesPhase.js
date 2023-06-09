const mongoose=require('mongoose')
const salesPhaseSchema=new mongoose.Schema({
 name:{
    type:String,
    required:true
 },

  
});
module.exports=mongoose.model('Tbl_SalesPhase',salesPhaseSchema)
const mongoose=require('mongoose')
const businessSectorSchema=new mongoose.Schema({
 name:{
    type:String,
    required:true
 },

  
});
module.exports=mongoose.model('Tbl_BusinessSector',businessSectorSchema)
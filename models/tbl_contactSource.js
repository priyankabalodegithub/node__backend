const mongoose=require('mongoose')
const contactSourceSchema=new mongoose.Schema({
 name:{
    type:String,
    required:true
 },

  
});
module.exports=mongoose.model('Tbl_ContactSource',contactSourceSchema)
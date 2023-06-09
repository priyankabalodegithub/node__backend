const mongoose=require('mongoose')
const LanguageSchema=new mongoose.Schema({
 
 language:{
   type:String
}
  
});
module.exports=mongoose.model('Tbl_Language',LanguageSchema)


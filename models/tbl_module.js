const mongoose=require('mongoose')
const parentSchema=new mongoose.Schema({
  
module:{
   type:String
}
}
 
);
module.exports=mongoose.model('Tbl_Module',parentSchema)
const mongoose=require('mongoose')
const dealLostSchema=new mongoose.Schema({
 dealLostReason:{
    type:String,
    required:true
 },
});
module.exports=mongoose.model('Tbl_DealLostReason',dealLostSchema)
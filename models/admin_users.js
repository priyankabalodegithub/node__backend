const mongoose=require('mongoose')
const adminSchema=new mongoose.Schema({
//  username:{
//     type:String,
//     required:true
//  },
//  password:{
//     type:String,
//     required:true
//  },
 
//  name:{
//    type:String,
//    required:true
// },
// mobile:{
//     type:String,
//     required:true
//  },
//  email:{
//     type:String,
//     required:true
//  },
//  address:{
//     type:String,
//     required:true
//  },
 

//   profile_photo:{
//     type:String,
//     // required:true
//   },

message:{
   type:String,
   
}
 
 
  
});
module.exports=mongoose.model('Admin_Users',adminSchema)
const mongoose=require('mongoose')
const taskManagementSchema=new mongoose.Schema({
  
subject:{
    type:String,
    required:true  
 },
 add_task_for:{
    type:String,
    required:true 
   
 },
 set_task_priority:{
    type:String,
    required:true  
 },
 reason_to_change_task_priority:{
    type:String,
      // required:true  
    
 },
 estimated_date:{
    type:String,
    required:true  
 },
 reason_to_change_estimated_date:{
    type:String,
      // required:true  
     
 },
 contact_source:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_ContactSource',
    required:true       
 }],
 selected_list:[{
   type:mongoose.Schema.Types.ObjectId,
   enum:['Tbl_Contact','Tbl_Lead','Tbl_Customer'],
   required:true
 }],
 business_opportunity:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Business_Opportunity',
     required:true
 }],
 sales_phase:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_SalesPhase' ,
     required:true      
 }],
 action:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_TaskAction',  
    required:true      
 }],
 action_date:{
    type:String,
    required:true  
 },
 remarks:{
    type:String
 },
 assign_task_to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_Staff',
    required:true  
 },
 budget:{
   type:Number
 },
 client_firstName:{
   type:String,
   // required:true  
 },
 client_lastName:{
   type:String,
   // required:true  
 },
 client_contactNumber:{
   type:String,
   // required:true  
 },
 client_email:{
   type:String,
   // required:true  
 },
 level_of_urgency:{
  type:String,
//   required:true  
 },
 lead_status:{
   type:Number,
   default:1
 },
 task_status:{
   type:Number,
   default:1
 },
reason_for_dealLost:{
   type:String,
    
},
task_completed:{
   type:Number,
   default:0
 },
 invoice_file:{
   type:String
 },
 quotation_file:{
   type:String
 },
 is_archive:{
   type:Number,
   default:0
},
// is_completed:{
//    type:Number,
//    default:0
//  },
//  note:{
//    type:String
//  }
},
{timestamps:true}
);
module.exports=mongoose.model('Tbl_TaskManagement',taskManagementSchema)
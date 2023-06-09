const mongoose=require('mongoose')
const taskHistorySchema=new mongoose.Schema({
  
task_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_TaskManagement',
   //  required:true
 },
 sales_phase:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_SalesPhase' ,
    //  required:true      
 }],
 action:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_TaskAction',  
    // required:true      
 }],
 business_opportunity:[{
  type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Business_Opportunity',
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
    // required:true  
 },
 budget:{
    type:Number
  },
 invoice_file:{
    type:String
  },
  
  quotation_file:{
    type:String
  },
  status_date:{ 
   type:Date,
   default:new Date().toISOString()
 },
 task_status:{
    type:Number,
    default:1
  },
  lead_status:{
    type:Number,
    default:1
  },
  selected_list:[{
    type:mongoose.Schema.Types.ObjectId,
    enum:['Tbl_Contact','Tbl_Lead','Tbl_Customer'],
    required:true
  }],
  level_of_urgency:{
    type:String,
    // default:1
  },
  reason_for_dealLost:{
   type:String 
},
is_completed:{
   type:Number,
   default:0
 },
 note:{
   type:String
 },
 next_action:{
   type:Number,
   default:1
 },
 task_completed:{
   type:Number,
   default:0
 },
 is_archive:{
  type:Number,
  default:0
},

 
},
{timestamps:true}
);
module.exports=mongoose.model('Task_History',taskHistorySchema)
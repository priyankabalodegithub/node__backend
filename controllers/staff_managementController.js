
const Staff=require('../models/tbl_staff');
const Right=require('../models/tbl_rights');
const Permission=require('../models/staff_permission');
const permissionRights=require('../models/tbl_rights')
const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history')
const ContactManagement = require('../models/tbl_contactManagement');
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const config=require("../config/config");
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const tbl_module = require('../models/tbl_module');
const csv=require('csvtojson')

const create_token=async(id)=>{
  try{
    
       const token=await jwt.sign({_id:id},config.sessionSecret);
       return token;


  }
  catch(error)
  {
      res.status(400).send(error.message);
  }
}

// secure password
const securePassword=async(password)=>{
  try{

     const passwordHash=await bcrypt.hash(password,10)
     return passwordHash;

  }
  catch(err)
  {
      console.log(err.message);
  }
}

// for reset password send mail

const sendResetPasswordMail=async(email,token)=>{
  try{

     const transporter= nodemailer.createTransport({
          service:'gmail',
          requireTLS:true,
  auth:{
      user:'balodepriyanka0@gmail.com',
      pass:'fpoaokmqbvgkgflt'
  },
  
   });

   const mailOptions={
      from:'balodepriyanka0@gmail.com',
      to:email,
      subject:'for Reset Password',
      html:'<p>Hii,please click here to <a href="http://localhost:4200/reset-password?token='+token+'">Reset...</a>your password </p>'
   }                                                       
   transporter.sendMail(mailOptions,function(error,info){
      if(error)
      {
          console.log(error)
      }
      else{
          console.log("email has been send: ",info.response)
      }
   })

  }
  catch(err){
      console.log(err.message);
  }
}


// for send mail
const sendVerifyMail=async(email,password)=>{
  try{

     const transporter= nodemailer.createTransport({
          service:'gmail',
          requireTLS:true,
  auth:{
      user:'balodepriyanka0@gmail.com',
      pass:'fpoaokmqbvgkgflt'
  },
  
   });

   const mailOptions={
      from:'balodepriyanka0@gmail.com',
      to:email,
      subject:'for verification mail',
      html:'<p>Hii,<b>Email:-</b>'+email+'<br><b>Password:-'+password+'</b>'
   }
   
   
   transporter.sendMail(mailOptions,function(error,info){
      if(error)
      {
          console.log(error)
      }
      else{
          console.log("email has been send: ",info.response)
      }
   })

  }
  catch(error){
      
      console.log(error.message)
  }
}

// Add staff
const addStaff = async (req, res) => {
  try {
    const rightData = await Right.find().exec();
        // console.log(salesData);
        const selectedPhase = rightData.find((data) => data._id.equals(req.body.title));
    var n="MS";
    const spassword=n+Math.round(Math.random() *999999)
    const staff = new Staff({
      first_name:req.body.first_name,
      last_name: req.body.last_name,
      // password:n+Math.round(Math.random() *999999),
      password:spassword,
      confirm_password:spassword,
      designation: req.body.designation,
      primary_contact_number: req.body.primary_contact_number,
      secondary_contact_number: req.body.secondary_contact_number,
      email: req.body.email,
    
    });
    staff.save().then(async (userData) => {
      let permissionArray = [];
      req.body.permissions.forEach((data) => {
        data.childs.forEach((childData) => {
          const childPermission = childData.permission.map(
            (_permissionList) => {
              // console.log(_permissionList)
              return {
                permission: _permissionList.isSelected,
                right_detail: _permissionList.name,
                staff_id: userData._id,
                rights_id: childData._id,
               
              }; 
              
            }
            
          );
          // console.log(childPermission)
         

          permissionArray = [...permissionArray, ...childPermission];
        });
      });
      permissionArray = permissionArray.filter((data) => data);
      const permissionData = await Permission.insertMany(permissionArray);
      // console.log("permissionData", permissionData);
      if (userData && permissionData) {
        sendVerifyMail(req.body.email,userData.password,userData._id);
        res.status(200).send({
          success: true,
          data: userData,
          msg: "Data save successfully.",
        });
      } else {
        res.status(200).send({ msg: "group data failed" });
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};



// verify  login

const verifyLogin=async(req,res)=>{
  try{
      const email=req.body.email;
      const password=req.body.password;
      const userData=await Staff.findOne({email:email,is_deleted:0});
      if(userData){

        //  const passwordMatch=await bcrypt.compare(password,userData.password);

         if(password===userData.password)
         {

          if(userData.user_type!=="user"&& userData.user_type!=="admin")
          {
              res.status(200).send({success:true,msg:"username and password is incorrect"})
            

          }
          else{
              
              const tokenData=await create_token(userData._id);
              let permission = await Permission.find({
                staff_id: userData._id,
                is_deleted:0
              })
                // .populate("rights_id")
                .populate({
                  path: "rights_id",
                  populate: {
                    path: "module_id",
                    model: "Tbl_Module",
                  },
                })
                .exec();

          const userResult={
              _id:userData._id,
              first_name:userData.first_name,
              last_name:userData.last_name,
              designation:userData.designation,
              primary_contact_number:userData.primary_contact_number,
              secondary_contact_number:userData.secondary_contact_number,
              email:userData.email,
              password:userData.password,
              user_type:userData.user_type,
              permission:permission,
              token:tokenData

          }

          const response={
              success:true,
              msg:"user details",
              data:userResult
          }
          res.status(200).send(response)
              
          }

         }
         else{
          
          res.status(200).send({msg:"username and password is incorrect"})
         }

      }
      else{
          res.status(200).send({msg:"username and password is incorrects"})
      }

  }
  catch(err){
      res.status(400).send(err.message);
  }
}

// change password
const change_password=async(req,res)=>{
  try{
  const {old_password,new_password,confirm_password}=req.body;
  const id=req._id;
  const users=await Staff.findById(id);
 
  if(old_password==='' || new_password==='' || confirm_password==='')
  {
      res.status(200).send({success:true,msg:"All fields are required"})
  }
  else{
  if(old_password===users.password)
  {
  
  if( new_password && confirm_password){
  
      if( new_password!==confirm_password){
  
          res.status(200).send({success:true,msg:"Confirm password does not match"})
  
      }
      else{
  
          // const salt=await bcrypt.genSalt(10);
          // const newHashPassword=await bcrypt.hash(new_password,salt);
          await Staff.findByIdAndUpdate(req._id,{$set:{password:new_password}})
          res.status(200).send({success:true,msg:"password changed successfully"})
  
      }
  
  }
  // else{
  //     res.status(200).send({msg:"All fields are required"})
  // }
  }
  else{
  
      
      res.status(200).send({success:true,msg:"old password does not match"})
      
  }
  }
  }
  catch(err){
      res.status(400).send(err.message)
  }
      
  }
  // forget password

const forgetPassword=async(req,res)=>{
  try{

     const email=req.body.email;
      const userData=await Staff.findOne({email:email,is_deleted:0});

     if(userData)
     {
         if(userData.user_type==='')
          {
            return  res.render('forget',{message:"Email is incoreect"});
          }
          else
          {

              const randomString= randomstring.generate();
              const data=await Staff.updateOne({email:email},{$set:{token:randomString}})
      
              sendResetPasswordMail(userData.email,randomString)
      
              res.status(200).send({success:true,msg:"Please check your inbox mail and reset your password"});
          } 

     }
     else{
      res.status(200).send({success:false,msg:"this email not exist"});
     }

  }
  catch(error){
      res.status(400).send(error.message)
  }
}

// reset password
const reset_password=async(req,res)=>{

  try{

      const token=req.query.token;
      const tokenData=await Staff.findOne({token:token,is_deleted:0});

      if(tokenData)
      {
        const password=req.body.password;
        const confirm_password=req.body.confirm_password;
        if(password===confirm_password){
        const userData=await Staff.findByIdAndUpdate({_id:tokenData._id},{$set:{password:password,confirm_password:confirm_password,token:''}},{new:true});
        res.status(200).send({success:true,msg:"Your User Password has been reset",data:userData})
        }else{
          res.status(200).send({success:false,msg:"Password and Confirm password does not match"})
        }
      }
      else{
          res.status(200).send({msg:"this link has been expired"})
      }

  }
  catch(error)
  {
      res.status(400).send(error.message);
  }
  
}


// email exist
const emailExist=async(req,res)=>{

    try{
       
        Staff.find({email:req.query.email,is_deleted:0})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'Email alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'Email not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// contact exist

const contactExist=async(req,res)=>{

    try{
       
        Staff.find({primary_contact_number:req.query.primary_contact_number,is_deleted:0})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'contact alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'contact not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
// get base structure
const getRightList = async() => {
  let userData=await Right.aggregate([
    {
        $lookup:{
            from:'tbl_modules',
            localField:'module_id',
            foreignField:'_id',
            as:'module_id'
        }
    }
])
userData =   userData.map((data) => {
    return {
        ...data,
        moduleName: data.module_id[0].module || '',
        moduleId: data.module_id[0]._id || ''
    }

}).reduce((list, data)=> {
   const moduleIndex = list.findIndex((lst) => lst.moduleName === data.moduleName);
   if(moduleIndex === -1) {
    list.push({
        moduleName: data.moduleName,
        moduleId: data.moduleId,
        childs: [{
            _id: data._id,
            title: data.title
        }]
    })
   } else {
    list[moduleIndex].childs.push({
        _id: data._id,
        title: data.title
    })
   }
   return list;
}, []);

return userData;
}

// tables rights
const rightList=async(req,res)=>
{
    try{

        let userData= await getRightList();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }

}
// staff permission
const addPermission=async(req,res)=>{
    try{
        
            
            const permissionRight=new Permission({
                staff_id:req.body.staff_id,
                rights_id:req.body.rights_id,
                right_detail:req.body.right_detail,
                permission:req.body.permission  
                      
        })
            const userData=await permissionRight.save();

            if(userData)
            {
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}
// staff list
const staffList = async (req, res) => {
  try {
    var sortObject = {};
    var stype = req.query.sorttype ? req.query.sorttype : "createdAt";
    var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
    sortObject[stype] = sdir;

    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    var rightsFilters=[];
      
    if(req.query.rightsFilters){
        rightsFilters=req.query.rightsFilters.split(',');            
    }
   
    const query = {};

    query.user_type = 'user';
    query.is_deleted=0;
    

    if (rightsFilters.length > 0) {
        query.permissionModuleList = { $in: rightsFilters }
    } 
    console.log( query.permissionModuleList)

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 4;
    const result = {};
    const totalPosts = await Staff.countDocuments(query).exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await Staff.countDocuments(query).exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    const staffList = await Staff.find(query)
      .sort(sortObject)
      .skip(startIndex)
      .limit(limit)
      .find({
        $or: [
          { first_name: { $regex: ".*" + search + ".*", $options: "i" } },
          { email: { $regex: ".*" + search + ".*", $options: "i" } },
          {
            primary_contact_number: {
              $regex: ".*" + search + ".*",
              $options: "i",
            },
          },
        ],
      })
      .exec();
    var count=0;
    const permissionList = await Promise.all(
      staffList?.map(async (lst) => {
        let permission = await Permission.find({
          staff_id: lst._id,
          is_deleted:0
        })
          // .populate("rights_id")
          .populate({
            path: "rights_id",
            
            populate: {
              path: "module_id",
              model: "Tbl_Module",
            },
          })
          .exec();
          const {_doc: staffDetails} = lst;
          const permissionModuleList = []
          permission = permission.map((details) => {
            let _details =   {
              _id: details._id,
              name: details.right_detail,
              permission: details.permission,
              childModuleName: details.rights_id.title
            }
            if(details.permission === true) {
              const childModule = permissionModuleList.find((moduleName) => moduleName === _details.childModuleName);
              if(!childModule) {
                permissionModuleList.push(_details.childModuleName)
              }
            }
            return _details;
          });
        
          let tasks = await Task.find({
            assign_task_to: lst._id,
            is_deleted:0
          }).exec();
          const taskAssignList = []
          tasks = tasks.map((task) => {
            task.selected_list.map((selected_contact_list) => {
              ContactManagement.findById({
                _id: selected_contact_list,
                is_deleted:0
              }).exec().then((result)=>{
                if(result){
                  taskAssignList.push(result.first_name+' '+result.last_name);
                }
              });
            })
          });

        let totalTask = await Task.find({
          assign_task_to: lst._id,
          is_deleted:0
        }).countDocuments();
        let completedTaskCount = await Task.find({ assign_task_to: lst._id, task_status: 3, task_completed: 1,is_deleted:0 }).countDocuments();
        let conversionRate = (completedTaskCount / totalTask) * 100;
        conversionRate = (conversionRate) ? Math.round(conversionRate.toFixed(2)) : 0;
        count=count+conversionRate
       
        
        return {
          ...staffDetails,
          // permission,
          permissionModuleList: permissionModuleList.join(', '),
          taskAssigned: taskAssignList.join(', '),
          totalTask: totalTask,
          conversionRate: conversionRate,
         
        };
      })
    );
    let totalTasks = await Task.find({is_deleted:0}).countDocuments();
    let completedTaskCounts = await Task.find({task_status: 3, task_completed: 1,is_deleted:0 }).countDocuments();
        let conversionRate = (completedTaskCounts / totalTasks) * 100;
        conversionRate = (conversionRate) ? Math.round(conversionRate.toFixed(2)) : 0;
        let percentage=conversionRate+'%'
    result.rowsPerPage = limit;
    return res.send({
      msg: "Posts Fetched successfully",
      data: { ...result, data: permissionList,avrageRate:percentage},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
};

//simple staff list

const allstaffList=async(req,res)=>{
  try{

      const userData=await Staff.find({user_type:"user",is_deleted:0});
  res.status(200).send({success:true,data:userData});

  }
  catch(err){
      res.status(400).send(err.message);
  }
}

const mapChildData = (moduleDetails, permissionList) => {
 const data =  moduleDetails.childs.map((subChild) => {
    const permissionDetails = permissionList.filter((_pDeatils) => _pDeatils.rights_id._id.equals(subChild._id) ? true : false);
    return {
      ...subChild,
      permissions: [...permissionDetails]
    }
  })

  return data;
}

// delete staff
const deleteStaff=async(req,res)=>{

  try{

    const id=req.query.id;
    const userData= await Staff.deleteOne({_id:id});
    const permission = await Permission.deleteMany({
    staff_id: id,
    })
      .populate("rights_id")
      .populate({
        path: "rights_id",
        populate: {
          path: "module_id",
          model: "Tbl_Module",
        },
      })
      .exec();
    
    return res.send({
      msg: " delete data successfully",
      
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
  
}

// undo Staff
const undoStaff=async(req,res)=>{
  try{
    
     const userData1= await Staff.findByIdAndUpdate({_id:req.params.id},{$set:{is_deleted:0}});
     const userData2= await Permission.updateMany({staff_id:req.params.id},{$set:{is_deleted:0}});
     res.status(200).send({success:true,msg:"Staff can be undo"})

  }
  catch(error){
      res.status(400).send(error.message);
  }
}
// soft delete 
const softDeleteStaff=async(req,res)=>{
  try{
     
    const userData1= await Staff.findByIdAndUpdate({_id:req.params.id},{$set:{is_deleted:1}});
    const userData2= await Permission.updateMany({staff_id:req.params.id},{$set:{is_deleted:1}});
     res.status(200).send({success:true,msg:"Staff can be deleted"})
      }

  catch(error){
      res.status(400).send(error.message);
  }
}

// staff edit & update

const editStaff=async(req,res)=>{

  try{

    const id=req.query.id;
    const userData=await Staff.find({_id:id,is_deleted:0 })
    const taskHistory = await TaskHistory.find({ assign_task_to: req.query.id,is_deleted:0  }).populate('sales_phase action business_opportunity task_id assign_task_to');
    const task = await Task.find({ assign_task_to: req.query.id,is_deleted:0  }).populate('sales_phase action business_opportunity assign_task_to contact_source')
    
    const permission = await Permission.find({
      staff_id: id,
    })
      .populate("rights_id")
      .populate({
        path: "rights_id",
        populate: {
          path: "module_id",
          model: "Tbl_Module",
        },
      })
      .exec();
      let {_doc: userDetails} = userData[0];
    // console.log(userDetails)
    const permissionList = {
      ...userDetails,
      permission,
      task,
      taskHistory  
    }

    let permissionBaseStructure = await getRightList();
    permissionList.permission = permissionBaseStructure.map((moduleDetails) => {
      return {
        ...moduleDetails,
        childs: mapChildData(moduleDetails, permissionList.permission)
      }
    })

    return res.send({
      msg: " fetch data successfully",
      staff: permissionList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
  
}
// update staff
const updateStaff=async(req,res)=>{
  try{

     const StaffData= await Staff.findByIdAndUpdate({_id:req.params.id,is_deleted:0 },{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
     primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,email:req.body.email,
    }})
    
    let updateList = [];
    req.body.permissions.map((data) => {
      data.childs.map((child) => {
        if(child) {
          updateList.push(...child.permission)
        }
      })
    })
    updateList = await  Promise.all(updateList.map(async(data) => {
      // const update =   {
      //   _id:data._id,
      //   permission: data.isSelected
      // }
     return await Permission.findByIdAndUpdate({_id:data._id},{$set:{permission: data.isSelected}});
    }))
    console.log(updateList);
    // const permission =
    // console.log(permission);

    return res.send({
      msg: " update data successfully",
     
    });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
}
// export staff data
const exportStaff=async(req,res)=>{
  try{
    
    
        const userData=await Staff.find({is_deleted:0})
     
    
        try {
          
              res.status(200).send({ msg: "User staff Data", data: userData});
       
      
        } catch (err) {
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
      catch(err){
        console.log(err.message);
      }
}
// import customer
const importStaff=async(req,res)=>{
  try{
  
      var userData=[];
  
     csv()
     .fromFile(req.file.path)
     .then(async(response)=>{
     
       for(var x=0;x<response.length;x++){
          userData.push({
              first_name:response[x].first_name,
              last_name:response[x].last_name,
              designation:response[x].designation,
              company_name:response[x].company_name,
              primary_contact_number:response[x].primary_contact_number,
              email:response[x].email,
              secondary_contact_number:response[x].secondary_contact_number,
              
          })
  
       }
       await Staff.insertMany(userData)
  
     })
      res.send({success:true,msg:"CSV imported"})
  
  
  }catch(error){
      res.send({success:false,msg:error.message})
  }
  }

  // all permission rights 
const allPermissionrights=async(req,res)=>{
  try{

      const userData=await permissionRights.find();
  res.status(200).send({success:true,data:userData});

  }
  catch(err){
      res.status(400).send(err.message);
  }
}

module.exports={
    
    addStaff,
    rightList,
    addPermission,
    staffList,
    editStaff,
    updateStaff,
    deleteStaff,
    allstaffList,
    emailExist,
    contactExist,
    importStaff,
    create_token,
    securePassword,
    sendVerifyMail,
    verifyLogin,
    change_password,
    forgetPassword,
    reset_password,
    exportStaff,
    allPermissionrights,
    softDeleteStaff,
    undoStaff
  
}


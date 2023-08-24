
const Message=require('../models/tbl_messages');
const MsgSend=require('../models/tbl_msgtosend');
const groupContact=require('../models/tbl_groupContact');
const Template=require('../models/tbl_template');
const _http=require('https')


// add message for group

const addMessage=async(req,res)=>{
    try{
   
        const templateData = await Template.find().exec();
        const selectedPhase = templateData.find((data) => data._id.equals(req.body.template_id));
   
            const message=new Message({
                message:req.body.message,
                language:req.body. language,
                template_name:req.body.template_name,
                template_id:req.body.template_id,
                media:selectedPhase.template_created_for,
                group_id:req.body.group_id,
                is_send:req.body.is_send,
                when_to_send:req.body.when_to_send,
                contact_count:req.body.contact_count,
                is_archive:req.body.is_archive,
                members:req.body.members,
                
        })
            const userData=await message.save().then(async (userData) => {
               const count=0
                for(var i=0; i< req.body.group_id.length;i++){
                    const contact = await groupContact.find().exec();
                    const groups = contact.find((data) => data.group_id.equals(req.body.group_id[i]) ? true : false);
                    console.log(groups);
                   
                    if(groups) {
                        const data = new MsgSend({
                            msg_id:userData._id,
                            contact_id:groups.contact_id
                           
                        })
                        const sendGroup = await data.save()
                    } 
            }
            });

            if(userData)
            {
               
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:" data failed"})
            }
    
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send(error.message);
    }

}

// add message for members


const sendMembers=async(req,res)=>{
    try{
   
        const templateData = await Template.find().exec();
        const selectedPhase = templateData.find((data) => data._id.equals(req.body.template_id));
            const message=new Message({
                message:req.body.message,
                language:req.body. language,
                template_name:req.body.template_name,
                template_id:req.body.template_id,
                media:selectedPhase.template_created_for,
                group_id:req.body.group_id,
                members:req.body.members,
                is_send:req.body.is_send,
                when_to_send:req.body.when_to_send,
                contact_count:(req.body.members)?(req.body.members.length):0,
                is_archive:req.body.is_archive
                
        })
            const userData=await message.save().then(async (userData) => {
                var number=[]
                var textMsg=[]
               if(userData.members.length>0){
                for(var i=0; i<req.body.members.length;i++){
                   
                 
                        const data = new MsgSend({
                            msg_id:userData._id,
                            contact_id:req.body.members[i]
                           
                        })
                  
                        const sendMembers = await (await data.save()).populate('contact_id msg_id')
                        number.push(sendMembers.contact_id.primary_contact_number)
                        textMsg.push(sendMembers.msg_id.message)
                        // console.log(textMsg)
                       
            }
          
        }
        if(userData.is_send==1){
        _http.request('https://whatzapi.orcainfosolutions.com/api/send-text.php?number='+number+'&msg='+textMsg+'&apikey=6c0c75abc9884de8d88ed9de0c55188066a4d976&instance=o2eaqrWXldO31Ag', {method: 'GET'}, function(res) {
         
            res.on('data', function (chunk) {
            //   console.log('BODY: ' + chunk);
            });
          }).end();
        }
            });

            if(userData)
            {
               
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:" data failed"})
            }
    
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send(error.message);
    }

}

const sendList=async(req,res)=>{
    try{

        const userData=await Message.find({is_deleted:0}).populate('group_id template_id');
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// send all send message list
const sendAll=async(req,res)=>{
    try{

        const userData=await Message.find({is_send:1,is_deleted:0}).populate('group_id template_id');
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}
// send all schedule message list
const scheduleAll=async(req,res)=>{
    try{

        const userData=await Message.find({is_send:0,is_deleted:0}).populate('group_id template_id');
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// message send list
const messageSend=async(req,res)=>{
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        var search='';
        if(req.query.search){
            search=req.query.search
        }

        var groupFilters=[];
        var mediaFilters=[];
      
        if(req.query.groupFilters){
            groupFilters=req.query.groupFilters.split(',');            
        }
        if(req.query.mediaFilters){
            mediaFilters=req.query.mediaFilters.split(',');            
        }
        const query = {};
        query.is_deleted=0;

        query.is_send =1;
        if (groupFilters.length > 0) {
            query.group_id = { $in: groupFilters }
        } 
        if (mediaFilters.length > 0) {
            query.media = { $in: mediaFilters }
        } 



        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Message.countDocuments(query).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        
        if (endIndex < (await Message.countDocuments(query).exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Message.find(query)
        .populate('group_id template_id')
        .find({
            $or:[
                {template_name:{$regex:'.*'+search+'.*',$options:'i'}},
                // {group:{$regex:'.*'+search+'.*',$options:'i'}},
                // {primary_contact_number:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
        .sort(sortObject)
        .skip(startIndex)
        .limit(limit)
        .exec();
        
        
        
      result.rowsPerPage = limit;
      return res.send({
         msg: "Posts Fetched successfully", 
         data: result,
        
        });

    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// delete messages
const deletemessage = async (req, res) => {

    try {
        const id = req.query.id;
        const userData = await Message.deleteOne({ _id: id });
        const deleteContact = await MsgSend.deleteMany({ contact_id: id })
        res.status(200).send({ success: true, msg: "Message can be deleted" })


    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// message send list
const messageSendLater=async(req,res)=>{
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        var search='';
        if(req.query.search){
            search=req.query.search
        }

        var groupFilters=[];
        var mediaFilters=[];
      
        if(req.query.groupFilters){
            groupFilters=req.query.groupFilters.split(',');            
        }
        if(req.query.mediaFilters){
            mediaFilters=req.query.mediaFilters.split(',');            
        }
        const query = {};
        query.is_deleted=0;

        query.is_send =0;
        if (groupFilters.length > 0) {
            query.group_id = { $in: groupFilters }
        } 
        if (mediaFilters.length > 0) {
            query.media = { $in: mediaFilters }
        } 

        if (req.query.is_archive) {
            query.is_archive = req.query.is_archive
        } 

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Message.countDocuments(query).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        
        if (endIndex < (await Message.countDocuments(query).exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Message.find(query)
        .populate('group_id template_id')
        .find({
            $or:[
                {template_name:{$regex:'.*'+search+'.*',$options:'i'}},
                // {group:{$regex:'.*'+search+'.*',$options:'i'}},
                // {primary_contact_number:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
        .sort(sortObject)
        .skip(startIndex)
        .limit(limit)
        .exec();

        
      result.rowsPerPage = limit;
      return res.send({
         msg: "Posts Fetched successfully", 
         data: result});

    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}


// undo Message
const undoMessage=async(req,res)=>{
    try{
      
       const userData= await Message.findByIdAndUpdate({_id:req.params.id},{$set:{is_deleted:0}});
       await MsgSend.deleteMany({ msg_id: userData._id });
       const data=(userData.members)?(userData.members.length):0
       if(data.length>0){
        for(var i=0; i< data.length;i++){
           
                const data = new MsgSend({
                    msg_id:userData._id,
                    contact_id:data[i]
                   
                })
                const sendMembers = await data.save()
    }
  }
       res.status(200).send({success:true,msg:"Message can be undo"})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// soft delete 
const softDeleteMessage=async(req,res)=>{
    try{
       
       const userData= await Message.findByIdAndUpdate({_id:req.params.id},{$set:{is_deleted:1}});
  
       await MsgSend.deleteMany({ msg_id: userData._id });
      const data=(userData.members)?(userData.members.length):0
       if(data.length>0){
        for(var i=0; i< data.length;i++){
                const data = new MsgSend({
                    msg_id:userData._id,
                    contact_id:data[i]
                   
                })
                const sendMembers = await data.save()
    }
}
       res.status(200).send({success:true,msg:"Message can be deleted"})
        }

    catch(error){
        res.status(400).send(error.message);
    }
}
// message edit & update

const editMessage=async(req,res)=>{
    try{

       const id=req.query.id;
       
       const userData=await Message.findById({_id:id}).populate('group_id template_id members');

       if(userData){

         res.status(200).send({success:true,messages:userData})
       
       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update message

const updateMessage=async(req,res)=>{
    try{

       const userData= await Message.findByIdAndUpdate({_id:req.params.id},
        {$set:
            {
                message:req.body.message,
                language:req.body. language,
                template_name:req.body.template_name,
                template_id:req.body.template_id,
                members:req.body.members,
                group_id:req.body.group_id,
                is_send:req.body.is_send,
                when_to_send:req.body.when_to_send,
                contact_count:(req.body.members)?(req.body.members.length):0,
            }}).then(async (userData) => {
                await MsgSend.deleteMany({ msg_id:userData._id,});
                
                if(req.body.members && req.body.members.length >0){
              
                    for(var i=0;i<req.body.members.length;i++){
                        const all = new MsgSend({
                            msg_id:userData._id,
                            contact_id:req.body.members[i]
                        
                        })
                        const groupgroup = await all.save()
                        
                       
                    }
                  
                }
            });
       res.status(200).send({sucess:true,msg:"sucessfully updated",message:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// export message data
const exportMessage=async(req,res)=>{
    try{
      
      
          const userData=await Message.find({is_deleted:0})
       
      
          try {
            
                res.status(200).send({ msg: "User message Data", data: userData});
         
        
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
  // update archive unarchive
const updateMessageArchiveUnarchive=async(req,res)=>{
    try{

       const userData= await Message.findByIdAndUpdate({_id:req.params.id},
        {$set:{
            is_archive:req.body.is_archive
        }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",updateData:userData})
    }
    catch(error){        
        res.status(400).send(error.message);
    }
}

module.exports={

    addMessage,
    sendMembers,
    messageSend,
    messageSendLater,
    editMessage,
    updateMessage,
    sendList,
    sendAll,
    scheduleAll,
    exportMessage,
    updateMessageArchiveUnarchive,
    deletemessage,
    undoMessage,
    softDeleteMessage
}
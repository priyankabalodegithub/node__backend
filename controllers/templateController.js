const Template=require('../models/tbl_template');
const Language=require('../models/tbl_language');
const {validationResult}=require('express-validator');
const path=require("path");

// add Template for whatspp

const addTemplate=async(req,res)=>{
    try{
        var errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
            const template=new Template({
                template_created_for:req.body.template_created_for,
                template_name:req.body.template_name,
                language:req.body.language,
                template_message:req.body.template_message,
                image: (Object.keys(req.files).length > 0) ? req.files.image[0].filename : null,
                document: (Object.keys(req.files).length > 0) ? req.files.document[0].filename : null, 
                doc_type:req.body.doc_type,
                is_send:req.body.is_send,
                is_archive:req.body.is_archive
        })
            const userData=await template.save();

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"your template has been successfully."})
            }
            else
            {
                res.status(200).send({success:false,msg:"your template has been failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}
// add Template for sms

const addTemplatesms=async(req,res)=>{
    try{
       
            const template=new Template({
                template_created_for:req.body.template_created_for,
                template_name:req.body.template_name,
                language:req.body.language,
                template_message:req.body.template_message,
                image: '',
                document:'', 
                doc_type:req.body.doc_type,
                is_send:req.body.is_send,
                is_archive:req.body.is_archive
        })
            const userData=await template.save();

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"your template has been successfully."})
            }
            else
            {
                res.status(200).send({success:false,msg:"your template has been failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}


// all template list

const alltemplate=async(req,res)=>{
    try{

        const userData=await Template.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// all whatsapp template list
const allwhatsppTemplate=async(req,res)=>{
    try{

        const userData=await Template.find({template_created_for:'whatsApp'});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// all sms template list

const allsmstemplate=async(req,res)=>{
    try{

        const userData=await Template.find({template_created_for:'sms'});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// template list
const templateList=async(req,res)=>{
   
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        
        var search='';
        if(req.query.search){
            search=req.query.search
        }

        var languageFilters=[];
      
        if(req.query.languageFilters){
            languageFilters=req.query.languageFilters.split(',');            
        }
        const query = {};

        query.type = 'template';
        

        if (languageFilters.length > 0) {
            query.language = { $in: languageFilters }
        } 
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Template.countDocuments(query).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Template.countDocuments(query).exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }

        // const query = {};
        if (req.query.is_archive) {
            query.is_archive = req.query.is_archive
        } 

        result.data = await Template.find(query)
        .find({
            $or:[
                // {is_archive: req.query.is_archive},
                {template_name :{$regex:'.*'+search+'.*',$options:'i'}},
                {language:{$regex:'.*'+search+'.*',$options:'i'}},
                {template_created_for:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        }).find(query)
        .sort(sortObject)
        .skip(startIndex)
        .limit(limit)
        .exec();
      result.rowsPerPage = limit;
      result.data = result.data.map((lst) => {
        const {_doc: details} = lst;
        return {
            ...details,
            // imageUrl: path.join('http://', req.get('host'), 'image', details.image)
        };
      })
      return res.send({ msg: "Posts Fetched successfully", data: result});
       
    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// delete template
const deleteTemplate=async(req,res)=>{
    try{

        const id=req.query.id;
        await Template.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"template can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// edit template
const editTemplate=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Template.findById({_id:id});

       if(userData){

        res.status(200).send({success:true,template:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// update whatspp list

const updateTemplate=async(req,res)=>{
    try{

       const userData= await Template.findByIdAndUpdate({_id:req.params.id},
        {$set:{
            template_created_for:req.body.template_created_for, 
            template_name:req.body.template_name,
            language:req.body.language,
            template_message:req.body.template_message,
            image: req.files.image[0].filename,
            document:req.files.document[0].filename,
            doc_type:req.body.doc_type,
            is_send:req.body.is_send
        }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",updateData:userData})

    }
    catch(error){
        
        res.status(400).send(error.message);
    }
}

// update sms list

const updateTemplateSms=async(req,res)=>{
    try{

       const userData= await Template.findByIdAndUpdate({_id:req.params.id},
        {$set:{
            template_created_for:req.body.template_created_for, 
            template_name:req.body.template_name,
            language:req.body.language,
            template_message:req.body.template_message,
            image:'',
            document:'',
            doc_type:'',
            is_send:req.body.is_send
        }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",updateData:userData})

    }
    catch(error){
        
        res.status(400).send(error.message);
    }
}
// languages list

const languageList=async(req,res)=>{
    try{

        const userData=await Language.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// update archive unarchive
const updateArchiveUnarchive=async(req,res)=>{
    try{

       const userData= await Template.findByIdAndUpdate({_id:req.params.id},
        {$set:{
            is_archive:req.body.is_archive
        }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",updateData:userData})
    }
    catch(error){        
        res.status(400).send(error.message);
    }
}
// export template data
const exportTemplate=async(req,res)=>{
    try{
      
      
          const userData=await Template.find()
       
      
          try {
            
                res.status(200).send({ msg: "User template Data", data: userData});
         
        
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
module.exports={
    addTemplate,
    languageList,
    templateList,
    editTemplate,
    deleteTemplate,
    updateTemplate,
    alltemplate,
    addTemplatesms,
    updateTemplateSms,
    allsmstemplate,
    updateArchiveUnarchive,
    exportTemplate,
    allwhatsppTemplate
    
}


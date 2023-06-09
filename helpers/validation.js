const {check}=require('express-validator');

exports.docValidation=[
   check('image').custom( (value, {req}) =>{
      if(Object.keys(req.files).length == 0 || req.files.image[0].mimetype === 'image/jpeg' || req.files.image[0].mimetype === 'image/png'){
          return true;
      }
      else{
          return false;
      }
   }).withMessage('Please upload an image Jpeg, PNG'),
   check('document').custom( (value, {req}) =>{
      if(Object.keys(req.files).length == 0 || req.files.document[0].mimetype === 'application/msword' || req.files.document[0].mimetype === 'application/pdf'){
          return true;
      }
      else{
          return false;
      }
   }).withMessage('Please upload pdf or doc format')
]
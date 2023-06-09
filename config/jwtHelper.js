
const jwt=require('jsonwebtoken');
const config=require("../config/config");

const verifyJwtToken=(req,res,next)=>{
    // var token;
    // if('authorization' in req.headers)
    //    token=req.headers['authorization'].split(' ')[1];
    const token=req.body.token || req.query.token || req.headers['authorization']

       if(!token)
       
        return res.status(403).send({auth:false,message:'No token provided'});
       else{
        jwt.verify(token,config.sessionSecret,(err,decoded)=>{
            if(err)
            return res.status(500).send({auth:false, message:'token authentication failed'});
            else{
                req._id=decoded._id;
                next();
            }
        })
       }
       
}
module.exports=verifyJwtToken;
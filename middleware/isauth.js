const jwt=require("jsonwebtoken");
const User=require("../model/user.js");
const verifytoken=async (req,res,next)=>{
    try{
        let token=req.headers['accesstoken']||req.headers['authorization'];
        if(!token)
            return res.status(401).json({success:false,msg:"Please login or signup"});
        token=token.replace(/^Bearer\s+/,"")
        const verify=await jwt.verify(token,process.env.secretkey,
        async (err,payload)=>{
            if(err){
                return res.status(401).json({success:false,msg:"Invalid or expired token",msg2:err});
            }
            const user=await User.findOne({email:payload.email});
            if (!user) return res.status(404).json({ success: false, msg: "User does not exists" });
            req.user=user;
            next();
        });
        }
        catch(error){
             next(error);    

        }
}

module.exports=verifytoken

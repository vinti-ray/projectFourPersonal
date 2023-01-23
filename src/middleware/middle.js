const jwt=require("jsonwebtoken")

const authentication=async function(req,res,next){
    try {
	let token=req.headers["x-auth-key"]
	    if(!token) return res.status(400).send({message:"token not present"})
	    let decodedToken=jwt.verify(token,"groupseven",(err)=>{
	        if(err) return res.status(401).send({err:err.message})
	    })
	    next()
} catch (error) {
	return res.status(500).send({ error: error.message })
}
    }


    const authorisation=async function(req,res,next){
       try {
	 let token=req.headers["x-auth-key"]
	        let decodedToken=jwt.verify(token,"groupseven")
	        if(decodedToken.userId!=req.body.userId) return res.status(400).send({message:"you are not authorised"})
	         next()
} catch (error) {
	return res.status(500).send({ error: error.message })
}}


    module.exports={authentication,authorisation}
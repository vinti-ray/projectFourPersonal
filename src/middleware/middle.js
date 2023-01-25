const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const mongoose=require("mongoose")

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-auth-key"];
    if (!token) return res.status(401).send({ message: "token not present" });

    jwt.verify(token, "groupseven", (err,decode) => {
      if (err) {return res.status(401).send({ err: err.message })
	}else{
		req.decode = decode;
		return next(); 
	};
    });

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const authForCreation = async function (req, res, next) {
  try {
    if (req.decode.userId != req.body.userId)
      return res.status(403).send({ message: "you are not authorised" });

    next();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const authForDltAndPut = async (req, res, next) => {
  try {
     if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" });

    const findBook = await bookModel.findById(req.params.bookId);
    
	if(!findBook)  return res.status(404).send({status:true,message:"no data found"})
    if (req.decode.userId != findBook.userId)
      return res.status(403).send({ message: "you are not authorised" }); 

    next();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { authentication, authForCreation ,authForDltAndPut};

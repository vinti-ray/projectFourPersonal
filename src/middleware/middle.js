const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const mongoose=require("mongoose")

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-auth-key"];
    if (!token) return res.status(401).send({status: false, message: "token not present" });

    jwt.verify(token, "groupseven", (err,decode) => {
      if (err) {return res.status(401).send({status: false, err: err.message })
	}else{
		req.decode = decode;
		return next(); 
	};
    });

  } catch (error) {
    return res.status(500).send({status: false, error: error.message });
  }
};

const authForCreation = async function (req, res, next) {
  try {

    let fetchJSON = req.body.data // pass JSON key-value and fetch through req.body  in form-data
    let data = (JSON.parse(fetchJSON))
    if(!data.userId) return res.status(400).send({status: false, message:"user id is not present"})
    if(!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({status: false, message:"user id is not valid"})
    if (req.decode.userId != data.userId)
      return res.status(403).send({status: false, message: "you are not authorised" });

    next();
  } catch (error) {
    return res.status(500).send({status: false, error: error.message });
  }
};

const authForDltAndPut = async (req, res, next) => {
  try {
     if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" });

  const findBook = await bookModel.findOne({ _id:req.params.bookId, isDeleted: false });

    if (!findBook) return res.status(404).send({ status: false, message: "no book found with this id " });

    if (req.decode.userId != findBook.userId)
      return res.status(403).send({status: false, message: "you are not authorised" }); 

    next();
  } catch (error) {
    return res.status(500).send({status: false, error: error.message });
  }
};

module.exports = { authentication, authForCreation ,authForDltAndPut};

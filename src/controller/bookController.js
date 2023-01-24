const bookModel=require("../models/bookModel")
const userModel=require("../models/userModel")
const valid=require("../validation/validation")
const mongoose=require("mongoose")

const createBook=async (req,res)=>{
    let data=req.body
     const {title,excerpt,userId,ISBN,category,subcategory,releasedAt}=data
     if(!title) return res.status(400).send({status:false,message:"title is required"})
     if(!excerpt) return res.status(400).send({status:false,message:"excerpt is required"})
 
     if(!userId) return res.status(400).send({status:false,message:"userId is required"})
     if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"userId is not a valid object id"})
 
     const findUser=await userModel.findById(userId)
     if(!findUser) return res.status(400).send({status:false,message:"userId doesnt exist"})
 
     if(!ISBN)  return res.status(400).send({status:false,message:"ISBN is required"})
     if(typeof ISBN!="string")  return res.status(400).send({status:false,message:"ISBN should be string"})
     if(!valid.isValidIsbn(ISBN)) return res.status(400).send({status:false,message:"ISBN is not valid"})
     const existingData=await bookModel.findOne({$or:[{title:title},{ISBN:ISBN}]})
     if(existingData){
         if(existingData.title==title)  return res.status(400).send({status:false,message:"title is already in use"})
         if(existingData.ISBN==ISBN)  return res.status(400).send({status:false,message:"ISBN is already in use"})
     }
 
     if(!category.trim()) return res.status(400).send({status:false,message:"category is required"})
     if(!valid.isValidName(category)) return res.status(400).send({status:false,message:"category is not valid"})
    
     if(!subcategory) return res.status(400).send({status:false,message:"subcatagory is required"})
     if(!valid.isValidName(subcategory)) return res.status(400).send({status:false,message:"subcategory is not valid"})
     if(!releasedAt) return res.status(400).send({status:false,message:"releasedAt is required"})
 
     const createData=await bookModel.create(data)
 
     return res.status(201).send({status:true,data:createData})
 
 }

 
 
 module.exports.createBook=createBook
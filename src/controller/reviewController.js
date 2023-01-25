const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const { reviewJoi,updatereviewJoi } = require("../validation/joiValidation")
const mongoose=require("mongoose")

const reviewCreate = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "plz. provide data" })
        let { review, rating, reviewedBy } = data
        let error = 0
        const validation = await reviewJoi.validateAsync(data).then(() => true).catch((err) => { error = err.message; return null })

        if (!validation) return res.status(400).send({ status: false, message: `${error}` })
        if (req.body.bookId != req.params.bookId) return res.status(400).send({ message: "you can change only that at which u are registered" })
        let alreadyPresent = await bookModel.findOne({ id: req.body.bookId, isDeleted: false })
        if (!alreadyPresent) return res.status(400).send({ message: "not present" })
        if (!reviewedBy) {
            data.reviewedBy = "Guest"
        }
        console.log(data.reviewedBy)
        let reviewSave = await reviewModel.create(data)
        let updateBook = await bookModel.findByIdAndUpdate(data.bookId, { $inc: { reviews: 1 } }, { new: true }).lean()
        let responsedata = { _id: reviewSave._id, bookId: reviewSave.bookId, reviewedBy: reviewSave.reviewedBy, reviewedAt: reviewSave.reviewedAt, rating: reviewSave.rating, review: reviewSave.review }

        updateBook["reviewsData"] = responsedata
        return res.status(201).send({ status:true,message:`review count updated successfully for ${updateBook.title}`,data: updateBook })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const reviewUpdate=async (req,res)=>{
   try {
	 let data=req.body
     let { review,rating, reviewedBy}=data
     let error=0;
     let validation=await updatereviewJoi.validateAsync(data).then(()=>true).catch((err)=>{error=err.message;return null})
     if(!validation) return res.status(400).send({status:false,message:`${error}`})
	    if(Object.keys(data).length==0) return res.status(400).send({message:"no data here to update"})
	    let bookId=req.params.bookId
	    let reviewId=req.params.reviewId
	    let bookCheck=await bookModel.findOne({bookId},{isDeleted:false}).lean()
	   if(!bookCheck) return  res.status(404).send({message:"not found"})
       let reviewCheck=await reviewModel.findById(reviewId)
       if(!reviewCheck) return res.status(404).send({message:"no review exists"})
       let updateReview=await reviewModel.findByIdAndUpdate(reviewId,{$set:{review:review,rating:rating,reviewedBy:reviewedBy}},{new:true}).select({isDeleted:0,createdAt:0,updatedAt:0,__v:0})
       
       bookCheck["reviewsData"]=updateReview
	     res.status(200).send({data:bookCheck})
	}
catch (error) {
	res.status(500).send({error:error.message})
}}
 


const deleteReview=async (req,res)=>{
    let bookId=req.params.bookId

    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"bookId is not a valid object id"})

    let reviewId=req.params.reviewId

    if(!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({status:false,message:"reviewId is not a valid object id"})

    let checkReview=await reviewModel.findOne({_id:reviewId,bookId:bookId,isDeleted:false})

    if(!checkReview) return res.status(404).send({status:false,message:"review is deleted"})

    let reviewDel=await reviewModel.findByIdAndUpdate(reviewId,{$set:{isDeleted:true}},{new:true})

    let bookreviewCount=await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}},{new:true})
    
    res.status(200).send({message:"successfully deleted",data:bookreviewCount})
}





module.exports = {reviewCreate,reviewUpdate,deleteReview}

const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const { reviewJoi, updatereviewJoi } = require("../validation/joiValidation")
const mongoose = require("mongoose")

// --------------------------------REVIEW CREATE---------------------------------------------

const reviewCreate = async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data" })

        let { review, rating, reviewedBy } = data

        let error = 0

        const validation = await reviewJoi.validateAsync(data).then(() => true).catch((err) => { error = err.message; return null })

        if (!validation) return res.status(400).send({ status: false, message: `${error}` })

        if (!req.params.bookId) return res.status(400).send({status:false, message: "please provide bookId in params" })

        if (req.body.bookId != req.params.bookId) return res.status(400).send({ status:false,message: "bookId should be equal in params and body" })

        let alreadyPresent = await bookModel.findOne({ _id: data.bookId, isDeleted: false })

        if (!alreadyPresent) return res.status(400).send({ status:false,message: "no book found with this Id" })

        let reviewSave = await reviewModel.create(data)

        let updateBook = await bookModel.findByIdAndUpdate(data.bookId, { $inc: { reviews: 1 } }, { new: true }).lean()

        let responsedata = { _id: reviewSave._id, bookId: reviewSave.bookId, reviewedBy: reviewSave.reviewedBy, reviewedAt: reviewSave.reviewedAt, rating: reviewSave.rating, review: reviewSave.review }

        updateBook["reviewsData"] = responsedata
        return res.status(200).send({ status: true, message: `review count updated successfully for ${updateBook.title}`, data: updateBook })

    } catch (error) {
        return res.status(500).send({status: false, error: error.message })
    }
}

// ---------------------------------REVIEW UPDATE-----------------------------------------------------------

const reviewUpdate = async (req, res) => {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send({ status:false,message: "no data here to update"})

        let bookId = req.params.bookId

        let reviewId = req.params.reviewId

        if((!mongoose.Types.ObjectId.isValid(bookId))|| (!mongoose.Types.ObjectId.isValid(reviewId)))
        return res.status(400).send({ status:false,message: "type of bookId or reviewId is not a valid objectId" });

        let { review, rating, reviewedBy } = data

        let error = 0;
        let validation = await updatereviewJoi.validateAsync(data).then(() => true).catch((err) => { error = err.message; return null })

        if (!validation) return res.status(400).send({ status: false, message: `${error}` })

        let bookCheck = await bookModel.findOne({_id:bookId, isDeleted: false }).lean()

        if (!bookCheck) return res.status(404).send({status:false, message: "no book with Id exist" })

        let reviewCheck = await reviewModel.findOne({_id:reviewId,isDeleted:false})

        if (!reviewCheck) return res.status(404).send({ status:false,message: "no review exists with this Id" })

        let updateReview = await reviewModel.findByIdAndUpdate(reviewId, { $set: { review: review, rating: rating, reviewedBy: reviewedBy } }, { new: true }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        bookCheck["reviewsData"] = updateReview

       return  res.status(200).send({status:true,message:"Book lists", data: bookCheck })
    }
    catch (error) {
        return res.status(500).send({status: false, error: error.message })
    }
}

// ===========================================DELETE REVIEW==============================================

const deleteReview = async (req, res) => {
   try {
	 let bookId = req.params.bookId
	
	    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "bookId is not a valid object id" })
	
	    let reviewId = req.params.reviewId
	
	    if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not a valid object id" })

        let bookCheck = await bookModel.findOne({_id:bookId, isDeleted: false })

        if (!bookCheck) return res.status(404).send({status:false, message: "no book with Id exist" })

	    let checkReview = await reviewModel.findOne({ _id: reviewId,  isDeleted: false })
	
	    if (!checkReview) return res.status(404).send({ status: false, message: "no review found for this book" })
	
	    await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } })
	
	    await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } })
	
	    return res.status(200).send({status:true, message: "successfully deleted"})

} catch (error) {
	return res.status(500).send({status: false,error:error.message})
}}

// -------------------------------------EXPORTS----------------------------------

module.exports = { reviewCreate, reviewUpdate, deleteReview }

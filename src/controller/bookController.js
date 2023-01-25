const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const moment = require("moment")
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const joi = require("joi");
const { bookJoi, updateJoi } = require("../validation/joiValidation");

const createBook = async (req, res) => {
  try {
    let data = req.body;

    let error = 0
    const validation = await bookJoi.validateAsync(data).then(() => true).catch((err) => { error= err.message; return null })

    if (!validation) return res.status(400).send({ status: false, message: `${error}` })

    //no need
    if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "userId is not a valid object id" })

    //no need
    const findUser = await userModel.findById(data.userId)
    if (!findUser) return res.status(400).send({ status: false, message: "userId doesnt exist" })

    title = data.title.trim()
    ISBN = data.ISBN.trim()   //no need

    const existingData = await bookModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

    if (existingData) {
      if (existingData.title == title) return res.status(400).send({ status: false, message: "title is already in use" })
      if (existingData.ISBN == ISBN) return res.status(400).send({ status: false, message: "ISBN is already in use" })
    }

    if (data.isDeleted === true) data.deletedAt = Date.now()

    
    data.releasedAt=Date.now()
    const createData = await bookModel.create(data)

    return res.status(201).send({ status: true, data: createData });

    // data.title = title.charAt(0).toUpperCase() + title.slice(1);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getData = async (req, res) => {
  try {
    let data = req.query;
    let filter = {
      isDeleted: false,
      ...data,
    };

    if (Object.keys(data).includes("userId")) {
      if (!mongoose.Types.ObjectId.isValid(data.userId))
        return res.status(400).send({ msg: "objectId is not valid" });
    }
    const findInDb = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 });

    if (findInDb.length == 0)
      return res.status(404).send({ msg: "no book found" });

    return res.status(200).send({ status: true, message: "Books list", data: findInDb });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    if (!bookId) return res.status(400).send({ status: false, message: "please provide param" });

    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" });

    const findData = await bookModel.findById(bookId).lean();

    if (!findData) return res.status(404).send({ status: false, message: "no book found" });

    const findInReviw = await reviewModel.find({ bookId: bookId }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0 });

    findData["reviewsData"] = findInReviw;

    // findData._doc.reviewsData=findInReviw

    return res.status(200).send({ status: true, message: "Books list", data: findData });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateData = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    // if (!bookId) return res.status(400).send({ status: false, message: "please provide param" });
    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "please send some data" });

    let { title, ISBN, releasedAt, excerpt } = data;

    let one = 0;
    const validation = await updateJoi.validateAsync(data).then(() => true).catch((err) => { one = err.message; return null; });

    if (!validation) return res.status(400).send({ status: false, message: `${one}` });

    if (title || ISBN) {
      const existingData = await bookModel.findOne({ $or: [{ title: title.trim() }, { ISBN: ISBN }] });
      if (existingData) {
        if (existingData.title == title.trim()) return res.status(400).send({ status: false, message: "title is already present" });

        if (existingData.ISBN == ISBN) return res.status(400).send({ status: false, message: "ISBN is already present" })
      }
    }

    const isExist = await bookModel.findOne({ _id: bookId, isDeleted: false });

    if (!isExist) return res.status(404).send({ status: false, message: "no book found with this id" });

    const updateBook = await bookModel.findByIdAndUpdate(bookId, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }, }, { new: true });

    return res.status(200).send({ status: true, data: updateBook });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false });

    if (!checkBook) return res.status(404).send({ status: false, message: "no book found with this id" });

    await bookModel.findByIdAndUpdate(bookId, { isDeleted: true, deletedAt: Date.now() });

    res.status(200).send({ status: true, message: "book deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { createBook, getData, getBookById, updateData, deleteData }




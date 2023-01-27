const express=require("express")
const router=express.Router()
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const {authentication,authForCreation,authForDltAndPut}=require("../middleware/middle")
const reviewController=require("../controller/reviewController")

// --------------------------USER ROUTE-------------------------------------------
router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)

// ---------------------------BOOK ROUTE-------------------------------------------------------
router.post("/books",authentication,authForCreation,bookController.createBook)

router.get("/books",authentication,bookController.getData)

router.get("/books/:bookId",authentication,bookController.getBookById)

router.put("/books/:bookId",authentication,authForDltAndPut,bookController.updateData)

router.delete("/books/:bookId",authentication,authForDltAndPut,bookController.deleteData)

// ---------------------------REVIEW ROUTE----------------------------------

router.post("/books/:bookId/review",reviewController.reviewCreate)
router.put("/books/:bookId/review/:reviewId",reviewController.reviewUpdate)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)

router.all("/*", (req, res) => {
    res.status(400).send({ message: "invalid path" });
  });

  //EXPORTS:

module.exports=router
const express=require("express")
const router=express.Router()
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const {authentication,authForCreation,authForDltAndPut}=require("../middleware/middle")


router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",authentication,authForCreation,bookController.createBook)

router.get("/books",authentication,bookController.getData)

router.get("/books/:bookId",authentication,bookController.getBookById)

router.put("/books/:bookId",authentication,authForDltAndPut,bookController.updateData)

router.delete("/books/:bookId",authentication,authForDltAndPut,bookController.deleteData)

router.all("/*", (req, res) => {
    res.status(400).send({ message: "invalid path" });
  });

module.exports=router
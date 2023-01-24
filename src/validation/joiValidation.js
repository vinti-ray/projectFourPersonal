const Joi = require('joi');

const bookJoi = Joi.object({
    
      title: Joi.string().required(),

      excerpt: Joi.string().required(),

      ISBN: Joi.string().required().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).message("please enter valid ISBN"),

      userId:Joi.required(),

      category:Joi.string().required(),
    
      subcategory: Joi.string().required(),
      reviews: Joi.number(),
      deletedAt: Joi.date(),
      isDeleted: Joi.boolean(),
      releasedAt: Joi.date().required()
    })



const userJOI=Joi.object({
  title: Joi.string().required().valid("Mr", "Mrs", "Miss"),

  name: Joi.string().required().regex(/^[a-zA-Z ]+$/).message("please enter valid name"),
 
  phone: Joi.string().trim().required().regex(/^[0]?[6789]\d{9}$/).message("phone is not valid"),

  email:Joi.string().trim().required().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).message("please enter valid email"),

  password: Joi.string().trim().required().min(8).max(15).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/).message("password  should contain Min 8 character and 1 Special Symbol"),

  address: Joi.object({
    street: Joi.string(),

    city: Joi.string(),

    pincode:Joi.string().regex(/^([0-9]{4}|[0-9]{6})$/).message("please enter valid pin")
  })
  


  

})
    const reviewJoi = Joi.object({
      bookId: Joi.string().required(),


      reviewedBy:Joi.string().required(),

      reviewedAt:Joi.date().required(),

      rating:Joi.number().min(1).max(5).required(),

      review:Joi.string(),
    
      isDeleted:Joi.boolean()

    })

    const loginJoi=Joi.object({
      email:Joi.string().trim().required().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).message("please enter valid email"),
      password: Joi.string().trim().required().min(8).max(15).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/).message("please enter valid password"),
    })


    const updateJoi=Joi.object({
      title: Joi.string(),

      excerpt: Joi.string(),

      ISBN: Joi.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/),
      releasedAt: Joi.date()
    })





    module.exports={bookJoi,reviewJoi,userJOI,loginJoi,updateJoi}



    //add trim and message in isbn part
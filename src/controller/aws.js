
const aws = require('aws-sdk')

// s3 and cloud stodare
//  step1: multer will be used to get access to the file in nodejs( from previous session learnings)
//  step2:[BEST PRACTISE]:- always write s2 upload function separately- in a separate file/function..exptect it to take file as input and return the uploaded file as output
// step3: aws-sdk install - as package
// step4: Setupconfig for aws authenticcation- use code below as plugin keys that are given to you
//  step5: build the uploadFile funciton for uploading file- use code below and edit what is marked HERE only


//PROMISES:-
// -you can never use await on callback..if you awaited something , then you can be sure it is within a promise
// -how to write promise:- wrap your entire code inside: "return new Promise( function(resolve, reject) { "...and when error - return reject( err )..else when all ok and you have data, return resolve (data)

const uploadFile = async (files) => {  //    // this function will upload file to aws and return the link

    return new Promise(function (resolve, reject) {
        aws.config.update({
            accessKeyId: "AKIAY3L35MCRZNIRGT6N",
            secretAccessKey: "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",
            region: "ap-south-1"
        })



        let s3 = new aws.S3({ apiVersion: '2006-03-01' });  ///// we will be using the s3 service of aws


        // s3.upload({
            //ACL: "public-read",
        //     Bucket: 'classroom-training-bucket',
        //     Key: "Group7/" + files.originalname,
        //     Body: files.buffer
        //   }, function(err, data) {
        //     if (err) {
        //       return reject({ "error": err })
        //     } else {
        //     console.log("file uploaded succesfully")
  
            // return resolve(data.Location)
        //     }
        //   });

        let uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "Group7/" + files.originalname,
            Body: files.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            console.log("file uploaded succesfully")
  
            return resolve(data.Location)
        })
    })
}
module.exports = { uploadFile }
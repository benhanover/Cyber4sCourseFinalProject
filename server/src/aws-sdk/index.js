const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config({ path: '../../.env' });

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


// export const saveImageProfileToAWS=(userId: string , imageFile: any){
    
// }

const s3 = new AWS.S3({apiVersion: '2006-03-01'});
// call S3 to retrieve upload file to specified bucket
const uploadParams = {Bucket: process.env.AWS_S3_BUCKET_NAME, Key: 'annonymous', Body: fs.readFileSync('../assets/images/annonymous.png'), ContentType: 'image/png'};

s3.upload(uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }
});

// const readparams = {
//   Bucket: process.env.AWS_S3_BUCKET_NAME, 
//   MaxKeys: 1
// };
// s3.listObjects(readparams, function(err, data) {
//    if (err)return console.log(err, err.stack); 
//   fs.writeFileSync("../assets/images/result", data);








// });
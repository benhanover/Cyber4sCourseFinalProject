const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
// const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});



export function uploadImage(file: any, username: string, type: string) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: fileStream,
    Key: username,
    ACL: 'public-read',
    ContentType: type,
  }
  return s3.upload(uploadParams).promise();
}




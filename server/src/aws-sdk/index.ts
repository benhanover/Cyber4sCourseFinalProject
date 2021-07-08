const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
// const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});



export function uploadImage(file: any) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
    ACL: 'public-read',
    ContentType: 'image/png',
  }
  return s3.upload(uploadParams).promise();
}

export function getFileStream(fileKey: any) {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.AWS_S3_BUCKET_NAME
  }
  return s3.getObject(downloadParams).createReadStream();
}

// export
// export const uploadToS3 = async (data: string, username: string) => {
//   const name = 'default' + '.png';
//   await s3.putObject({
//     Key: name,
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     ContentType: 'image/png',
//     Body: data,
//     ACL: 'public-read',
//   }).promise();
//   return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${username}`;
// };



const AWS = require('aws-sdk');
const {promisify} = require('util');
const fs = require('fs');
// require('dotenv').config({ path: '../../.env' });

const readFilePromise = promisify(fs.readFile);

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadToS3 = async (data, username) => {
  const name = username + '.png';
  await s3.putObject({
    Key: name, f
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ContentType: 'image/png',
    Body: data,
    ACL: 'public-read',
  }).promise();
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${name}`;
};


const main = async () => {
  try {
    const data = await readFilePromise('../assets/images/annonymous.png');
    const url = await uploadToS3(data);
    console.log(url);
  } catch(e) {
    console.log(e);
  }
}
main();

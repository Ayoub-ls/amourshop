require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testConnection() {
  console.log("Testing Cloudinary Credentials...");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key length (if exists):", process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.length : 'MISSING');
  console.log("API Secret length (if exists):", process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 'MISSING');

  try {
    const res = await cloudinary.api.ping();
    console.log("SUCCESS! Cloudinary ping successful:", res);
  } catch (error) {
    console.error("FAILURE! Cloudinary ping failed:");
    console.error(error);
  }
}

testConnection();

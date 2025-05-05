const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file in cloudinary
const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    console.log(`File uploaded to Cloudinary. File src: ${response.url}`);

    //file is remove from the local storage after being uploaded to the cloudinary
    fs.unlinkSync(filepath);
    return response;
  } catch (error) {
    console.log("Error while upload on cloudinary", error);
    fs.unlinkSync(filepath);
    return null;
  }
};

//delete file from cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("Delete from cloudinary, PublicId:", publicId);
  } catch (error) {
    console.log("Error while delete from cloudinary", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };

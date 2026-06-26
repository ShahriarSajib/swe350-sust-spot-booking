const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate a unique public ID (without extension, multer-storage-cloudinary handles extension)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    
    // Choose folder dynamically based on fieldname or default
    let folder = "sust-spot-booking/general";
    if (file.fieldname === "profile_picture") {
      folder = "sust-spot-booking/profiles";
    } else if (file.fieldname === "signature") {
      folder = "sust-spot-booking/signatures";
    } else if (file.fieldname && file.fieldname.startsWith("image")) {
      folder = "sust-spot-booking/spots";
    } else if (file.fieldname === "coverImage" || file.fieldname === "galleryImages") {
      folder = "sust-spot-booking/blogs";
    }

    return {
      folder: folder,
      public_id: uniqueSuffix,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    };
  },
});

module.exports = { cloudinary, storage };

// Cloudinary integration for file uploads
// Note: This is a placeholder implementation
// You would need to configure cloudinary with your actual credentials

const cloudinary = require("cloudinary").v2;
const { AppError } = require("./appError");

// Configure cloudinary (you would set these in environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to cloudinary
const uploadToCloudinary = async (file, folder = "uploads") => {
  try {
    // Convert buffer to base64
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    return uploadResponse.secure_url;
  } catch (error) {
    throw new AppError("Error uploading file", 500);
  }
};

// Delete file from cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    // Don't throw error for delete operations as it's not critical
    console.error("Error deleting file from cloudinary:", error);
    return false;
  }
};

// Placeholder implementation for when cloudinary is not configured
const uploadToLocal = async (file, folder = "uploads") => {
  // This would save files locally instead of cloudinary
  // For now, just return a placeholder URL
  return `http://localhost:3002/uploads/${Date.now()}-${file.originalname}`;
};

const deleteFromLocal = async (imageUrl) => {
  // This would delete files locally
  // For now, just return true
  return true;
};

// Export functions - use local if cloudinary is not configured
const uploadFile = process.env.CLOUDINARY_CLOUD_NAME
  ? uploadToCloudinary
  : uploadToLocal;
const deleteFile = process.env.CLOUDINARY_CLOUD_NAME
  ? deleteFromCloudinary
  : deleteFromLocal;

module.exports = {
  uploadToCloudinary: uploadFile,
  deleteFromCloudinary: deleteFile,
};

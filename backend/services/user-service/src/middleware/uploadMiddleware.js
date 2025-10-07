const multer = require("multer");
const { AppError } = require("../utils/appError");

// Memory storage for file uploads
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("File too large. Maximum size is 5MB.", 400));
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new AppError("Too many files. Maximum is 1 file.", 400));
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new AppError("Unexpected field name for file upload.", 400));
    }
  }

  next(err);
};

module.exports = {
  upload,
  handleMulterError,
};

// utils/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to create Multer configuration
const createMulterConfig = (subfolder, fileTypes, fileSizeLimit = 5) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, `../../uploads/${subfolder}`);

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (fileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${fileTypes.join(", ")} files are allowed!`), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit * 1024 * 1024 }, // MB to bytes
  });
};

// Specific configurations
const complaintUpload = createMulterConfig(
  "complaints",
  ["image/jpeg", "image/png", "image/gif"],
  5 // 5MB limit
);

const documentUpload = createMulterConfig(
  "documents",
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  10 // 10MB limit
);

module.exports = {
  complaintUpload,
  documentUpload,
  createMulterConfig, // Export the factory function if you need to create more
};

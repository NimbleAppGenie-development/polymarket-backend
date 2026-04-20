const multer = require("multer");
const path = require("path");
const fs = require("fs");


const fileService = (fileType, folder, isVideo) => {
  
  const allowedFileTypes = {
    image: /jpeg|jpg|png|gif/,
    video: /mp4|avi|mov|mkv/,
  };

  const baseUploadPath = path.join(__dirname, "../../../../public");
  
  // Multer Storage Configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        // Use fileType and folder to define the directory path
        const uploadPath = path.join(baseUploadPath, folder || fileType);       

        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });        

        cb(null, uploadPath);
      } catch (error) {
        console.error("Error creating directory:", error);
        cb(error, null);
      }
    },

    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
     
      cb(null, uniqueName);
    }
  });

  // Multer File Filter for Validation
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
  
    if (!allowedFileTypes[fileType].test(ext)) {
      console.log(`File type not allowed: ${ext}`);
      return cb(new Error(`Only ${fileType} files are allowed`), false);
    }
    cb(null, true);
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: isVideo ? { fileSize: 500 * 1024 * 1024 } : { fileSize: 100 * 1024 * 1024 }, // 500MB for videos, 100MB for images
  }).any();
};

module.exports = {
  fileService
};

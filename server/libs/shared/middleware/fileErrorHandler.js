const multer = require("multer");

const fileErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // If error is related to Multer file upload issues
        return res.status(400).json({
            status: false,
            message: `File upload error: ${err.message}`
        });
    } else if (err) {
        // If any other error occurs (like no image uploaded)
        return res.status(400).json({
            status: false,
            message: err.message || "An unknown error occurred."
        });
    }
    next();
};

module.exports = { fileErrorHandler };
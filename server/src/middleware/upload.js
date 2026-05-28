const multer = require("multer");
const { isPdfBuffer } = require("../utils/validators");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files allowed"), false);
      return;
    }

    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const validatePdfBuffer = (req, res, next) => {
  if (!req.file?.buffer) {
    return next();
  }

  if (!isPdfBuffer(req.file.buffer)) {
    return next(new Error("Invalid PDF file content"));
  }

  return next();
};

module.exports = upload;
module.exports.validatePdfBuffer = validatePdfBuffer;

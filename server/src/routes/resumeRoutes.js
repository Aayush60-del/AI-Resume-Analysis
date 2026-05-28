const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");
const { uploadLimiter } = require("../middleware/rateLimiter");

const { uploadResume, getResumeHistory, getSingleAnalysis } = require("../controllers/resumeController");
const { deleteResume } = require("../controllers/deleteResume");

const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    upload.validatePdfBuffer(req, res, next);
  });
};

router.post("/upload", protect, uploadLimiter, handleUpload, uploadResume);
router.delete("/delete/:id", protect, deleteResume);
router.get("/history", protect, getResumeHistory);
router.get("/analysis/:id", protect, getSingleAnalysis);

module.exports = router;

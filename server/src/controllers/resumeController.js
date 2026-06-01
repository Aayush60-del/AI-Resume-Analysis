const mongoose = require("mongoose");
const path = require("path");
const pdfParse = require("pdf-parse");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { ResumeModel } = require("../models/Resume");
const analysisModel = require("../models/analysis");
const s3 = require("../config/s3");
const { analyzeResume } = require("../services/grokService");
const { sendError } = require("../utils/sendError");

const HISTORY_LIMIT = 50;

const safeFileName = (fileName) => {
  const parsed = path.parse(fileName);
  const base = parsed.name.replace(/[^a-z0-9-_]/gi, "-").slice(0, 80) || "resume";

  return `${base}.pdf`;
};

const deleteS3Object = async (key) => {
  if (!process.env.AWS_BUCKET_NAME || !key) {
    return;
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    })
  );
};

const uploadResume = async (req, res) => {
  let uploadedKey = null;
  let savedFile = null;
  let savedAnalysis = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!process.env.AWS_BUCKET_NAME) {
      return res.status(500).json({ message: "File storage is not configured" });
    }

    const resumeData = await pdfParse(req.file.buffer);

    if (!resumeData.text?.trim()) {
      return res.status(400).json({
        message: "Could not read text from this PDF. Please upload a text-based resume PDF.",
      });
    }

    const analysisPayload = await analyzeResume(resumeData.text);
    const userId = req.user.id;
    const fileName = `resumes/${userId}/${Date.now()}-${safeFileName(req.file.originalname)}`;
    uploadedKey = fileName;

    const parallelUpload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: "application/pdf",
      },
    });

    const uploadResult = await parallelUpload.done();

    savedFile = await ResumeModel.create({
      userId,
      fileUrl: uploadResult.Location,
      publicId: fileName,
    });

    savedAnalysis = await analysisModel.create({
      userId,
      resumeId: savedFile._id,
      ...analysisPayload,
    });

    res.status(200).json({
      message: "Resume uploaded and analyzed successfully",
      analysis: savedAnalysis,
      resumeId: savedFile._id,
    });
  } catch (error) {
    if (savedAnalysis?._id) {
      await analysisModel.deleteOne({ _id: savedAnalysis._id }).catch(() => {});
    }

    if (savedFile?._id) {
      await ResumeModel.deleteOne({ _id: savedFile._id }).catch(() => {});
    }

    if (uploadedKey) {
      await deleteS3Object(uploadedKey).catch(() => {});
    }

    return sendError(res, error);
  }
};

const uploadDemoResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeData = await pdfParse(req.file.buffer);

    if (!resumeData.text?.trim()) {
      return res.status(400).json({
        message: "Could not read text from this PDF. Please upload a text-based resume PDF.",
      });
    }

    const analysisPayload = await analyzeResume(resumeData.text);

    res.status(200).json({
      message: "Demo resume analyzed successfully",
      analysis: {
        _id: "demo-analysis",
        ...analysisPayload,
      },
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const history = await analysisModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(HISTORY_LIMIT)
      .lean();

    res.status(200).json({ history });
  } catch (error) {
    return sendError(res, error);
  }
};

const getSingleAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid analysis id" });
    }

    const analysis = await analysisModel.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    res.status(200).json({ analysis });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { uploadResume, uploadDemoResume, getResumeHistory, getSingleAnalysis };

const mongoose = require("mongoose");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { ResumeModel } = require("../models/Resume");
const analysisModel = require("../models/analysis");
const s3 = require("../config/s3");
const { sendError } = require("../utils/sendError");

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid resume id",
      });
    }

    let resume = await ResumeModel.findOne({ _id: id, userId });
    let resumeId = id;

    if (!resume) {
      const analysis = await analysisModel.findOne({ _id: id, userId });

      if (!analysis) {
        return res.status(404).json({
          message: "Resume not found",
        });
      }

      resumeId = analysis.resumeId;
      resume = await ResumeModel.findOne({ _id: resumeId, userId });
    }

    if (!resume) {
      await analysisModel.deleteMany({ resumeId, userId });
      return res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
      });
    }

    if (process.env.AWS_BUCKET_NAME && resume.publicId) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: resume.publicId,
        })
      );
    }

    await analysisModel.deleteMany({ resumeId: resume._id, userId });
    await ResumeModel.deleteOne({ _id: resume._id, userId });

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { deleteResume };

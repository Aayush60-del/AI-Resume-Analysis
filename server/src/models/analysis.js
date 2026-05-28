const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },

  score: {
    type: Number,
    required: true,
  },

  strengths: {
    type: [String],
    default: [],
  },

  weaknesses: {
    type: [String],
    default: [],
  },

  missingSkills: {
    type: [String],
    default: [],
  },

  suggestions: {
    type: [String],
    default: [],
  },
  formattingFeedback: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const analysisModel = mongoose.model("Ai_Analysis", analysisSchema);

module.exports = analysisModel;
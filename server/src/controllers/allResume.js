const { ResumeModel } = require("../models/Resume");

const allResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await ResumeModel.find({ userId });

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { allResume };
const User = require("../models/User");
const { sendError } = require("../utils/sendError");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { getProfile };

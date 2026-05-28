const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/sendError");
const {
  normalizeEmail,
  validateSignup,
  validateLogin,
} = require("../utils/validators");

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const signup = async (req, res) => {
  try {
    const validationError = validateSignup(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { name, password } = req.body;
    const normalizedEmail = normalizeEmail(req.body.email);
    const existUser = await User.findOne({ email: normalizedEmail });

    if (existUser) {
      return res.status(400).json({
        message: "Unable to register with this email. Try logging in instead.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      token: createToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const validationError = validateLogin(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { password } = req.body;
    const normalizedEmail = normalizeEmail(req.body.email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: createToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { signup, login };

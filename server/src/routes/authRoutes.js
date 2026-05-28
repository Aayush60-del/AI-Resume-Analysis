const express = require("express");
const route = express.Router();
const { signup, login } = require("../controllers/authController");
const { getProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

route.post("/signup", authLimiter, signup);
route.post("/login", authLimiter, login);
route.get("/profile", protect, getProfile);

module.exports = route;

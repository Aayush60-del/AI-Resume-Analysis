const mongoose = require("mongoose");

const connectDB = async function () {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not configured");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

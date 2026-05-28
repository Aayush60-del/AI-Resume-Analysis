const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoute = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoute);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer API is running");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed" });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "PDF file must be 5MB or smaller",
    });
  }

  if (error.message === "Only PDF files allowed" || error.message === "Invalid PDF file content") {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error.statusCode && error.statusCode < 500) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error("[Unhandled Error]", error);

  return res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
});

module.exports = app;

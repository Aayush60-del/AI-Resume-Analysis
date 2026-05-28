const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoute = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const normalizeOrigin = (url) =>
  typeof url === "string" ? url.trim().replace(/\/+$/, "") : "";

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ai-resume-analysis-wheat.vercel.app",
    normalizeOrigin(process.env.CLIENT_URL),
  ].filter(Boolean)
);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalized = normalizeOrigin(origin);

  if (allowedOrigins.has(normalized)) {
    return true;
  }

  if (/^https:\/\/ai-resume-analysis[a-z0-9-]*\.vercel\.app$/i.test(normalized)) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      console.warn("[CORS] Blocked origin:", origin);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
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

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "AI Resume Analyzer API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
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

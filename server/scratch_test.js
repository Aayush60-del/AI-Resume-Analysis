const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const Groq = require("groq-sdk");
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

async function testServices() {
  console.log("Starting diagnostic tests...");
  console.log("MONGO_URL length:", process.env.MONGO_URL ? process.env.MONGO_URL.length : "undefined");
  console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : "undefined");
  console.log("AWS_ACCESS_KEY_ID length:", process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.length : "undefined");

  // 1. Test Mongo
  try {
    console.log("\n1. Testing MongoDB Connection...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✓ MongoDB Connected Successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("✗ MongoDB Connection Failed:", err.message);
  }

  // 2. Test Groq
  try {
    console.log("\n2. Testing Groq API Connection...");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say 'Hello ResumAI'" }],
      temperature: 0.1,
    });
    console.log("✓ Groq API Works! Response:", completion.choices?.[0]?.message?.content);
  } catch (err) {
    console.error("✗ Groq API Failed:", err.message);
  }

  // 3. Test AWS S3
  try {
    console.log("\n3. Testing AWS S3 Connection...");
    const config = { region: process.env.AWS_REGION };
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }
    const s3 = new S3Client(config);
    const command = new ListBucketsCommand({});
    await s3.send(command);
    console.log("✓ AWS S3 Connection Works!");
  } catch (err) {
    console.error("✗ AWS S3 Connection Failed:", err.message);
  }
}

testServices();

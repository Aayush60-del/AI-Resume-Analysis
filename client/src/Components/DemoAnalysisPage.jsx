import { motion } from "motion/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { uploadDemoResume } from "../services/resumeService";
import getErrorMessage from "../utils/getErrorMessage";
import AnalysisPage from "./AnalysisPage";
import TopNav from "./TopNav";

const DEMO_USED_KEY = "resumai_demo_used";
const DEMO_RESULT_KEY = "resumai_demo_result";

const getInitialDemoResult = () => {
  const cachedResult = sessionStorage.getItem(DEMO_RESULT_KEY);

  if (!cachedResult) {
    return null;
  }

  try {
    return JSON.parse(cachedResult);
  } catch {
    sessionStorage.removeItem(DEMO_RESULT_KEY);
    return null;
  }
};

const DemoAnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(getInitialDemoResult);
  const [loading, setLoading] = useState(false);
  const [demoUsed, setDemoUsed] = useState(
    () => localStorage.getItem(DEMO_USED_KEY) === "true"
  );
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async () => {
    if (demoUsed) {
      toast.error("Demo scan already used in this browser");
      return;
    }

    if (!file) {
      toast.error("Select a PDF resume first");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadDemoResume(file);

      localStorage.setItem(DEMO_USED_KEY, "true");
      sessionStorage.setItem(DEMO_RESULT_KEY, JSON.stringify(response.analysis));
      setDemoUsed(true);
      setAnalysis(response.analysis);
      setFile(null);
      toast.success("Demo analysis ready");
    } catch (err) {
      toast.error(getErrorMessage(err, "Demo upload failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      return;
    }

    toast.error("Only PDF files are supported");
  };

  if (analysis) {
    return <AnalysisPage initialAnalysis={analysis} />;
  }

  return (
    <main className="analysis-page">
      <TopNav active="Analyze" compact />

      <section className="demo-page">
        <motion.div
          className="tool-heading demo-heading"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span>One-time demo scan</span>
          <h1>Upload one resume and test the AI report</h1>
          <p>
            Try ResumAI once without creating an account. Your demo upload is analyzed for this
            session only and is not saved to your dashboard history.
          </p>
        </motion.div>

        <motion.section
          className={`upload-panel demo-upload-panel ${dragOver ? "drag-over" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {demoUsed ? (
            <>
              <div className="upload-icon">1X</div>
              <h2>Demo scan used</h2>
              <p>
                This browser has already used the free demo scan. Sign in to upload more resumes,
                save history, and revisit reports.
              </p>
              <div className="demo-actions">
                <Link to="/login">Login</Link>
                <Link to="/signup">Create account</Link>
              </div>
            </>
          ) : (
            <>
              <div className="upload-icon">PDF</div>
              <h2>Choose your resume</h2>
              <p>Upload a text-based PDF resume up to 5MB for a live ATS analysis.</p>

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />

              {file && (
                <motion.small
                  className="selected-file"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Selected: {file.name}
                </motion.small>
              )}

              <motion.button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                {loading ? "Analyzing..." : "Run Demo Analysis"}
              </motion.button>
            </>
          )}
        </motion.section>
      </section>
    </main>
  );
};

export default DemoAnalysisPage;

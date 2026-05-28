import { useContext, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContextValue";
import { deleteResume, getHistory, uploadResume } from "../services/resumeService";
import getErrorMessage from "../utils/getErrorMessage";
import DashboardSidebar from "./DashboardSidebar";
const getGreeting = () => {

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
};
const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryError("");
        const data = await getHistory();
        setHistory(data.history || []);
      } catch (err) {
        setHistoryError(getErrorMessage(err, "Unable to load history"));
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.querySelector(location.hash);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, history.length]);

  const stats = useMemo(() => {
    if (!history.length) {
      return {
        totalUploads: 0,
        averageScore: 0,
        bestScore: 0,
      };
    }

    const totalUploads = history.length;
    const totalScore = history.reduce((acc, item) => acc + (item.score || 0), 0);
    const averageScore = Math.round(totalScore / totalUploads);
    const bestScore = Math.max(...history.map((item) => item.score || 0));

    return {
      totalUploads,
      averageScore,
      bestScore,
    };
  }, [history]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a PDF first");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadResume(file);

      setHistory((prev) => [response.analysis, ...prev]);
      setFile(null);

      navigate(`/analysis/${response.analysis._id}`, {
        state: {
          analysis: response.analysis,
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm("Delete this resume analysis?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteResume(item.resumeId || item._id);
      setHistory((prev) => prev.filter((entry) => entry._id !== item._id));
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      return;
    }

    toast.error("Only PDF files are supported");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="dashboard-layout">
      <DashboardSidebar active="dashboard" />

      <section className="dashboard-main">
        <motion.div
          className="dash-intro"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
<h1>{getGreeting()}, {user?.name || "candidate"}</h1>
          <p>
            Your resume intelligence suite is ready. Upload a PDF resume to
            generate ATS scoring, keyword gaps, formatting feedback, and
            optimization suggestions.
          </p>
        </motion.div>

        <motion.div
          className="metric-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.article variants={item}>
            <span>Total uploads</span>
            <b>{stats.totalUploads}</b>
            <i>📊</i>
          </motion.article>

          <motion.article variants={item}>
            <span>Average score</span>
            <b>{stats.averageScore}%</b>
            <i>📈</i>
          </motion.article>

          <motion.article variants={item} className="wide">
            <span>Best ATS Score</span>
            <b>{stats.bestScore}%</b>
            <i>⭐</i>
          </motion.article>
        </motion.div>

        <motion.section
          id="upload"
          className={`upload-panel ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: dragOver ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="upload-icon">PDF</div>

          <h2>Analyze new resume</h2>

          <p>Choose a PDF file for an AI-powered ATS audit.</p>

          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {file && (
            <motion.small
              className="selected-file"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ {file.name}
            </motion.small>
          )}

          <motion.button
            onClick={handleUpload}
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </motion.button>
        </motion.section>

        <section className="recent-scans" id="history">
          <div className="section-head">
            <h2>Recent scans</h2>
            <a href="#history">View all</a>
          </div>

          {historyError && <div className="tool-empty">{historyError}</div>}

          {!historyError && !history.length && (
            <div className="tool-empty">No resume scans yet. Upload a PDF to begin.</div>
          )}

          <AnimatePresence mode="popLayout">
            {history.map((entry, index) => (
              <motion.article
                className="scan-row"
                key={entry._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginTop: 0, padding: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div
                  className="scan-content"
                  onClick={() =>
                    navigate(`/analysis/${entry._id}`, {
                      state: {
                        analysis: entry,
                      },
                    })
                  }
                >
                  <div className="file-icon">PDF</div>

                  <div>
                    <b>Resume Analysis</b>
                    <small>ATS Score: {entry.score}%</small>
                  </div>
                </div>

                <div className="scan-actions">
                  <strong>{entry.score}% ATS</strong>

                  <motion.button
                    className="delete-btn"
                    onClick={() => handleDelete(entry)}
                    whileHover={{ backgroundColor: "crimson", color: "white" }}
                    whileTap={{ scale: 0.92 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>

        <motion.article
          className="insight-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span>AI Insight of the day</span>

          <h2>Boost your response rate with measurable impact</h2>

          <p>
            Incorporating metrics and specific outcomes improves both ATS
            matching and recruiter readability.
          </p>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link to="/optimizations">Show me how</Link>
          </motion.div>
        </motion.article>
      </section>
    </main>
  );
};

export default DashboardPage;

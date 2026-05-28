import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSingleAnalysis } from "../services/resumeService";
import getErrorMessage from "../utils/getErrorMessage";
import DashboardSidebar from "./DashboardSidebar";
import ScoreRing from "./ScoreRing";
import TopNav from "./TopNav";

const AnalysisPage = ({ initialAnalysis = null }) => {
  const location = useLocation();
  const { id } = useParams();
  const isGuestView = location.pathname === "/demo";

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(!isGuestView && Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (isGuestView) {
      setAnalysis(initialAnalysis);
      setLoading(false);
      setError("");
      return;
    }

    if (!id) {
      setAnalysis(null);
      setLoading(false);
      return;
    }

    const stateMatch = location.state?.analysis;

    if (stateMatch?._id === id) {
      setAnalysis(stateMatch);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError("");
      setAnalysis(null);

      try {
        const data = await getSingleAnalysis(id);

        if (!cancelled) {
          setAnalysis(data.analysis);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Unable to load analysis"));
          setAnalysis(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, [id, isGuestView, initialAnalysis, location.state?.analysis]);

  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const missingSkills = analysis?.missingSkills || [];
  const suggestions = analysis?.suggestions || [];
  const formattingFeedback = analysis?.formattingFeedback || [];
  const score = analysis?.score || 0;

  const downloadReport = () => {
    const report = [
      "ResumAI Analysis Report",
      `ATS Score: ${score}%`,
      "",
      "Strengths:",
      ...strengths.map((item) => `- ${item}`),
      "",
      "Weaknesses:",
      ...weaknesses.map((item) => `- ${item}`),
      "",
      "Missing Keywords:",
      ...missingSkills.map((item) => `- ${item}`),
      "",
      "Formatting Feedback:",
      ...formattingFeedback.map((item) => `- ${item}`),
      "",
      "Suggestions:",
      ...suggestions.map((item) => `- ${item}`),
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "resume-analysis-report.txt";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  const copySuggestions = async () => {
    if (!suggestions.length) {
      toast.error("No suggestions to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(suggestions.join("\n"));
      toast.success("Suggestions copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  if (loading) {
    return <main className="loading-analysis">Loading analysis...</main>;
  }

  if (!analysis) {
    return (
      <main className="analysis-page">
        <div className="empty-analysis">
          <h1>{error || "No Analysis Found"}</h1>

          <p>Upload a resume first to generate AI-powered ATS insights.</p>

          <Link to="/dashboard">
            <button className="go-dashboard-btn" type="button">
              Go To Dashboard
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const scoreHeadline =
    score >= 85
      ? "Elite readiness detected"
      : score >= 70
        ? "Strong resume foundation"
        : "Resume needs optimization";

  const analysisContent = (
    <>
      <motion.section
        className="score-section"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ScoreRing score={score} />

        <h1>{scoreHeadline}</h1>
        <p>Your resume has been analyzed successfully by AI.</p>
      </motion.section>

      <motion.div
        className="analysis-grid"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.section className="report-card" variants={fadeUp}>
          <h2>Key Strengths</h2>

          <div className="strength-grid">
            {strengths.map((item, index) => (
              <motion.article
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <h3>Strength {index + 1}</h3>
                <p>{item}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section className="report-card" variants={fadeUp}>
          <h2>Weaknesses</h2>

          <ul className="weak-list">
            {weaknesses.map((item, index) => (
              <motion.li key={index} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section className="report-card" variants={fadeUp}>
          <h2>Missing Keywords</h2>

          <motion.div className="keyword-stack" variants={stagger} initial="hidden" animate="show">
            {missingSkills.map((skill, index) => (
              <motion.span key={index} variants={fadeUp}>
                {skill}
              </motion.span>
            ))}
          </motion.div>

          <em>Add these to match more job description requirements.</em>
        </motion.section>

        <motion.section className="report-card" variants={fadeUp}>
          <h2>Formatting Feedback</h2>

          {formattingFeedback.map((item, index) => (
            <motion.div className="bar-row" key={index} variants={fadeUp}>
              <span>{item}</span>

              <i>
                <u style={{ width: `${score}%` }} />
              </i>
            </motion.div>
          ))}
        </motion.section>

        <motion.section className="report-card" variants={fadeUp}>
          <h2>Suggestions</h2>

          <ul className="weak-list">
            {suggestions.map((item, index) => (
              <motion.li key={index} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.div>

      <motion.div
        className="analysis-actions"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button onClick={copySuggestions} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
          Copy optimization suggestions
        </motion.button>

        <motion.button onClick={downloadReport} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
          Download analysis report
        </motion.button>
      </motion.div>

      <footer className="site-footer">
        <strong>ResumAI</strong>
        <span>Copyright 2026 ResumAI Engineering. Built for Elite Careers.</span>
      </footer>
    </>
  );

  if (isGuestView) {
    return (
      <main className="analysis-page">
        <TopNav active="Analyze" compact />
        {analysisContent}
      </main>
    );
  }

  return (
    <main className="dashboard-layout analysis-with-sidebar">
      <DashboardSidebar active="analysis" />

      <section className="dashboard-main analysis-main">{analysisContent}</section>
    </main>
  );
};

export default AnalysisPage;

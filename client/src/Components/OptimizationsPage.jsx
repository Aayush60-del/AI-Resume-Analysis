import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getHistory } from "../services/resumeService";
import getErrorMessage from "../utils/getErrorMessage";
import DashboardSidebar from "./DashboardSidebar";

const ChecklistItem = ({ id, text, checked, onToggle }) => (
  <motion.li
    layout
    animate={{
      backgroundColor: checked ? "rgba(14, 165, 164, 0.08)" : "transparent",
    }}
    transition={{ type: "spring", stiffness: 320, damping: 24 }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onToggle(id)}
      aria-label={`Mark task complete: ${text}`}
    />
    <motion.span
      animate={{
        color: checked ? "#60766f" : "#0a2130",
        textDecoration: checked ? "line-through" : "none",
        opacity: checked ? 0.72 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {text}
    </motion.span>
  </motion.li>
);

const OptimizationsPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedTasks, setCheckedTasks] = useState({});

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHistory();
        setHistory(data.history || []);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load optimizations"));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const latest = history[0];

  const keywordPlan = useMemo(() => {
    const skills = latest?.missingSkills || [];

    return skills.map((skill) => ({
      skill,
      action: `Add ${skill} to your skills section or project bullets where it truthfully applies.`,
    }));
  }, [latest]);

  const toggleTask = (id) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyPlan = async () => {
    if (!latest) {
      return;
    }

    const text = [
      "ResumAI Optimization Plan",
      `ATS Score: ${latest.score}%`,
      "",
      "Priority Suggestions:",
      ...(latest.suggestions || []).map((item) => `- ${item}`),
      "",
      "Keywords To Add:",
      ...(latest.missingSkills || []).map((item) => `- ${item}`),
      "",
      "Formatting Fixes:",
      ...(latest.formattingFeedback || []).map((item) => `- ${item}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Optimization plan copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="dashboard-layout">
      <DashboardSidebar active="optimizations" />

      <section className="dashboard-main tool-page-shell">
        <motion.div
          className="tool-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span>Optimization Workspace</span>
          <h1>Turn analysis into resume edits</h1>
          <p>
            Review the latest AI recommendations, copy a focused action plan,
            and work through keyword, formatting, and content improvements.
          </p>
        </motion.div>

        {loading && <div className="tool-empty">Loading optimizations...</div>}

        {!loading && error && <div className="tool-empty">{error}</div>}

        {!loading && !error && !latest && (
          <div className="tool-empty">
            Upload and analyze a resume first to generate optimization tasks.
            <Link to="/dashboard">Go to dashboard</Link>
          </div>
        )}

        {!loading && latest && (
          <>
            <motion.section
              className="optimization-summary"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.article variants={fadeUp}>
                <span>Latest ATS Score</span>
                <b>{latest.score}%</b>
              </motion.article>

              <motion.article variants={fadeUp}>
                <span>Suggestions</span>
                <b>{latest.suggestions?.length || 0}</b>
              </motion.article>

              <motion.article variants={fadeUp}>
                <span>Missing Keywords</span>
                <b>{latest.missingSkills?.length || 0}</b>
              </motion.article>
            </motion.section>

            <motion.section
              className="tool-grid"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.article className="tool-panel" variants={fadeUp}>
                <h2>Priority Edits</h2>
                <ul className="task-list">
                  {(latest.suggestions || []).map((item, index) => (
                    <ChecklistItem
                      key={`suggestion-${index}`}
                      id={`suggestion-${index}`}
                      text={item}
                      checked={Boolean(checkedTasks[`suggestion-${index}`])}
                      onToggle={toggleTask}
                    />
                  ))}
                </ul>
              </motion.article>

              <motion.article className="tool-panel" variants={fadeUp}>
                <h2>Keyword Plan</h2>
                <motion.div
                  className="keyword-plan"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  {keywordPlan.map((item) => (
                    <motion.div key={item.skill} variants={fadeUp}>
                      <strong>{item.skill}</strong>
                      <p>{item.action}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.article>

              <motion.article className="tool-panel" variants={fadeUp}>
                <h2>Formatting Fixes</h2>
                <ul className="task-list">
                  {(latest.formattingFeedback || []).map((item, index) => (
                    <ChecklistItem
                      key={`format-${index}`}
                      id={`format-${index}`}
                      text={item}
                      checked={Boolean(checkedTasks[`format-${index}`])}
                      onToggle={toggleTask}
                    />
                  ))}
                </ul>
              </motion.article>

              <motion.article className="tool-panel" variants={fadeUp}>
                <h2>Strengths To Preserve</h2>
                <ul className="task-list strengths-list">
                  {(latest.strengths || []).map((item, index) => (
                    <motion.li
                      key={index}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                    >
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.article>
            </motion.section>

            <motion.div
              className="analysis-actions tool-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <motion.button onClick={copyPlan} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                Copy optimization plan
              </motion.button>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link to={`/analysis/${latest._id}`} state={{ analysis: latest }}>
                  Open full analysis
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
};

export default OptimizationsPage;

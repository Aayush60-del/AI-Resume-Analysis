import { useContext, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";
import DashboardSidebar from "./DashboardSidebar";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [saveNotice, setSaveNotice] = useState("");

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("resumeai-settings");

      return saved
        ? JSON.parse(saved)
        : {
            targetRole: "",
            targetIndustry: "Software Engineering",
            analysisDepth: "Standard",
            emailReports: true,
            saveHistory: true,
          };
    } catch {
      localStorage.removeItem("resumeai-settings");

      return {
        targetRole: "",
        targetIndustry: "Software Engineering",
        analysisDepth: "Standard",
        emailReports: true,
        saveHistory: true,
      };
    }
  });

  const updateSetting = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSettings = (e) => {
    e.preventDefault();

    localStorage.setItem("resumeai-settings", JSON.stringify(settings));
    setSaveNotice("Career settings saved successfully.");
    window.setTimeout(() => setSaveNotice(""), 3200);
  };

  const panel = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.42 } },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.12 },
    },
  };

  return (
    <main className="dashboard-layout">
      <DashboardSidebar active="settings" />

      <section className="dashboard-main tool-page-shell">
        <motion.div
          className="tool-heading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span>Account Settings</span>
          <h1>Control your resume analysis workspace</h1>
          <p>
            Set your career targets and preferences used by your local ResumAI
            experience.
          </p>
        </motion.div>

        <AnimatePresence>
          {saveNotice && (
            <motion.div
              className="settings-toast"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              {saveNotice}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          className="settings-form"
          onSubmit={saveSettings}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.section className="tool-panel" variants={panel}>
            <h2>Profile</h2>

            <div className="settings-row">
              <span>Name</span>
              <strong>{user?.name || "Candidate"}</strong>
            </div>

            <div className="settings-row">
              <span>Email</span>
              <strong>{user?.email || "Not available"}</strong>
            </div>
          </motion.section>

          <motion.section className="tool-panel" variants={panel}>
            <h2>Analysis Preferences</h2>

            <label>
              Target Role
              <input
                className="real-input"
                name="targetRole"
                placeholder="Frontend Developer"
                value={settings.targetRole}
                onChange={(e) => updateSetting(e.target.name, e.target.value)}
              />
            </label>

            <label>
              Target Industry
              <select
                className="real-input"
                name="targetIndustry"
                value={settings.targetIndustry}
                onChange={(e) => updateSetting(e.target.name, e.target.value)}
              >
                <option>Software Engineering</option>
                <option>Data Science</option>
                <option>Product Management</option>
                <option>Design</option>
                <option>Marketing</option>
              </select>
            </label>

            <label>
              Analysis Depth
              <select
                className="real-input"
                name="analysisDepth"
                value={settings.analysisDepth}
                onChange={(e) => updateSetting(e.target.name, e.target.value)}
              >
                <option>Fast</option>
                <option>Standard</option>
                <option>Detailed</option>
              </select>
            </label>
          </motion.section>

          <motion.section className="tool-panel" variants={panel}>
            <h2>Preferences</h2>

            <label className="toggle-row">
              <span>
                Email Reports
                <small>Keep report generation enabled for exports.</small>
              </span>
              <input
                type="checkbox"
                checked={settings.emailReports}
                onChange={(e) => updateSetting("emailReports", e.target.checked)}
              />
            </label>

            <label className="toggle-row">
              <span>
                Save History
                <small>Keep analyzed resumes visible on your dashboard.</small>
              </span>
              <input
                type="checkbox"
                checked={settings.saveHistory}
                onChange={(e) => updateSetting("saveHistory", e.target.checked)}
              />
            </label>
          </motion.section>

          <motion.div className="settings-actions" variants={panel}>
            <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              Save settings
            </motion.button>
            <motion.button
              type="button"
              className="danger-action"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              Logout
            </motion.button>
          </motion.div>
        </motion.form>
      </section>
    </main>
  );
};

export default SettingsPage;

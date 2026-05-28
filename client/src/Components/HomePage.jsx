import { motion } from "motion/react";
import HeroPage from "./HeroPage";
import TopNav from "./TopNav";

const features = [
  {
    icon: "ATS",
    title: "ATS Analysis",
    text: "Real-time simulation of industry-leading Applicant Tracking Systems. Know exactly how machines read your profile.",
    checks: ["Keyword density", "Formatting"],
  },
  {
    icon: "NLP",
    title: "Skill Detection",
    text: "Our NLP engine extracts hidden skills from project descriptions and maps them automatically.",
    checks: ["Semantic mapping", "Gap identification"],
  },
  {
    icon: "AI",
    title: "AI Suggestions",
    text: "Context-aware rewriting suggestions that emphasize impact and metrics using generative AI models.",
    checks: ["Impact-driven", "Bullet point optimization"],
  },
];

const featureContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const featureItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HomePage = () => {
  return (
    <main className="page-shell">
      <TopNav active="Home" />

      <HeroPage />

      <section className="feature-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          Precision Engineering
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.06 }}
        >
          Experience the future of talent evaluation with our multi-layered
          analysis engine.
        </motion.p>

        <motion.div
          className="feature-grid"
          variants={featureContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature) => (
            <motion.article
              className="feature-card"
              key={feature.title}
              variants={featureItem}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 28px 56px rgba(8, 47, 73, 0.14)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <div className="icon-box">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              {feature.checks.map((check) => (
                <span className="check-row" key={check}>
                  {check}
                </span>
              ))}
            </motion.article>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="cta-panel"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>Ready to land your dream interview?</h2>
        <p>
          Join 15,000+ elite professionals using ResumAI to bypass the
          gatekeepers and get hired.
        </p>
        <motion.a
          className="primary-action"
          href="/dashboard"
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 360, damping: 20 }}
        >
          Start free scan now
        </motion.a>
      </motion.section>

      <footer className="site-footer">
        <strong>ResumAI</strong>
        <span>Copyright 2026 ResumAI Engineering. Pure performance.</span>
        <a href="/">Privacy</a>
        <a href="/">Terms</a>
        <a href="/">API</a>
        <a href="/">Support</a>
      </footer>
    </main>
  );
};

export default HomePage;

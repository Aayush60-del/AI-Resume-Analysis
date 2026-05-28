import { motion } from "motion/react";

const HeroPage = () => {
  return (
    <section className="landing-hero">
      <motion.div
        className="hero-copy"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.14, delayChildren: 0.1 },
          },
        }}
      >
        <motion.span
          className="black-label"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
        >
          AI-Powered Engineering
        </motion.span>

        <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
          Analyze your resume with neural intelligence
        </motion.h1>

        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          Beat the black-box ATS algorithms. Our proprietary AI models scan your
          experience to detect skill gaps, industry alignment, and deliver an
          elite-grade ATS score in seconds.
        </motion.p>

        <motion.div
          className="button-row"
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
        >
          <motion.a
            className="btn-black"
            href="/dashboard"
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}
          >
            Upload resume
          </motion.a>
          <motion.a
            className="btn-white"
            href="/demo"
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}
          >
            Try demo
          </motion.a>
        </motion.div>

        <motion.div
          className="trusted"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        >
          <span>Trusted by:</span>
          <strong>Meta</strong>
          <strong>Nvidia</strong>
          <strong>Stripe</strong>
        </motion.div>
      </motion.div>

      <motion.div
        className="resume-visual"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -14, 0],
        }}
        transition={{
          opacity: { duration: 0.65, delay: 0.15 },
          scale: { duration: 0.65, delay: 0.15 },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          },
        }}
      >
        <div className="paper-lines">
          <b />
          <span />
          <span />
          <b className="short" />
          <span />
          <i />
          <span className="long" />
        </div>
        <div className="score-badge">85%</div>
        <div className="ats-chip">ATS Optimized</div>
        <div className="cloud-chip">Cloud Detected</div>
      </motion.div>
    </section>
  );
};

export default HeroPage;

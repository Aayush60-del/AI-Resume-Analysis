import { useEffect, useState } from "react";
import { motion } from "motion/react";

const ScoreRing = ({ score = 0 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 85 ? "#00c853" : score >= 70 ? "#ffb300" : "#ff5252";

  useEffect(() => {
    let frameId;
    const start = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayScore(Math.round(score * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  return (
    <div className="score-ring-svg">
      <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#dcece7"
          strokeWidth="14"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (score / 100) * circumference,
          }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          transform="rotate(-90 100 100)"
        />
      </svg>

      <div className="score-ring-label">
        <b>{displayScore}</b>
        <span>%</span>
        <small>ATS Score</small>
      </div>
    </div>
  );
};

export default ScoreRing;

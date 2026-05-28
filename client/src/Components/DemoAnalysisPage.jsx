import AnalysisPage from "./AnalysisPage";

const demoAnalysis = {
  _id: "demo-analysis",
  score: 85,
  strengths: [
    "Clear project experience with measurable engineering impact.",
    "Strong technical keyword coverage for modern software roles.",
  ],
  weaknesses: [
    "Some bullet points can be rewritten with stronger action verbs.",
    "A few achievements need clearer numbers, scope, or business outcomes.",
  ],
  missingSkills: ["Testing", "CI/CD", "Cloud Deployment", "System Design"],
  formattingFeedback: [
    "Keep section headings consistent and easy to scan.",
    "Use concise bullets and avoid dense paragraphs.",
  ],
  suggestions: [
    "Add metrics such as latency reduced, users served, revenue impact, or time saved.",
    "Group skills by category so ATS parsers can detect them more reliably.",
    "Rewrite responsibilities into achievement-focused bullets.",
  ],
};

const DemoAnalysisPage = () => {
  return <AnalysisPage initialAnalysis={demoAnalysis} />;
};

export default DemoAnalysisPage;

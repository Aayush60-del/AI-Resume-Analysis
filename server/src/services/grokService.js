const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("GROQ_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
};

const RESUME_TEXT_LIMIT = 14000;

const extractJson = (value) => {
  const raw = value.replace(/```json|```/g, "").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON object");
  }

  return raw.slice(start, end + 1);
};

const toStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
};

const clampScore = (value) => {
  const score = Math.round(Number(value));

  if (!Number.isFinite(score)) {
    throw new Error("AI returned an invalid ATS score");
  }

  return Math.max(0, Math.min(100, score));
};

const normalizeAnalysis = (raw) => {
  const strengths = toStringArray(raw?.strengths);
  const weaknesses = toStringArray(raw?.weaknesses);
  const missingSkills = toStringArray(raw?.missingSkills);
  const suggestions = toStringArray(raw?.suggestions);
  const formattingFeedback = toStringArray(raw?.formattingFeedback);

  if (
    strengths.length < 2 ||
    weaknesses.length < 2 ||
    missingSkills.length < 2 ||
    suggestions.length < 2 ||
    formattingFeedback.length < 2
  ) {
    throw new Error("AI analysis was incomplete. Please try again.");
  }

  return {
    score: clampScore(raw?.score),
    strengths,
    weaknesses,
    missingSkills,
    suggestions,
    formattingFeedback,
  };
};

const SYSTEM_PROMPT = `You are a senior technical recruiter and ATS (Applicant Tracking System) specialist with 12+ years of hiring experience across software, product, and data roles.

Your job is to evaluate ONE resume honestly — the way a real hiring team would before a phone screen. Scores must reflect THAT candidate only.

SCORING RUBRIC (total 100 — compute mentally, then set "score" to the sum):

1) Role clarity & positioning (0–15)
   - Clear target role, summary, and career narrative aligned with experience.

2) ATS keyword & skills coverage (0–25)
   - Relevant hard skills, tools, and role keywords present naturally (not keyword-stuffed).

3) Experience quality & impact (0–30)
   - Strong action verbs, scope, ownership, and measurable outcomes (%, $, time, scale).
   - Penalize vague bullets ("responsible for", "helped with") with no outcomes.

4) Structure & readability (0–15)
   - Logical sections, scannable bullets, consistent dates/titles, reasonable length.

5) Formatting & ATS parseability (0–15)
   - Plain-text friendly layout; penalize tables/columns/graphics risk, missing sections, typos.

SCORING RULES (critical):
- Use the FULL range 0–100. Weak resumes may score 25–55. Average 56–74. Strong 75–89. Exceptional 90–100.
- Do NOT default to 85, 80, or 75. Do NOT round to multiples of 5 unless the rubric truly lands there.
- Different resumes MUST produce different scores when quality differs.
- If the resume is empty, unreadable, or not a resume, score ≤ 20 and say so in weaknesses.
- Every strength/weakness/suggestion must reference specific content from the resume (skills, titles, bullets, gaps).
- missingSkills = skills/keywords a typical ATS would expect for their apparent role but that are absent or weak.
- Be strict but fair — recruiters reject vague, generic, or unquantified resumes.

OUTPUT: Return ONLY valid JSON matching the schema. No markdown. No extra keys.`;

const buildUserPrompt = (text) => {
  const resumeBody =
    text.length > RESUME_TEXT_LIMIT
      ? `${text.slice(0, RESUME_TEXT_LIMIT)}\n\n[TRUNCATED — analyze only the text above]`
      : text;

  return `Analyze this resume using the rubric. Read it completely before scoring.

RESUME TEXT:
"""
${resumeBody}
"""

Return ONLY this JSON object:
{
  "score": <integer 0-100 from rubric sum>,
  "strengths": ["<specific strength tied to resume content>", "..."],
  "weaknesses": ["<specific weakness tied to resume content>", "..."],
  "missingSkills": ["<missing skill/keyword for their target role>", "..."],
  "suggestions": ["<concrete edit the candidate should make>", "..."],
  "formattingFeedback": ["<ATS/format issue observed>", "..."]
}

Requirements:
- Minimum 2 items per array (prefer 3–5 where relevant).
- "score" must be an integer earned from the rubric — not a guess or template score.`;
};

const analyzeResume = async (text) => {
  const trimmed = text?.trim();

  if (!trimmed || trimmed.length < 80) {
    const error = new Error("Resume text is too short to analyze. Upload a text-based PDF.");
    error.statusCode = 400;
    throw error;
  }

  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(trimmed) },
    ],
    temperature: 0.65,
    top_p: 0.9,
    response_format: { type: "json_object" },
  });

  const response = completion.choices?.[0]?.message?.content;

  if (!response) {
    throw new Error("AI did not return an analysis");
  }

  try {
    return normalizeAnalysis(JSON.parse(extractJson(response)));
  } catch (err) {
    const error = new Error("AI analysis failed. Please try again.");
    error.statusCode = 502;
    throw error;
  }
};

module.exports = { analyzeResume };

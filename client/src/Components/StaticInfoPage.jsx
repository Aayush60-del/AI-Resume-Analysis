import { Link, useParams } from "react-router-dom";
import TopNav from "./TopNav";

const pages = {
  privacy: {
    eyebrow: "Privacy",
    title: "Your resume data stays under your control",
    intro:
      "ResumAI only asks for the details needed to analyze resumes, manage accounts, and keep the product reliable.",
    sections: [
      {
        title: "What we collect",
        items: [
          "Account details such as name and email when you register.",
          "Uploaded resume PDFs and generated analysis for signed-in dashboard history.",
          "Basic technical logs used to prevent abuse and diagnose service issues.",
        ],
      },
      {
        title: "Demo uploads",
        items: [
          "The demo scan analyzes one PDF without creating a dashboard record.",
          "The browser is marked after one demo use so the trial stays limited.",
        ],
      },
      {
        title: "Your choices",
        items: [
          "Delete saved resume analysis from your dashboard history.",
          "Contact support for account or data questions.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Use ResumAI as a career assistant, not a hiring guarantee",
    intro:
      "The analysis is designed to help improve resume clarity, ATS readability, and keyword coverage.",
    sections: [
      {
        title: "Acceptable use",
        items: [
          "Upload resumes that you own or have permission to analyze.",
          "Do not upload malicious files, automated spam, or non-resume content.",
        ],
      },
      {
        title: "Service limits",
        items: [
          "Demo scans are limited to one upload per browser.",
          "Uploaded PDFs must be text-based and 5MB or smaller.",
        ],
      },
      {
        title: "No guarantee",
        items: [
          "Scores and suggestions are guidance, not a promise of interviews or job offers.",
          "Always review AI suggestions before using them in applications.",
        ],
      },
    ],
  },
  api: {
    eyebrow: "API",
    title: "API status and integration notes",
    intro:
      "The public app uses the same REST backend for authentication, uploads, history, and analysis reports.",
    sections: [
      {
        title: "Available areas",
        items: [
          "Auth endpoints handle login and registration.",
          "Resume endpoints handle protected uploads, history, single analysis, and demo upload.",
          "Health endpoint: /api/health returns the backend status.",
        ],
      },
      {
        title: "Upload requirements",
        items: [
          "Send multipart form data with the file field named resume.",
          "Use PDF files only; scanned image PDFs may fail if no text can be extracted.",
        ],
      },
    ],
  },
  support: {
    eyebrow: "Support",
    title: "Help for uploads, reports, and account access",
    intro:
      "Most issues come from PDF text extraction, expired login sessions, or missing backend configuration.",
    sections: [
      {
        title: "Quick checks",
        items: [
          "Use a text-based PDF instead of a scanned image resume.",
          "Keep the file under 5MB.",
          "Log in again if the dashboard asks for authentication.",
        ],
      },
      {
        title: "Still stuck",
        items: [
          "Include the page, action, and exact error message when reporting a problem.",
          "Try the demo scan first to confirm the analyzer is reachable.",
        ],
      },
    ],
  },
};

const StaticInfoPage = () => {
  const { page = "privacy" } = useParams();
  const content = pages[page] || pages.privacy;

  return (
    <main className="page-shell">
      <TopNav active="Home" />

      <section className="info-page">
        <div className="tool-heading">
          <span>{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>

        <div className="info-grid">
          {content.sections.map((section) => (
            <article className="tool-panel" key={section.title}>
              <h2>{section.title}</h2>
              <ul className="info-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="info-return">
          <Link to="/">Back to home</Link>
          <Link to="/demo">Try demo</Link>
        </div>
      </section>
    </main>
  );
};

export default StaticInfoPage;

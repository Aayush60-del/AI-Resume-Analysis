<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=220&section=header&text=ResumAI&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20ATS%20Resume%20Analyzer&descAlignY=58&descSize=18" />

<p>
  <img src="https://img.shields.io/badge/React%20%2B%20Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js%20%2B%20Express-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS%20S3-Storage-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-AI-000000?style=for-the-badge" />
</p>

<h3>Upload your resume. Get ATS insights. Improve your chances of getting shortlisted.</h3>

<p>
  <a href="https://ai-resume-analysis-wheat.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20App-764ba2?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <a href="https://github.com/Aayush60-del">
    <img src="https://img.shields.io/badge/GitHub-Aayush60--del-181717?style=for-the-badge&logo=github" />
  </a>
</p>

</div>

---

## ✨ What is ResumAI?

**ResumAI** is an AI-powered ATS resume analyzer that helps users evaluate their resumes, identify missing skills, and receive AI-generated improvement suggestions.

It is built with a modern full-stack architecture using **React, Node.js, Express, MongoDB, AWS S3, and Groq AI**.

---

## 🚀 Features

<table>
  <tr>
    <td width="50%">
      <h3>📤 Resume Upload</h3>
      <p>Upload resume files securely and store them using AWS S3.</p>
    </td>
    <td width="50%">
      <h3>🤖 AI Resume Analysis</h3>
      <p>Analyze resumes using Groq AI and generate useful career feedback.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 ATS Insights</h3>
      <p>Get ATS-style feedback, score, strengths, and weaknesses.</p>
    </td>
    <td width="50%">
      <h3>🧠 Skill Gap Detection</h3>
      <p>Find missing skills and improvement areas for better job matching.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔐 Authentication</h3>
      <p>Secure login and signup with JWT-based authentication.</p>
    </td>
    <td width="50%">
      <h3>🌐 Production Deployment</h3>
      <p>Frontend deployed on Vercel and backend deployed on Render.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend    | Database      | AI & Storage   | Deployment |
| -------- | ---------- | ------------- | -------------- | ---------- |
| React    | Node.js    | MongoDB       | Groq AI        | Vercel     |
| Vite     | Express.js | Mongoose      | AWS S3         | Render     |
| CSS      | JWT Auth   | MongoDB Atlas | Resume Uploads |            |

</div>

---

## 🧩 Project Flow

```mermaid
flowchart LR
    A[User Uploads Resume] --> B[Resume Stored in AWS S3]
    B --> C[Backend Processes Resume]
    C --> D[Groq AI Analyzes Content]
    D --> E[ATS Score and Feedback]
    E --> F[User Views Suggestions]
```

---

## 📂 Folder Structure

```bash
ResumAI/
├── client/              # React + Vite frontend
│   ├── src/
│   ├── .env.example
│   └── package.json
│
├── server/              # Node.js + Express backend
│   ├── src/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Add these variables inside `server/.env`:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name

CLIENT_URL=http://localhost:5173
PORT=5000
```

Backend runs on:

```bash
http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Add this variable inside `client/.env`:

```env
VITE_API_URL=/api
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 🚀 Deployment

<table>
  <tr>
    <td width="50%">
      <h3>Backend — Render</h3>
      <ul>
        <li>Deploy the <code>server/</code> folder</li>
        <li>Add variables from <code>server/.env.example</code></li>
        <li>Set <code>CLIENT_URL</code> to your Vercel frontend URL</li>
      </ul>
    </td>
    <td width="50%">
      <h3>Frontend — Vercel</h3>
      <ul>
        <li>Deploy the <code>client/</code> folder</li>
        <li>Add <code>VITE_API_URL</code></li>
        <li>Redeploy after adding environment variables</li>
      </ul>
    </td>
  </tr>
</table>

### Backend Environment

```env
MONGO_URL=
JWT_SECRET=
GROQ_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
CLIENT_URL=https://ai-resume-analysis-wheat.vercel.app
PORT=5000
```

### Frontend Environment

```env
VITE_API_URL=https://YOUR-SERVICE.onrender.com/api
```

---

## 🔐 CORS Setup

Make sure your backend allows requests from your deployed frontend URL.

Correct:

```bash
https://ai-resume-analysis-wheat.vercel.app
```

Wrong:

```bash
https://ai-resume-analysis-wheat.vercel.app/
```

Avoid adding a trailing slash in `CLIENT_URL`.

---

## 📸 Screenshots

Add screenshots inside a `screenshots` folder and update the paths below.

<table>
  <tr>
    <td><img src="./screenshots/home.png" alt="Home Page" /></td>
    <td><img src="./screenshots/upload.png" alt="Resume Upload" /></td>
  </tr>
  <tr>
    <td><img src="./screenshots/result.png" alt="Analysis Result" /></td>
    <td><img src="./screenshots/dashboard.png" alt="Dashboard" /></td>
  </tr>
</table>

---

## 🌱 Future Improvements

* Job description based resume matching
* Resume improvement suggestions with priority level
* Downloadable ATS analysis report
* Resume history dashboard
* Multiple resume comparison

---

## 👨‍💻 Author

<div align="center">

### Ayush Negi

<p>
  <a href="https://github.com/Aayush60-del">
    <img src="https://img.shields.io/badge/GitHub-Aayush60--del-181717?style=for-the-badge&logo=github" />
  </a>
</p>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:764ba2,100:667eea&height=120&section=footer" />

### ⭐ If you like this project, give it a star!

</div>

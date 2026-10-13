import { useRef, useState } from "react";
import "./ResumeAnalyzer.css";
import AppHeader from "../components/AppHeader";

const API_URL = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

function ResumeAnalyzer() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const [coachMessage, setCoachMessage] = useState("");

  const [coachMessages, setCoachMessages] = useState([
    {
      role: "ai",
      text: "I've analyzed your resume. Ask me anything about your skills, projects, internships, resume improvement, or what you should learn next.",
    },
  ]);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    setError("");

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Your resume must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setStatus("analyzing");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await fetch(
        `${API_URL}/api/analyze-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken") || ""}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Resume analysis failed."
        );
      }

      sessionStorage.setItem(
        "resumeText",
        data.text || ""
      );

      sessionStorage.setItem(
        "resumeFileName",
        data.fileName || selectedFile.name
      );

      sessionStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(data.analysis)
      );

      setAnalysis(data.analysis);
      setStatus("complete");

      setCoachMessages([
        {
          role: "ai",
          text: `I've analyzed your resume and found ${
            Array.isArray(data.analysis?.skills)
              ? data.analysis.skills.length
              : 0
          } technical skills. Ask me what you should learn next, whether you're ready for internships, or how you can improve your profile.`,
        },
      ]);
    } catch (err) {
      console.error(err);

      setStatus("error");

      setError(
        err.message ||
          "Something went wrong while analyzing your resume."
      );
    }
  };

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    handleFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile =
      event.dataTransfer.files?.[0];

    handleFile(droppedFile);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const goToDashboard = () => {
    window.location.href = "/resume-dashboard";
  };

  /* =========================================
     CAREER TARGET NAVIGATION
  ========================================= */

  const goToCareerTarget = () => {
    const savedAnalysis =
      sessionStorage.getItem("resumeAnalysis");

    if (!savedAnalysis) {
      setError(
        "Please analyze your resume before choosing a career target."
      );
      return;
    }

    window.location.href = "/career-target";
  };

  const startAgain = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
    setStatus("idle");
    setCoachMessage("");

    setCoachMessages([
      {
        role: "ai",
        text: "I've analyzed your resume. Ask me anything about your skills, projects, internships, resume improvement, or what you should learn next.",
      },
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     ANALYSIS DATA
  ========================================================= */

  const score = Number(
    analysis?.resumeScore ?? 0
  );

  const scoreLabel =
    score >= 85
      ? "Strong foundation"
      : score >= 70
      ? "Good foundation"
      : score >= 55
      ? "Needs improvement"
      : "Early stage";

  const skills = Array.isArray(analysis?.skills)
    ? analysis.skills
    : [];

  const strengths = Array.isArray(
    analysis?.strengths
  )
    ? analysis.strengths
    : [];

  const improvementAreas = Array.isArray(
    analysis?.improvementAreas
  )
    ? analysis.improvementAreas
    : [];

  const recommendedSkills = Array.isArray(
    analysis?.recommendedSkills
  )
    ? analysis.recommendedSkills
    : [];

  const getScoreClass = () => {
    if (score >= 85) return "score-high";
    if (score >= 70) return "score-good";
    if (score >= 55) return "score-mid";

    return "score-low";
  };

  /* =========================================================
     CAREER COACH
  ========================================================= */

  const answerCoachQuestion = (question) => {
    const q = question.toLowerCase();

    if (
      q.includes("learn") ||
      q.includes("skill") ||
      q.includes("next")
    ) {
      if (recommendedSkills.length > 0) {
        return `Based on your resume analysis, I recommend focusing next on ${recommendedSkills
          .slice(0, 4)
          .join(", ")}. You already have a foundation in ${skills
          .slice(0, 4)
          .join(", ")}, so building depth in these areas can strengthen your profile.`;
      }

      return "Focus next on strengthening programming fundamentals, SQL, Git/GitHub, Data Structures and Algorithms, and one specialization such as Machine Learning.";
    }

    if (
      q.includes("internship") ||
      q.includes("job") ||
      q.includes("ready")
    ) {
      if (score >= 80) {
        return `Your current resume score is ${score}/100, which shows a solid foundation. Before applying widely, strengthen your projects, add measurable results, and prepare for technical interviews.`;
      }

      return `Your current resume score is ${score}/100. You have a foundation, but improving your projects, technical skills, and resume impact can make your profile stronger for internship applications.`;
    }

    if (
      q.includes("project") ||
      q.includes("projects")
    ) {
      return "Build projects that demonstrate the skills you want recruiters to notice. For an AIML profile, good directions include Machine Learning, data analysis, recommendation systems, computer vision, NLP, and deployed AI applications.";
    }

    if (
      q.includes("resume") ||
      q.includes("improve")
    ) {
      return `Your resume currently scores ${score}/100. Focus on measurable project results, stronger action verbs, relevant technical keywords, and clearly explaining what you personally built.`;
    }

    if (q.includes("python")) {
      return "Python is a strong foundation for AIML. Next, deepen your knowledge of NumPy, Pandas, Scikit-learn, data preprocessing, model evaluation, and end-to-end projects.";
    }

    if (
      q.includes("machine learning") ||
      q.includes("ml")
    ) {
      return "For Machine Learning, focus on statistics, data preprocessing, supervised and unsupervised learning, model evaluation, feature engineering, and practical projects.";
    }

    if (
      q.includes("strength") ||
      q.includes("good at")
    ) {
      if (strengths.length > 0) {
        return `Your analysis identified these strengths: ${strengths
          .slice(0, 3)
          .join(", ")}. These are areas you should continue demonstrating through projects and measurable achievements.`;
      }

      return "Your profile has a foundation to build on. Your next step should be turning your technical knowledge into stronger, measurable project outcomes.";
    }

    if (
      q.includes("weak") ||
      q.includes("gap") ||
      q.includes("missing")
    ) {
      if (improvementAreas.length > 0) {
        return `Your analysis identified these improvement areas: ${improvementAreas
          .slice(0, 3)
          .join(", ")}. Improving these areas can strengthen your overall career profile.`;
      }

      return "Your biggest opportunity is to add more depth to your technical projects and demonstrate practical application of your skills.";
    }

    return `I've analyzed your resume and detected ${skills.length} technical skills. You can ask me about your next skills, internships, projects, resume improvement, Machine Learning, or your skill gaps.`;
  };

  const sendCoachMessage = (text = coachMessage) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    const userMessage = {
      role: "user",
      text: trimmed,
    };

    const aiMessage = {
      role: "ai",
      text: answerCoachQuestion(trimmed),
    };

    setCoachMessages((previous) => [
      ...previous,
      userMessage,
      aiMessage,
    ]);

    setCoachMessage("");
  };

  const suggestedQuestions = [
    "What should I learn next?",
    "Am I ready for an internship?",
    "What projects should I build?",
    "How can I improve my resume?",
  ];

  return (
    <div className="analyzer-page">

      {/* BACKGROUND */}

      <div className="analyzer-grid" />
      <div className="analyzer-glow analyzer-glow-one" />
      <div className="analyzer-glow analyzer-glow-two" />

      {/* NAVBAR */}

      <AppHeader active="analyzer">
<span className="ah-status"><i />AI system online</span>
<button type="button" className="ah-btn ah-btn--primary" onClick={goToDashboard}>Dashboard <span>↗</span></button>
</AppHeader>

      {/* MAIN */}

      <main className="analyzer-main">

        {/* INTRO */}

        <section className="analyzer-intro">

          <div className="eyebrow">
            <span className="eyebrow-dot" />
            RESUME INTELLIGENCE
          </div>

          <h1>
            Let your resume
            <span> speak for itself.</span>
          </h1>

          <p>
            Upload your resume and let AI Coach analyze your
            skills, experience, projects and ATS readiness.
          </p>

        </section>

        {/* =================================================
            UPLOAD
        ================================================= */}

        {status === "idle" && (
          <section className="upload-layout">

            <div
              className="upload-card"
              onDragOver={(event) =>
                event.preventDefault()
              }
              onDrop={handleDrop}
            >

              <div className="upload-top">
                <span>01</span>
                <span>RESUME INPUT</span>
              </div>

              <div className="upload-icon-wrap">

                <div className="upload-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 17V11" />
                    <path d="M9.5 13.5 12 11l2.5 2.5" />
                  </svg>

                </div>

              </div>

              <h2>
                Upload your resume
              </h2>

              <p className="upload-description">
                Drop your PDF here or choose a file from
                your computer. We'll take care of the rest.
              </p>

              <button
                className="choose-file-btn"
                onClick={openFilePicker}
              >
                Choose PDF Resume
                <span>→</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleInputChange}
                hidden
              />

              <div className="upload-meta">
                <span>PDF ONLY</span>
                <span>MAX 5 MB</span>
                <span>PRIVATE & SECURE</span>
              </div>

            </div>

            {/* PRODUCT PREVIEW */}

            <div className="preview-card">

              <div className="preview-header">

                <div>

                  <span className="preview-label">
                    WHAT YOU'LL GET
                  </span>

                  <h3>
                    Career intelligence
                  </h3>

                </div>

                <div className="preview-live">
                  <i />
                  LIVE
                </div>

              </div>

              <div className="mini-score">

                <div className="mini-score-ring">

                  <div>
                    <strong>76</strong>
                    <small>/100</small>
                  </div>

                </div>

                <div className="mini-score-copy">

                  <span>RESUME SCORE</span>

                  <strong>
                    Career readiness
                  </strong>

                  <p>
                    A structured view of what your resume
                    communicates to employers.
                  </p>

                </div>

              </div>

              <div className="preview-lines">

                <div>
                  <span>
                    <i className="blue-dot" />
                    Skills detected
                  </span>

                  <strong>09</strong>
                </div>

                <div>
                  <span>
                    <i className="mint-dot" />
                    Project signal
                  </span>

                  <strong>01</strong>
                </div>

                <div>
                  <span>
                    <i className="orange-dot" />
                    ATS structure
                  </span>

                  <strong>GOOD</strong>
                </div>

              </div>

              <div className="preview-bottom">
                <span>
                  AI CAREER PROFILE
                </span>

                <div className="preview-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>

            </div>

          </section>
        )}

        {/* =================================================
            ANALYZING
        ================================================= */}

        {status === "analyzing" && (
          <section className="analysis-processing">

            <div className="processing-card">

              <div className="processing-orbit">

                <div className="orbit-ring ring-one" />
                <div className="orbit-ring ring-two" />

                <div className="orbit-core">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M4 18V9" />
                    <path d="M9 18V5" />
                    <path d="M14 18v-7" />
                    <path d="M19 18V3" />
                  </svg>

                </div>

              </div>

              <div className="processing-copy">

                <span className="processing-eyebrow">
                  AI ANALYSIS IN PROGRESS
                </span>

                <h2>
                  Reading your
                  <span> career signal...</span>
                </h2>

                <p>
                  We're turning your resume into a structured
                  career profile.
                </p>

                <div className="processing-file">

                  <div className="file-symbol">
                    PDF
                  </div>

                  <div>
                    <strong>
                      {file?.name}
                    </strong>

                    <span>
                      {file
                        ? `${(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`
                        : "Processing"}
                    </span>
                  </div>

                  <div className="processing-spinner" />

                </div>

              </div>

              <div className="analysis-steps">

                <div className="analysis-step active">
                  <span>01</span>

                  <div>
                    <strong>
                      Reading resume
                    </strong>

                    <small>
                      Extracting career data
                    </small>
                  </div>

                  <i>✓</i>
                </div>

                <div className="analysis-step active">
                  <span>02</span>

                  <div>
                    <strong>
                      Detecting skills
                    </strong>

                    <small>
                      Mapping technical signals
                    </small>
                  </div>

                  <i>✓</i>
                </div>

                <div className="analysis-step active">
                  <span>03</span>

                  <div>
                    <strong>
                      Evaluating profile
                    </strong>

                    <small>
                      Measuring career readiness
                    </small>
                  </div>

                  <i className="step-loading" />
                </div>

                <div className="analysis-step">
                  <span>04</span>

                  <div>
                    <strong>
                      Building insights
                    </strong>

                    <small>
                      Preparing recommendations
                    </small>
                  </div>

                  <i />
                </div>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            COMPLETE
        ================================================= */}

        {status === "complete" && analysis && (

          <section className="results-section">

            {/* RESULTS HEADER */}

            <div className="results-top">

              <div>

                <span className="results-eyebrow">
                  ANALYSIS COMPLETE
                </span>

                <h2>
                  Your career profile
                  <span> is ready.</span>
                </h2>

                <p>
                  We've analyzed the structure and signals in
                  your resume. Here's your first look.
                </p>

              </div>

              <div className="complete-badge">
                <i>✓</i>
                ANALYZED
              </div>

            </div>

            {/* RESULTS GRID */}

            <div className="results-grid">

              {/* SCORE */}

              <div className="result-score-card">

                <div className="result-card-label">
                  RESUME PERFORMANCE
                </div>

                <div
                  className={`big-score ${getScoreClass()}`}
                >

                  <svg
                    className="score-circle"
                    viewBox="0 0 200 200"
                  >

                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      className="score-track"
                    />

                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      className="score-progress"
                      style={{
                        strokeDasharray:
                          `${score * 5.15} 515`,
                      }}
                    />

                  </svg>

                  <div className="score-number">

                    <strong>
                      {score}
                    </strong>

                    <span>
                      /100
                    </span>

                  </div>

                </div>

                <div className="score-status">

                  <strong>
                    {scoreLabel}
                  </strong>

                  <p>
                    {analysis.summary ||
                      "Your resume has a solid foundation with clear areas for improvement."}
                  </p>

                </div>

              </div>

              {/* PROFILE SIGNALS */}

              <div className="result-signals-card">

                <div className="result-card-label">
                  PROFILE SIGNALS
                </div>

                <div className="signal-result">

                  <div className="signal-result-icon blue">
                    ✦
                  </div>

                  <div>
                    <span>
                      TECHNICAL SKILLS
                    </span>

                    <strong>
                      {skills.length} detected
                    </strong>
                  </div>

                  <div className="signal-arrow">
                    ↗
                  </div>

                </div>

                <div className="signal-result">

                  <div className="signal-result-icon mint">
                    ◇
                  </div>

                  <div>
                    <span>
                      STRENGTHS
                    </span>

                    <strong>
                      {strengths.length || "Several"} identified
                    </strong>
                  </div>

                  <div className="signal-arrow">
                    ↗
                  </div>

                </div>

                <div className="signal-result">

                  <div className="signal-result-icon orange">
                    !
                  </div>

                  <div>
                    <span>
                      IMPROVEMENT AREAS
                    </span>

                    <strong>
                      {improvementAreas.length || "A few"} found
                    </strong>
                  </div>

                  <div className="signal-arrow">
                    ↗
                  </div>

                </div>

              </div>

              {/* SKILLS */}

              <div className="skills-result-card">

                <div className="skills-result-heading">

                  <div>

                    <span className="result-card-label">
                      DETECTED SKILLS
                    </span>

                    <h3>
                      Your current skill signal
                    </h3>

                  </div>

                  <span className="skills-count">
                    {skills.length
                      .toString()
                      .padStart(2, "0")}
                  </span>

                </div>

                <div className="skill-tags">

                  {skills
                    .slice(0, 12)
                    .map((skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    ))}

                </div>

              </div>

            </div>

            {/* =================================================
                AI CAREER COACH
            ================================================= */}

            <section className="embedded-career-coach">

              <div className="coach-section-header">

                <div>

                  <span>
                    ✦ AI CAREER COACH
                  </span>

                  <h2>
                    Your analysis has a
                    <strong> conversation.</strong>
                  </h2>

                  <p>
                    Ask questions about your resume,
                    skills, internships, projects and
                    what you should do next.
                  </p>

                </div>

                <div className="coach-live-indicator">
                  <i />
                  PROFILE AWARE
                </div>

              </div>

              <div className="embedded-coach-layout">

                {/* CHAT */}

                <div className="embedded-chat">

                  <div className="embedded-chat-header">

                    <div className="embedded-ai-icon">
                      AI
                    </div>

                    <div>
                      <strong>
                        Career Coach
                      </strong>

                      <span>
                        Using your resume analysis
                      </span>
                    </div>

                  </div>

                  <div className="embedded-chat-messages">

                    {coachMessages.map(
                      (item, index) => (

                        <div
                          key={index}
                          className={`embedded-message ${
                            item.role === "user"
                              ? "embedded-user"
                              : "embedded-ai"
                          }`}
                        >

                          {item.role === "ai" && (
                            <div className="embedded-message-avatar">
                              AI
                            </div>
                          )}

                          <div className="embedded-message-bubble">
                            {item.text}
                          </div>

                        </div>

                      )
                    )}

                  </div>

                  <div className="embedded-chat-input">

                    <input
                      value={coachMessage}
                      onChange={(event) =>
                        setCoachMessage(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter"
                        ) {
                          sendCoachMessage();
                        }
                      }}
                      placeholder="Ask about your career..."
                    />

                    <button
                      onClick={() =>
                        sendCoachMessage()
                      }
                    >
                      →
                    </button>

                  </div>

                </div>

                {/* COACH CONTEXT */}

                <aside className="embedded-coach-side">

                  <div className="coach-context-card">

                    <span>
                      YOUR PROFILE
                    </span>

                    <div className="coach-context-score">
                      <strong>
                        {score}
                      </strong>

                      <small>
                        /100
                      </small>
                    </div>

                    <p>
                      Resume performance
                    </p>

                  </div>

                  <div className="coach-question-card">

                    <span>
                      TRY ASKING
                    </span>

                    <h3>
                      Where should I focus?
                    </h3>

                    <div className="coach-question-list">

                      {suggestedQuestions.map(
                        (question, index) => (

                          <button
                            key={index}
                            onClick={() =>
                              sendCoachMessage(
                                question
                              )
                            }
                          >

                            <span>
                              0{index + 1}
                            </span>

                            {question}

                            <b>
                              →
                            </b>

                          </button>

                        )
                      )}

                    </div>

                  </div>

                  <div className="coach-signal-mini">

                    <span>
                      CAREER SIGNAL
                    </span>

                    <strong>
                      {skills.length}
                    </strong>

                    <p>
                      technical skills detected
                    </p>

                  </div>

                </aside>

              </div>

            </section>

            {/* =================================================
                CAREER TARGET CTA
            ================================================= */}

            <section className="career-roadmap-cta">

              <div className="roadmap-cta-glow"></div>

              <div className="roadmap-cta-icon">
                ✦
              </div>

              <div className="roadmap-cta-content">

                <span>
                  NEXT: CAREER DIRECTION
                </span>

                <h2>
                  Turn your analysis
                  <br />
                  into a <strong>career path.</strong>
                </h2>

                <p>
                  Your resume analysis has identified your
                  current skills, strengths and areas to improve.
                  Choose a career target and AI Coach will use
                  it to personalize your roadmap.
                </p>

                <div className="roadmap-cta-points">

                  <div>
                    <i>✓</i>
                    Your current foundation
                  </div>

                  <div>
                    <i>✓</i>
                    Skills to develop
                  </div>

                  <div>
                    <i>✓</i>
                    Projects to build
                  </div>

                  <div>
                    <i>✓</i>
                    Interview preparation
                  </div>

                </div>

              </div>

              <button
                className="generate-roadmap-btn"
                onClick={goToCareerTarget}
              >
                Choose Career Target
                <span>→</span>
              </button>

            </section>

            {/* =================================================
                FULL DASHBOARD CTA
            ================================================= */}

            <div className="full-analysis-card">

              <div className="full-analysis-glow" />

              <div className="full-analysis-copy">

                <span>
                  YOUR NEXT STEP
                </span>

                <h3>
                  Go deeper into your
                  <br />
                  career intelligence.
                </h3>

                <p>
                  Explore your complete career intelligence
                  dashboard, including skill gaps, ATS insights,
                  project analysis and recommended next skills.
                </p>

              </div>

              <button
                className="full-analysis-btn"
                onClick={goToDashboard}
              >
                View Full Analysis
                <span>→</span>
              </button>

            </div>

            <button
              className="analyze-again-btn"
              onClick={startAgain}
            >
              Analyze another resume
            </button>

          </section>
        )}

        {/* ERROR */}

        {status === "error" && (

          <section className="error-section">

            <div className="error-card">

              <div className="error-icon">
                !
              </div>

              <span>
                ANALYSIS INTERRUPTED
              </span>

              <h2>
                We couldn't analyze that resume.
              </h2>

              <p>
                {error ||
                  "Please check your file and try uploading it again."}
              </p>

              <button
                className="choose-file-btn"
                onClick={startAgain}
              >
                Try Again
                <span>→</span>
              </button>

            </div>

          </section>

        )}

        {error && status === "idle" && (

          <div className="upload-error">

            <span>!</span>

            {error}

          </div>

        )}

      </main>

      {/* FOOTER */}

      <footer className="analyzer-footer">

        <span>
          AI COACH
        </span>

        <span>
          CAREER INTELLIGENCE SYSTEM
        </span>

        <span>
          2026
        </span>

      </footer>

    </div>
  );
}

export default ResumeAnalyzer;
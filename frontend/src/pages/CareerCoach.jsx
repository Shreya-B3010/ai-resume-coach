import { useState } from "react";
import "./CareerCoach.css";
import AppHeader from "../components/AppHeader";

function CareerCoach() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI Career Coach. I can help you understand your resume, identify skill gaps, plan your learning path, and prepare for internships."
    }
  ]);

  const getSessionItem = (key, fallback = "") => {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const resumeText = getSessionItem("resumeText", "");
  const savedAnalysis = getSessionItem("resumeAnalysis", "{}");

  let analysis = {};

  try {
    analysis = JSON.parse(savedAnalysis);
  } catch {
    analysis = {};
  }

  const skills = Array.isArray(analysis.skills)
    ? analysis.skills
    : [];

  const recommendedSkills = Array.isArray(
    analysis.recommendedSkills
  )
    ? analysis.recommendedSkills
    : [];

  const score = Number(
    analysis.resumeScore || 0
  );

  const answerQuestion = (question) => {
    const q = question.toLowerCase();

    if (
      q.includes("learn") ||
      q.includes("skill") ||
      q.includes("next")
    ) {
      if (recommendedSkills.length > 0) {
        return `Based on your resume, I would focus next on ${recommendedSkills
          .slice(0, 4)
          .join(", ")}. You already have a foundation in ${skills
          .slice(0, 4)
          .join(", ")}, so these skills can help you build more depth.`;
      }

      return "Start by strengthening your programming fundamentals, SQL, Git/GitHub, data structures, and one specialization such as Machine Learning.";
    }

    if (
      q.includes("internship") ||
      q.includes("job") ||
      q.includes("ready")
    ) {
      if (score >= 80) {
        return `Your current resume score is ${score}/100, which shows a solid foundation. Before applying, focus on strengthening your projects, adding measurable outcomes, and preparing for technical interviews.`;
      }

      return `Your current resume score is ${score}/100. You have a foundation, but I recommend improving your projects, technical skills, and resume impact before applying widely.`;
    }

    if (
      q.includes("project") ||
      q.includes("projects")
    ) {
      return "Build projects that demonstrate the skills you want recruiters to notice. For an AIML profile, consider projects involving Machine Learning, data analysis, recommendation systems, computer vision, NLP, or deployment.";
    }

    if (
      q.includes("resume") ||
      q.includes("improve")
    ) {
      return `Your resume currently has a score of ${score}/100. Focus on measurable project results, stronger action verbs, relevant technical keywords, and clear descriptions of what you personally built.`;
    }

    if (
      q.includes("python")
    ) {
      return "Python is a strong foundation for AIML. After the basics, focus on NumPy, Pandas, Scikit-learn, data preprocessing, model evaluation, and building end-to-end projects.";
    }

    if (
      q.includes("ml") ||
      q.includes("machine learning")
    ) {
      return "For Machine Learning, build your foundation in statistics, data preprocessing, supervised and unsupervised learning, model evaluation, feature engineering, and practical projects.";
    }

    return `I've analyzed your resume and detected ${skills.length} technical skills. Ask me about your next skills, internships, projects, resume improvement, or Machine Learning preparation.`;
  };

  const sendMessage = (text = message) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    const userMessage = {
      role: "user",
      text: trimmed
    };

    const aiMessage = {
      role: "ai",
      text: answerQuestion(trimmed)
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      aiMessage
    ]);

    setMessage("");
  };

  const suggestedQuestions = [
    "What should I learn next?",
    "Am I ready for an internship?",
    "What projects should I build?",
    "How can I improve my resume?"
  ];

  return (
    <div className="career-coach-page">

      <div className="coach-background-grid" />
      <div className="coach-glow coach-glow-blue" />
      <div className="coach-glow coach-glow-mint" />

      {/* HEADER */}

      <AppHeader active="coach" width={1250}>
<a className="ah-btn" href="/resume-dashboard">← Dashboard</a>
</AppHeader>

      {/* MAIN */}

      <main className="coach-main">

        <section className="coach-intro">

          <div className="coach-eyebrow">
            <span />
            PERSONAL CAREER COACH
          </div>

          <h1>
            Ask your career
            <br />
            <span>anything.</span>
          </h1>

          <p>
            Your resume is already analyzed.
            Now use your career profile to
            understand what to learn, what to
            build, and where to go next.
          </p>

        </section>

        {/* CHAT */}

        <section className="coach-chat-layout">

          <div className="coach-chat">

            <div className="chat-header">

              <div className="chat-ai-avatar">
                AI
              </div>

              <div>
                <strong>
                  Career Coach
                </strong>

                <span>
                  <i />
                  Profile-aware
                </span>
              </div>

            </div>

            <div className="chat-messages">

              {messages.map(
                (item, index) => (

                  <div
                    key={index}
                    className={`chat-message ${
                      item.role === "user"
                        ? "chat-user"
                        : "chat-ai"
                    }`}
                  >

                    {item.role === "ai" && (
                      <div className="message-avatar">
                        AI
                      </div>
                    )}

                    <div className="message-bubble">
                      {item.text}
                    </div>

                  </div>

                )
              )}

            </div>

            <div className="chat-input-area">

              <input
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    sendMessage();
                  }
                }}
                placeholder="Ask about your career..."
              />

              <button
                onClick={() =>
                  sendMessage()
                }
              >
                →
              </button>

            </div>

          </div>

          {/* SIDE PANEL */}

          <aside className="coach-side-panel">

            <div className="profile-mini-card">

              <div className="mini-score">
                <strong>
                  {score}
                </strong>

                <span>
                  /100
                </span>
              </div>

              <div>
                <small>
                  RESUME SCORE
                </small>

                <strong>
                  Career profile
                </strong>

                <p>
                  {skills.length} skills
                  detected
                </p>
              </div>

            </div>

            <div className="suggestions-card">

              <span>
                TRY ASKING
              </span>

              <h3>
                Start a conversation.
              </h3>

              <div className="suggestion-list">

                {suggestedQuestions.map(
                  (
                    question,
                    index
                  ) => (

                    <button
                      key={index}
                      onClick={() =>
                        sendMessage(
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

            <div className="coach-signal-card">

              <div className="signal-icon">
                ✦
              </div>

              <small>
                PROFILE CONTEXT
              </small>

              <strong>
                {skills.length}
                <span>
                  technical signals
                </span>
              </strong>

              <p>
                The coach uses your
                analyzed resume profile
                to personalize its guidance.
              </p>

            </div>

          </aside>

        </section>

        {/* FEATURES */}

        <section className="coach-capabilities">

          <div className="capability-item">
            <span>01</span>
            <strong>Career direction</strong>
            <p>
              Understand which skills
              can strengthen your profile.
            </p>
          </div>

          <div className="capability-item">
            <span>02</span>
            <strong>Learning roadmap</strong>
            <p>
              Turn your skill gaps into
              practical learning steps.
            </p>
          </div>

          <div className="capability-item">
            <span>03</span>
            <strong>Interview preparation</strong>
            <p>
              Prepare for the technical
              expectations of internships.
            </p>
          </div>

          <div className="capability-item">
            <span>04</span>
            <strong>Project strategy</strong>
            <p>
              Build projects that demonstrate
              your capabilities.
            </p>
          </div>

        </section>

      </main>

      <footer className="coach-footer">
        <span>AI COACH</span>
        <span>PERSONAL CAREER INTELLIGENCE</span>
        <span>PROFILE-AWARE GUIDANCE</span>
      </footer>

    </div>
  );
}

export default CareerCoach;
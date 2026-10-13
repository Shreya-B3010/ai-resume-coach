import { useState } from "react";
import "./CareerCoach.css";
import AppHeader from "../components/AppHeader";
import { requestAI } from "../lib/ai";

function CareerCoach() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
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

  const score = Number(
    analysis.resumeScore || 0
  );

  const sendMessage = async (text = message) => {
    const trimmed = text.trim();

    if (!trimmed || isSending) {
      return;
    }

    setError("");
    setIsSending(true);
    const userMessage = {
      role: "user",
      text: trimmed
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);
    setMessage("");

    try {
      const result = await requestAI("/api/career-coach", {
        message: trimmed,
        resumeText,
        analysis,
        history: messages.slice(-8).map((item) => ({
          role: item.role === "ai" ? "assistant" : "user",
          content: item.text,
        })),
      });
      setMessages((previous) => [
        ...previous,
        { role: "ai", text: result.answer },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSending(false);
    }
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
          <p>
            Career questions and resume context are sent to Google Gemini.
            The free tier has usage limits, and Google may use submitted
            content to improve its products.
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

              {isSending && (
                <div className="chat-message chat-ai">
                  <div className="message-avatar">AI</div>
                  <div className="message-bubble">Thinking...</div>
                </div>
              )}

            </div>

            {error && <p role="alert">{error}</p>}

            <div className="chat-input-area">

              <input
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isSending}
                placeholder="Ask about your career..."
              />

              <button
                onClick={() => sendMessage()}
                disabled={isSending || !message.trim()}
                aria-label="Send message"
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
                      disabled={isSending}
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
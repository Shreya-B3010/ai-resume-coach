import "./App.css";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeDashboard from "./pages/ResumeDashboard";
import CareerCoach from "./pages/CareerCoach";
import MockInterview from "./pages/MockInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import CareerTarget from "./pages/CareerTarget";
import ProjectRecommendations from "./pages/ProjectRecommendations";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  // Login page
  if (window.location.pathname === "/login") {
    return <Login />;
  }

  // Signup page
  if (window.location.pathname === "/signup") {
    return <Signup />;
  }

  // Resume Analyzer page
  if (window.location.pathname === "/resume-analyzer") {
    return <ResumeAnalyzer />;
  }

  // Resume Dashboard page
  if (window.location.pathname === "/resume-dashboard") {
    return <ResumeDashboard />;
  }

  // AI Career Coach page
  if (window.location.pathname === "/career-coach") {
    return <CareerCoach />;
  }

  // AI Mock Interview page
  if (window.location.pathname === "/mock-interview") {
    return <MockInterview />;
  }

  // AI Career Roadmap page
  if (window.location.pathname === "/career-roadmap") {
    return <CareerRoadmap />;
  }

  // Career Target page
  if (window.location.pathname === "/career-target") {
    return <CareerTarget />;
  }

  // Project Recommendations page
  if (window.location.pathname === "/project-recommendations") {
    return <ProjectRecommendations />;
  }

  // Project Details page
  if (window.location.pathname === "/project-details") {
    return <ProjectDetails />;
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">

          <div className="logo">
            <div className="logo-mark">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span>
              AI<span className="logo-blue">Coach</span>
            </span>
          </div>

          <div className="nav-links">
            <a href="#features">AI Tools</a>
            <a href="#process">How it works</a>
            <a href="#insights">Insights</a>
          </div>

          <div className="nav-buttons">
            <button
              className="signin"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Sign in
            </button>

            <button
              className="start-small"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Get Started <span>→</span>
            </button>
          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="hero">

        <div className="hero-background"></div>

        <div className="hero-inner">

          <div className="hero-content">

            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              YOUR AI CAREER COMPANION
            </div>

            <h1>
              Your career
              <br />
              deserves an
              <br />
              <span>intelligent coach.</span>
            </h1>

            <p>
              Understand your resume, discover the skills you're missing,
              and prepare for your next interview — all with one AI-powered
              career companion.
            </p>

            <div className="hero-actions">

              <a
                href="/resume-analyzer"
                className="primary-button"
              >
                Analyze My Resume
                <span>→</span>
              </a>

              <a
                href="/career-coach"
                className="secondary-button"
              >
                Explore AI Coach
              </a>

            </div>

            <div className="hero-meta">

              <div className="meta-item">
                <strong>01</strong>
                <span>Resume</span>
              </div>

              <div className="meta-line"></div>

              <div className="meta-item">
                <strong>02</strong>
                <span>Skills</span>
              </div>

              <div className="meta-line"></div>

              <div className="meta-item">
                <strong>03</strong>
                <span>Interview</span>
              </div>

            </div>

          </div>


          {/* HERO VISUAL */}
          <div className="hero-visual">

            <div className="background-circle circle-one"></div>
            <div className="background-circle circle-two"></div>

            <div className="floating-role">

              <div className="role-icon">
                ↗
              </div>

              <div>
                <small>
                  TARGET ROLE
                </small>

                <strong>
                  Software Engineer
                </strong>
              </div>

              <span className="role-match">
                91%
              </span>

            </div>


            <div className="profile-card">

              <div className="profile-header">

                <div>
                  <small>
                    AI CAREER PROFILE
                  </small>

                  <h3>
                    Your profile
                  </h3>
                </div>

                <div className="online">
                  <span></span>
                  AI ACTIVE
                </div>

              </div>


              <div className="profile-score">

                <div className="score-ring">

                  <div className="score-center">

                    <strong>
                      87
                    </strong>

                    <small>
                      /100
                    </small>

                  </div>

                </div>

                <div className="score-text">

                  <small>
                    CAREER READINESS
                  </small>

                  <strong>
                    Strong foundation
                  </strong>

                  <p>
                    AI has identified your next opportunities.
                  </p>

                </div>

              </div>


              <div className="profile-divider"></div>


              <div className="profile-metrics">

                <div className="metric">

                  <div className="metric-title">
                    <span>Resume</span>
                    <strong>87%</strong>
                  </div>

                  <div className="progress">
                    <span className="resume-progress"></span>
                  </div>

                </div>


                <div className="metric">

                  <div className="metric-title">
                    <span>Skills</span>
                    <strong>74%</strong>
                  </div>

                  <div className="progress">
                    <span className="skills-progress"></span>
                  </div>

                </div>


                <div className="metric">

                  <div className="metric-title">
                    <span>Interview</span>
                    <strong>68%</strong>
                  </div>

                  <div className="progress">
                    <span className="interview-progress"></span>
                  </div>

                </div>

              </div>


              <div className="ai-message">

                <div className="ai-symbol">
                  ✦
                </div>

                <div>

                  <small>
                    AI INSIGHT
                  </small>

                  <p>
                    Your projects are strong. Add cloud experience
                    to improve your target-role match.
                  </p>

                </div>

              </div>

            </div>


            <div className="floating-skills">

              <small>
                SKILL GAP
              </small>

              <div className="skill-item">
                <span className="skill-dot orange"></span>
                Docker
              </div>

              <div className="skill-item">
                <span className="skill-dot blue"></span>
                AWS
              </div>

              <div className="skill-item">
                <span className="skill-dot green"></span>
                System Design
              </div>

            </div>


            <span className="orbit-dot dot-one"></span>
            <span className="orbit-dot dot-two"></span>
            <span className="orbit-dot dot-three"></span>

          </div>

        </div>

      </section>


      {/* INTRO STRIP */}
      <section className="intro-strip">

        <div>
          <span>
            AI COACH
          </span>

          <strong>
            One place to understand your career.
          </strong>
        </div>

        <p>
          From the first resume upload to your next interview,
          AI Coach helps you know what to improve and why.
        </p>

      </section>


      {/* FEATURES */}
      <section
        className="features"
        id="features"
      >

        <div className="section-heading">

          <div className="section-label">
            THREE AI TOOLS
          </div>

          <h2>
            Your career,
            <br />
            <span>understood.</span>
          </h2>

          <p>
            Every part of AI Coach is designed to answer one question:
            <b> what should I do next?</b>
          </p>

        </div>


        <div className="feature-grid">

          {/* RESUME */}
          <article className="feature-card resume-feature">

            <div className="feature-number">
              01
            </div>

            <div className="feature-icon">
              <span>▤</span>
            </div>

            <h3>
              Resume Analysis
            </h3>

            <p>
              Let AI examine your resume for structure, impact,
              ATS compatibility, and areas that need improvement.
            </p>

            <div className="feature-visual resume-visual">

              <div className="mini-resume">

                <div className="mini-profile"></div>

                <div className="mini-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="mini-section"></div>

                <div className="mini-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

              <div className="mini-score">
                <strong>87</strong>
                <small>ATS SCORE</small>
              </div>

            </div>

            <a
              href="/resume-analyzer"
              className="feature-link"
            >
              Analyze your resume →
            </a>

          </article>


          {/* SKILLS */}
          <article className="feature-card skills-feature">

            <div className="feature-number">
              02
            </div>

            <div className="feature-icon">
              <span>◇</span>
            </div>

            <h3>
              Skill Gap Analysis
            </h3>

            <p>
              Compare your current profile with your target role
              and discover the skills that could move you forward.
            </p>

            <div className="feature-visual skill-visual">

              <div className="skill-center">
                AI
              </div>

              <div className="skill-bubble bubble-a">
                Python
              </div>

              <div className="skill-bubble bubble-b">
                React
              </div>

              <div className="skill-bubble bubble-c missing">
                AWS
              </div>

              <div className="skill-bubble bubble-d missing">
                Docker
              </div>

              <div className="skill-connection connection-a"></div>
              <div className="skill-connection connection-b"></div>
              <div className="skill-connection connection-c"></div>
              <div className="skill-connection connection-d"></div>

            </div>

            <a
              href="/resume-dashboard"
              className="feature-link"
            >
              Discover your gaps →
            </a>

          </article>


          {/* INTERVIEW */}
          <article className="feature-card interview-feature">

            <div className="feature-number">
              03
            </div>

            <div className="feature-icon">
              <span>◉</span>
            </div>

            <h3>
              AI Mock Interview
            </h3>

            <p>
              Practice realistic interview questions and receive
              feedback on your answers, confidence, and clarity.
            </p>

            <div className="feature-visual interview-visual">

              <div className="interview-top">

                <span>
                  QUESTION 04
                </span>

                <span className="recording">
                  <i></i>
                  LIVE
                </span>

              </div>

              <p>
                Tell me about a project where you
                solved a difficult problem.
              </p>

              <div className="waveform">

                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>

              </div>

            </div>

            <a
              href="/mock-interview"
              className="feature-link"
            >
              Practice interview →
            </a>

          </article>

        </div>

      </section>


      {/* PROCESS */}
      <section
        className="process"
        id="process"
      >

        <div className="process-heading">

          <div>

            <div className="section-label">
              HOW IT WORKS
            </div>

            <h2>
              From information
              <br />
              <span>to direction.</span>
            </h2>

          </div>

          <p>
            AI Coach turns your existing experience into
            practical career guidance.
          </p>

        </div>


        <div className="process-container">

          <div className="process-line">
            <span></span>
          </div>


          <div className="process-step">

            <div className="process-number">
              01
            </div>

            <div className="process-icon">
              ↑
            </div>

            <small>
              INPUT
            </small>

            <h3>
              Bring your profile
            </h3>

            <p>
              Upload your resume and tell us the role
              you're working toward.
            </p>

          </div>


          <div className="process-step">

            <div className="process-number">
              02
            </div>

            <div className="process-icon">
              ✦
            </div>

            <small>
              INTELLIGENCE
            </small>

            <h3>
              AI finds the signal
            </h3>

            <p>
              Your experience, skills, and target role
              are analyzed together.
            </p>

          </div>


          <div className="process-step">

            <div className="process-number">
              03
            </div>

            <div className="process-icon">
              ↗
            </div>

            <small>
              ACTION
            </small>

            <h3>
              Know what to do
            </h3>

            <p>
              Get clear recommendations and practice
              until you're ready.
            </p>

          </div>

        </div>

      </section>


      {/* CAREER ROADMAP PREVIEW */}
      <section className="roadmap-preview-section">

        <div className="roadmap-preview-content">

          <div className="section-label">
            AI CAREER ROADMAP
          </div>

          <h2>
            Your career,
            <br />
            <span>mapped from you.</span>
          </h2>

          <p>
            Upload your resume and let AI understand your skills,
            experience, strengths and gaps. Your personalized career
            roadmap will then show you what to learn, what to build,
            and how to prepare for your next opportunity.
          </p>

          <a
            href="/resume-analyzer"
            className="insight-button"
          >
            Analyze My Resume →
          </a>

        </div>


        <div className="roadmap-preview-card">

          <div className="roadmap-preview-header">

            <div>

              <small>
                PERSONALIZED AFTER ANALYSIS
              </small>

              <strong>
                Your roadmap starts with your resume
              </strong>

            </div>

            <span>
              ✦
            </span>

          </div>


          <div className="roadmap-preview-line">

            <div className="preview-step active">

              <span>
                01
              </span>

              <strong>
                Resume
              </strong>

              <small>
                Upload
              </small>

            </div>


            <div className="preview-connector"></div>


            <div className="preview-step">

              <span>
                02
              </span>

              <strong>
                Analysis
              </strong>

              <small>
                Understand
              </small>

            </div>


            <div className="preview-connector"></div>


            <div className="preview-step">

              <span>
                03
              </span>

              <strong>
                Skill Gaps
              </strong>

              <small>
                Discover
              </small>

            </div>


            <div className="preview-connector"></div>


            <div className="preview-step">

              <span>
                04
              </span>

              <strong>
                Roadmap
              </strong>

              <small>
                Personalized
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* INSIGHTS */}
      <section
        className="insights"
        id="insights"
      >

        <div className="insight-background"></div>

        <div className="insight-content">

          <div className="section-label">
            AI CAREER INSIGHTS
          </div>

          <h2>
            Not just a score.
            <br />
            <span>A direction.</span>
          </h2>

          <p>
            A good career tool shouldn't simply tell you that
            your resume is weak. It should tell you why — and
            what you can do about it.
          </p>

          <a
            href="/career-coach"
            className="insight-button"
          >
            Explore your insights →
          </a>

        </div>


        <div className="insight-card">

          <div className="insight-card-header">

            <div>

              <small>
                PERSONALIZED AI INSIGHT
              </small>

              <strong>
                What should you improve?
              </strong>

            </div>

            <span>
              ✦
            </span>

          </div>


          <div className="insight-main">

            <div className="insight-number">
              <span>
                01
              </span>
            </div>

            <div>

              <small>
                BIGGEST OPPORTUNITY
              </small>

              <h3>
                Strengthen your cloud
                <br />
                engineering profile.
              </h3>

              <p>
                Your projects demonstrate strong programming
                ability. Adding practical cloud experience could
                improve your alignment with Software Engineer roles.
              </p>

            </div>

          </div>


          <div className="insight-footer">

            <div>
              <span className="check">
                ✓
              </span>
              Docker
            </div>

            <div>
              <span className="check">
                ✓
              </span>
              AWS
            </div>

            <div>
              <span className="check">
                ✓
              </span>
              Deployment
            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="final-cta">

        <div className="cta-shape shape-one"></div>
        <div className="cta-shape shape-two"></div>

        <div className="section-label">
          YOUR NEXT MOVE
        </div>

        <h2>
          Build the career
          <br />
          <span>you want.</span>
        </h2>

        <p>
          Start with your resume. We'll take it from there.
        </p>

        <a
          href="/resume-analyzer"
          className="primary-button final-button"
        >
          Start with AI Coach
          <span>→</span>
        </a>

      </section>


      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="logo">

              <div className="logo-mark">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span>
                AI<span className="logo-blue">
                  Coach
                </span>
              </span>

            </div>

            <p>
              Intelligent career guidance,
              built for your next opportunity.
            </p>

          </div>


          <div className="footer-column">

            <strong>
              AI TOOLS
            </strong>

            <a href="#features">
              Resume Analysis
            </a>

            <a href="/resume-dashboard">
              Skill Gap Analysis
            </a>

            <a href="/mock-interview">
              Mock Interview
            </a>

            <a href="/career-roadmap">
              Career Roadmap
            </a>

            <a href="/project-recommendations">
              Project Recommendations
            </a>

          </div>


          <div className="footer-column">

            <strong>
              PRODUCT
            </strong>

            <a href="#process">
              How it works
            </a>

            <a href="/career-coach">
              AI Insights
            </a>

            <a href="/resume-dashboard">
              Dashboard
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 AI Coach
          </span>

          <span>
            Built for ambitious careers.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;

import "./ResumeDashboard.css";
import AppHeader from "../components/AppHeader";

function ResumeDashboard() {
  const getSessionItem = (key, fallback = "") => {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const savedAnalysis = getSessionItem("resumeAnalysis");
  const resumeFileName = getSessionItem(
    "resumeFileName",
    "Resume.pdf"
  );

  const resumeText = getSessionItem(
    "resumeText",
    ""
  ).toLowerCase();

  if (!savedAnalysis) {
    return (
      <div className="future-dashboard">
      <AppHeader active="dashboard" />
      <div className="dashboard-empty">
        <div className="empty-orb">
          <span>AI</span>
        </div>

        <p className="empty-eyebrow">
          CAREER INTELLIGENCE
        </p>

        <h1>Start with your resume.</h1>

        <p>
          Upload your resume and let AI Coach build
          your personalized career intelligence profile.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/resume-analyzer";
          }}
        >
          Analyze My Resume <span>→</span>
        </button>
      </div>
      </div>
    );
  }

  let analysis = {};

  try {
    const parsed = JSON.parse(savedAnalysis);

    if (
      parsed &&
      typeof parsed === "object"
    ) {
      analysis = parsed;
    }
  } catch {
    analysis = {};
  }

  /* =====================================================
     SAFE DATA HELPERS
     ===================================================== */

  const safeString = (
    value,
    fallback = ""
  ) => {
    if (typeof value === "string") {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    return fallback;
  };

  const safeArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return String(item);
        }

        return "";
      })
      .filter(Boolean);
  };

  /* =====================================================
     RESUME DATA
     ===================================================== */

  const resumeScore = Math.max(
    0,
    Math.min(
      100,
      Number(analysis.resumeScore) || 0
    )
  );

  const skills = safeArray(
    analysis.skills
  );

  const recommendedSkills = safeArray(
    analysis.recommendedSkills
  );

  const strengths = safeArray(
    analysis.strengths
  );

  const improvementAreas = safeArray(
    analysis.improvementAreas
  );

  const nextSteps = safeArray(
    analysis.nextSteps
  );

  const summary = safeString(
    analysis.summary,
    "Your resume has been analyzed and your career profile is ready."
  );

  const atsFeedback = safeString(
    analysis.atsFeedback,
    "Your resume has a recognizable structure, with opportunities to improve ATS readability."
  );

  const projectFeedback = safeString(
    analysis.projectFeedback,
    "Strengthen your projects with technologies, measurable outcomes and clear impact."
  );

  const careerReadiness = safeString(
    analysis.careerReadiness,
    "Your profile shows a developing technical foundation."
  );

  /* =====================================================
     RESUME CONTENT SIGNAL DETECTION
     ===================================================== */

  const hasSection = (...keywords) =>
    keywords.some((keyword) =>
      resumeText.includes(keyword)
    );

  const wordCount =
    resumeText
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;

  const projectCount =
    (resumeText.match(
      /\b(project|projects)\b/g
    ) || []).length;

  const experienceSignal =
    hasSection(
      "experience",
      "internship",
      "intern",
      "work experience",
      "professional experience"
    );

  const educationSignal =
    hasSection(
      "education",
      "bachelor",
      "b.e",
      "btech",
      "engineering",
      "college",
      "university"
    );

  const certificationSignal =
    hasSection(
      "certification",
      "certifications",
      "certificate",
      "course",
      "coursera",
      "udemy"
    );

  const achievementSignal =
    hasSection(
      "achievement",
      "achievements",
      "award",
      "awards",
      "hackathon",
      "competition"
    );

  const contactSignal =
    hasSection(
      "@",
      "email",
      "phone",
      "linkedin",
      "github"
    );

  /* =====================================================
     DYNAMIC PROFILE METRICS
     ===================================================== */

  const skillScore = Math.max(
    20,
    Math.min(
      100,
      35 +
        skills.length * 6
    )
  );

  const projectScore = Math.max(
    25,
    Math.min(
      100,
      35 +
        projectCount * 18 +
        (hasSection(
          "python",
          "java",
          "javascript",
          "machine learning",
          "pandas",
          "numpy",
          "scikit"
        )
          ? 12
          : 0)
    )
  );

  const experienceScore =
    experienceSignal
      ? 78
      : Math.min(
          55,
          25 +
            (wordCount > 250
              ? 10
              : 0)
        );

  const educationScore =
    educationSignal
      ? 90
      : 50;

  const atsScore = Math.max(
    35,
    Math.min(
      100,
      45 +
        (contactSignal ? 8 : 0) +
        (educationSignal ? 8 : 0) +
        (hasSection(
          "skills"
        )
          ? 10
          : 0) +
        (hasSection(
          "projects"
        )
          ? 10
          : 0) +
        (experienceSignal
          ? 8
          : 0) +
        (certificationSignal
          ? 5
          : 0) +
        (wordCount >= 250
          ? 6
          : 0)
    )
  );

  /* =====================================================
     PROFILE DEPTH
     ===================================================== */

  const profileDepth = Math.round(
    (
      skillScore +
      projectScore +
      experienceScore +
      atsScore +
      educationScore
    ) / 5
  );

  /* =====================================================
     CAREER STATE
     ===================================================== */

  let careerState =
    "Needs improvement";

  if (resumeScore >= 80) {
    careerState =
      "Strong foundation";
  } else if (
    resumeScore >= 65
  ) {
    careerState =
      "Developing";
  }

  /* =====================================================
     PROJECT SIGNAL
     ===================================================== */

  let projectSignal =
    "BUILDING";

  if (
    projectCount >= 2 ||
    hasSection(
      "machine learning",
      "deep learning",
      "artificial intelligence"
    )
  ) {
    projectSignal =
      "STRONG";
  }

  /* =====================================================
     SKILL CATEGORY
     ===================================================== */

  const getSkillCategory = (
    skill
  ) => {
    const value =
      safeString(
        skill
      ).toLowerCase();

    if (
      value.includes("python") ||
      value.includes("java") ||
      value.includes("c++") ||
      value === "c"
    ) {
      return "PROGRAMMING";
    }

    if (
      value.includes("machine") ||
      value.includes("deep") ||
      value.includes("artificial") ||
      value === "ai" ||
      value.includes("scikit") ||
      value.includes("tensorflow") ||
      value.includes("pytorch") ||
      value.includes("data")
    ) {
      return "AI / ML";
    }

    if (
      value.includes("sql") ||
      value.includes("mysql") ||
      value.includes("mongo") ||
      value.includes("database")
    ) {
      return "DATA";
    }

    if (
      value.includes("react") ||
      value.includes("javascript") ||
      value.includes("typescript") ||
      value.includes("html") ||
      value.includes("css") ||
      value.includes("node") ||
      value.includes("express")
    ) {
      return "WEB";
    }

    if (
      value.includes("git") ||
      value.includes("github") ||
      value.includes("docker") ||
      value.includes("aws") ||
      value.includes("azure")
    ) {
      return "TOOLS";
    }

    return "TECHNICAL";
  };

  /* =====================================================
     DYNAMIC SKILL LEVEL
     ===================================================== */

  const getSkillLevel = (
    skill,
    index
  ) => {
    const value =
      safeString(
        skill
      ).toLowerCase();

    let level = 55;

    if (
      resumeText.includes(
        value
      )
    ) {
      level += 12;
    }

    if (
      value.includes("python") ||
      value.includes("java") ||
      value.includes("c++") ||
      value === "c"
    ) {
      level += 8;
    }

    if (
      value.includes("machine") ||
      value.includes("scikit") ||
      value.includes("pandas") ||
      value.includes("numpy")
    ) {
      level += 5;
    }

    level -= index * 2;

    return Math.max(
      42,
      Math.min(
        94,
        level
      )
    );
  };

  /* =====================================================
     DISPLAY DATA
     ===================================================== */

  const displayedSkills =
    skills.length > 0
      ? skills.slice(0, 8)
      : [
          "Python",
          "C",
          "C++",
          "Java",
          "DSA"
        ];

  const displayedRecommended =
    recommendedSkills.length > 0
      ? recommendedSkills.slice(0, 6)
      : [
          "SQL",
          "Advanced ML",
          "Model Deployment",
          "Git & GitHub",
          "Cloud Fundamentals",
          "System Design"
        ];

  const displayedStrengths =
    strengths.length > 0
      ? strengths.slice(0, 4)
      : [
          "Technical foundation",
          "Academic background",
          "Programming skills",
          "Project exposure"
        ];

  const displayedImprovements =
    improvementAreas.length > 0
      ? improvementAreas.slice(0, 4)
      : [
          "Add measurable project outcomes",
          "Strengthen experience section",
          "Expand technical skills",
          "Improve ATS keyword coverage"
        ];

  const displayedSteps =
    nextSteps.length > 0
      ? nextSteps.slice(0, 4)
      : [
          "Strengthen core technical skills",
          "Build stronger portfolio projects",
          "Improve resume impact",
          "Prepare for internships"
        ];

  /* =====================================================
     SCORE RING
     ===================================================== */

  const scoreRadius = 66;

  const scoreCircumference =
    2 *
    Math.PI *
    scoreRadius;

  const scoreOffset =
    scoreCircumference -
    (resumeScore / 100) *
      scoreCircumference;

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const goToAnalyzer = () => {
    window.location.href =
      "/resume-analyzer";
  };

  const goHome = () => {
    window.location.href =
      "/";
  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="future-dashboard">

      <div className="dashboard-grid" />

      <div className="dashboard-glow dashboard-glow-blue" />

      <div className="dashboard-glow dashboard-glow-mint" />

      {/* =================================================
          HEADER
         ================================================= */}

      <AppHeader active="dashboard">
<div className="resume-file-pill"><span className="file-pill-icon">PDF</span><span>{resumeFileName}</span></div>
<button type="button" className="ah-btn ah-btn--primary" onClick={goToAnalyzer}>New analysis <span>+</span></button>
</AppHeader>

      <main className="dashboard-main">

        {/* =================================================
            HERO
           ================================================= */}

        <section className="intelligence-hero">

          <div className="hero-copy">

            <div className="dashboard-eyebrow">
              <span />
              RESUME INTELLIGENCE
            </div>

            <h1>
              Your career,
              <br />
              <span>
                decoded.
              </span>
            </h1>

            <p>
              {summary}
            </p>

            <div className="hero-meta">

              <span>
                <i />
                ANALYSIS COMPLETE
              </span>

              <span>
                PROFILE SIGNALS ACTIVE
              </span>

            </div>

          </div>

          <div className="hero-score">

            <div className="score-orbit orbit-outer" />

            <div className="score-orbit orbit-inner" />

            <svg
              className="hero-score-ring"
              viewBox="0 0 160 160"
              aria-label={`Resume score ${resumeScore} out of 100`}
            >

              <circle
                className="hero-score-track"
                cx="80"
                cy="80"
                r={scoreRadius}
              />

              <circle
                className="hero-score-progress"
                cx="80"
                cy="80"
                r={scoreRadius}
                style={{
                  strokeDasharray:
                    scoreCircumference,
                  strokeDashoffset:
                    scoreOffset
                }}
              />

            </svg>

            <div className="hero-score-content">

              <span>
                SCORE
              </span>

              <strong>
                {resumeScore}
              </strong>

              <small>
                / 100
              </small>

            </div>

            <div className="score-orbit-label">
              CAREER READINESS
            </div>

          </div>

        </section>

        {/* =================================================
            SIGNAL BAR
           ================================================= */}

        <section className="signal-bar">

          <div className="signal-item">

            <span className="signal-number">
              {String(
                skills.length
              ).padStart(2, "0")}
            </span>

            <div>
              <small>
                SKILLS DETECTED
              </small>

              <strong>
                Technical profile
              </strong>
            </div>

          </div>

          <div className="signal-divider" />

          <div className="signal-item">

            <span className="signal-number">
              {String(
                Math.max(
                  0,
                  Math.min(
                    9,
                    projectCount
                  )
                )
              ).padStart(2, "0")}
            </span>

            <div>
              <small>
                PROJECT SIGNAL
              </small>

              <strong>
                {projectSignal}
              </strong>
            </div>

          </div>

          <div className="signal-divider" />

          <div className="signal-item">

            <span className="signal-state">
              <i />
              LIVE
            </span>

            <div>
              <small>
                PROFILE STATE
              </small>

              <strong>
                {careerState}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            AI INSIGHT
           ================================================= */}

        <section className="ai-insight">

          <div className="ai-insight-left">

            <div className="ai-chip">
              <span>
                ✦
              </span>
              AI CAREER SIGNAL
            </div>

            <h2>
              You have a foundation.
              <br />
              <span>
                Now build depth.
              </span>
            </h2>

            <p>
              {careerReadiness}
            </p>

          </div>

          <div className="ai-insight-right">

            <div className="insight-pulse">
              <span />
              <span />
              <span />
            </div>

            <small>
              PROFILE ANALYZED
            </small>

            <strong>
              {skills.length} technical signals
            </strong>

          </div>

        </section>

        {/* =================================================
            CAPABILITY MAP
           ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span>
                01 / CAPABILITY MAP
              </span>

              <h2>
                Your technical landscape.
              </h2>

            </div>

            <p>
              Skills detected from your resume,
              organized into a visual capability
              profile.
            </p>

          </div>

          <div className="capability-layout">

            <div className="constellation">

              <div className="constellation-line line-one" />
              <div className="constellation-line line-two" />
              <div className="constellation-line line-three" />

              <div className="constellation-core">
                <span>
                  AI
                </span>

                <small>
                  TECH
                </small>
              </div>

              {displayedSkills
                .slice(0, 6)
                .map(
                  (
                    skill,
                    index
                  ) => (

                    <div
                      className={`skill-node node-${index + 1}`}
                      key={`node-${skill}-${index}`}
                    >

                      <span className="node-dot" />

                      <strong>
                        {skill}
                      </strong>

                      <small>
                        {getSkillCategory(
                          skill
                        )}
                      </small>

                    </div>

                  )
                )}

            </div>

            <div className="skill-detail-panel">

              <div className="panel-top">

                <span>
                  CURRENT SKILLS
                </span>

                <strong>
                  {skills.length}
                </strong>

              </div>

              {displayedSkills
                .slice(0, 5)
                .map(
                  (
                    skill,
                    index
                  ) => {

                    const level =
                      getSkillLevel(
                        skill,
                        index
                      );

                    return (

                      <div
                        className="skill-progress-row"
                        key={`skill-${skill}-${index}`}
                      >

                        <div className="skill-progress-header">

                          <span>
                            {skill}
                          </span>

                          <small>
                            {level}%
                          </small>

                        </div>

                        <div className="skill-progress-track">

                          <div
                            className="skill-progress-fill"
                            style={{
                              width: `${level}%`
                            }}
                          />

                        </div>

                      </div>

                    );
                  }
                )}

            </div>

          </div>

        </section>

        {/* =================================================
            PROFILE SIGNALS
           ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span>
                02 / PROFILE SIGNALS
              </span>

              <h2>
                What your resume communicates.
              </h2>

            </div>

          </div>

          <div className="signal-grid">

            <div className="profile-signal-card">

              <div className="profile-signal-icon blue">
                ◈
              </div>

              <span>
                STRENGTH
              </span>

              <h3>
                Technical foundation
              </h3>

              <p>
                {displayedStrengths[0]}
              </p>

              <div className="signal-card-line" />

              <strong>
                Positive signal
              </strong>

            </div>

            <div className="profile-signal-card">

              <div className="profile-signal-icon mint">
                ◆
              </div>

              <span>
                PROJECT
              </span>

              <h3>
                Practical exposure
              </h3>

              <p>
                {projectFeedback}
              </p>

              <div className="signal-card-line" />

              <strong>
                Development area
              </strong>

            </div>

            <div className="profile-signal-card">

              <div className="profile-signal-icon orange">
                ◎
              </div>

              <span>
                ATS
              </span>

              <h3>
                Resume structure
              </h3>

              <p>
                {atsFeedback}
              </p>

              <div className="signal-card-line" />

              <strong>
                Optimization available
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            SKILL GAP
           ================================================= */}

        <section className="gap-section">

          <div className="gap-copy">

            <div className="dashboard-eyebrow">
              <span />
              03 / SKILL GAP
            </div>

            <h2>
              The distance between
              <br />
              <span>
                now and next.
              </span>
            </h2>

            <p>
              Your current skills create the
              foundation. These are the areas
              your resume indicates could be
              strengthened next.
            </p>

            <div className="gap-list">

              {displayedImprovements
                .slice(0, 3)
                .map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="gap-list-item"
                      key={`gap-${index}`}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p>
                        {item}
                      </p>

                    </div>

                  )
                )}

            </div>

          </div>

          {/* RADAR */}

          <div className="radar-card">

            <div className="radar-label">

              <span>
                PROFILE DEPTH
              </span>

              <strong>
                {profileDepth}%
              </strong>

            </div>

            <div className="radar">

              <div className="radar-ring radar-ring-one" />

              <div className="radar-ring radar-ring-two" />

              <div className="radar-ring radar-ring-three" />

              <div className="radar-axis axis-one" />

              <div className="radar-axis axis-two" />

              <div className="radar-axis axis-three" />

              <div
                className="radar-shape"
                style={{
                  transform: `translate(-50%, -50%) rotate(30deg) scale(${0.72 + profileDepth / 400})`
                }}
              >
                <span />
              </div>

              <div className="radar-center">

                <span>
                  {profileDepth}
                </span>

              </div>

              <label className="radar-label-top">
                SKILLS
              </label>

              <label className="radar-label-right">
                PROJECTS
              </label>

              <label className="radar-label-bottom">
                EXPERIENCE
              </label>

              <label className="radar-label-left">
                ATS
              </label>

            </div>

          </div>

        </section>

        {/* =================================================
            NEXT SKILLS
           ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span>
                04 / NEXT SKILL LAYER
              </span>

              <h2>
                What to build next.
              </h2>

            </div>

            <p>
              Recommended capabilities based
              on the gaps detected in your
              current profile.
            </p>

          </div>

          <div className="future-skills-grid">

            {displayedRecommended.map(
              (
                skill,
                index
              ) => (

                <div
                  className="future-skill-card"
                  key={`recommended-${skill}-${index}`}
                >

                  <span>
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div className="future-skill-dot" />

                  <h3>
                    {skill}
                  </h3>

                  <p>
                    Add this capability
                    to strengthen your
                    profile.
                  </p>

                  <div className="future-skill-arrow">
                    ↗
                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            CAREER TRAJECTORY
           ================================================= */}

        <section className="trajectory-section">

          <div className="trajectory-heading">

            <span>
              05 / CAREER TRAJECTORY
            </span>

            <h2>
              Turn your current profile
              <br />
              into your next opportunity.
            </h2>

          </div>

          <div className="trajectory-line">

            <div className="trajectory-step active">

              <div className="trajectory-dot">
                <span />
              </div>

              <small>
                NOW
              </small>

              <strong>
                AIML Student
              </strong>

              <p>
                Current foundation
              </p>

            </div>

            <div className="trajectory-connector">
              <span />
            </div>

            <div className="trajectory-step">

              <div className="trajectory-dot">
                <span />
              </div>

              <small>
                BUILD
              </small>

              <strong>
                Deeper Skills
              </strong>

              <p>
                Close identified gaps
              </p>

            </div>

            <div className="trajectory-connector">
              <span />
            </div>

            <div className="trajectory-step">

              <div className="trajectory-dot">
                <span />
              </div>

              <small>
                TARGET
              </small>

              <strong>
                Internship
              </strong>

              <p>
                Apply with confidence
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            RESUME INTELLIGENCE
           ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span>
                06 / RESUME INTELLIGENCE
              </span>

              <h2>
                What to improve first.
              </h2>

            </div>

          </div>

          <div className="resume-intelligence-grid">

            {/* STRENGTHS */}

            <div className="intelligence-column">

              <div className="column-heading positive">

                <span>
                  +
                </span>

                <div>

                  <small>
                    KEEP BUILDING
                  </small>

                  <h3>
                    Your strengths
                  </h3>

                </div>

              </div>

              <div className="intelligence-items">

                {displayedStrengths.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="intelligence-item"
                      key={`strength-${index}`}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p>
                        {item}
                      </p>

                      <i>
                        ✓
                      </i>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* IMPROVEMENTS */}

            <div className="intelligence-column">

              <div className="column-heading improvement">

                <span>
                  ↗
                </span>

                <div>

                  <small>
                    FOCUS AREA
                  </small>

                  <h3>
                    Improve next
                  </h3>

                </div>

              </div>

              <div className="intelligence-items">

                {displayedImprovements.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="intelligence-item"
                      key={`improvement-${index}`}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p>
                        {item}
                      </p>

                      <i>
                        →
                      </i>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            PROJECT INTELLIGENCE
           ================================================= */}

        <section className="project-intelligence">

          <div className="project-intelligence-copy">

            <span>
              07 / PROJECT INTELLIGENCE
            </span>

            <h2>
              Your projects should
              <br />
              <strong>
                prove your skills.
              </strong>
            </h2>

            <p>
              {projectFeedback}
            </p>

          </div>

          <div className="project-metric">

            <div className="project-metric-circle">

              <strong>
                {String(
                  Math.min(
                    9,
                    projectCount
                  )
                ).padStart(
                  2,
                  "0"
                )}
              </strong>

              <span>
                PROJECT
                <br />
                SIGNAL
              </span>

            </div>

            <div className="project-metric-copy">

              <small>
                CURRENT STATE
              </small>

              <strong>
                {projectSignal === "STRONG"
                  ? "Good exposure"
                  : "Build depth"}
              </strong>

              <p>
                Add measurable outcomes,
                technologies and impact.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            ACTION SYSTEM
           ================================================= */}

        <section className="action-system">

          <div className="action-heading">

            <div>

              <span>
                08 / ACTION SYSTEM
              </span>

              <h2>
                Your next moves.
              </h2>

            </div>

            <p>
              A practical sequence generated
              from your current resume profile.
            </p>

          </div>

          <div className="action-grid">

            {displayedSteps.map(
              (
                step,
                index
              ) => (

                <div
                  className={`action-card ${
                    index === 0
                      ? "action-primary"
                      : ""
                  }`}
                  key={`action-${index}`}
                >

                  <span className="action-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div className="action-status">
                    {index === 0
                      ? "START HERE"
                      : "NEXT"}
                  </div>

                  <h3>
                    {step}
                  </h3>

                  <div className="action-arrow">
                    →
                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            FINAL
           ================================================= */}

        <section className="future-final">

          <div className="final-orbit final-orbit-one" />

          <div className="final-orbit final-orbit-two" />

          <div className="final-content">

            <span>
              YOUR CAREER PROFILE IS READY
            </span>

            <h2>
              Keep building.
              <br />
              <strong>
                Keep moving.
              </strong>
            </h2>

            <p>
              Your resume is only the starting
              point. Continue improving your
              skills, projects and experience.
            </p>

          </div>

          <button
            type="button"
            onClick={goToAnalyzer}
          >
            Analyze another resume

            <span>
              →
            </span>

          </button>

        </section>

      </main>

      {/* =================================================
          FOOTER
         ================================================= */}

      <footer className="dashboard-footer">

        <span>
          AI COACH
        </span>

        <span>
          CAREER INTELLIGENCE SYSTEM
        </span>

        <span>
          RESUME ANALYSIS
        </span>

      </footer>

    </div>
  );
}

export default ResumeDashboard;
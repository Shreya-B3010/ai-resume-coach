import { useEffect, useMemo, useState } from "react";
import "./CareerRoadmap.css";
import AppHeader from "../components/AppHeader";

function CareerRoadmap() {
  const [analysis, setAnalysis] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [careerTarget, setCareerTarget] = useState("");

  useEffect(() => {
    const savedAnalysis = sessionStorage.getItem("resumeAnalysis");
    const savedFileName = sessionStorage.getItem("resumeFileName");
    const savedCareerTarget =
      sessionStorage.getItem("careerTarget");

    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (error) {
        console.error(
          "Could not load resume analysis:",
          error
        );
      }
    }

    if (savedFileName) {
      setResumeFileName(savedFileName);
    }

    if (savedCareerTarget) {
      setCareerTarget(savedCareerTarget);
    }
  }, []);

  const skills = Array.isArray(analysis?.skills)
    ? analysis.skills
    : [];

  const recommendedSkills = Array.isArray(
    analysis?.recommendedSkills
  )
    ? analysis.recommendedSkills
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

  const resumeScore = Number(
    analysis?.resumeScore || 0
  );

  /* =========================================================
     DETECTED SKILLS
  ========================================================= */

  const detectedSkills = useMemo(() => {
    if (skills.length > 0) {
      return skills.slice(0, 8);
    }

    return [
      "Python",
      "C/C++",
      "Java",
      "DSA",
    ];
  }, [skills]);

  /* =========================================================
     CAREER TARGET
  ========================================================= */

  const target = careerTarget || "Software Engineer";

  const careerData = useMemo(() => {
    const data = {
      "AI Engineer": {
        direction: "AI Engineer",
        shortDescription:
          "Build intelligent applications and AI-powered systems.",
        skills: [
          "Python",
          "Machine Learning",
          "Deep Learning",
          "LLMs",
          "APIs",
          "AI Deployment",
        ],
        project:
          "Build an AI-powered application using a machine learning or LLM pipeline and deploy it as a usable product.",
        projectSkills: [
          "Python",
          "AI / ML",
          "APIs",
          "LLMs",
          "GitHub",
          "Deployment",
        ],
        interviewSkills: [
          "Python",
          "AI Fundamentals",
          "Machine Learning",
          "LLMs",
          "Projects",
          "Problem Solving",
        ],
        focus:
          "AI systems, machine learning fundamentals and practical AI applications.",
      },

      "Machine Learning Engineer": {
        direction: "Machine Learning Engineer",
        shortDescription:
          "Build, train and deploy machine learning models.",
        skills: [
          "Python",
          "Statistics",
          "Machine Learning",
          "Scikit-learn",
          "Feature Engineering",
          "Model Deployment",
        ],
        project:
          "Build an end-to-end Machine Learning project with data preprocessing, model training, evaluation and deployment.",
        projectSkills: [
          "Python",
          "Pandas",
          "Scikit-learn",
          "ML",
          "APIs",
          "Deployment",
        ],
        interviewSkills: [
          "Python",
          "Statistics",
          "Machine Learning",
          "Model Evaluation",
          "DSA",
          "Projects",
        ],
        focus:
          "Machine learning fundamentals, model development and deployment.",
      },

      "Software Engineer": {
        direction: "Software Engineer",
        shortDescription:
          "Design and build reliable software applications and systems.",
        skills: [
          "DSA",
          "OOP",
          "Java",
          "DBMS",
          "Operating Systems",
          "System Design",
        ],
        project:
          "Build a complete software application with a clean architecture, database integration, APIs and deployment.",
        projectSkills: [
          "Java",
          "DSA",
          "OOP",
          "DBMS",
          "APIs",
          "GitHub",
        ],
        interviewSkills: [
          "DSA",
          "OOP",
          "DBMS",
          "Operating Systems",
          "Computer Networks",
          "Projects",
        ],
        focus:
          "Programming fundamentals, problem solving and software engineering concepts.",
      },

      "Data Scientist": {
        direction: "Data Scientist",
        shortDescription:
          "Turn data into insights using statistics and machine learning.",
        skills: [
          "Python",
          "SQL",
          "Statistics",
          "Pandas",
          "Machine Learning",
          "Data Visualization",
        ],
        project:
          "Build a data science project that analyzes a real dataset, discovers patterns and uses machine learning to generate useful predictions.",
        projectSkills: [
          "Python",
          "SQL",
          "Pandas",
          "Statistics",
          "Machine Learning",
          "Visualization",
        ],
        interviewSkills: [
          "Python",
          "SQL",
          "Statistics",
          "Machine Learning",
          "Data Analysis",
          "Projects",
        ],
        focus:
          "Statistics, data analysis, machine learning and communicating insights.",
      },

      "Data Analyst": {
        direction: "Data Analyst",
        shortDescription:
          "Analyze data and communicate useful business insights.",
        skills: [
          "SQL",
          "Excel",
          "Python",
          "Pandas",
          "Data Visualization",
          "Power BI",
        ],
        project:
          "Build a data analytics dashboard using SQL, Python and visualization tools to communicate meaningful insights.",
        projectSkills: [
          "SQL",
          "Excel",
          "Python",
          "Pandas",
          "Power BI",
          "Visualization",
        ],
        interviewSkills: [
          "SQL",
          "Excel",
          "Statistics",
          "Data Analysis",
          "Visualization",
          "Business Questions",
        ],
        focus:
          "SQL, data analysis, visualization and communicating business insights.",
      },

      "Frontend Developer": {
        direction: "Frontend Developer",
        shortDescription:
          "Create polished, responsive and interactive web applications.",
        skills: [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "APIs",
          "Git & GitHub",
        ],
        project:
          "Build and deploy a polished React application with responsive UI, API integration and a professional GitHub repository.",
        projectSkills: [
          "React",
          "JavaScript",
          "CSS",
          "APIs",
          "GitHub",
          "Deployment",
        ],
        interviewSkills: [
          "JavaScript",
          "React",
          "HTML/CSS",
          "APIs",
          "Web Fundamentals",
          "Projects",
        ],
        focus:
          "Modern frontend development, React and building polished user experiences.",
      },
    };

    return (
      data[careerTarget] ||
      data["Software Engineer"]
    );
  }, [careerTarget]);

  /* =========================================================
     CAREER-SPECIFIC SKILL GAPS
  ========================================================= */

  const skillGaps = useMemo(() => {
    const existingSkills = skills.map((skill) =>
      String(skill).toLowerCase()
    );

    const missingTargetSkills =
      careerData.skills.filter(
        (skill) =>
          !existingSkills.some((existing) =>
            existing.includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(existing)
          )
      );

    const recommended = recommendedSkills.filter(
      (skill) =>
        !missingTargetSkills.some(
          (targetSkill) =>
            targetSkill.toLowerCase() ===
            String(skill).toLowerCase()
        )
    );

    const combined = [
      ...missingTargetSkills,
      ...recommended,
    ];

    const unique = [];

    combined.forEach((skill) => {
      if (
        skill &&
        !unique.some(
          (item) =>
            String(item).toLowerCase() ===
            String(skill).toLowerCase()
        )
      ) {
        unique.push(skill);
      }
    });

    if (unique.length > 0) {
      return unique.slice(0, 6);
    }

    return careerData.skills.slice(0, 6);
  }, [
    skills,
    recommendedSkills,
    careerData,
  ]);

  /* =========================================================
     READINESS
  ========================================================= */

  const readinessLabel = useMemo(() => {
    if (resumeScore >= 85) {
      return "Strong foundation";
    }

    if (resumeScore >= 70) {
      return "Building momentum";
    }

    if (resumeScore >= 50) {
      return "Developing foundation";
    }

    return "Early foundation";
  }, [resumeScore]);

  /* =========================================================
     ROADMAP STAGES
  ========================================================= */

  const roadmapStages = [
    {
      number: "01",
      label: "CURRENT",
      title: "Understand your foundation",
      description:
        `Start from the technical strengths already visible in your resume. Your current profile provides the foundation for becoming a ${careerData.direction}. Strengthen the skills you already have before expanding too broadly.`,
      skills: detectedSkills.slice(0, 5),
      status: "CURRENT",
      type: "current",
    },

    {
      number: "02",
      label: "NEXT PRIORITY",
      title: `Build toward ${careerData.direction}`,
      description:
        `Your selected target requires a focused set of skills. Prioritize the missing capabilities that are most relevant to ${careerData.direction} and learn them through practical work.`,
      skills: skillGaps.slice(0, 4),
      status: "NEXT",
      type: "next",
    },

    {
      number: "03",
      label: "BUILD",
      title: "Create proof of ability",
      description:
        `Build a project specifically aligned with your ${careerData.direction} target. The project should demonstrate the technical skills you're developing and show that you can apply them to a real problem.`,
      skills: careerData.projectSkills.slice(0, 4),
      status: "BUILD",
      type: "build",
    },

    {
      number: "04",
      label: "PREPARE",
      title: "Become interview ready",
      description:
        `Prepare for interviews around the skills relevant to ${careerData.direction}. Combine technical preparation, problem solving, project explanations and communication practice.`,
      skills: careerData.interviewSkills.slice(0, 4),
      status: "PREPARE",
      type: "prepare",
    },

    {
      number: "05",
      label: "TARGET",
      title: "Move toward real opportunities",
      description:
        `Use your improved resume, stronger projects and interview preparation to target internships and entry-level opportunities related to ${careerData.direction}.`,
      skills: [
        "Internships",
        careerData.direction,
        "Resume",
        "Applications",
      ],
      status: "TARGET",
      type: "target",
    },
  ];

  const nextSkill =
    skillGaps.length > 0
      ? skillGaps[0]
      : careerData.skills[0];

  const projectFocus = careerData.project;

  const nextMoveText =
    strengths.length > 0
      ? `Your profile already shows strengths in ${strengths
          .slice(0, 2)
          .join(" and ")}. Use those strengths as your starting point and focus next on ${nextSkill} for your ${careerData.direction} target.`
      : `Your next priority should be ${nextSkill}. Build practical evidence around it and connect that learning to your ${careerData.direction} career target.`;

  return (
    <div className="roadmap-page">

      {/* HEADER */}

      <AppHeader active="roadmap" width={1110}>
<a className="ah-btn" href="/resume-dashboard">← Back to Dashboard</a>
</AppHeader>

      {/* HERO */}

      <section className="roadmap-hero">

        <div className="roadmap-eyebrow">
          <span className="roadmap-eyebrow-dot"></span>
          AI CAREER ROADMAP
        </div>

        <h1>
          Your career,
          <br />
          <span>mapped from you.</span>
        </h1>

        <p>
          Your roadmap turns the signals from your resume
          into practical next steps for your selected career
          target — what to strengthen, what to build, and
          how to prepare for your next opportunity.
        </p>

      </section>

      <main className="roadmap-content">

        {/* PROFILE OVERVIEW */}

        <section className="roadmap-overview">

          <div className="overview-main">

            <div className="overview-label">
              PERSONALIZED PROFILE
            </div>

            <h2>
              {careerData.direction}
            </h2>

            <p>
              {resumeFileName
                ? `Generated from ${resumeFileName}`
                : "Generated from your resume analysis"}
            </p>

            <div className="overview-tags">

              <span>
                {detectedSkills.length} detected skills
              </span>

              <span>
                {skillGaps.length} priority gaps
              </span>

              <span>
                {readinessLabel}
              </span>

            </div>

          </div>

          <div className="overview-score">

            <div className="overview-score-ring">

              <svg viewBox="0 0 120 120">

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="overview-track"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="overview-progress"
                  style={{
                    strokeDasharray:
                      `${resumeScore * 3.14} 314`,
                  }}
                />

              </svg>

              <div>
                <strong>
                  {resumeScore}
                </strong>

                <span>
                  /100
                </span>
              </div>

            </div>

            <small>
              PROFILE SCORE
            </small>

          </div>

        </section>

        {/* TARGET CAREER CARD */}

        <section className="roadmap-intelligence">

          <div className="intelligence-card">

            <span className="intel-icon blue">
              ✦
            </span>

            <div>
              <small>
                SELECTED CAREER
              </small>

              <strong>
                {careerData.direction}
              </strong>

              <p>
                {careerData.shortDescription}
              </p>
            </div>

          </div>

          <div className="intelligence-card">

            <span className="intel-icon orange">
              !
            </span>

            <div>
              <small>
                PRIORITY GAP
              </small>

              <strong>
                {nextSkill}
              </strong>

              <p>
                This is one of the next areas to focus on.
              </p>
            </div>

          </div>

          <div className="intelligence-card">

            <span className="intel-icon mint">
              ↗
            </span>

            <div>
              <small>
                CAREER FOCUS
              </small>

              <strong>
                {careerData.focus}
              </strong>

              <p>
                Your roadmap is aligned with your selected target.
              </p>
            </div>

          </div>

        </section>

        {/* SKILL MAP */}

        <section className="skill-map-section">

          <div className="roadmap-section-heading">

            <small>
              YOUR SKILL MAP
            </small>

            <h2>
              What you have vs. what comes next.
            </h2>

            <p>
              Your existing skills form the foundation.
              The priority layer shows capabilities that
              can move you toward {careerData.direction}.
            </p>

          </div>

          <div className="skill-map">

            <div className="skill-column">

              <div className="skill-column-header">

                <div>
                  <span className="skill-column-dot blue"></span>

                  <strong>
                    YOUR FOUNDATION
                  </strong>
                </div>

                <span>
                  {detectedSkills.length}
                </span>

              </div>

              <div className="skill-list">

                {detectedSkills.map(
                  (skill, index) => (
                    <div
                      className="skill-map-item"
                      key={index}
                    >
                      <span>✓</span>
                      {skill}
                    </div>
                  )
                )}

              </div>

            </div>

            <div className="skill-map-arrow">
              →
            </div>

            <div className="skill-column priority">

              <div className="skill-column-header">

                <div>
                  <span className="skill-column-dot orange"></span>

                  <strong>
                    PRIORITY NEXT
                  </strong>
                </div>

                <span>
                  {skillGaps.length}
                </span>

              </div>

              <div className="skill-list">

                {skillGaps.map(
                  (skill, index) => (
                    <div
                      className="skill-map-item"
                      key={index}
                    >
                      <span>+</span>
                      {skill}
                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ROADMAP */}

        <section className="roadmap-main-section">

          <div className="roadmap-section-heading">

            <small>
              YOUR CAREER JOURNEY
            </small>

            <h2>
              From foundation to opportunity.
            </h2>

            <p>
              Five practical stages designed around your
              current profile and your target:
              <strong> {careerData.direction}</strong>.
            </p>

          </div>

          <div className="roadmap-timeline">

            {roadmapStages.map(
              (stage, index) => (

                <div
                  className={`roadmap-step ${
                    index === 0 ? "active" : ""
                  }`}
                  key={stage.number}
                >

                  <div className="roadmap-node">
                    {stage.number}
                  </div>

                  <div className="roadmap-card">

                    <div className="roadmap-card-top">

                      <div>

                        <div className="roadmap-card-label">
                          {stage.label}
                        </div>

                        <h3>
                          {stage.title}
                        </h3>

                        <p className="roadmap-card-description">
                          {stage.description}
                        </p>

                      </div>

                      <span
                        className={`roadmap-status ${stage.type}`}
                      >
                        {stage.status}
                      </span>

                    </div>

                    <div className="roadmap-skills">

                      {stage.skills.map(
                        (skill, skillIndex) => (

                          <span
                            className={`roadmap-skill ${
                              stage.type === "next"
                                ? "missing"
                                : ""
                            }`}
                            key={skillIndex}
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* 30 / 60 / 90 DAY PLAN */}

        <section className="roadmap-plan-section">

          <div className="roadmap-section-heading">

            <small>
              EXECUTION PLAN
            </small>

            <h2>
              Turn the roadmap into action.
            </h2>

            <p>
              A focused progression for becoming more
              prepared for {careerData.direction}.
            </p>

          </div>

          <div className="plan-grid">

            <div className="plan-card">

              <span className="plan-number">
                30
              </span>

              <div>

                <small>
                  FIRST 30 DAYS
                </small>

                <h3>
                  Strengthen
                </h3>

                <p>
                  Focus on your highest-priority skill gap:
                  <strong> {nextSkill}</strong>.
                  Practice consistently and build a small
                  project or feature around it.
                </p>

              </div>

            </div>

            <div className="plan-card">

              <span className="plan-number">
                60
              </span>

              <div>

                <small>
                  FIRST 60 DAYS
                </small>

                <h3>
                  Build
                </h3>

                <p>
                  Create a portfolio-quality project
                  specifically aligned with
                  <strong> {careerData.direction}</strong>.
                  Document the technology, problem and result.
                </p>

              </div>

            </div>

            <div className="plan-card">

              <span className="plan-number">
                90
              </span>

              <div>

                <small>
                  FIRST 90 DAYS
                </small>

                <h3>
                  Prepare & apply
                </h3>

                <p>
                  Polish your resume and GitHub, practice
                  target-specific interviews and begin
                  targeting opportunities aligned with
                  <strong> {careerData.direction}</strong>.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* PROJECT RECOMMENDATION */}

        <section className="project-recommendation">

          <div className="project-recommendation-glow"></div>

          <div className="project-icon">
            ✦
          </div>

          <div className="project-content">

            <span>
              RECOMMENDED PROJECT DIRECTION
            </span>

            <h2>
              {projectFocus}
            </h2>

            <p>
              The goal is not to add another project just
              for the resume. Build something that directly
              demonstrates the capabilities required for your
              selected career target.
            </p>

            <div className="project-points">

              <span>
                <i>✓</i>
                Real problem
              </span>

              <span>
                <i>✓</i>
                GitHub repository
              </span>

              <span>
                <i>✓</i>
                Measurable result
              </span>

              <span>
                <i>✓</i>
                Deployment
              </span>

            </div>

            {/* PROJECT RECOMMENDATIONS BUTTON */}

            <a
              href="/project-recommendations"
              className="roadmap-button primary"
              style={{
                display: "inline-flex",
                marginTop: "24px",
              }}
            >
              Explore Recommended Projects
              <span>→</span>
            </a>

          </div>

        </section>

        {/* TARGET INTERVIEW PREPARATION */}

        <section className="improvement-section">

          <div className="roadmap-section-heading">

            <small>
              INTERVIEW PREPARATION
            </small>

            <h2>
              Prepare for your target role.
            </h2>

            <p>
              These are the areas your preparation should
              cover for {careerData.direction}.
            </p>

          </div>

          <div className="improvement-grid">

            {careerData.interviewSkills
              .slice(0, 4)
              .map((area, index) => (

                <div
                  className="improvement-card"
                  key={index}
                >

                  <span>
                    0{index + 1}
                  </span>

                  <p>
                    {area}
                  </p>

                </div>

              ))}

          </div>

        </section>

        {/* RESUME IMPROVEMENT AREAS */}

        {improvementAreas.length > 0 && (

          <section className="improvement-section">

            <div className="roadmap-section-heading">

              <small>
                RESUME SIGNALS
              </small>

              <h2>
                Areas worth improving.
              </h2>

              <p>
                These signals came directly from your
                resume analysis and should be considered
                alongside your career target.
              </p>

            </div>

            <div className="improvement-grid">

              {improvementAreas
                .slice(0, 4)
                .map((area, index) => (

                  <div
                    className="improvement-card"
                    key={index}
                  >

                    <span>
                      0{index + 1}
                    </span>

                    <p>
                      {area}
                    </p>

                  </div>

                ))}

            </div>

          </section>

        )}

        {/* FINAL ACTION */}

        <section className="roadmap-action">

          <div className="roadmap-action-content">

            <small>
              YOUR NEXT MOVE
            </small>

            <h2>
              You're not starting from zero.
            </h2>

            <p>
              {nextMoveText}
            </p>

            <div className="action-meta">

              <span>
                ✦ {careerData.direction}
              </span>

              <span>
                → {nextSkill}
              </span>

            </div>

          </div>

          <div className="roadmap-action-buttons">

            <a
              href="/mock-interview"
              className="roadmap-button primary"
            >
              Practice Mock Interview
              <span>→</span>
            </a>

            <a
              href="/resume-dashboard"
              className="roadmap-button secondary"
            >
              View Dashboard
            </a>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CareerRoadmap;
{/* PROJECT RECOMMENDATIONS BUTTON */}

<a
  href="/project-recommendations"
  className="roadmap-button primary"
  style={{
    display: "inline-flex",
    marginTop: "28px",
    padding: "16px 26px",
    fontSize: "16px",
    fontWeight: "700",
    minHeight: "54px",
    alignItems: "center",
    gap: "10px",
  }}
>
  Explore Recommended Projects
  <span style={{ fontSize: "20px" }}>→</span>
</a>
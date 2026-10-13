import { useEffect, useMemo, useState } from "react";
import "./ProjectRecommendations.css";
import AppHeader from "../components/AppHeader";

function ProjectRecommendations() {
  const [analysis, setAnalysis] = useState(null);
  const [careerTarget, setCareerTarget] = useState("");

  useEffect(() => {
    const savedAnalysis =
      sessionStorage.getItem("resumeAnalysis");

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

    if (savedCareerTarget) {
      setCareerTarget(savedCareerTarget);
    }
  }, []);

  const resumeSkills = Array.isArray(analysis?.skills)
    ? analysis.skills
    : [];

  const target =
    careerTarget || "Software Engineer";

  const projectData = useMemo(() => {
    const projects = {
      "AI Engineer": [
        {
          title: "AI Resume Intelligence Platform",
          description:
            "Build an AI-powered platform that analyzes resumes, identifies skill gaps and generates personalized career recommendations.",
          why:
            "You already have resume analysis experience. This project lets you extend that work into a stronger AI product.",
          stack: [
            "Python",
            "Machine Learning",
            "LLMs",
            "Flask",
            "React",
            "GitHub",
          ],
          skills: [
            "AI Applications",
            "APIs",
            "Prompt Engineering",
            "ML Pipelines",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "Smart College Admission Predictor",
          description:
            "Create an intelligent admission prediction system that estimates college possibilities using historical cutoff data.",
          why:
            "This connects naturally with your existing SeatSense project while giving you an opportunity to improve prediction and deployment.",
          stack: [
            "Python",
            "Pandas",
            "Scikit-learn",
            "Flask",
            "React",
            "SQL",
          ],
          skills: [
            "Machine Learning",
            "Data Processing",
            "APIs",
            "Deployment",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "AI Interview Coach",
          description:
            "Build an application that generates interview questions, evaluates answers and provides personalized preparation feedback.",
          why:
            "It demonstrates practical AI application development and directly connects to career preparation.",
          stack: [
            "Python",
            "NLP",
            "React",
            "Flask",
            "APIs",
          ],
          skills: [
            "NLP",
            "AI Systems",
            "Evaluation",
            "Web Development",
          ],
          difficulty: "Advanced",
        },
      ],

      "Machine Learning Engineer": [
        {
          title: "Smart Crop Yield Prediction Platform",
          description:
            "Build an end-to-end ML system that predicts crop yield using agricultural and environmental data.",
          why:
            "You already have exposure to crop prediction, Python and machine learning. This version can demonstrate a complete ML pipeline.",
          stack: [
            "Python",
            "Pandas",
            "Scikit-learn",
            "Flask",
            "Docker",
          ],
          skills: [
            "ML Pipelines",
            "Model Evaluation",
            "APIs",
            "Deployment",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "Student Performance Prediction System",
          description:
            "Predict student performance using academic, attendance and behavioral features.",
          why:
            "The project gives you practical experience with preprocessing, feature engineering and model evaluation.",
          stack: [
            "Python",
            "Pandas",
            "Scikit-learn",
            "Flask",
            "SQL",
          ],
          skills: [
            "Feature Engineering",
            "Classification",
            "Model Evaluation",
            "Deployment",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "Real-Time ML Prediction API",
          description:
            "Train a machine learning model and expose it through a production-style REST API.",
          why:
            "This focuses strongly on the engineering side of machine learning rather than only model training.",
          stack: [
            "Python",
            "Scikit-learn",
            "FastAPI",
            "Docker",
            "GitHub",
          ],
          skills: [
            "Model Serving",
            "REST APIs",
            "Docker",
            "ML Deployment",
          ],
          difficulty: "Advanced",
        },
      ],

      "Software Engineer": [
        {
          title: "College Management System",
          description:
            "Build a complete web application for managing students, courses, attendance and academic records.",
          why:
            "It demonstrates programming, database design, APIs and application architecture.",
          stack: [
            "Java",
            "React",
            "Node.js",
            "MySQL",
            "GitHub",
          ],
          skills: [
            "OOP",
            "DBMS",
            "REST APIs",
            "Software Architecture",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "Online Coding Practice Platform",
          description:
            "Create a platform where users can solve coding problems, track progress and view performance.",
          why:
            "This gives you opportunities to demonstrate DSA, backend development and database skills.",
          stack: [
            "Java",
            "React",
            "Node.js",
            "MongoDB",
          ],
          skills: [
            "DSA",
            "Backend Development",
            "DBMS",
            "Authentication",
          ],
          difficulty: "Advanced",
        },
        {
          title: "Library Management System",
          description:
            "Develop a full-stack library system with book management, users, lending records and search.",
          why:
            "A focused project for demonstrating CRUD operations, database relationships and clean application structure.",
          stack: [
            "Java",
            "MySQL",
            "React",
            "REST API",
          ],
          skills: [
            "OOP",
            "SQL",
            "APIs",
            "CRUD",
          ],
          difficulty: "Beginner",
        },
      ],

      "Data Scientist": [
        {
          title: "Customer Churn Prediction",
          description:
            "Analyze customer behavior and build a machine learning model that predicts customers likely to leave.",
          why:
            "This combines data cleaning, exploratory analysis, statistics and machine learning.",
          stack: [
            "Python",
            "Pandas",
            "Scikit-learn",
            "Matplotlib",
            "SQL",
          ],
          skills: [
            "EDA",
            "Statistics",
            "Classification",
            "Data Visualization",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "E-Commerce Sales Intelligence",
          description:
            "Analyze e-commerce transactions to discover sales patterns and build predictive insights.",
          why:
            "This demonstrates the complete process from raw data to business-oriented conclusions.",
          stack: [
            "Python",
            "Pandas",
            "SQL",
            "Power BI",
            "Scikit-learn",
          ],
          skills: [
            "SQL",
            "EDA",
            "Visualization",
            "Machine Learning",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "Student Performance Analytics",
          description:
            "Explore academic data to identify factors affecting student performance and predict outcomes.",
          why:
            "It provides a practical dataset for statistical analysis and predictive modeling.",
          stack: [
            "Python",
            "Pandas",
            "Statistics",
            "Scikit-learn",
          ],
          skills: [
            "Statistics",
            "Data Analysis",
            "ML",
            "Visualization",
          ],
          difficulty: "Beginner",
        },
      ],

      "Data Analyst": [
        {
          title: "E-Commerce Analytics Dashboard",
          description:
            "Create an interactive dashboard that tracks sales, customers, products and revenue trends.",
          why:
            "This directly demonstrates the core workflow of a data analyst: SQL, analysis and communication.",
          stack: [
            "SQL",
            "Excel",
            "Python",
            "Power BI",
          ],
          skills: [
            "SQL",
            "Data Cleaning",
            "Dashboards",
            "Business Insights",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "College Placement Analytics",
          description:
            "Analyze placement data to identify trends across departments, skills, companies and salary ranges.",
          why:
            "The project turns structured data into insights that can support real decisions.",
          stack: [
            "Python",
            "Pandas",
            "SQL",
            "Power BI",
          ],
          skills: [
            "SQL",
            "EDA",
            "Visualization",
            "Reporting",
          ],
          difficulty: "Beginner",
        },
        {
          title: "Retail Sales Analysis",
          description:
            "Analyze retail transactions to identify profitable products, customer patterns and seasonal trends.",
          why:
            "It gives you a strong portfolio example for business-focused analytics.",
          stack: [
            "Excel",
            "SQL",
            "Power BI",
            "Python",
          ],
          skills: [
            "Excel",
            "SQL",
            "Power BI",
            "Business Analysis",
          ],
          difficulty: "Beginner",
        },
      ],

      "Frontend Developer": [
        {
          title: "AI Career Dashboard",
          description:
            "Build a polished responsive dashboard that visualizes skills, career progress and personalized recommendations.",
          why:
            "You are already building an AI career platform, so this can become a strong frontend-focused portfolio project.",
          stack: [
            "React",
            "JavaScript",
            "CSS",
            "REST APIs",
            "GitHub",
          ],
          skills: [
            "React",
            "Responsive Design",
            "API Integration",
            "UI/UX",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "Student Productivity Platform",
          description:
            "Create a modern web application for managing study plans, tasks, deadlines and progress.",
          why:
            "It gives you room to demonstrate reusable React components, state management and responsive design.",
          stack: [
            "React",
            "JavaScript",
            "CSS",
            "Firebase",
          ],
          skills: [
            "React",
            "State Management",
            "Authentication",
            "UI Design",
          ],
          difficulty: "Intermediate",
        },
        {
          title: "College Event Discovery App",
          description:
            "Build a responsive platform where students can discover, search and register for college events.",
          why:
            "A practical frontend project with search, filters, forms and API integration.",
          stack: [
            "React",
            "JavaScript",
            "CSS",
            "REST APIs",
          ],
          skills: [
            "React",
            "JavaScript",
            "APIs",
            "Responsive UI",
          ],
          difficulty: "Beginner",
        },
      ],
    };

    return (
      projects[target] ||
      projects["Software Engineer"]
    );
  }, [target]);

  const matchingSkills = useMemo(() => {
    return resumeSkills.filter((resumeSkill) =>
      projectData.some((project) =>
        project.skills.some(
          (skill) =>
            String(resumeSkill)
              .toLowerCase()
              .includes(skill.toLowerCase()) ||
            skill
              .toLowerCase()
              .includes(
                String(resumeSkill).toLowerCase()
              )
        )
      )
    );
  }, [resumeSkills, projectData]);

  const handleBuildProject = (project) => {
    sessionStorage.setItem(
      "selectedProject",
      JSON.stringify(project)
    );

    sessionStorage.setItem(
      "selectedCareerTarget",
      target
    );

    window.location.href = "/project-details";
  };

  return (
    <div className="projects-page">
      <AppHeader active="projects" width={1124}>
<a className="ah-btn" href="/career-roadmap">← Back to Roadmap</a>
</AppHeader>

      <section className="projects-hero">
        <div className="projects-eyebrow">
          <span></span>
          AI PROJECT INTELLIGENCE
        </div>

        <h1>
          Build projects that
          <br />
          <strong>move your career forward.</strong>
        </h1>

        <p>
          These recommendations are aligned with your
          selected career target and the skills already
          visible in your resume.
        </p>

        <div className="projects-target">
          <span>YOUR TARGET</span>
          <strong>{target}</strong>
        </div>
      </section>

      <main className="projects-content">
        {matchingSkills.length > 0 && (
          <section className="projects-signal">
            <div className="signal-icon">✦</div>

            <div>
              <small>
                YOUR EXISTING SIGNALS
              </small>

              <p>
                Your resume already shows exposure to{" "}
                <strong>
                  {matchingSkills
                    .slice(0, 4)
                    .join(", ")}
                </strong>
                . The projects below are designed
                to help you turn that foundation into
                stronger portfolio evidence.
              </p>
            </div>
          </section>
        )}

        <section className="projects-section-heading">
          <small>
            RECOMMENDED FOR YOU
          </small>

          <h2>
            3 projects worth building.
          </h2>

          <p>
            Choose based on the skills you want to
            demonstrate, not simply the number of
            projects on your resume.
          </p>
        </section>

        <section className="projects-grid">
          {projectData.map((project, index) => (
            <article
              className="project-card"
              key={project.title}
            >
              <div className="project-card-top">
                <span className="project-number">
                  0{index + 1}
                </span>

                <span
                  className={`difficulty ${project.difficulty
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {project.difficulty}
                </span>
              </div>

              <h3>{project.title}</h3>

              <p className="project-description">
                {project.description}
              </p>

              <div className="project-why">
                <small>
                  WHY THIS PROJECT
                </small>

                <p>{project.why}</p>
              </div>

              <div className="project-detail">
                <small>BUILD WITH</small>

                <div className="project-tags">
                  {project.stack.map(
                    (tech) => (
                      <span key={tech}>
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="project-detail">
                <small>SKILLS YOU'LL GAIN</small>

                <div className="project-skills">
                  {project.skills.map(
                    (skill) => (
                      <span key={skill}>
                        <i>+</i>
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="project-card-footer">
                <div>
                  <span>
                    Portfolio value
                  </span>

                  <strong>
                    Real-world proof
                  </strong>
                </div>

                <button
                  type="button"
                  className="build-project-button"
                  onClick={() =>
                    handleBuildProject(project)
                  }
                >
                  Build This Project
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="build-plan">
          <div className="build-plan-heading">
            <small>
              HOW TO BUILD IT
            </small>

            <h2>
              Don't just finish the project.
              <br />
              Make it portfolio-ready.
            </h2>
          </div>

          <div className="build-steps">
            <div>
              <span>01</span>
              <h3>Define</h3>
              <p>
                Choose a real problem and clearly
                define what your application will solve.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Build</h3>
              <p>
                Develop the core functionality and
                apply the target skills in practice.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Measure</h3>
              <p>
                Add meaningful metrics, model results,
                performance numbers or user outcomes.
              </p>
            </div>

            <div>
              <span>04</span>
              <h3>Showcase</h3>
              <p>
                Publish the code on GitHub, write a
                clear README and deploy the application.
              </p>
            </div>
          </div>
        </section>

        <section className="projects-action">
          <div>
            <small>
              NEXT STEP
            </small>

            <h2>
              Build one strong project.
            </h2>

            <p>
              One well-documented project that proves
              your target skills can be more useful than
              several unfinished projects.
            </p>
          </div>

          <div className="projects-action-buttons">
            <a
              href="/mock-interview"
              className="projects-button primary"
            >
              Practice Interview
              <span>→</span>
            </a>

            <a
              href="/career-roadmap"
              className="projects-button secondary"
            >
              Back to Roadmap
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProjectRecommendations;
import { useEffect, useState } from "react";
import "./ProjectDetails.css";
import AppHeader from "../components/AppHeader";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [careerTarget, setCareerTarget] = useState("");

  useEffect(() => {
    const savedProject =
      sessionStorage.getItem("selectedProject");

    const savedTarget =
      sessionStorage.getItem("selectedCareerTarget");

    if (savedProject) {
      try {
        setProject(JSON.parse(savedProject));
      } catch (error) {
        console.error(
          "Could not load selected project:",
          error
        );
      }
    }

    if (savedTarget) {
      setCareerTarget(savedTarget);
    }
  }, []);

  if (!project) {
    return (
      <div className="project-details-page">
        <AppHeader active="projects" width={1124}>
<a className="ah-btn" href="/project-recommendations">← Back to Projects</a>
</AppHeader>

        <main className="project-details-empty">
          <div>
            <span>PROJECT NOT SELECTED</span>

            <h1>
              Choose a project first.
            </h1>

            <p>
              Go back to your project recommendations
              and select a project to see its complete
              build plan.
            </p>

            <a
              href="/project-recommendations"
              className="project-details-button primary"
            >
              View Recommended Projects
              <span>→</span>
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      <AppHeader active="projects" width={1124}>
<a className="ah-btn" href="/project-recommendations">← Back to Projects</a>
</AppHeader>

      <section className="project-details-hero">
        <div className="project-details-eyebrow">
          <span></span>
          PROJECT BUILD PLAN
        </div>

        <div className="project-details-target">
          <span>CAREER TARGET</span>
          <strong>
            {careerTarget || "Software Engineer"}
          </strong>
        </div>

        <h1>{project.title}</h1>

        <p>
          {project.description}
        </p>

        <div className="project-details-tags">
          {project.stack.map((tech) => (
            <span key={tech}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      <main className="project-details-content">

        <section className="project-overview-grid">
          <div className="project-overview-card">
            <small>DIFFICULTY</small>

            <strong>
              {project.difficulty}
            </strong>

            <p>
              A project designed to demonstrate
              practical skills for your selected
              career direction.
            </p>
          </div>

          <div className="project-overview-card">
            <small>PORTFOLIO VALUE</small>

            <strong>
              Real-world proof
            </strong>

            <p>
              Focus on building something that can
              be demonstrated, documented and deployed.
            </p>
          </div>

          <div className="project-overview-card">
            <small>CAREER CONNECTION</small>

            <strong>
              {careerTarget || "Software Engineer"}
            </strong>

            <p>
              The project is aligned with the technical
              capabilities expected in this direction.
            </p>
          </div>
        </section>

        <section className="project-details-section">
          <div className="project-details-heading">
            <small>
              01 · THE PROBLEM
            </small>

            <h2>
              What are you building?
            </h2>
          </div>

          <div className="project-problem-card">
            <div className="project-problem-icon">
              ✦
            </div>

            <div>
              <h3>
                Build a useful solution, not just a demo.
              </h3>

              <p>
                {project.description}
              </p>

              <p>
                Your goal is to create a working
                application that solves a clearly
                defined problem and demonstrates the
                skills required for your career target.
              </p>
            </div>
          </div>
        </section>

        <section className="project-details-section">
          <div className="project-details-heading">
            <small>
              02 · CORE FEATURES
            </small>

            <h2>
              What should you build?
            </h2>

            <p>
              Start with a focused MVP and then add
              advanced features once the core system
              works.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <span>01</span>

              <h3>
                User Interface
              </h3>

              <p>
                Create a clean interface where users
                can interact with the main functionality
                of the application.
              </p>
            </div>

            <div className="feature-card">
              <span>02</span>

              <h3>
                Core Functionality
              </h3>

              <p>
                Implement the main feature that makes
                your project useful and different from
                a basic CRUD application.
              </p>
            </div>

            <div className="feature-card">
              <span>03</span>

              <h3>
                Data & Processing
              </h3>

              <p>
                Handle data properly through validation,
                processing, storage or model pipelines
                depending on the project.
              </p>
            </div>

            <div className="feature-card">
              <span>04</span>

              <h3>
                Results
              </h3>

              <p>
                Show meaningful outputs such as
                predictions, analytics, recommendations,
                performance or user progress.
              </p>
            </div>
          </div>
        </section>

        <section className="project-details-section">
          <div className="project-details-heading">
            <small>
              03 · SKILLS TO DEMONSTRATE
            </small>

            <h2>
              What will this project prove?
            </h2>
          </div>

          <div className="project-skill-grid">
            {project.skills.map(
              (skill, index) => (
                <div
                  className="project-skill-card"
                  key={skill}
                >
                  <span>
                    0{index + 1}
                  </span>

                  <strong>
                    {skill}
                  </strong>

                  <p>
                    Demonstrate this capability
                    through an actual feature or
                    implementation in your project.
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <section className="project-details-section">
          <div className="project-details-heading">
            <small>
              04 · IMPLEMENTATION ROADMAP
            </small>

            <h2>
              Build it step by step.
            </h2>
          </div>

          <div className="implementation-timeline">

            <div className="implementation-step">
              <div className="implementation-number">
                01
              </div>

              <div>
                <small>
                  PHASE 1
                </small>

                <h3>
                  Define the problem
                </h3>

                <p>
                  Identify the exact user problem,
                  define your target users and write
                  down the expected outcome.
                </p>
              </div>
            </div>

            <div className="implementation-step">
              <div className="implementation-number">
                02
              </div>

              <div>
                <small>
                  PHASE 2
                </small>

                <h3>
                  Design the system
                </h3>

                <p>
                  Plan your frontend, backend, database,
                  APIs and any machine learning pipeline
                  before starting implementation.
                </p>
              </div>
            </div>

            <div className="implementation-step">
              <div className="implementation-number">
                03
              </div>

              <div>
                <small>
                  PHASE 3
                </small>

                <h3>
                  Build the MVP
                </h3>

                <p>
                  Implement the smallest working version
                  of your application. Make the core
                  functionality work before adding extras.
                </p>
              </div>
            </div>

            <div className="implementation-step">
              <div className="implementation-number">
                04
              </div>

              <div>
                <small>
                  PHASE 4
                </small>

                <h3>
                  Add intelligence
                </h3>

                <p>
                  Add machine learning, analytics,
                  recommendations, automation or other
                  advanced functionality relevant to
                  your project.
                </p>
              </div>
            </div>

            <div className="implementation-step">
              <div className="implementation-number">
                05
              </div>

              <div>
                <small>
                  PHASE 5
                </small>

                <h3>
                  Test and improve
                </h3>

                <p>
                  Test different inputs, handle errors,
                  improve performance and make the
                  interface responsive and reliable.
                </p>
              </div>
            </div>

            <div className="implementation-step">
              <div className="implementation-number">
                06
              </div>

              <div>
                <small>
                  PHASE 6
                </small>

                <h3>
                  Deploy and showcase
                </h3>

                <p>
                  Deploy the application, publish the
                  source code on GitHub and create a
                  README explaining the problem,
                  solution, technology and results.
                </p>
              </div>
            </div>

          </div>
        </section>

        <section className="project-showcase">
          <div>
            <small>
              RESUME SIGNAL
            </small>

            <h2>
              Turn this project into a strong resume story.
            </h2>

            <p>
              Don't only write the project title.
              Explain the problem you solved, the
              technology you used and the measurable
              result you achieved.
            </p>
          </div>

          <div className="resume-story-card">
            <span>
              PROJECT DESCRIPTION TEMPLATE
            </span>

            <p>
              <strong>
                {project.title}
              </strong>{" "}
              — Developed a practical application
              using{" "}
              <strong>
                {project.stack
                  .slice(0, 3)
                  .join(", ")}
              </strong>{" "}
              to solve a real-world problem, implementing
              key functionality around{" "}
              <strong>
                {project.skills
                  .slice(0, 2)
                  .join(" and ")}
              </strong>
              . Deployed and documented the project
              with measurable results.
            </p>
          </div>
        </section>

        <section className="project-details-action">
          <div>
            <small>
              READY TO BUILD?
            </small>

            <h2>
              Make this project part of your portfolio.
            </h2>

            <p>
              Build it, document it, deploy it and use
              it as evidence of your ability.
            </p>
          </div>

          <div className="project-details-buttons">
            <a
              href="/mock-interview"
              className="project-details-button primary"
            >
              Practice Interview
              <span>→</span>
            </a>

            <a
              href="/project-recommendations"
              className="project-details-button secondary"
            >
              Choose Another Project
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
export default ProjectDetails;
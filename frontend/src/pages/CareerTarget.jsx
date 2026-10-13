import { useState } from "react";
import "./CareerTarget.css";
import AppHeader from "../components/AppHeader";

function CareerTarget() {
  const [selectedCareer, setSelectedCareer] = useState("");

  const careerOptions = [
    {
      id: "AI Engineer",
      icon: "✦",
      title: "AI Engineer",
      description:
        "Build intelligent applications, AI systems and practical solutions using modern AI technologies.",
      tags: ["AI", "Python", "LLMs"],
    },
    {
      id: "Machine Learning Engineer",
      icon: "◈",
      title: "Machine Learning Engineer",
      description:
        "Build, train and deploy machine learning models that solve real-world problems.",
      tags: ["ML", "Python", "Deployment"],
    },
    {
      id: "Software Engineer",
      icon: "⌘",
      title: "Software Engineer",
      description:
        "Design and build reliable software applications, systems and backend services.",
      tags: ["DSA", "Java", "Systems"],
    },
    {
      id: "Data Scientist",
      icon: "◫",
      title: "Data Scientist",
      description:
        "Turn data into useful insights through statistics, machine learning and analytical thinking.",
      tags: ["Python", "SQL", "Analytics"],
    },
    {
      id: "Data Analyst",
      icon: "◒",
      title: "Data Analyst",
      description:
        "Analyze business data, discover patterns and communicate insights through dashboards and reports.",
      tags: ["SQL", "Excel", "BI"],
    },
    {
      id: "Frontend Developer",
      icon: "◇",
      title: "Frontend Developer",
      description:
        "Create polished, responsive and interactive web experiences for modern applications.",
      tags: ["React", "JavaScript", "UI"],
    },
  ];

  const handleContinue = () => {
    if (!selectedCareer) {
      return;
    }

    sessionStorage.setItem(
      "careerTarget",
      selectedCareer
    );

    window.location.href = "/career-roadmap";
  };

  const handleBack = () => {
    window.location.href = "/resume-analyzer";
  };

  return (
    <div className="career-target-page">

      {/* BACKGROUND */}
      <div className="career-target-grid" />
      <div className="career-target-glow glow-blue" />
      <div className="career-target-glow glow-mint" />

      {/* HEADER */}
      <AppHeader active="analyzer">
<button type="button" className="ah-btn" onClick={handleBack}>← Back to Analysis</button>
</AppHeader>


      {/* MAIN */}
      <main className="career-target-main">

        <section className="career-target-hero">

          <div className="career-target-eyebrow">
            <span />
            STEP 02 / CAREER DIRECTION
          </div>

          <h1>
            Where do you want
            <br />
            <span>your career to go?</span>
          </h1>

          <p>
            Choose a target career and AI Coach will use it to
            personalize your skill gaps, projects, roadmap and
            interview preparation.
          </p>

        </section>


        {/* CAREER OPTIONS */}
        <section className="career-options-section">

          <div className="career-options-heading">

            <div>
              <span>
                SELECT ONE TARGET
              </span>

              <h2>
                Choose your direction.
              </h2>
            </div>

            <p>
              You can change your target later.
            </p>

          </div>


          <div className="career-options-grid">

            {careerOptions.map((career) => {

              const isSelected =
                selectedCareer === career.id;

              return (
                <button
                  type="button"
                  key={career.id}
                  className={`career-option ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCareer(
                      career.id
                    )
                  }
                >

                  <div className="career-option-top">

                    <div className="career-option-icon">
                      {career.icon}
                    </div>

                    <div
                      className={`career-option-check ${
                        isSelected
                          ? "visible"
                          : ""
                      }`}
                    >
                      ✓
                    </div>

                  </div>

                  <div className="career-option-content">

                    <h3>
                      {career.title}
                    </h3>

                    <p>
                      {career.description}
                    </p>

                  </div>

                  <div className="career-option-tags">

                    {career.tags.map(
                      (tag) => (
                        <span
                          key={tag}
                        >
                          {tag}
                        </span>
                      )
                    )}

                  </div>

                  <div className="career-option-arrow">
                    →
                  </div>

                </button>
              );
            })}

          </div>

        </section>


        {/* CONTINUE */}
        <section className="career-target-action">

          <div className="career-target-selected">

            <div className="selected-indicator">
              <span />
            </div>

            <div>

              <small>
                YOUR TARGET
              </small>

              <strong>
                {selectedCareer ||
                  "Choose a career direction"}
              </strong>

            </div>

          </div>


          <button
            type="button"
            className="career-target-continue"
            disabled={!selectedCareer}
            onClick={handleContinue}
          >
            Continue to My Roadmap
            <span>→</span>
          </button>

        </section>


        {/* INFORMATION */}
        <section className="career-target-info">

          <div className="info-icon">
            ✦
          </div>

          <div>

            <small>
              WHY THIS MATTERS
            </small>

            <p>
              Your target career gives AI Coach a destination.
              Instead of giving you generic advice, your roadmap
              can now focus on the skills, projects and preparation
              that are relevant to the direction you selected.
            </p>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="career-target-footer">

        <span>
          AI COACH
        </span>

        <span>
          CAREER INTELLIGENCE SYSTEM
        </span>

        <span>
          TARGET SELECTION
        </span>

      </footer>

    </div>
  );
}

export default CareerTarget;
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { connectDB } = require("./config/db");
const { createUser, findUserByEmail, findUserById } = require("./models/User");
const authMiddleware = require("./middleware/auth");
const { PDFParse } = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;
const frontendOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) =>
    origin.startsWith("http://") || origin.startsWith("https://")
      ? origin
      : `https://${origin}`
  );
const allowedOrigins = new Set([
  "http://localhost:5173",
  ...frontendOrigins,
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Coach backend is running!",
  });
});

// --------------------------------------------------
// AUTH ROUTES
// --------------------------------------------------

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating the account.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const user = await findUserByEmail(email.trim().toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
});

app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Current user lookup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving the account.",
    });
  }
});

// --------------------------------------------------
// RESUME ANALYSIS ENGINE
// --------------------------------------------------

function analyzeResume(resumeText) {
  const text = resumeText.toLowerCase();

  // ---------- SECTION DETECTION ----------

  const sections = {
    contact:
      /email|phone|mobile|linkedin|github|contact/.test(text),

    summary:
      /summary|profile|objective|about me/.test(text),

    education:
      /education|college|university|bachelor|b\.?tech|degree|cgpa|gpa/.test(
        text
      ),

    skills:
      /skills|technical skills|programming languages|technologies/.test(text),

    projects:
      /projects|project/.test(text),

    experience:
      /experience|internship|intern|work experience/.test(text),

    certifications:
      /certification|certifications|certificate/.test(text),

    achievements:
      /achievement|achievements|award|awards/.test(text),

    languages:
      /languages|english|kannada|hindi|tamil|telugu/.test(text),
  };

  // ---------- SKILL DETECTION ----------

  const skillList = [
    "python",
    "java",
    "c",
    "c++",
    "javascript",
    "typescript",
    "html",
    "css",
    "react",
    "node.js",
    "node",
    "express",
    "sql",
    "mysql",
    "mongodb",
    "git",
    "github",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "data structures",
    "algorithms",
    "figma",
    "power bi",
    "excel",
    "aws",
    "azure",
    "docker",
  ];

  const detectedSkills = [];

  skillList.forEach((skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");

    if (regex.test(resumeText)) {
      detectedSkills.push(skill);
    }
  });

  // ---------- PROJECT ANALYSIS ----------

  const projectKeywords = [
    "project",
    "developed",
    "develop",
    "built",
    "created",
    "designed",
    "implemented",
    "prediction",
    "system",
    "application",
    "website",
    "model",
  ];

  let projectKeywordCount = 0;

  projectKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const matches = resumeText.match(regex);

    if (matches) {
      projectKeywordCount += matches.length;
    }
  });

  // ---------- RESUME LENGTH ----------

  const words = resumeText
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  // ---------- SCORE ----------

  let score = 0;

  if (sections.contact) score += 10;

  if (sections.summary) score += 8;

  if (sections.education) score += 12;

  if (sections.skills) score += 12;

  if (sections.projects) score += 15;

  if (sections.experience) score += 12;

  if (sections.certifications) score += 6;

  if (sections.achievements) score += 5;

  if (sections.languages) score += 5;

  // ---------- TECHNICAL SKILL DIVERSITY ----------

  if (detectedSkills.length >= 5) {
    score += 8;
  } else if (detectedSkills.length >= 3) {
    score += 5;
  } else if (detectedSkills.length >= 1) {
    score += 3;
  }

  // ---------- PROJECT DEPTH ----------

  if (projectKeywordCount >= 8) {
    score += 7;
  } else if (projectKeywordCount >= 4) {
    score += 4;
  }

  score = Math.min(score, 100);

  // ---------- STRENGTHS ----------

  const strengths = [];

  if (sections.education) {
    strengths.push("Education information is clearly included.");
  }

  if (sections.skills && detectedSkills.length > 0) {
    strengths.push(
      `Good technical foundation with ${detectedSkills.length} detected skills.`
    );
  }

  if (sections.projects) {
    strengths.push(
      "Projects are included, which helps demonstrate practical experience."
    );
  }

  if (sections.contact) {
    strengths.push("Contact information is present.");
  }

  if (sections.experience) {
    strengths.push("Experience or internship information is included.");
  }

  if (detectedSkills.includes("python")) {
    strengths.push(
      "Python is a useful technical skill for software and AI-related roles."
    );
  }

  if (
    detectedSkills.includes("machine learning") ||
    detectedSkills.includes("scikit-learn")
  ) {
    strengths.push(
      "Machine-learning related skills strengthen the technical profile."
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "The resume contains information that can be developed into a stronger professional profile."
    );
  }

  // ---------- IMPROVEMENT AREAS ----------

  const improvementAreas = [];

  if (!sections.summary) {
    improvementAreas.push(
      "Add a short professional summary targeted toward the role you want."
    );
  }

  if (!sections.projects) {
    improvementAreas.push(
      "Add relevant academic or personal projects to demonstrate practical ability."
    );
  }

  if (!sections.experience) {
    improvementAreas.push(
      "Consider adding internships, volunteering, freelance work, or relevant practical experience."
    );
  }

  if (!sections.certifications) {
    improvementAreas.push(
      "Add relevant certifications or completed technical courses when applicable."
    );
  }

  if (!sections.achievements) {
    improvementAreas.push(
      "Add measurable achievements, awards, competitions, or leadership activities if available."
    );
  }

  if (detectedSkills.length < 5) {
    improvementAreas.push(
      "Expand the technical skills section with relevant tools and technologies you genuinely know."
    );
  }

  if (wordCount < 250) {
    improvementAreas.push(
      "The resume is quite short; add relevant evidence of projects, skills, achievements, or experience."
    );
  }

  if (wordCount > 900) {
    improvementAreas.push(
      "The resume may be too long for an early-career profile; remove less relevant information."
    );
  }

  if (improvementAreas.length === 0) {
    improvementAreas.push(
      "Continue tailoring the resume to each job description and add measurable results wherever possible."
    );
  }

  // ---------- RECOMMENDED SKILLS ----------

  const recommendedSkills = [];

  const possibleSkills = [
    ["sql", "SQL"],
    ["git", "Git/GitHub"],
    ["javascript", "JavaScript"],
    ["react", "React"],
    ["node.js", "Node.js"],
    ["machine learning", "Machine Learning"],
    ["data structures", "Data Structures & Algorithms"],
    ["docker", "Docker"],
    ["aws", "AWS"],
    ["tensorflow", "TensorFlow"],
    ["pytorch", "PyTorch"],
    ["rest", "REST APIs"],
  ];

  possibleSkills.forEach(([key, label]) => {
    if (!text.includes(key) && recommendedSkills.length < 6) {
      recommendedSkills.push(label);
    }
  });

  // ---------- CAREER READINESS ----------

  let careerReadiness;

  if (score >= 80) {
    careerReadiness =
      "Strong early-career profile. Focus on tailoring the resume and preparing for technical interviews.";
  } else if (score >= 65) {
    careerReadiness =
      "Good foundation with room for improvement. Strengthening projects, skills, and measurable achievements can improve job readiness.";
  } else if (score >= 50) {
    careerReadiness =
      "Developing profile. More practical projects, technical skills, and career-focused resume content would help.";
  } else {
    careerReadiness =
      "Early-stage profile. Focus on building projects, strengthening technical skills, and improving resume structure.";
  }

  // ---------- ATS FEEDBACK ----------

  const atsPoints = [];

  if (sections.skills) {
    atsPoints.push(
      "A dedicated skills section helps ATS systems identify technical keywords."
    );
  } else {
    atsPoints.push("Add a clearly labelled Skills section.");
  }

  if (sections.education) {
    atsPoints.push("Education information is detectable.");
  }

  if (sections.projects) {
    atsPoints.push("Projects provide additional keyword opportunities.");
  }

  if (!sections.experience) {
    atsPoints.push(
      "If applicable, add internship or experience information using standard section headings."
    );
  }

  atsPoints.push(
    "Tailor keywords to each job description instead of using the same resume for every application."
  );

  const atsFeedback = atsPoints.join(" ");

  // ---------- PROJECT FEEDBACK ----------

  const projectFeedback = [];

  if (sections.projects) {
    projectFeedback.push(
      "Projects are a valuable part of the profile. Make each project stronger by clearly stating the problem, technologies used, your contribution, and the result."
    );

    if (projectKeywordCount >= 5) {
      projectFeedback.push(
        "The resume contains several action-oriented project terms. Add measurable outcomes where possible."
      );
    }
  } else {
    projectFeedback.push(
      "No clear project section was detected. Add 2–3 relevant projects with technologies and outcomes."
    );
  }

  // ---------- NEXT STEPS ----------

  const nextSteps = [
    "Tailor the resume keywords to the job description you are applying for.",
    "Use measurable results wherever possible, such as accuracy, performance improvement, users, or time saved.",
    "Keep project descriptions focused on your contribution and technical implementation.",
    "Prepare interview explanations for every technology and project listed on the resume.",
  ];

  return {
    resumeScore: score,
    summary: `The resume contains approximately ${wordCount} words and ${detectedSkills.length} detectable technical skills. The profile shows a ${
      score >= 65 ? "good" : "developing"
    } foundation for early-career opportunities.`,
    strengths,
    improvementAreas,
    skills: detectedSkills,
    recommendedSkills,
    careerReadiness,
    atsFeedback,
    projectFeedback,
    nextSteps,
  };
}

// --------------------------------------------------
// ANALYZE RESUME API
// --------------------------------------------------

app.post(
  "/api/analyze-resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    let parser;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No resume uploaded.",
        });
      }

      console.log(`Resume received: ${req.file.originalname}`);

      // Extract PDF text
      parser = new PDFParse({
        data: req.file.buffer,
      });

      const result = await parser.getText();

      const resumeText = result.text?.trim() || "";

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          error: "Could not extract text from this PDF.",
        });
      }

      console.log("Resume text extracted successfully.");

      // Analyze resume
      console.log("Running resume analysis engine...");

      const analysis = analyzeResume(resumeText);

      console.log("Resume analysis completed.");

      res.json({
        success: true,
        fileName: req.file.originalname,
        text: resumeText,
        analysis,
      });
    } catch (error) {
      console.error("Resume processing error:", error);

      res.status(500).json({
        success: false,
        error: error.message || "Failed to process the resume.",
      });
    } finally {
      if (parser) {
        await parser.destroy();
      }
    }
  }
);

// --------------------------------------------------
// START SERVER AFTER DATABASE CONNECTION
// --------------------------------------------------

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`AI Coach backend running at http://localhost:${PORT}`);
  });
}

startServer();
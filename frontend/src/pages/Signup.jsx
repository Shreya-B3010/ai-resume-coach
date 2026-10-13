import { useState } from "react";
import "./Signup.css";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not create your account.");
      }

      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userName", data.user.name);
      sessionStorage.setItem("userEmail", data.user.email);
      window.location.href = "/resume-analyzer";
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-background-shape signup-shape-one"></div>
      <div className="signup-background-shape signup-shape-two"></div>

      <div className="signup-container">
        <div className="signup-brand">
          <a href="/" className="signup-logo">
            <span className="signup-logo-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>AI<span>Coach</span></span>
          </a>

          <p>
            Turn your skills into your next opportunity.
          </p>
        </div>

        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-icon">+</div>

            <h1>Create your account</h1>

            <p>
              Start your personalized AI-powered career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="signup-email">Email address</label>

              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="signup-password">Password</label>

              <div className="signup-password-wrapper">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="signup-form-group">
              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="signup-password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="signup-error">
                {error}
              </div>
            )}

            <button type="submit" className="signup-submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
              <span>→</span>
            </button>
          </form>

          <div className="signup-benefits">
            <div>
              <span>✓</span>
              Personalized career roadmap
            </div>

            <div>
              <span>✓</span>
              AI resume intelligence
            </div>

            <div>
              <span>✓</span>
              Skill-gap and project guidance
            </div>
          </div>

          <p className="signup-switch">
            Already have an account?
            <a href="/login">Sign in</a>
          </p>
        </div>

        <p className="signup-footer">
          Your career data stays connected to your personal journey.
        </p>
      </div>
    </div>
  );
}

export default Signup;

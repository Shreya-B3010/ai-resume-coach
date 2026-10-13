import { useState } from "react";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not sign in.");
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
    <div className="auth-page">
      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-container">
        <div className="auth-brand">
          <a href="/" className="auth-logo">
            <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>AI<span>Coach</span></span>
          </a>

          <p className="auth-brand-text">
            Your intelligent career companion.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">↗</div>

            <h1>Welcome back</h1>

            <p>
              Continue building your career with AI-powered guidance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError("Password reset will be available soon.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
              <span>→</span>
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?
            <a href="/signup">Create an account</a>
          </p>
        </div>

        <p className="auth-footer">
          AI-powered career intelligence for students and professionals.
        </p>
      </div>
    </div>
  );
}

export default Login;

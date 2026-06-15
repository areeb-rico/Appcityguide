import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e.target.email.value, password: e.target.password.value }),
    })
      .then((r) => r.json())
      .then((data) => {
        setLoading(false);
        if (data.Error) { setError(data.Error); return; }
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name || "User");
        localStorage.setItem("userRole", data.Role);
        if (data.Role === "admin") navigate("/admindash");
        else navigate("/");
      })
      .catch(() => { setLoading(false); setError("Server not reachable. Make sure backend is running."); });
  };

  return (
    <div className="login-container min-vh-100 d-flex">
      {/* Left Panel — Branding */}
      <div className="login-left-panel d-none d-lg-flex flex-column justify-content-between p-5">
        <div className="login-blob-1" />
        <div className="login-blob-2" />

        <div className="login-content">
          <Link to="/" className="text-decoration-none">
            <span className="fw-bold fs-3 login-logo-primary">APP-</span>
            <span className="fw-bold fs-3 text-white">CITIGUIDE</span>
          </Link>
        </div>

        <div className="login-content">
          <h2 className="text-white fw-bold mb-3 login-title">
            Your guide to Pakistan's best cities
          </h2>
          <p className="login-description">
            Discover top attractions, restaurants, hotels, and hidden gems across Karachi, Lahore, Islamabad and more.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            {["🌊 Karachi", "🕌 Lahore", "🌿 Islamabad", "🏺 Peshawar"].map((c) => (
              <span key={c} className="px-3 py-1 rounded-pill small login-city-chip">{c}</span>
            ))}
          </div>
        </div>

        <p className="login-footer">
          © {new Date().getFullYear()} APP-CityGuide
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div className="login-form-container">

          {/* Mobile logo */}
          <div className="d-lg-none text-center mb-5">
            <Link to="/" className="text-decoration-none">
              <span className="fw-bold fs-4 login-logo-primary">APP-</span>
              <span className="fw-bold fs-4 text-white">CITIGUIDE</span>
            </Link>
          </div>

          <h3 className="fw-bold text-white mb-1">Welcome back</h3>
          <p className="mb-4 login-subtitle">Sign in to continue exploring</p>

          {error && (
            <div className="d-flex align-items-center gap-2 p-3 mb-4 rounded-3 login-error">
              <span>⚠️</span>
              <span className="text-danger small">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-medium login-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control py-2 login-input"
                placeholder="you@email.com"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label small fw-medium login-label">Password</label>
              <div className="position-relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="form-control py-2 login-input"
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="btn position-absolute end-0 top-50 translate-middle-y border-0 p-2 login-password-toggle"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="text-end mb-4">
              <Link to="/forgot-password" className="small text-decoration-none login-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn w-100 fw-semibold py-2 mb-4 login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" /> Signing in...
                </span>
              ) : "Sign In"}
            </button>

            <p className="text-center mb-0 login-signup-link">
              Don't have an account?{" "}
              <Link to="/register" className="fw-semibold text-decoration-none login-forgot-link">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

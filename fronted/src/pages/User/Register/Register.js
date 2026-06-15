import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);

  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const data = {
      firstname: e.target.firstname.value,
      lastname: e.target.lastname.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    setLoading(true);
    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((result) => {
        setLoading(false);
        if (result.failed) { setError(result.failed); return; }
        navigate("/Login");
      })
      .catch(() => { setLoading(false); setError("Server error. Make sure backend is running."); });
  };

  const strengthColors = ["#dee2e6", "#dc3545", "#fd7e14", "#ffc107", "#20c997", "#198754"];
  const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-vh-100 d-flex" style={{ background: "#0a0a1a" }}>

      {/* Left Panel — Branding */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: "42%",
          background: "linear-gradient(145deg, #0d1b3e 0%, #1a0533 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -100, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,201,240,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(67,97,238,0.2) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" className="text-decoration-none">
            <span className="fw-bold fs-3" style={{ color: "#4cc9f0" }}>APP-</span>
            <span className="fw-bold fs-3 text-white">CITIGUIDE</span>
          </Link>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="text-white fw-bold mb-4" style={{ fontSize: "1.9rem", lineHeight: 1.35 }}>
            Join thousands of travellers exploring Pakistan
          </h2>
          <div className="d-flex flex-column gap-3">
            {[
              { icon: "📍", text: "Discover attractions in 6+ cities" },
              { icon: "⭐", text: "Read and write genuine reviews" },
              { icon: "🗺️", text: "Get real-time directions and maps" },
              { icon: "❤️", text: "Save your favourite places" },
            ].map((f) => (
              <div key={f.text} className="d-flex align-items-center gap-3">
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, position: "relative", zIndex: 1 }}>
          © {new Date().getFullYear()} APP-CityGuide
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="d-lg-none text-center mb-4">
            <Link to="/" className="text-decoration-none">
              <span className="fw-bold fs-4" style={{ color: "#4cc9f0" }}>APP-</span>
              <span className="fw-bold fs-4 text-white">CITIGUIDE</span>
            </Link>
          </div>

          <h3 className="fw-bold text-white mb-1">Create your account</h3>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Start exploring Pakistan's best cities today</p>

          {error && (
            <div className="d-flex align-items-center gap-2 p-3 mb-4 rounded-3" style={{ background: "rgba(220,53,69,0.15)", border: "1px solid rgba(220,53,69,0.3)" }}>
              <span>⚠️</span>
              <span className="text-danger small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-medium" style={{ color: "rgba(255,255,255,0.7)" }}>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control py-2"
                  placeholder="Ahmed"
                  required
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 10 }}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control py-2"
                  placeholder="Khan"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 10 }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control py-2"
                placeholder="you@email.com"
                required
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 10 }}
              />
            </div>

            <div className="mb-1">
              <label className="form-label small fw-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Password</label>
              <div className="position-relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="form-control py-2"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  onChange={(e) => checkStrength(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 10, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="btn position-absolute end-0 top-50 translate-middle-y border-0 p-2"
                  style={{ background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 15 }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {strength > 0 && (
              <div className="mb-3 mt-2">
                <div className="d-flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} style={{ flex: 1, height: 3, borderRadius: 4, background: s <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                  ))}
                </div>
                <small style={{ color: strengthColors[strength], fontSize: 11 }}>{strengthLabels[strength]}</small>
              </div>
            )}

            <div className="mb-4 mt-3">
              <label className="d-flex align-items-start gap-2 small" style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                <input type="checkbox" required className="mt-1 flex-shrink-0" />
                <span>I agree to the <span style={{ color: "#4cc9f0" }}>Terms of Service</span> and <span style={{ color: "#4cc9f0" }}>Privacy Policy</span></span>
              </label>
            </div>

            <button
              type="submit"
              className="btn w-100 fw-semibold py-2 mb-4"
              disabled={loading}
              style={{ background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff", borderRadius: 10, border: "none", fontSize: 15 }}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" /> Creating account...
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-center mb-0" style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
              Already have an account?{" "}
              <Link to="/Login" className="fw-semibold text-decoration-none" style={{ color: "#4cc9f0" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

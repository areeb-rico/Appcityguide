import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    fetch("http://localhost:4000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((d) => {
        setLoading(false);
        if (d.error) { setError(d.error); return; }
        setStep(2);
        setResendTimer(60);
      })
      .catch(() => { setLoading(false); setError("Server error. Make sure backend is running."); });
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  function handleOtpChange(val, idx) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(e, idx) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    fetch("http://localhost:4000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    })
      .then((r) => r.json())
      .then((d) => {
        setLoading(false);
        if (d.error) { setError(d.error); return; }
        setStep(3);
      })
      .catch(() => { setLoading(false); setError("Server error."); });
  }

  function handleResend() {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendTimer(60);
    fetch("http://localhost:4000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  }

  // ── Step 3: Reset Password ───────────────────────────────────────────────
  function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    fetch("http://localhost:4000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otp.join(""), newPassword }),
    })
      .then((r) => r.json())
      .then((d) => {
        setLoading(false);
        if (d.error) { setError(d.error); return; }
        setStep(4);
        setTimeout(() => navigate("/Login"), 2500);
      })
      .catch(() => { setLoading(false); setError("Server error."); });
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #1a0533 100%)" }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none">
            <span className="fw-bold fs-4" style={{ color: "#4cc9f0" }}>APP-</span>
            <span className="fw-bold fs-4 text-white">CITIGUIDE</span>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                style={{
                  width: 32, height: 32, fontSize: 13,
                  background: step > s ? "#4cc9f0" : step === s ? "linear-gradient(135deg,#4361ee,#7b2ff7)" : "rgba(255,255,255,0.1)",
                  color: step >= s ? "#fff" : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div style={{ width: 40, height: 2, background: step > s ? "#4cc9f0" : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        <div
          className="p-4"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, backdropFilter: "blur(10px)" }}
        >
          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <>
              <div className="text-center mb-4">
                <div style={{ fontSize: 44 }}>📧</div>
                <h5 className="text-white fw-bold mt-2 mb-1">Forgot Password?</h5>
                <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>Enter your email and we'll send you a 6-digit OTP</p>
              </div>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <form onSubmit={handleSendOtp}>
                <div className="mb-4">
                  <label className="form-label small fw-medium text-white opacity-75">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10 }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-semibold py-2"
                  disabled={loading}
                  style={{ background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff", borderRadius: 10, border: "none" }}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <>
              <div className="text-center mb-4">
                <div style={{ fontSize: 44 }}>🔐</div>
                <h5 className="text-white fw-bold mt-2 mb-1">Enter OTP</h5>
                <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
                  We sent a 6-digit code to <span className="text-white fw-medium">{email}</span>
                </p>
              </div>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <form onSubmit={handleVerifyOtp}>
                <div className="d-flex justify-content-center gap-2 mb-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className="text-center fw-bold"
                      style={{
                        width: 48, height: 54, fontSize: 22, borderRadius: 10,
                        background: digit ? "rgba(67,97,238,0.3)" : "rgba(255,255,255,0.08)",
                        border: digit ? "2px solid #4361ee" : "1px solid rgba(255,255,255,0.2)",
                        color: "#fff", outline: "none", transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-semibold py-2 mb-3"
                  disabled={loading}
                  style={{ background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff", borderRadius: 10, border: "none" }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="text-center small" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {resendTimer > 0 ? (
                    <span>Resend OTP in <span className="text-white fw-medium">{resendTimer}s</span></span>
                  ) : (
                    <span>Didn't receive it?{" "}
                      <button type="button" onClick={handleResend} className="btn btn-link p-0 text-primary small fw-medium text-decoration-none">
                        Resend OTP
                      </button>
                    </span>
                  )}
                </div>
              </form>
              <button className="btn btn-link p-0 mt-2 small text-decoration-none w-100 text-center" style={{ color: "rgba(255,255,255,0.4)" }} onClick={() => { setStep(1); setError(""); }}>
                ← Change Email
              </button>
            </>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <>
              <div className="text-center mb-4">
                <div style={{ fontSize: 44 }}>🔑</div>
                <h5 className="text-white fw-bold mt-2 mb-1">New Password</h5>
                <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>Choose a strong new password</p>
              </div>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label small fw-medium text-white opacity-75">New Password</label>
                  <div className="position-relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="btn position-absolute end-0 top-50 translate-middle-y border-0 p-2"
                      style={{ background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 16 }}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-medium text-white opacity-75">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10 }}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <small className="text-danger mt-1 d-block">Passwords do not match</small>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-semibold py-2"
                  disabled={loading}
                  style={{ background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff", borderRadius: 10, border: "none" }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div className="text-center py-3">
              <div style={{ fontSize: 60 }}>✅</div>
              <h5 className="text-white fw-bold mt-3 mb-2">Password Reset!</h5>
              <p className="small mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                Your password has been updated successfully. Redirecting to login...
              </p>
              <div className="spinner-border spinner-border-sm text-primary" />
            </div>
          )}
        </div>

        <p className="text-center mt-4 small" style={{ color: "rgba(255,255,255,0.4)" }}>
          Remember your password?{" "}
          <Link to="/Login" className="text-primary fw-medium text-decoration-none">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

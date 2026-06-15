import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "User");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 2px 20px rgba(0,0,0,0.08)", zIndex: 1000 }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" style={{ color: "#007bff", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#343a40" }}>APP-</span>CITIGUIDE
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/Splash" onClick={() => setMenuOpen(false)}>Cities</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/listing" onClick={() => setMenuOpen(false)}>Attractions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/searchres" onClick={() => setMenuOpen(false)}>Search</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/maps" onClick={() => setMenuOpen(false)}>Map</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link fw-medium px-3" to="/reviews" onClick={() => setMenuOpen(false)}>Reviews</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profilepref"
                  className="d-flex align-items-center gap-2 text-decoration-none text-dark fw-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width: 36, height: 36, background: "#007bff", fontSize: 14 }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="d-none d-lg-inline" style={{ fontSize: 14 }}>{userName}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger ms-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/Login" className="btn btn-sm btn-outline-primary px-3" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary px-3" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Cities", to: "/Splash" },
  { label: "Attractions", to: "/listing" },
  { label: "Search", to: "/searchres" },
  { label: "Map & Directions", to: "/maps" },
  { label: "Write a Review", to: "/reviews" },
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan"];

const SOCIAL = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const styles = `
  @keyframes footerFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-35px)} }
  @keyframes footerFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
  @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .footer-link {
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.25s, padding-left 0.25s;
    display: inline-block;
    position: relative;
  }
  .footer-link::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #4361ee, #4cc9f0);
    transition: width 0.3s;
  }
  .footer-link:hover {
    color: #4cc9f0;
    padding-left: 4px;
  }
  .footer-link:hover::before { width: 100%; }

  .footer-social-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s;
    backdrop-filter: blur(6px);
  }
  .footer-social-btn:hover {
    background: linear-gradient(135deg, rgba(67,97,238,0.5), rgba(76,201,240,0.3));
    border-color: #4361ee;
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(67,97,238,0.35);
  }

  .footer-city-chip {
    font-size: 12px;
    padding: 4px 14px;
    border-radius: 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    transition: all 0.25s;
    display: inline-block;
  }
  .footer-city-chip:hover {
    background: rgba(67,97,238,0.3);
    border-color: #4361ee;
    color: #fff;
    transform: translateY(-2px);
  }

  .footer-gradient-heading {
    background: linear-gradient(90deg, #4361ee, #4cc9f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .footer-brand-gradient {
    background: linear-gradient(90deg, #4361ee, #7b2ff7, #4cc9f0);
    background-size: 200% 200%;
    animation: shimmer 4s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-divider {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(67,97,238,0.4), rgba(76,201,240,0.4), transparent);
    margin: 0;
  }
`;

function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 55%, #1a0533 100%)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(67,97,238,0.2)",
      }}
    >
      <style>{styles}</style>

      {/* Background blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-15%", left: "-8%",
          width: 450, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67,97,238,0.12) 0%, transparent 70%)",
          animation: "footerFloat1 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,37,133,0.1) 0%, transparent 70%)",
          animation: "footerFloat2 11s ease-in-out infinite",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Top separator wave */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ display: "block", width: "100%", transform: "scaleY(-1)" }}>
          <path d="M0 60L60 52C120 44 240 28 360 24C480 20 600 28 720 32C840 36 960 36 1080 32C1200 28 1320 20 1380 16L1440 12V60H0Z"
            fill="#f8f9fa" fillOpacity="0.04" />
        </svg>
      </div>

      {/* Main content */}
      <div className="container position-relative py-5" style={{ zIndex: 2 }}>
        <div className="row g-5">

          {/* Brand column */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <span className="fw-bold fs-4" style={{ letterSpacing: "-0.5px" }}>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>APP-</span>
                <span className="footer-brand-gradient">CITIGUIDE</span>
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
              Pakistan's leading city guide — discover hidden gems, iconic landmarks, top restaurants, and authentic local experiences across vibrant cities.
            </p>

            {/* Stats mini row */}
            <div className="d-flex gap-4 mt-4">
              {[{ v: "6+", l: "Cities" }, { v: "200+", l: "Spots" }, { v: "4.8★", l: "Rating" }].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="fw-bold text-white" style={{ fontSize: "1.1rem" }}>{s.v}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="d-flex gap-2 mt-4">
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} className="footer-social-btn" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="footer-gradient-heading">Explore</div>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-gradient-heading">Top Cities</div>
            <div className="d-flex flex-wrap gap-2">
              {CITIES.map((city) => (
                <Link key={city} to={`/listing?city=${encodeURIComponent(city)}`} className="footer-city-chip">
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact / newsletter */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-gradient-heading">Stay Connected</div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }}>
              Get the latest travel tips and city highlights delivered to you.
            </p>
            <div
              className="d-flex align-items-center gap-2 p-2 mt-3"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                backdropFilter: "blur(10px)",
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-grow-1 bg-transparent border-0 text-white"
                style={{ outline: "none", fontSize: 13, padding: "6px 8px", color: "rgba(255,255,255,0.8)" }}
              />
              <button
                className="btn btn-sm fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #4361ee, #7b2ff7)",
                  color: "#fff",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 12,
                  padding: "6px 14px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Subscribe
              </button>
            </div>

            {/* Contact info */}
            <ul className="list-unstyled mt-4 d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" />
                </svg>
                support@citiguide.pk
              </li>
              <li className="d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                Pakistan
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="footer-divider" style={{ marginInline: 0 }} />

      {/* Bottom bar */}
      <div
        className="position-relative py-4"
        style={{ zIndex: 2, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)" }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
              &copy; {new Date().getFullYear()}{" "}
              <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>APP-CITIGUIDE</span>
              . All rights reserved.
            </p>
            <div className="d-flex align-items-center gap-1">
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Built with</span>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                background: "linear-gradient(90deg, #4361ee, #4cc9f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginLeft: 4,
              }}>
                React &amp; Node.js
              </span>
            </div>
            <div className="d-flex gap-3">
              {["Privacy Policy", "Terms of Use"].map((t) => (
                <a key={t} href="#" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

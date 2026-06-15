import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan"];

const ROTATING_WORDS = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"];

function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const chipsRef = useRef(null);
  const statsRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(badgeRef.current, { y: -30, opacity: 0, duration: 0.6 })
      .from(titleRef.current, { y: 60, opacity: 0, duration: 0.8 }, "-=0.3")
      .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.7 }, "-=0.4")
      .from(searchRef.current, { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
      .from(chipsRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
      .from(statsRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.2");
  }, []);

  // Rotating city word
  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(wordRef.current, {
        y: -20, opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => {
          setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
          gsap.fromTo(wordRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
        },
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/searchres?q=${encodeURIComponent(query)}`);
    else navigate("/Splash");
  }

  return (
    <div
      ref={heroRef}
      className="position-relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #1a0533 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Animated background blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67,97,238,0.15) 0%, transparent 70%)",
          animation: "float1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,37,133,0.12) 0%, transparent 70%)",
          animation: "float2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(76,201,240,0.1) 0%, transparent 70%)",
          animation: "float3 7s ease-in-out infinite",
        }} />
        {/* Grid lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,30px)} }
      `}</style>

      {/* Main Content */}
      <div className="container position-relative py-5" style={{ zIndex: 2 }}>
        <div className="text-center" style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Badge */}
          <div ref={badgeRef} className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-pill" style={{ background: "rgba(67,97,238,0.2)", border: "1px solid rgba(67,97,238,0.4)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4cc9f0", display: "inline-block", boxShadow: "0 0 8px #4cc9f0", animation: "pulse 2s infinite" }} />
            <span className="text-white small fw-medium">Pakistan's #1 City Guide</span>
          </div>

          {/* Headline */}
          <h1
            ref={titleRef}
            className="fw-bold text-white mb-4"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", lineHeight: 1.15, letterSpacing: "-1px" }}
          >
            Explore the Best of{" "}
            <span
              ref={wordRef}
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg, #4361ee, #4cc9f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mb-5"
            style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 2rem" }}
          >
            Discover hidden gems, iconic landmarks, top restaurants, and local experiences across Pakistan's most vibrant cities.
          </p>

          {/* Search Bar */}
          <form ref={searchRef} onSubmit={handleSearch} className="mb-4">
            <div
              className="d-flex align-items-center gap-2 p-2 mx-auto"
              style={{
                maxWidth: 580,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 50,
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="ps-3 text-white opacity-50" style={{ fontSize: 20 }}>🔍</span>
              <input
                type="text"
                placeholder="Search attractions, restaurants, hotels..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow-1 border-0 bg-transparent text-white"
                style={{ outline: "none", fontSize: 15, padding: "10px 4px" }}
              />
              <button
                type="submit"
                className="btn fw-semibold px-4 py-2"
                style={{
                  background: "linear-gradient(135deg, #4361ee, #7b2ff7)",
                  color: "#fff",
                  borderRadius: 40,
                  border: "none",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                Explore Now
              </button>
            </div>
          </form>

          {/* City Quick Chips */}
          <div ref={chipsRef} className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            <span className="text-white opacity-50 small align-self-center me-1">Popular:</span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/listing?city=${encodeURIComponent(city)}`)}
                className="btn btn-sm text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 30,
                  fontSize: 13,
                  padding: "5px 16px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(67,97,238,0.4)"; e.currentTarget.style.borderColor = "#4361ee"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="d-flex flex-wrap justify-content-center gap-4 gap-md-5">
            {[
              { value: "6+", label: "Cities" },
              { value: "200+", label: "Attractions" },
              { value: "50K+", label: "Travellers" },
              { value: "4.8★", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="fw-bold text-white" style={{ fontSize: "1.6rem", letterSpacing: "-0.5px" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%" }}>
          <path d="M0 80L60 69.3C120 59 240 37 360 32C480 27 600 37 720 42.7C840 48 960 48 1080 42.7C1200 37 1320 27 1380 21.3L1440 16V80H0Z" fill="#f8f9fa" />
        </svg>
      </div>
    </div>
  );
}

export default HeroSection;

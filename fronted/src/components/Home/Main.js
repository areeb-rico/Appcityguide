import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CITIES = [
  { name: "Karachi", tag: "City of Lights", emoji: "🌊", color: "#4361ee", desc: "Beaches, food streets & vibrant nightlife" },
  { name: "Lahore", tag: "Cultural Capital", emoji: "🕌", color: "#7b2ff7", desc: "Mughal heritage, gardens & world-class food" },
  { name: "Islamabad", tag: "Green Capital", emoji: "🌿", color: "#06d6a0", desc: "Hills, modern architecture & clean streets" },
  { name: "Peshawar", tag: "Ancient City", emoji: "🏺", color: "#f72585", desc: "Bazaars, forts & rich Pashtun culture" },
  { name: "Quetta", tag: "Fruit Garden", emoji: "🍑", color: "#ff9f1c", desc: "Mountain views, orchards & rugged terrain" },
  { name: "Multan", tag: "City of Saints", emoji: "🌸", color: "#4cc9f0", desc: "Shrines, handicrafts & ancient history" },
];

const FEATURES = [
  { icon: "🗺️", title: "Interactive Maps", desc: "Real-time maps with turn-by-turn directions to every attraction." },
  { icon: "⭐", title: "Verified Reviews", desc: "Honest ratings from real travellers who have visited." },
  { icon: "🔍", title: "Smart Search", desc: "Find exactly what you're looking for — filter by category, rating, city." },
  { icon: "📍", title: "Detailed Listings", desc: "Opening hours, contact info, photos, and website links." },
  { icon: "🏆", title: "Top Picks", desc: "Curated lists of the best places in every city." },
  { icon: "📱", title: "Always Up-to-Date", desc: "Admin-managed listings ensure fresh, accurate information." },
];

const STEPS = [
  { num: "01", title: "Choose a City", desc: "Browse our growing list of Pakistani cities and pick your destination.", icon: "🏙️" },
  { num: "02", title: "Explore Attractions", desc: "Filter by category, sort by rating, and find the perfect spots.", icon: "🗺️" },
  { num: "03", title: "Plan & Visit", desc: "Get directions, read reviews, and make the most of your trip.", icon: "✈️" },
];

function useScrollAnim(ref, from, options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll ? ref.current.querySelectorAll("[data-anim]") : [ref.current];
    const targets = els.length > 0 ? els : [ref.current];
    gsap.from(targets, {
      ...from,
      scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none none" },
      stagger: 0.12,
      ease: "power3.out",
      duration: 0.7,
      ...options,
    });
  }, []);
}

function Main() {
  const navigate = useNavigate();
  const citiesRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useScrollAnim(citiesRef, { y: 50, opacity: 0 });
  useScrollAnim(featuresRef, { y: 40, opacity: 0 });
  useScrollAnim(stepsRef, { y: 40, opacity: 0 });
  useScrollAnim(statsRef, { y: 30, opacity: 0 });
  useScrollAnim(ctaRef, { scale: 0.96, opacity: 0 });

  return (
    <>
      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3 rounded-pill fw-medium">Simple Steps</span>
            <h2 className="fw-bold" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>How It Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 460, lineHeight: 1.7 }}>Start exploring in three easy steps</p>
          </div>
          <div ref={stepsRef} className="row g-4 justify-content-center">
            {STEPS.map((s, i) => (
              <div key={s.num} data-anim="true" className="col-md-4">
                <div className="text-center p-4 position-relative">
                  {i < STEPS.length - 1 && (
                    <div className="d-none d-md-block position-absolute top-50 end-0 translate-middle-y" style={{ width: 60, right: -30, zIndex: 1 }}>
                      <div style={{ height: 2, background: "linear-gradient(90deg,#4361ee,#7b2ff7)", opacity: 0.3 }} />
                    </div>
                  )}
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{ width: 80, height: 80, background: "linear-gradient(135deg,#eef0fd,#e8e3fd)", fontSize: 32 }}
                  >
                    {s.icon}
                  </div>
                  <div className="text-primary fw-bold small mb-2" style={{ letterSpacing: 1 }}>{s.num}</div>
                  <h5 className="fw-bold mb-2">{s.title}</h5>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES ────────────────────────────────────────── */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 mb-3 rounded-pill fw-medium">Destinations</span>
            <h2 className="fw-bold" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>Explore Pakistan's Cities</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 480, lineHeight: 1.7 }}>Each city has its own story, culture, and unmissable attractions</p>
          </div>
          <div ref={citiesRef} className="row g-4">
            {CITIES.map((city) => (
              <div key={city.name} data-anim="true" className="col-sm-6 col-lg-4">
                <div
                  className="card border-0 h-100 overflow-hidden"
                  onClick={() => navigate(`/listing?city=${encodeURIComponent(city.name)}`)}
                  style={{
                    borderRadius: 18,
                    cursor: "pointer",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                >
                  {/* Colored top bar */}
                  <div style={{ height: 6, background: city.color }} />
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{ width: 52, height: 52, background: city.color + "15", fontSize: 24 }}
                      >
                        {city.emoji}
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">{city.name}</h5>
                        <span className="small fw-medium" style={{ color: city.color }}>{city.tag}</span>
                      </div>
                    </div>
                    <p className="text-muted small mb-3" style={{ lineHeight: 1.65 }}>{city.desc}</p>
                    <span className="small fw-semibold d-flex align-items-center gap-1" style={{ color: city.color }}>
                      Explore {city.name} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button
              className="btn btn-outline-primary px-5 py-2 fw-semibold"
              style={{ borderRadius: 40 }}
              onClick={() => navigate("/Splash")}
            >
              View All Cities
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #1a0533 100%)" }}
      >
        <div className="container py-3">
          <div ref={statsRef} className="row g-4 text-center">
            {[
              { value: "6+", label: "Cities Covered", icon: "🏙️" },
              { value: "200+", label: "Attractions Listed", icon: "📍" },
              { value: "50,000+", label: "Happy Travellers", icon: "😊" },
              { value: "1,200+", label: "User Reviews", icon: "⭐" },
            ].map((s) => (
              <div key={s.label} data-anim="true" className="col-6 col-md-3">
                <div className="py-2">
                  <div style={{ fontSize: 36 }} className="mb-2">{s.icon}</div>
                  <div
                    className="fw-bold text-white mb-1"
                    style={{ fontSize: "2rem", letterSpacing: "-1px" }}
                  >
                    {s.value}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 mb-3 rounded-pill fw-medium">Why Us</span>
            <h2 className="fw-bold" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>Everything You Need to Explore</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 460, lineHeight: 1.7 }}>Packed with tools to make your city exploration easier and more enjoyable</p>
          </div>
          <div ref={featuresRef} className="row g-4">
            {FEATURES.map((f) => (
              <div key={f.title} data-anim="true" className="col-sm-6 col-lg-4">
                <div
                  className="p-4 h-100 rounded-3"
                  style={{
                    background: "#f8f9fa",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(67,97,238,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 32 }} className="mb-3">{f.icon}</div>
                  <h6 className="fw-bold mb-2">{f.title}</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 mb-3 rounded-pill fw-medium">Reviews</span>
            <h2 className="fw-bold" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>What Travellers Say</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Sara Khan", city: "Lahore", text: "Found the most amazing food streets in Lahore using this app. The recommendations were spot on and the directions were super accurate!", avatar: "SK", rating: 5 },
              { name: "Ahmed Raza", city: "Karachi", text: "Planned my entire Karachi trip using CityGuide. The detailed attraction listings with opening hours saved me so much time.", avatar: "AR", rating: 5 },
              { name: "Fatima Malik", city: "Islamabad", text: "The map feature is incredible. Found hidden gems in Islamabad I never knew existed. Highly recommend to every traveller!", avatar: "FM", rating: 4 },
            ].map((t) => (
              <div key={t.name} className="col-md-4">
                <div className="card border-0 shadow-sm h-100 p-4" style={{ borderRadius: 16 }}>
                  <div className="d-flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ color: s <= t.rating ? "#ffc107" : "#dee2e6", fontSize: 14 }}>★</span>
                    ))}
                  </div>
                  <p className="text-muted mb-4" style={{ lineHeight: 1.7, fontSize: 14 }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                      style={{ width: 44, height: 44, background: "linear-gradient(135deg,#4361ee,#7b2ff7)", fontSize: 14 }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="fw-bold small">{t.name}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>📍 {t.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="py-5"
        style={{ background: "linear-gradient(135deg, #4361ee 0%, #7b2ff7 100%)" }}
      >
        <div className="container py-4 text-center">
          <h2 className="fw-bold text-white mb-3" style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)" }}>
            Ready to Start Exploring?
          </h2>
          <p className="text-white mb-4" style={{ opacity: 0.8, maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Join thousands of travellers discovering the best of Pakistan's cities every day.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <button
              className="btn btn-white btn-lg fw-bold px-5 text-primary"
              style={{ borderRadius: 40, background: "#fff", border: "none" }}
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </button>
            <button
              className="btn btn-outline-white btn-lg fw-semibold px-5"
              style={{ borderRadius: 40, border: "2px solid rgba(255,255,255,0.6)", color: "#fff" }}
              onClick={() => navigate("/Splash")}
            >
              Browse Cities
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Main;

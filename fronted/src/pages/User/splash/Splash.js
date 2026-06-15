import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const BASE_CITIES = [
  {
    name: "Karachi",
    country: "Pakistan",
    tag: "Coastal Metropolis",
    description: "Pakistan's largest city — a coastal giant known for vibrant culture, diverse street food, and the Arabian Sea.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Badshahi_Mosque_Oct_2008.jpg/640px-Badshahi_Mosque_Oct_2008.jpg",
  },
  {
    name: "Lahore",
    country: "Pakistan",
    tag: "Cultural Capital",
    description: "The heart of Pakistan's culture and history — Mughal architecture, legendary food, and a city that never sleeps.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Badshahi_Mosque_Oct_2008.jpg/640px-Badshahi_Mosque_Oct_2008.jpg",
  },
  {
    name: "Islamabad",
    country: "Pakistan",
    tag: "Green Capital",
    description: "Pakistan's modern capital surrounded by the Margalla Hills — clean, peaceful, and full of natural beauty.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Faisal_Mosque_2.jpg/640px-Faisal_Mosque_2.jpg",
  },
  {
    name: "Peshawar",
    country: "Pakistan",
    tag: "Ancient City",
    description: "One of Asia's oldest living cities — rich in Pashtun culture, ancient bazaars, and centuries of history.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Peshawar_Bala_Hisar_fort.jpg/640px-Peshawar_Bala_Hisar_fort.jpg",
  },
  {
    name: "Quetta",
    country: "Pakistan",
    tag: "Mountain City",
    description: "The fruit garden of Pakistan — nestled among dramatic mountains with cool weather and stunning landscapes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Quetta_city.jpg/640px-Quetta_city.jpg",
  },
  {
    name: "Multan",
    country: "Pakistan",
    tag: "City of Saints",
    description: "City of saints and sufis — ancient shrines, vibrant handicrafts, and famous mango orchards.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Multan_Mausoleum_of_Shah_Rukn-e-Alam.jpg/640px-Multan_Mausoleum_of_Shah_Rukn-e-Alam.jpg",
  },
];

function mergeCities(dbCities) {
  return BASE_CITIES.map((base) => {
    const fromDb = dbCities.find(
      (d) => d.name && d.name.trim().toLowerCase() === base.name.toLowerCase()
    );
    if (!fromDb) return base;
    return {
      ...base,
      description: fromDb.description || base.description,
      image:
        fromDb.image && fromDb.image.startsWith("/uploads")
          ? `http://localhost:4000${fromDb.image}`
          : fromDb.image && fromDb.image.startsWith("http")
          ? fromDb.image
          : base.image,
    };
  });
}

function CityCard({ city, onClick }) {
  const [imgSrc, setImgSrc] = useState(city.image);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        background: "#fff",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.14)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
        <img
          src={imgSrc}
          alt={city.name}
          onError={() => setImgSrc(`https://placehold.co/640x400/0f3460/ffffff?text=${city.name}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
            transition: "background 0.3s ease",
          }}
        />
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(15,52,96,0.85)",
              color: "#fff",
              backdropFilter: "blur(6px)",
            }}
          >
            {city.tag}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h5 style={{ fontWeight: 700, margin: 0, fontSize: "1.05rem", color: "#1a1a2e" }}>{city.name}</h5>
          <span style={{ fontSize: 11, color: "#6c757d" }}>{city.country}</span>
        </div>

        <p style={{ fontSize: 13, color: "#6c757d", lineHeight: 1.65, flex: 1, marginBottom: 16 }}>
          {city.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#0f3460", fontWeight: 600 }}>
            {city.attractions > 0 ? `${city.attractions} Attractions` : "No listings yet"}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: 8,
              background: hovered ? "linear-gradient(135deg, #0f3460, #533483)" : "#f0f4ff",
              color: hovered ? "#fff" : "#0f3460",
              transition: "all 0.25s ease",
            }}
          >
            Explore
          </span>
        </div>
      </div>
    </div>
  );
}

function Splash() {
  const [cities, setCities] = useState(BASE_CITIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/cities").then((r) => r.json()).catch(() => []),
      fetch("http://localhost:4000/attractions").then((r) => r.json()).catch(() => []),
    ]).then(([citiesData, attractionsData]) => {
      const attractions = Array.isArray(attractionsData) ? attractionsData : [];

      const countMap = {};
      attractions.forEach((a) => {
        if (a.city) {
          const key = a.city.trim().toLowerCase();
          countMap[key] = (countMap[key] || 0) + 1;
        }
      });

      const merged = mergeCities(Array.isArray(citiesData) ? citiesData : []).map((city) => ({
        ...city,
        attractions: countMap[city.name.toLowerCase()] || 0,
      }));

      setCities(merged);
      setLoading(false);
    });
  }, []);

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />

      {/* Page Header */}
      <div
        className="py-5 text-white"
        style={{ background: "linear-gradient(135deg, #0f3460 0%, #533483 100%)" }}
      >
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.65, fontSize: 13, marginBottom: 10 }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span>
            <span>›</span>
            <span>Cities</span>
          </div>
          <h1 className="fw-bold mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
            Explore Cities
          </h1>
          <p className="mb-4" style={{ opacity: 0.7, fontSize: "1rem" }}>
            Pick a city and discover its best attractions, restaurants, and hidden gems.
          </p>

          {/* Search */}
          <div style={{ maxWidth: 480 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: "6px 16px",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search a city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 14,
                  flex: 1,
                  padding: "6px 0",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: 44, height: 44 }} />
            <p className="mt-3 text-muted small">Loading cities...</p>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <p className="text-muted small mb-0">
                {filtered.length} {filtered.length === 1 ? "city" : "cities"} found
                {search ? ` for "${search}"` : ""}
              </p>
            </div>

            <div className="row g-4">
              {filtered.map((city) => (
                <div key={city.name} className="col-md-6 col-lg-4">
                  <CityCard
                    city={city}
                    onClick={() => navigate(`/listing?city=${encodeURIComponent(city.name)}`)}
                  />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-5">
                <h5 className="text-muted">No cities found for "{search}"</h5>
                <p className="text-muted small">Try a different search term</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Splash;

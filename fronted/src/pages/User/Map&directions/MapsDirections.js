import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const CITY_CENTERS = {
  Karachi:   { lat: 24.8607, lng: 67.0011, zoom: 12 },
  Lahore:    { lat: 31.5497, lng: 74.3436, zoom: 12 },
  Islamabad: { lat: 33.6844, lng: 73.0479, zoom: 12 },
  Peshawar:  { lat: 34.0151, lng: 71.5249, zoom: 12 },
  Quetta:    { lat: 30.1798, lng: 66.9750, zoom: 12 },
  Multan:    { lat: 30.1575, lng: 71.5249, zoom: 12 },
};

const SAMPLE_ATTRACTIONS = [
  { _id: "1", name: "Badshahi Mosque",  city: "Lahore",    category: "Attraction", lat: 31.5882, lng: 74.3099, description: "Iconic Mughal mosque" },
  { _id: "2", name: "Lahore Fort",      city: "Lahore",    category: "Attraction", lat: 31.5882, lng: 74.3148, description: "UNESCO World Heritage Site" },
  { _id: "3", name: "Faisal Mosque",    city: "Islamabad", category: "Attraction", lat: 33.7295, lng: 73.0371, description: "Largest mosque in Pakistan" },
  { _id: "4", name: "Margalla Hills",   city: "Islamabad", category: "Park",       lat: 33.7600, lng: 73.0551, description: "National park with hiking trails" },
  { _id: "5", name: "Clifton Beach",    city: "Karachi",   category: "Attraction", lat: 24.8125, lng: 67.0298, description: "Popular beach on Arabian Sea" },
];

function LoginPrompt({ navigate }) {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#f0f4ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f2027" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h5 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>Login Required</h5>
        <p style={{ color: "#6c757d", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          You need to be logged in to view the map and get directions to attractions.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => navigate("/Login")}
            className="btn btn-primary px-4"
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-outline-secondary px-4"
            style={{ borderRadius: 8 }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

function MapsDirections() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [attractions, setAttractions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("http://localhost:4000/attractions")
      .then((r) => r.json())
      .then((data) => setAttractions(Array.isArray(data) && data.length > 0 ? data : SAMPLE_ATTRACTIONS))
      .catch(() => setAttractions(SAMPLE_ATTRACTIONS));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (window.L) { initMap(); return; }
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(linkEl);

    const scriptEl = document.createElement("script");
    scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptEl.onload = () => setMapLoaded(true);
    document.head.appendChild(scriptEl);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if ((mapLoaded || window.L) && mapRef.current) initMap();
  }, [mapLoaded, selectedCity, attractions, isLoggedIn]);

  function initMap() {
    const L = window.L;
    if (!L || !mapRef.current) return;
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
    const center = CITY_CENTERS[selectedCity] || { lat: 30.3753, lng: 69.3451, zoom: 6 };
    const map = L.map(mapRef.current).setView([center.lat, center.lng], center.zoom);
    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const cityAttractions = attractions.filter((a) => a.city === selectedCity && a.lat && a.lng);

    const toRender = cityAttractions.length > 0
      ? cityAttractions
      : SAMPLE_ATTRACTIONS.filter((a) => a.city === selectedCity);

    toRender.forEach((a) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#0f3460;color:white;border-radius:50% 50% 50% 0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg)">&#9679;</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const marker = L.marker([a.lat, a.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width:160px;font-family:sans-serif">
          <strong style="font-size:14px">${a.name}</strong><br/>
          <small style="color:#666">${a.category} &middot; ${a.city}</small><br/>
          <small style="color:#888">${a.description || ""}</small><br/>
          <a href="https://www.google.com/maps/dir//${encodeURIComponent(a.name + " " + a.city)}" target="_blank" style="color:#0f3460;font-size:12px;font-weight:600">Get Directions</a>
        </div>
      `);
    });
  }

  const cityAttrList = [
    ...attractions,
    ...SAMPLE_ATTRACTIONS.filter((s) => !attractions.find((a) => a.name === s.name)),
  ].filter((a) => a.city === selectedCity);

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="py-4" style={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
        <div className="container">
          <h2 className="text-white fw-bold mb-1">Map & Directions</h2>
          <p className="text-white mb-3 small" style={{ opacity: 0.7 }}>
            Explore attractions on the map and get directions
          </p>
          {isLoggedIn && (
            <div className="d-flex flex-wrap gap-2">
              {Object.keys(CITY_CENTERS).map((city) => (
                <button
                  key={city}
                  className={`btn btn-sm ${selectedCity === city ? "btn-warning fw-bold" : "btn-outline-light"}`}
                  style={{ borderRadius: 20 }}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLoggedIn ? (
        <LoginPrompt navigate={navigate} />
      ) : (
        <>
          <div className="container-fluid p-0">
            <div className="row g-0" style={{ minHeight: "70vh" }}>
              {/* Sidebar */}
              <div className="col-md-3 border-end bg-white overflow-auto" style={{ maxHeight: "70vh" }}>
                <div className="p-3 border-bottom">
                  <h6 className="fw-bold mb-0">{selectedCity} Attractions</h6>
                  <small className="text-muted">{cityAttrList.length} places</small>
                </div>
                {cityAttrList.map((a) => (
                  <div
                    key={a._id}
                    className={`p-3 border-bottom d-flex gap-3 align-items-start ${selectedAttr?._id === a._id ? "bg-primary bg-opacity-10" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedAttr(a)}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: selectedAttr?._id === a._id ? "#0f3460" : "#f0f4ff",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={selectedAttr?._id === a._id ? "#fff" : "#0f3460"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="fw-medium small">{a.name}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{a.category}</div>
                      {a.openingHours && (
                        <div className="text-muted" style={{ fontSize: 11 }}>{a.openingHours}</div>
                      )}
                    </div>
                  </div>
                ))}
                {cityAttrList.length === 0 && (
                  <div className="text-center p-4 text-muted small">
                    No attractions listed for {selectedCity} yet.
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="col-md-9 position-relative">
                <div ref={mapRef} style={{ width: "100%", height: "70vh" }} />
                {!window.L && !mapLoaded && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="spinner-border text-primary" />
                    <p className="mt-2 small text-muted">Loading map...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected attraction info bar */}
          {selectedAttr && (
            <div className="bg-white border-top shadow p-3">
              <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <h6 className="fw-bold mb-1">{selectedAttr.name}</h6>
                  <small className="text-muted">
                    {selectedAttr.category} &middot; {selectedAttr.city}
                    {selectedAttr.openingHours ? " · " + selectedAttr.openingHours : ""}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir//${encodeURIComponent(selectedAttr.name + " " + selectedAttr.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary"
                    style={{ borderRadius: 8 }}
                  >
                    Get Directions
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(selectedAttr.name + " " + selectedAttr.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ borderRadius: 8 }}
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </>
  );
}

export default MapsDirections;

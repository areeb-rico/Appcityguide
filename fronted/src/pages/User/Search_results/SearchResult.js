import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const CATEGORIES = ["All", "Attraction", "Restaurant", "Hotel", "Museum", "Park", "Shopping", "Event"];

function StarRating({ rating, size = 13 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#ffc107" : "#dee2e6", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function LoginPrompt({ navigate }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3c72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h5 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>Login Required</h5>
        <p style={{ color: "#6c757d", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          You need to be logged in to search attractions across Pakistan's cities.
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

function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isLoggedIn = !!localStorage.getItem("token");

  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (isLoggedIn && params.get("q")) {
      doSearch(params.get("q"), params.get("category") || "All");
    }
  }, []);

  function doSearch(q, cat) {
    setLoading(true);
    setSearched(true);
    const catParam = cat && cat !== "All" ? `&category=${encodeURIComponent(cat)}` : "";
    fetch(`http://localhost:4000/attractions/search?q=${encodeURIComponent(q)}${catParam}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/searchres?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    doSearch(query, category);
  }

  return (
    <>
      <Header />

      {/* Search Hero */}
      <div className="py-5" style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
        <div className="container">
          <h2 className="text-white fw-bold mb-4 text-center">Search Attractions</h2>
          {isLoggedIn ? (
            <form onSubmit={handleSearch}>
              <div className="row g-2 justify-content-center">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control form-control-lg shadow-sm"
                    placeholder="Search by name, city, or keyword..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ borderRadius: 10 }}
                  />
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select form-select-lg shadow-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ borderRadius: 10 }}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold shadow-sm" style={{ borderRadius: 10 }}>
                    Search
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <p className="text-center text-white opacity-75 mb-0" style={{ fontSize: 15 }}>
              Login to search attractions, restaurants, and more across Pakistan's cities.
            </p>
          )}
        </div>
      </div>

      {!isLoggedIn ? (
        <LoginPrompt navigate={navigate} />
      ) : (
        <div className="container py-5">
          {/* Quick category chips */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-outline-secondary"}`}
                style={{ borderRadius: 20 }}
                onClick={() => { setCategory(cat); doSearch(query, cat); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} />
              <p className="mt-3 text-muted">Searching...</p>
            </div>
          )}

          {!loading && searched && (
            <>
              <p className="text-muted mb-4">
                {results.length > 0
                  ? <><strong>{results.length}</strong> result{results.length !== 1 ? "s" : ""} found{query ? ` for "${query}"` : ""}</>
                  : `No results found${query ? ` for "${query}"` : ""}. Try different keywords.`}
              </p>

              <div className="row g-4">
                {results.map((a) => (
                  <div key={a._id} className="col-md-6 col-lg-4">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: 14, cursor: "pointer", transition: "transform 0.2s" }}
                      onClick={() => navigate(`/listing?city=${encodeURIComponent(a.city || "")}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div style={{ height: 180, overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
                        <img
                          src={a.image && a.image.startsWith("/uploads") ? `http://localhost:4000${a.image}` : a.image || ""}
                          alt={a.name}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="badge bg-primary bg-opacity-10 text-primary small">{a.category}</span>
                          <span className="text-muted small">{a.city}</span>
                        </div>
                        <h6 className="fw-bold mb-1">{a.name}</h6>
                        <p className="text-muted small mb-2">
                          {(a.description || "").substring(0, 75)}{(a.description || "").length > 75 ? "..." : ""}
                        </p>
                        <div className="d-flex align-items-center">
                          <StarRating rating={a.rating || 0} />
                          <span className="ms-1 small text-muted">({a.reviewCount || 0})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="text-center py-5">
                  <h5 className="text-muted">No results found</h5>
                  <p className="text-muted small">Try searching for a city name, attraction name, or category</p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                    {["Lahore", "Karachi", "Islamabad", "Museum", "Park"].map((s) => (
                      <button
                        key={s}
                        className="btn btn-sm btn-outline-primary"
                        style={{ borderRadius: 20 }}
                        onClick={() => { setQuery(s); doSearch(s, "All"); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && !searched && (
            <div className="text-center py-5">
              <h4 className="mt-4 fw-bold">Find Your Next Adventure</h4>
              <p className="text-muted">Search for attractions, restaurants, hotels, and more across cities</p>
              <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                <span className="text-muted small me-2">Popular searches:</span>
                {["Badshahi Mosque", "Clifton Beach", "Faisal Mosque", "Lahore Fort"].map((s) => (
                  <button
                    key={s}
                    className="btn btn-sm btn-outline-primary"
                    style={{ borderRadius: 20 }}
                    onClick={() => { setQuery(s); doSearch(s, "All"); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

export default SearchResult;

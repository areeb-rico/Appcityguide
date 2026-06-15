import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const CATEGORIES = ["All", "Attraction", "Restaurant", "Hotel", "Museum", "Park", "Shopping", "Event"];

const SAMPLE_ATTRACTIONS = [
  { _id: "s1", name: "Clifton Beach", city: "Karachi", category: "Attraction", description: "One of Karachi's most popular beaches stretching along the Arabian Sea.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Karachi_Clifton_Beach.jpg/640px-Karachi_Clifton_Beach.jpg", rating: 4.2, reviewCount: 128, openingHours: "24/7", phone: "+92-21-111-000", website: "https://karachi.gov.pk" },
  { _id: "s2", name: "Pakistan Museum of Natural History", city: "Islamabad", category: "Museum", description: "A national natural history museum with exhibits on flora, fauna, and fossils.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Faisal_Mosque_2.jpg/640px-Faisal_Mosque_2.jpg", rating: 4.5, reviewCount: 89, openingHours: "9 AM – 5 PM", phone: "+92-51-9248145", website: "" },
  { _id: "s3", name: "Badshahi Mosque", city: "Lahore", category: "Attraction", description: "One of the world's largest mosques, a stunning example of Mughal architecture built in 1671.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Badshahi_Mosque_Oct_2008.jpg/640px-Badshahi_Mosque_Oct_2008.jpg", rating: 4.9, reviewCount: 342, openingHours: "5 AM – 10 PM", phone: "+92-42-111-222", website: "" },
  { _id: "s4", name: "Lahore Fort", city: "Lahore", category: "Attraction", description: "A UNESCO World Heritage Site showcasing centuries of Mughal, Sikh, and British architecture.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/LahoreFortetc.jpg/640px-LahoreFortetc.jpg", rating: 4.7, reviewCount: 215, openingHours: "9 AM – 5 PM", phone: "+92-42-111-333", website: "" },
  { _id: "s5", name: "Faisal Mosque", city: "Islamabad", category: "Attraction", description: "The largest mosque in Pakistan and one of the largest in the world, with its iconic tent-like structure.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Faisal_Mosque_2.jpg/640px-Faisal_Mosque_2.jpg", rating: 4.8, reviewCount: 290, openingHours: "5 AM – 10 PM", phone: "+92-51-9204747", website: "" },
  { _id: "s6", name: "Margalla Hills", city: "Islamabad", category: "Park", description: "A national park adjacent to Islamabad, offering hiking trails and panoramic views of the city.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Margalla_Hills.jpg/640px-Margalla_Hills.jpg", rating: 4.6, reviewCount: 178, openingHours: "Sunrise to Sunset", phone: "", website: "" },
];

function StarRating({ rating, size = 14 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#ffc107" : "#dee2e6", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function AttractionListing() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const cityParam = params.get("city") || "";

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selected, setSelected] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const url = cityParam
      ? `http://localhost:4000/attractions?city=${encodeURIComponent(cityParam)}`
      : "http://localhost:4000/attractions";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : SAMPLE_ATTRACTIONS.filter(a => !cityParam || a.city === cityParam || SAMPLE_ATTRACTIONS);
        setAttractions(Array.isArray(data) && data.length > 0 ? data : SAMPLE_ATTRACTIONS);
        setLoading(false);
      })
      .catch(() => {
        setAttractions(SAMPLE_ATTRACTIONS);
        setLoading(false);
      });
  }, [cityParam]);

  function openDetail(attraction) {
    setSelected(attraction);
    setShowModal(true);
    setReviews([]);
    fetch(`http://localhost:4000/reviews/${attraction._id}`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }

  function submitReview(e) {
    e.preventDefault();
    if (!token) { navigate("/Login"); return; }
    setReviewLoading(true);
    fetch("http://localhost:4000/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ attractionId: selected._id, attractionName: selected.name, comment: reviewText, rating: reviewRating }),
    })
      .then((r) => r.json())
      .then(() => {
        setReviewLoading(false);
        setReviewText("");
        setReviewRating(5);
        fetch(`http://localhost:4000/reviews/${selected._id}`)
          .then((r) => r.json())
          .then((d) => setReviews(Array.isArray(d) ? d : []));
      })
      .catch(() => setReviewLoading(false));
  }

  let filtered = [...attractions];
  if (category !== "All") filtered = filtered.filter((a) => a.category === category);
  if (sortBy === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "name") filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  return (
    <>
      <Header />

      {/* Page Header */}
      <div
        className="py-5 text-white"
        style={{ background: "linear-gradient(135deg, #0f3460 0%, #533483 100%)" }}
      >
        <div className="container">
          <div className="d-flex align-items-center gap-2 mb-2" style={{ opacity: 0.7, fontSize: 14 }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/Splash")}>Cities</span>
            <span>›</span>
            <span>{cityParam || "All Cities"}</span>
          </div>
          <h1 className="display-5 fw-bold mb-1">{cityParam ? `${cityParam} Attractions` : "All Attractions"}</h1>
          <p className="mb-0 opacity-75">Discover the best places to visit{cityParam ? ` in ${cityParam}` : ""}</p>
        </div>
      </div>

      <div className="container py-4">
        {/* Filters */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm">
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-outline-secondary"}`}
                style={{ borderRadius: 20 }}
              >
                {cat}
              </button>
            ))}
          </div>
          <select className="form-select form-select-sm w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="name">Sort: A-Z</option>
          </select>
        </div>

        <p className="text-muted mb-3 small">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} />
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((a) => (
              <div key={a._id} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: 14, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onClick={() => openDetail(a)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
                >
                  <div style={{ height: 200, overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
                    <img
                      src={a.image && a.image.startsWith("/uploads") ? `http://localhost:4000${a.image}` : a.image || "https://via.placeholder.com/400x200"}
                      alt={a.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=" + a.name; }}
                    />
                  </div>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary small">{a.category}</span>
                      <span className="small text-muted">{a.city}</span>
                    </div>
                    <h6 className="fw-bold mb-1">{a.name}</h6>
                    <p className="text-muted small mb-2" style={{ lineHeight: 1.5 }}>
                      {a.description ? a.description.substring(0, 80) + (a.description.length > 80 ? "..." : "") : ""}
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-1">
                        <StarRating rating={a.rating || 0} />
                        <span className="small text-muted ms-1">({a.reviewCount || 0})</span>
                      </div>
                      {a.openingHours && <span className="small text-muted">⏰ {a.openingHours}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-12 text-center py-5">
                <span style={{ fontSize: 60 }}>🔍</span>
                <h5 className="mt-3 text-muted">No attractions found</h5>
                <p className="text-muted small">Try a different category or city</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 2000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="bg-white shadow-lg"
            style={{ width: "90%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto", borderRadius: 16 }}
          >
            {/* Modal Header Image */}
            <div className="position-relative" style={{ height: 280 }}>
              <img
                src={selected.image && selected.image.startsWith("/uploads") ? `http://localhost:4000${selected.image}` : selected.image || "https://via.placeholder.com/700x280"}
                alt={selected.name}
                className="w-100 h-100"
                style={{ objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/700x280?text=" + selected.name; }}
              />
              <button
                className="btn btn-sm btn-dark position-absolute top-0 end-0 m-3"
                style={{ borderRadius: 20 }}
                onClick={() => setShowModal(false)}
              >✕</button>
              <div
                className="position-absolute bottom-0 start-0 end-0 text-white p-4"
                style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}
              >
                <span className="badge bg-primary me-2">{selected.category}</span>
                <h4 className="fw-bold mb-0">{selected.name}</h4>
                <small>📍 {selected.city}</small>
              </div>
            </div>

            <div className="p-4">
              {/* Rating */}
              <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <div>
                  <StarRating rating={selected.rating || 0} size={20} />
                  <span className="ms-2 fw-bold">{selected.rating || 0}</span>
                  <span className="text-muted small ms-1">({selected.reviewCount || 0} reviews)</span>
                </div>
                {selected.openingHours && (
                  <span className="text-muted small ms-auto">⏰ {selected.openingHours}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted mb-3">{selected.description}</p>

              {/* Contact Info */}
              <div className="row g-2 mb-4">
                {selected.phone && (
                  <div className="col-auto">
                    <span className="badge bg-light text-dark border">📞 {selected.phone}</span>
                  </div>
                )}
                {selected.website && (
                  <div className="col-auto">
                    <a href={selected.website} target="_blank" rel="noreferrer" className="badge bg-primary text-white text-decoration-none">
                      🌐 Visit Website
                    </a>
                  </div>
                )}
                {selected.city && (
                  <div className="col-auto">
                    {token ? (
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + " " + selected.city)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="badge bg-success text-white text-decoration-none"
                      >
                        Get Directions
                      </a>
                    ) : (
                      <button
                        className="badge bg-secondary text-white border-0"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/Login")}
                      >
                        Login to Get Directions
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Map iframe */}
              {token ? (
                <div className="mb-4 rounded overflow-hidden" style={{ height: 200 }}>
                  <iframe
                    title="map"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent((selected.name || "") + " " + (selected.city || ""))}&output=embed`}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="mb-4 rounded d-flex align-items-center justify-content-center"
                  style={{ height: 200, background: "#f8f9fa", border: "1px solid #e9ecef" }}
                >
                  <div className="text-center">
                    <p className="text-muted small mb-2">Login to view the map and get directions</p>
                    <button className="btn btn-sm btn-primary" onClick={() => navigate("/Login")}>
                      Login
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <h6 className="fw-bold mb-3">Reviews ({reviews.length})</h6>

              {reviews.length > 0 && (
                <div className="mb-4" style={{ maxHeight: 240, overflowY: "auto" }}>
                  {reviews.map((rv) => (
                    <div key={rv._id} className="p-3 mb-2 bg-light rounded">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-medium small">{rv.userEmail}</span>
                        <div><StarRating rating={rv.rating || 5} size={12} /></div>
                      </div>
                      <p className="mb-0 small text-muted">{rv.comment}</p>
                      <small className="text-muted" style={{ fontSize: 11 }}>{new Date(rv.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}

              {/* Write Review */}
              {token ? (
                <form onSubmit={submitReview} className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-3">Write a Review</h6>
                  <div className="mb-2">
                    <label className="form-label small">Rating</label>
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          style={{ fontSize: 24, cursor: "pointer", color: s <= reviewRating ? "#ffc107" : "#dee2e6" }}
                          onClick={() => setReviewRating(s)}
                        >★</span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Share your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={reviewLoading}>
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center p-3 bg-light rounded">
                  <p className="mb-2 small text-muted">Login to write a review</p>
                  <button className="btn btn-sm btn-primary" onClick={() => navigate("/Login")}>Login</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default AttractionListing;

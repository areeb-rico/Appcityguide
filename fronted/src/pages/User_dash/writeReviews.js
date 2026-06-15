import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ fontSize: 32, cursor: "pointer", color: s <= (hover || value) ? "#ffc107" : "#dee2e6", transition: "color 0.1s" }}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >★</span>
      ))}
    </div>
  );
}

function Writereviews() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userName");

  const [attractions, setAttractions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/Login"); return; }
    fetch("http://localhost:4000/attractions")
      .then((r) => r.json())
      .then((d) => setAttractions(Array.isArray(d) ? d : []))
      .catch(() => setAttractions([]));

    fetch("http://localhost:4000/reviews")
      .then((r) => r.json())
      .then((d) => {
        const all = Array.isArray(d) ? d : [];
        setMyReviews(all);
        setLoadingReviews(false);
      })
      .catch(() => setLoadingReviews(false));
  }, [token, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedId) return alert("Please select an attraction");
    setSubmitting(true);
    const attr = attractions.find((a) => a._id === selectedId);
    fetch("http://localhost:4000/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ attractionId: selectedId, attractionName: attr?.name || "", comment, rating }),
    })
      .then((r) => r.json())
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        setComment("");
        setSelectedId("");
        setRating(5);
        setTimeout(() => setSuccess(false), 3000);
        fetch("http://localhost:4000/reviews")
          .then((r) => r.json())
          .then((d) => setMyReviews(Array.isArray(d) ? d : []));
      })
      .catch(() => setSubmitting(false));
  }

  const displayReviews = myReviews.slice(0, 20);

  return (
    <>
      <Header />

      <div className="py-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="container">
          <h2 className="text-white fw-bold mb-1">Reviews</h2>
          <p className="text-white opacity-75 small mb-0">Share your experience and help other travellers</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Write Review Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">✍️ Write a Review</h5>

                {success && (
                  <div className="alert alert-success py-2 small">
                    ✅ Review submitted successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium small">Select Attraction</label>
                    <select
                      className="form-select"
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose an attraction --</option>
                      {attractions.map((a) => (
                        <option key={a._id} value={a._id}>{a.name} ({a.city})</option>
                      ))}
                    </select>
                    {attractions.length === 0 && (
                      <div className="text-muted small mt-1">
                        No attractions in database yet. Browse the <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/listing")}>Attractions</span> page to write reviews from there.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium small">Your Rating</label>
                    <StarPicker value={rating} onChange={setRating} />
                    <small className="text-muted mt-1 d-block">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium small">Your Review</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Share your experience — what did you love? What could be better?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      minLength={10}
                    />
                    <small className="text-muted">{comment.length}/500</small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={submitting}
                    style={{ borderRadius: 10 }}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="col-lg-7">
            <h5 className="fw-bold mb-3">🌟 Recent Reviews</h5>
            {loadingReviews ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" />
              </div>
            ) : displayReviews.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-3">
                <span style={{ fontSize: 56 }}>💬</span>
                <h6 className="mt-3 text-muted">No reviews yet — be the first!</h6>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {displayReviews.map((rv) => (
                  <div key={rv._id} className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{ width: 36, height: 36, background: "#007bff", fontSize: 14, flexShrink: 0 }}
                        >
                          {(rv.userEmail || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-medium small">{rv.userEmail || "Anonymous"}</div>
                          <div className="text-muted" style={{ fontSize: 11 }}>
                            {rv.attractionName && <span className="me-2">📍 {rv.attractionName}</span>}
                            {new Date(rv.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ color: s <= (rv.rating || 5) ? "#ffc107" : "#dee2e6", fontSize: 13 }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="mb-0 text-muted small" style={{ lineHeight: 1.6 }}>{rv.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Writereviews;

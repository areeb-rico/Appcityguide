import { useState, useEffect } from "react";

function ManageReviews() {
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { loadReviews(); }, []);

  function loadReviews() {
    setLoading(true);
    fetch("http://localhost:4000/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this review?")) return;
    fetch(`http://localhost:4000/reviews/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => { setMsg("Review deleted."); setTimeout(() => setMsg(""), 2000); loadReviews(); });
  }

  const filtered = reviews.filter((r) =>
    (r.attractionName || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.userEmail || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.comment || "").toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Manage Reviews</h4>
          <small className="text-muted">{reviews.length} total reviews · avg ⭐ {avgRating}</small>
        </div>
        <input
          type="text"
          className="form-control w-auto"
          placeholder="🔍 Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
      </div>

      {msg && <div className="alert alert-success py-2 small mb-3">{msg}</div>}

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 px-3">#</th>
                  <th className="border-0 py-3">User</th>
                  <th className="border-0 py-3">Attraction</th>
                  <th className="border-0 py-3">Rating</th>
                  <th className="border-0 py-3">Review</th>
                  <th className="border-0 py-3">Date</th>
                  <th className="border-0 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r._id}>
                    <td className="px-3 py-3 text-muted small">{i + 1}</td>
                    <td className="py-3">
                      <div className="fw-medium small">{r.userEmail || "Anonymous"}</div>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-primary bg-opacity-10 text-primary">{r.attractionName || "—"}</span>
                    </td>
                    <td className="py-3">
                      <span>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ color: s <= (r.rating || 5) ? "#ffc107" : "#dee2e6", fontSize: 13 }}>★</span>
                        ))}
                      </span>
                    </td>
                    <td className="py-3" style={{ maxWidth: 260 }}>
                      <span className="text-muted small">{(r.comment || "").substring(0, 80)}{(r.comment || "").length > 80 ? "..." : ""}</span>
                    </td>
                    <td className="py-3 text-muted small">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-5 text-muted">
                {search ? `No reviews matching "${search}"` : "No reviews yet."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageReviews;

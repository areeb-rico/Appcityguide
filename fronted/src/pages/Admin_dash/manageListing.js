import { useState, useEffect } from "react";

const CATEGORIES = ["Attraction", "Restaurant", "Hotel", "Museum", "Park", "Shopping", "Event"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan"];

const EMPTY_FORM = { name: "", city: "", category: "Attraction", description: "", openingHours: "", phone: "", website: "" };

function ManageListing() {
  const token = localStorage.getItem("token");
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { loadAttractions(); }, []);

  function loadAttractions() {
    setLoading(true);
    fetch("http://localhost:4000/attractions")
      .then((r) => r.json())
      .then((d) => { setAttractions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setShowForm(true);
  }

  function openEdit(a) {
    setEditing(a._id);
    setForm({ name: a.name || "", city: a.city || "", category: a.category || "Attraction", description: a.description || "", openingHours: a.openingHours || "", phone: a.phone || "", website: a.website || "" });
    setImageFile(null);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);

    const url = editing ? `http://localhost:4000/attractions/${editing}` : "http://localhost:4000/attractions";
    const method = editing ? "PUT" : "POST";

    fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd })
      .then((r) => r.json())
      .then(() => {
        setSaving(false);
        setShowForm(false);
        setMsg(editing ? "Attraction updated!" : "Attraction added!");
        setTimeout(() => setMsg(""), 3000);
        loadAttractions();
      })
      .catch(() => setSaving(false));
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this attraction?")) return;
    fetch(`http://localhost:4000/attractions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => { setMsg("Deleted."); setTimeout(() => setMsg(""), 2000); loadAttractions(); });
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Manage Attractions</h4>
          <small className="text-muted">{attractions.length} total attractions</small>
        </div>
        <button className="btn btn-primary btn-sm px-3" onClick={openAdd}>+ Add Attraction</button>
      </div>

      {msg && <div className="alert alert-success py-2 small mb-3">{msg}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 3000 }}>
          <div className="bg-white rounded-3 shadow-lg p-4" style={{ width: "90%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-bold mb-0">{editing ? "Edit Attraction" : "Add New Attraction"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Name *</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">City *</label>
                  <select className="form-select" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required>
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Category *</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Opening Hours</label>
                  <input className="form-control" placeholder="e.g. 9 AM – 5 PM" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Phone</label>
                  <input className="form-control" placeholder="+92-21-000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Website</label>
                  <input className="form-control" placeholder="https://..." value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Description *</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 px-3">Image</th>
                  <th className="border-0 py-3">Name</th>
                  <th className="border-0 py-3">City</th>
                  <th className="border-0 py-3">Category</th>
                  <th className="border-0 py-3">Rating</th>
                  <th className="border-0 py-3">Reviews</th>
                  <th className="border-0 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attractions.map((a) => (
                  <tr key={a._id}>
                    <td className="px-3 py-2">
                      <img
                        src={a.image && a.image.startsWith("/uploads") ? `http://localhost:4000${a.image}` : a.image || "https://via.placeholder.com/50x50"}
                        alt={a.name}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/50x50"; }}
                      />
                    </td>
                    <td className="py-3 fw-medium">{a.name}</td>
                    <td className="py-3 text-muted">{a.city}</td>
                    <td className="py-3"><span className="badge bg-primary bg-opacity-10 text-primary">{a.category}</span></td>
                    <td className="py-3">⭐ {a.rating || 0}</td>
                    <td className="py-3">{a.reviewCount || 0}</td>
                    <td className="py-3">
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attractions.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p>No attractions yet. Click "Add Attraction" to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageListing;

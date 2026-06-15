import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function ProfilePreference() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({ firstname: "", lastname: "", email: "", phone: "", city: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!token) { navigate("/Login"); return; }
    fetch("http://localhost:4000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { navigate("/Login"); return; }
        setProfile({
          firstname: d.firstname || "",
          lastname: d.lastname || "",
          email: d.email || "",
          phone: d.phone || "",
          city: d.city || "",
          bio: d.bio || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    fetch("http://localhost:4000/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    })
      .then((r) => r.json())
      .then((d) => {
        setSaving(false);
        if (d.success) {
          setSuccess(true);
          localStorage.setItem("userName", profile.firstname + " " + profile.lastname);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError("Failed to save. Try again.");
        }
      })
      .catch(() => { setSaving(false); setError("Server error. Try again."); });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  }

  const initials = ((profile.firstname || "U").charAt(0) + (profile.lastname || "").charAt(0)).toUpperCase();

  if (loading) return (
    <>
      <Header />
      <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />

      {/* Profile Hero */}
      <div className="py-5" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
        <div className="container">
          <div className="d-flex align-items-center gap-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 90, height: 90, background: "linear-gradient(135deg, #007bff, #6610f2)", fontSize: 32, flexShrink: 0 }}
            >
              {initials}
            </div>
            <div>
              <h3 className="text-white fw-bold mb-1">{profile.firstname} {profile.lastname}</h3>
              <p className="text-white opacity-75 mb-0">{profile.email}</p>
              {profile.city && <span className="badge bg-primary mt-1">📍 {profile.city}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="list-group list-group-flush" style={{ borderRadius: 14 }}>
                <button
                  className={`list-group-item list-group-item-action border-0 py-3 px-4 ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  👤 Edit Profile
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 py-3 px-4 ${activeTab === "preferences" ? "active" : ""}`}
                  onClick={() => setActiveTab("preferences")}
                >
                  ⚙️ Preferences
                </button>
                <button
                  className="list-group-item list-group-item-action border-0 py-3 px-4"
                  onClick={() => navigate("/reviews")}
                >
                  ⭐ My Reviews
                </button>
                <button
                  className="list-group-item list-group-item-action border-0 py-3 px-4 text-danger"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {activeTab === "profile" && (
              <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Edit Profile</h5>

                  {success && <div className="alert alert-success py-2 small">✅ Profile updated successfully!</div>}
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <form onSubmit={handleSave}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium small">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.firstname}
                          onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium small">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.lastname}
                          onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium small">Email (read-only)</label>
                        <input type="email" className="form-control bg-light" value={profile.email} readOnly />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium small">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+92-300-1234567"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium small">Home City</label>
                        <select
                          className="form-select"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        >
                          <option value="">-- Select city --</option>
                          {["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium small">Bio</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Tell others a bit about yourself..."
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="submit" className="btn btn-primary px-4 py-2" disabled={saving} style={{ borderRadius: 10 }}>
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Preferences</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium small">Favourite Categories</label>
                      <div className="d-flex flex-wrap gap-2">
                        {["Attractions", "Restaurants", "Hotels", "Museums", "Parks", "Shopping", "Events"].map((cat) => (
                          <div key={cat} className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id={cat} />
                            <label className="form-check-label small" htmlFor={cat}>{cat}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium small">Notification Settings</label>
                      <div className="d-flex flex-column gap-2">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                          <label className="form-check-label small" htmlFor="emailNotif">Email Notifications</label>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="newAttr" defaultChecked />
                          <label className="form-check-label small" htmlFor="newAttr">New Attraction Alerts</label>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="reviewReply" />
                          <label className="form-check-label small" htmlFor="reviewReply">Review Replies</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="btn btn-primary px-4" style={{ borderRadius: 10 }}>Save Preferences</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProfilePreference;

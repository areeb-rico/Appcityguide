import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManageListing from "./manageListing";
import ManageUsers from "./manageUsers";
import ManageReviews from "./manageReviews";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [page, setPage] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, attractions: 0, reviews: 0, cities: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setStats(d); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  }

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "attractions", icon: "🗺️", label: "Attractions" },
    { key: "users", icon: "👥", label: "Users" },
    { key: "reviews", icon: "⭐", label: "Reviews" },
  ];

  const statCards = [
    { label: "Total Users", value: stats.users, icon: "👥", color: "#4361ee", bg: "#eef0fd" },
    { label: "Attractions", value: stats.attractions, icon: "🗺️", color: "#3a0ca3", bg: "#ede7f6" },
    { label: "Reviews", value: stats.reviews, icon: "⭐", color: "#f72585", bg: "#fde8f2" },
    { label: "Cities", value: stats.cities, icon: "🏙️", color: "#4cc9f0", bg: "#e3f8fd" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column"
        style={{
          width: sidebarOpen ? 240 : 70,
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
          transition: "width 0.2s",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowX: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div className="d-flex align-items-center gap-2 p-3 border-bottom border-secondary">
          <span style={{ fontSize: 22, flexShrink: 0 }}>🌐</span>
          {sidebarOpen && <span className="text-white fw-bold" style={{ whiteSpace: "nowrap", fontSize: 15 }}>APP-CITIGUIDE</span>}
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 py-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className="w-100 border-0 d-flex align-items-center gap-3 py-3 px-3 text-start"
              style={{
                background: page === item.key ? "rgba(255,255,255,0.15)" : "transparent",
                color: page === item.key ? "#fff" : "rgba(255,255,255,0.6)",
                borderLeft: page === item.key ? "3px solid #4361ee" : "3px solid transparent",
                transition: "all 0.15s",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={() => navigate("/")}
            className="w-100 border-0 d-flex align-items-center gap-3 py-2 px-1 mb-1 text-start"
            style={{ background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 13, whiteSpace: "nowrap" }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>🏠</span>
            {sidebarOpen && "Back to Site"}
          </button>
          <button
            onClick={handleLogout}
            className="w-100 border-0 d-flex align-items-center gap-3 py-2 px-1 text-start"
            style={{ background: "transparent", color: "#ff6b6b", fontSize: 13, whiteSpace: "nowrap" }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, background: "#f8f9fa" }}>
        {/* Top Bar */}
        <div className="bg-white border-bottom d-flex align-items-center justify-content-between px-4 py-3 sticky-top">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-outline-secondary border-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h6 className="mb-0 fw-bold text-capitalize">{page === "dashboard" ? "Dashboard Overview" : page === "attractions" ? "Manage Attractions" : page === "users" ? "Manage Users" : "Manage Reviews"}</h6>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-danger">Admin</span>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 36, height: 36, background: "#4361ee", cursor: "default" }}
            >A</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 flex-grow-1">
          {page === "dashboard" && (
            <>
              {/* Stat Cards */}
              <div className="row g-4 mb-4">
                {statCards.map((card) => (
                  <div key={card.label} className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
                      <div className="card-body p-4">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{ width: 52, height: 52, background: card.bg, fontSize: 22 }}
                        >
                          {card.icon}
                        </div>
                        <h2 className="fw-bold mb-0" style={{ color: card.color }}>
                          {statsLoading ? <span className="spinner-border spinner-border-sm" /> : card.value}
                        </h2>
                        <p className="text-muted small mb-0">{card.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3">Quick Actions</h6>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-primary text-start d-flex align-items-center gap-2" onClick={() => setPage("attractions")}>
                          🗺️ Add New Attraction
                        </button>
                        <button className="btn btn-outline-primary text-start d-flex align-items-center gap-2" onClick={() => setPage("users")}>
                          👥 View All Users
                        </button>
                        <button className="btn btn-outline-secondary text-start d-flex align-items-center gap-2" onClick={() => setPage("reviews")}>
                          ⭐ Moderate Reviews
                        </button>
                        <button className="btn btn-outline-secondary text-start d-flex align-items-center gap-2" onClick={() => navigate("/")}>
                          🏠 View Public Site
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3">Site Overview</h6>
                      {[
                        { label: "Users", value: stats.users, max: 200, color: "#4361ee" },
                        { label: "Attractions", value: stats.attractions, max: 100, color: "#3a0ca3" },
                        { label: "Reviews", value: stats.reviews, max: 500, color: "#f72585" },
                      ].map((item) => (
                        <div key={item.label} className="mb-3">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="text-muted">{item.label}</span>
                            <span className="fw-medium">{item.value}</span>
                          </div>
                          <div className="progress" style={{ height: 6, borderRadius: 10 }}>
                            <div
                              className="progress-bar"
                              style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%`, background: item.color, borderRadius: 10 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {page === "attractions" && <ManageListing />}
          {page === "users" && <ManageUsers />}
          {page === "reviews" && <ManageReviews />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

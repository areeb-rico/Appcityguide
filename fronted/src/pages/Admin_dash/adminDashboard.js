function AdminDashboard() {
  return (
    <>
      {/* Public CSS link */}
      <link rel="stylesheet" href="/css/AdminDashboard.css" />

      <div className="admin-wrapper">

        {/* Sidebar */}
        <div className="sidebar">
          <h3 className="logo">City Guide Admin</h3>

          <div className="nav flex-column">

            <div className="nav-item active">
              Dashboard
            </div>

            <div className="nav-item">
              Attractions
            </div>

            <div className="nav-item">
              Users
            </div>

            <div className="nav-item">
              Reviews
            </div>

            <div className="nav-item">
              Settings
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="main">

          {/* 🔥 TOP BAR ADDED ONLY */}
          <div className="topbar">

            <h2>Dashboard</h2>

            <div className="topbar-right">

              {/* Notification */}
              <div className="icon">🔔</div>

              {/* Profile */}
              <div className="profile">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                />
                <span>Admin</span>
              </div>

              {/* Logout */}
              <button className="logout-btn">
                Logout
              </button>

            </div>

          </div>

          {/* Cards */}
          <div className="row mt-4 g-4">

            <div className="col-md-3">
              <div className="dashboard-card">
                <h2>120</h2>
                <p>Total Users</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="dashboard-card">
                <h2>80</h2>
                <p>Attractions</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="dashboard-card">
                <h2>540</h2>
                <p>Reviews</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="dashboard-card">
                <h2>12</h2>
                <p>Cities</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;
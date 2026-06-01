function Adminmain (){
    return(
<>
<div className="sidebar-footer">
  <span className="status-dot"></span>
  <span className="sidebar-footer-text">System running smoothly</span>
</div>


<div className="admin-main">
  <nav className="navbar admin-navbar navbar-expand bg-white">
    <div className="container-fluid px-3 px-lg-4">
      <button
        className="sidebar-toggle"
        type="button"
        data-sidebar-toggle
        aria-controls="adminSidebar"
        aria-expanded="true"
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <form className="d-none d-md-flex ms-3 flex-grow-1" role="search">
        <input
          className="form-control search-input"
          type="search"
          placeholder="Search users, orders, reports"
          aria-label="Search"
        />
      </form>

      <div className="navbar-actions ms-auto">
        <button
          className="icon-button theme-toggle"
          type="button"
          data-theme-toggle
          aria-label="Switch color theme"
          title="Switch color theme"
        >
          <i
            className="bi bi-moon-stars"
            data-theme-icon
            aria-hidden="true"
          ></i>
        </button>

        <div className="dropdown">
          <button
            className="icon-button"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Notifications"
          >
            <span className="notification-dot"></span>
            <i className="bi bi-bell" aria-hidden="true"></i>
          </button>

          <div className="dropdown-menu dropdown-menu-end notification-menu">
            <div className="dropdown-header fw-bold text-body">
              Notifications
            </div>

            <a className="dropdown-item" href="users.html">
              <span className="notification-title">
                New user registered
              </span>
              <span className="notification-time">4 minutes ago</span>
            </a>

            <a className="dropdown-item" href="charts.html">
              <span className="notification-title">
                Revenue target reached
              </span>
              <span className="notification-time">32 minutes ago</span>
            </a>

            <a className="dropdown-item" href="settings.html">
              <span className="notification-title">
                Security review completed
              </span>
              <span className="notification-time">1 hour ago</span>
            </a>
          </div>
        </div>

        <div className="dropdown">
          <button
            className="profile-button dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              className="avatar-img avatar-sm"
              src="../assets/images/avatar/avatar.jpg"
              alt="Admin Hasan"
            />
            <span className="profile-name d-none d-sm-inline">
              Admin Hasan
            </span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="profile.html">
                Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="settings.html">
                Account settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="login.html">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <main className="dashboard-content">
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon">
            <i
              className="bi bi-speedometer2"
              aria-hidden="true"
            ></i>
          </span>

          <div>
            <p className="eyebrow mb-1">Overview</p>
            <h1 className="h3 mb-1">Dashboard</h1>
            <p className="text-muted mb-0">
              Monitor performance, sales, users, and support from one clean
              workspace.
            </p>
          </div>
        </div>

        <div className="heading-actions">
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
          >
            <i className="bi bi-download" aria-hidden="true"></i>
            {" "}Export
          </button>

          <button
            className="btn btn-primary btn-sm"
            type="button"
          >
            <i
              className="bi bi-file-earmark-plus"
              aria-hidden="true"
            ></i>
            {" "}Create Report
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
</>
    )
}
export default Adminmain
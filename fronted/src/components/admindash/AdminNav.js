function AdminNav(){
    return(
<>
<div className="admin-shell">
  <div className="sidebar-backdrop" data-sidebar-close></div>

  <aside
    className="admin-sidebar"
    id="adminSidebar"
    aria-label="Main navigation"
  >
    <div className="sidebar-header">
      <a
        className="brand-mark"
        href="index.html"
        aria-label="adminHMD dashboard"
      >
        <span className="brand-icon">
          <i
            className="bi bi-grid-1x2-fill"
            aria-hidden="true"
          ></i>
        </span>

        <span className="brand-copy">
          <span className="brand-title">adminHMD</span>
          <span className="brand-subtitle">Admin Template</span>
        </span>
      </a>
    </div>

    <nav className="sidebar-nav">
      <a
        className="nav-link active"
        href="index.html"
        aria-current="page"
      >
        <span className="nav-icon">
          <i
            className="bi bi-speedometer2"
            aria-hidden="true"
          ></i>
        </span>
        <span className="nav-text">Dashboard</span>
      </a>

      <a className="nav-link" href="users.html">
        <span className="nav-icon">
          <i className="bi bi-people" aria-hidden="true"></i>
        </span>
        <span className="nav-text">Manage Users</span>
      </a>

      <a className="nav-link" href="add-user.html">
        <span className="nav-icon">
          <i className="bi bi-person-plus" aria-hidden="true"></i>
        </span>
        <span className="nav-text">Manage Listing</span>
      </a>

      <a className="nav-link" href="profile.html">
        <span className="nav-icon">
          <i className="bi bi-person-badge" aria-hidden="true"></i>
        </span>
        <span className="nav-text">Manage Reviews</span>
      </a>
    </nav>
  </aside>
</div>
</>
    )
}
export default AdminNav
import { useState, useEffect } from "react";

function ManageUsers() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { loadUsers(); }, []);

  function loadUsers() {
    setLoading(true);
    fetch("http://localhost:4000/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setUsers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    fetch(`http://localhost:4000/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => { setMsg("User deleted."); setTimeout(() => setMsg(""), 2000); loadUsers(); });
  }

  const filtered = users.filter((u) =>
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.firstname || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.lastname || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Manage Users</h4>
          <small className="text-muted">{users.length} registered users</small>
        </div>
        <input
          type="text"
          className="form-control w-auto"
          placeholder="🔍 Search users..."
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
                  <th className="border-0 py-3">Email</th>
                  <th className="border-0 py-3">Role</th>
                  <th className="border-0 py-3">City</th>
                  <th className="border-0 py-3">Joined</th>
                  <th className="border-0 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td className="px-3 py-3 text-muted small">{i + 1}</td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{ width: 36, height: 36, background: u.role === "admin" ? "#dc3545" : "#007bff", fontSize: 13, flexShrink: 0 }}
                        >
                          {(u.firstname || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-medium">{(u.firstname || "") + " " + (u.lastname || "") || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted">{u.email}</td>
                    <td className="py-3">
                      <span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-success"}`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 text-muted">{u.city || "—"}</td>
                    <td className="py-3 text-muted small">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3">
                      {u.role !== "admin" && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u._id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-5 text-muted">
                {search ? `No users matching "${search}"` : "No users found."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;

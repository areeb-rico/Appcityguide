import { Navigate } from 'react-router-dom';

function getRole() {
  return localStorage.getItem("userRole");
}

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// ── AdminGuard ────────────────────────────────────────────────
// Only admins can enter.
// Guest → /Login | User (non-admin) → /
export function AdminGuard({ children }) {
  if (!isLoggedIn()) return <Navigate to="/Login" replace />;
  if (getRole() !== "admin") return <Navigate to="/" replace />;
  return children;
}

// ── UserGuard ─────────────────────────────────────────────────
// Only logged-in regular users can enter.
// Guest → /Login | Admin → /admindash
export function UserGuard({ children }) {
  if (!isLoggedIn()) return <Navigate to="/Login" replace />;
  if (getRole() === "admin") return <Navigate to="/admindash" replace />;
  return children;
}

// ── GuestGuard ────────────────────────────────────────────────
// Only guests (not logged in) can enter (Login, Register pages).
// User → / | Admin → /admindash
export function GuestGuard({ children }) {
  if (isLoggedIn()) {
    if (getRole() === "admin") return <Navigate to="/admindash" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

// Keep default export for any existing usage
export default AdminGuard;

import { Link } from "react-router-dom";
import "../styles/main.css"; // uses same CSS as rest of the site

export default function NotAuthorized() {
  return (
    <div>
      {/* ===== Header ===== */}
      <div className="header">
        <div className="logo">
          <img
            src="/images/UMBC-primary-logo-CMYK-on-black.png"
            alt="UMBC Logo"
          />
        </div>
      </div>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <p>College of Engineering and Information Technology</p>
        <br />
        <h1>Department of Computer Science and Electrical Engineering</h1>
      </div>

      <div className="blackbar"></div>

      {/* ===== Content ===== */}
      <div className="main-container">
        <div
          className="content-wrapper"
          style={{ textAlign: "center", padding: "60px 40px" }}
        >
          <h1 className="page-title">Access Denied</h1>

          <p style={{ fontSize: 20, marginBottom: 20, color: "#333" }}>
            You do not have permission to view this page.
          </p>

          <p style={{ fontSize: 16, marginBottom: 40, color: "gray" }}>
            Only faculty members are authorized to access these administration tools.
          </p>

          <Link to="/" style={{ textDecoration: "none" }}>
            <button
              className="btn"
              style={{
                background: "#2C2C2C",
                color: "white",
                padding: "12px 26px",
                borderRadius: 8,
                fontSize: 18,
                cursor: "pointer",
                border: "none",
              }}
            >
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

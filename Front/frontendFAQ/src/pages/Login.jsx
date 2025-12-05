import styles from "../styles/login.module.css";
import { useState } from "react";
import { auth, provider } from "../firebase/firebase"
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [statusText, setStatusText] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();

    const res = await fetch("http://127.0.0.1:8000/secure-data", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      // user is authorized → navigate to /faculty
      navigate("/faculty");
    } else {
      const data = await res.json();
      alert(data.detail || "Access denied");
      await signOut(auth);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setStatusText("Logged out");
    setLoggedIn(false);
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.leftSection}>
        <div className={styles.loginContainer}>
          <div className={styles.header}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <img src="../images/department-lockup.png" alt="UMBC Shield" />
              </div>
            </div>

            <div className={styles.pageTitle}>
              CSEE FAQ / Triage Faculty Tools
            </div>
            <h2 className={styles.formTitle}>Faculty Log In</h2>
          </div>

           <div className={styles.loginControls}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "10px" // optional spacing between button and status
            }}
           >
            {!loggedIn ? (
              <button className="btn"
              style={{
                background: "#2C2C2C",
                color: "white",
                padding: "12px 26px",
                borderRadius: 8,
                fontSize: 18,
                cursor: "pointer",
                border: "none",
              }} onClick={handleLogin}>
                Login
              </button>
            ) : (
              <button className={"btn"} style={{
                background: "#2C2C2C",
                color: "white",
                padding: "12px 26px",
                borderRadius: 8,
                fontSize: 18,
                cursor: "pointer",
                border: "none",
              }} onClick={handleLogout}>
                Logout
              </button>
            )}
            <p>{statusText}</p>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        SOME <br />
        UMBC <br />
        PIC
      </div>
    </div>
  );
}

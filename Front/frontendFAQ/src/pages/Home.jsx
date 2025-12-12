import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "../styles/main.css";

export default function Home() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load FAQs on mount
  useEffect(() => {
    async function loadFaqs() {
      try {
        setLoading(true);
        const data = await api.getAllFaqs();
        // Initialize with expanded: false
        const initializedData = data.map(f => ({ ...f, expanded: false }));
        setFaqs(initializedData);
        setFilteredFaqs(initializedData);
      } catch (err) {
        console.error("Error loading FAQs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  // Search handler
  const handleSearch = (term) => {
    if (!term || term.trim() === "") {
      setFilteredFaqs(faqs); // reset to all FAQs if search is empty
      return;
    }

    const search = term.toLowerCase();
    const results = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(search) ||
        f.answer.toLowerCase().includes(search) ||
        (f.tags && f.tags.join(" ").toLowerCase().includes(search))
    );

    setFilteredFaqs(results);
  };

  // Toggle FAQ expand/collapse
  const toggleExpand = (index) => {
    setFilteredFaqs((prev) =>
      prev.map((faq, i) =>
        i === index ? { ...faq, expanded: !faq.expanded } : faq
      )
    );
  };

  // --- Chip Styling (Consistent with Admin Dashboard) ---
  const chipStyle = {
    backgroundColor: "#e0e0e0",
    padding: "4px 10px",
    borderRadius: "16px",
    fontSize: "13px",
    color: "#333",
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "500"
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="header" style={{ justifyContent: "space-between" }}>
        <div className="logo">
          <img src="/images/UMBC-primary-logo-CMYK-on-black.png" alt="UMBC Logo" />
        </div>

        <div className="login-nav">
          <Link to="/login" style={{ textDecoration: "none" }}>
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
              Login
            </button>
          </Link>
        </div>
      </div>

      <div className="breadcrumb">
        <p>College of Engineering and Information Technology</p>
        <br />
        <h1>Department of Computer Science and Electrical Engineering</h1>
      </div>

      <div className="blackbar"></div>

      {/* ===== Main Content ===== */}
      <div className="main-container">
        <div className="content-wrapper">
          <h1 className="page-title">CSEE Support</h1>
          <p style={{ textAlign: "center", marginBottom: 40, fontSize: 20, fontWeight: 500 }}>
            How can we help you?
          </p>

          {/* ===== Search Section ===== */}
          <div className="main-search-section">
            <SearchBar onChange={handleSearch} />
          </div>

          <p className="section-header" style={{ fontSize: 20 }}>
            Frequently Asked Questions
          </p>
          <p style={{ color: "gray", fontSize: 14 }}>Search for answers above!</p>
          <br />

          {/* ===== FAQ List ===== */}
          <div className="faq-section expanded">
            <div className="faq-content">
              {loading ? (
                <p>Loading FAQs...</p>
              ) : filteredFaqs.length === 0 ? (
                <p>No FAQs found.</p>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.id || index}
                    className={`faq-item ${faq.expanded ? "expanded" : ""}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => toggleExpand(index)}
                    >
                      <span className="question-text" style={{ fontWeight: "bold" }}>
                        {faq.question}
                      </span>
                      <i className="fa-solid fa-chevron-down dropdown-icon"></i>
                    </div>
                    
                    {faq.tags && faq.tags.length > 0 && (
                      <div style={{ 
                        padding: "0 24px 12px 24px", 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: "8px" 
                      }}>
                        {faq.tags.map((tag, tIndex) => (
                          <span key={tIndex} style={chipStyle}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="faq-answer">
                      <p style={{ lineHeight: "1.7" }}>{faq.answer}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
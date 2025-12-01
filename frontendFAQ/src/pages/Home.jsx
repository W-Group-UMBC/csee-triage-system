import { useEffect, useState } from "react";
import { api } from "../api/api";
import SearchBar from "../components/SearchBar";
import "../styles/main.css";

export default function Home() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAllFaqs();
        setFaqs(data);
        setFilteredFaqs(data);
      } catch (err) {
        console.error("Error loading FAQs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // search handler
  const handleSearch = (term) => {
    if (!term || term.trim() === "") {
      setFilteredFaqs(faqs);
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

  // toggle FAQ expand
  const toggleExpand = (id) => {
    setFilteredFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
      )
    );
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <>
        <div class="header">
          <div class="logo">
              <img src="/images/UMBC-primary-logo-CMYK-on-black.png" alt="UMBC Logo" />
          </div>
        </div>

      <div class="breadcrumb">
          <p>College of Engineering and Information Technology</p>
          <br />
          <h1>Department of Computer Science and Electrical Engineering</h1>
      </div>

    <div class="blackbar"></div>
    </>

      {/* ===== Main Content ===== */}
      <div className="main-container">
        <div className="content-wrapper">
          <h1 className="page-title">CSEE Support</h1>
          <p style={{ textAlign: "center", marginBottom: 40, fontSize: 20, fontWeight: 500 }}>
            How can we help you?
          </p>

          {/* ===== Search Section ===== */}
          
          <div className="main-search-section">
            <SearchBar onSearch={handleSearch} />
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
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`faq-item ${faq.expanded ? "expanded" : ""}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => toggleExpand(faq.id)}
                    >
                      <span className="question-text">{faq.question}</span>
                      <i className="fa-solid fa-chevron-down dropdown-icon"></i>
                    </div>

                    <div className="faq-answer">
                      <p>{faq.answer}</p>
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

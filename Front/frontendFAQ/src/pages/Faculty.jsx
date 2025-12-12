import { useEffect, useState } from "react";
import { api } from "../api/api";
import { auth } from "../firebase/firebase";
import AddFaqForm from "../components/AddFaqForm";
import SearchBar from "../components/SearchBar";
import "../styles/faculty.css";

export default function Faculty() {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load user + FAQ data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        await api.checkAccess();

        // Fetch FAQ data
        const data = await api.getAllFaqs();

        // Add expanded property (kept for consistency with data structure)
        const enriched = data.map((faq) => ({ ...faq, expanded: false }));

        setFaqs(enriched);
        setAuthorized(true);
      } catch (err) {
        console.error("Faculty access denied:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirect unauthorized users
  if (authorized === false && !loading) {
    window.location.href = "/login";
    return null;
  }

  if (loading || authorized === null) {
    return <p className="loading">Loading...</p>;
  }

  // Filtered FAQs
  const filteredFaqs = faqs.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      f.question.toLowerCase().includes(term) ||
      f.answer.toLowerCase().includes(term) ||
      (f.tags && f.tags.join(" ").toLowerCase().includes(term))
    );
  });

  // Add FAQ handler
  const handleAddFaq = async (faqData) => {
    try {
      await api.addFaq(faqData);

      const updated = await api.getAllFaqs();
      const enriched = updated.map((faq) => ({ ...faq, expanded: false }));

      setFaqs(enriched);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding FAQ:", err);
      alert("Failed to add FAQ.");
    }
  };

  // Delete FAQ handler
  const handleDeleteFaq = async (faqId) => {
    try {
      await api.deleteFaq(faqId);
      setFaqs((prev) => prev.filter((f) => f.id !== faqId));
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      alert("Failed to delete FAQ.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="logo">
          <img src="/images/UMBC-primary-logo-CMYK-on-black.png" alt="UMBC Logo" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="#">COIT</a> / <a href="#">CSEE</a> / <a href="#">CSEE FAQ</a> / Admin Tools
      </div>

      {/* Main Layout */}
      <div className="main-container">
        <div className="content-wrapper">
          <h1 className="faculty-page-title">Admin Tools</h1>

          {/* Search + Add Section */}
          <div className="FAQ-search-section">
            <div className="section-text">
              <h3>Frequently Asked Questions</h3>

              <button className="add-faq-btn" onClick={() => setShowAddForm((prev) => !prev)}>
                Add a question
              </button>
            </div>

            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Add Form */}
          {showAddForm && (
            <AddFaqForm onCancel={() => setShowAddForm(false)} onSubmit={handleAddFaq} />
          )}

          {/* FAQ List */}
          <div className="faq-section expanded">
            <div className="faq-content">
              {filteredFaqs.length === 0 ? (
                <p>No FAQs found.</p>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="faq-item"
                    style={{ cursor: "default" }}
                  >
                    <div className="item-actions">
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteFaq(faq.id)}
                      >
                        <i className="fa-solid fa-trash" style={{ fontSize: "20px" }}></i>
                      </button>
                    </div>

                    {/* Question Header (No longer clickable) */}
                    <div className="faq-question" style={{ cursor: "text" }}>
                      <span className="question-text" style={{ fontWeight: "bold" }}>
                        {faq.question}
                      </span>
                    </div>

                    {/* Tags (Always visible) */}
                    {faq.tags && faq.tags.length > 0 && (
                      <div className="faq-tags" style={{ maxHeight: "none", padding: "0 24px 10px 24px" }}>
                        <p>Tags: {faq.tags.join(", ")}</p>
                      </div>
                    )}

                    {/* Answer (Always visible) */}
                    <div className="faq-answer" style={{ maxHeight: "none", padding: "0 24px 24px 24px" }}>
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
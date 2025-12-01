import { useEffect, useState } from "react";
import { api } from "../api/api";
import AddFaqForm from "../components/AddFaqForm";
import FaqList from "../components/FaqList";
import SearchBar from "../components/SearchBar";
import "../styles/faculty.css";

export default function Faculty() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load FAQs + Check faculty authorization
  useEffect(() => {
    async function init() {
      try {
        await api.checkAccess(); // ensure user is faculty
        const data = await api.getAllFaqs();
        setFaqs(data);
        setFilteredFaqs(data);
      } catch (err) {
        console.error("Faculty access denied:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (!authorized) {
    window.location.href = "/not-authorized";
    return null;
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  // Handle search filtering
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredFaqs(faqs);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(term) ||
        f.answer.toLowerCase().includes(term) ||
        (f.tags && f.tags.join(" ").toLowerCase().includes(term))
    );

    setFilteredFaqs(results);
  };

  // Add new FAQ
  const handleAddFaq = async (faqData) => {
    try {
      await api.addFaq(faqData);

      // Reload
      const updated = await api.getAllFaqs();
      setFaqs(updated);
      setFilteredFaqs(updated);

      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding FAQ:", err);
      alert("Failed to add FAQ. Check console.");
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (faqId) => {
    try {
      await api.deleteFaq(faqId);
      const updated = faqs.filter((f) => f.id !== faqId);
      setFaqs(updated);
      setFilteredFaqs(updated);
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      alert("Failed to delete FAQ.");
    }
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="header">
        <div className="logo">
          <img src="/images/UMBC-primary-logo-CMYK-on-black.png" alt="UMBC Logo" />
        </div>
      </div>

      {/* ===== Breadcrumb ===== */}
      <div className="breadcrumb">
        <a href="#">COIT</a> / <a href="#">CSEE</a> / <a href="#">CSEE FAQ</a> / Admin Tools
      </div>

      {/* ===== Main Content ===== */}
      <div className="main-container">
        <div className="content-wrapper">
          <h1 className="faculty-page-title">Admin Tools</h1>

          <div className="FAQ-search-section">
            {/* FAQ Text + Add button */}
            <div className="section-text">
              <h3>Frequently Asked Questions</h3>

              <button
                className="add-faq-btn"
                onClick={() => setShowAddForm((prev) => !prev)}
              >
                Add a question
              </button>
            </div>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* ===== Add FAQ Form ===== */}
          {showAddForm && (
            <AddFaqForm
              onCancel={() => setShowAddForm(false)}
              onSubmit={handleAddFaq}
            />
          )}

          {/* ===== FAQ List ===== */}
          <FaqList faqs={filteredFaqs} onDelete={handleDeleteFaq} />
        </div>
      </div>
    </div>
  );
}

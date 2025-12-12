import { useState } from "react";

export default function AddFaqForm({ onSubmit, onCancel }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  // TAGS STATE: Initialize as empty array
  const [tags, setTags] = useState([]);
  // INPUT STATE: Temporary state for the tag currently being typed
  const [currentTagInput, setCurrentTagInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return alert("Please fill all fields");

    const newFaq = {
      question,
      answer,
      tags: tags, // Send array directly
      faculty: "CSEE Department", 
      index: null
    };

    // Call the parent handler (which calls the API)
    await onSubmit(newFaq);

    // Reset fields
    setQuestion("");
    setAnswer("");
    setTags([]);
    setCurrentTagInput("");
  };

  // --- Tag Logic (Matches AdminFaqItem) ---
  const handleAddTag = (e) => {
    e.preventDefault(); // Prevent form submission
    const val = currentTagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setCurrentTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  // --- Styles (Matches AdminFaqItem) ---
  const chipStyle = {
    backgroundColor: "#e0e0e0",
    padding: "4px 10px",
    borderRadius: "16px",
    fontSize: "14px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#F2F2F2",
    fontSize: "16px",
    fontFamily: "inherit",
    color: "#474747"
  };

  return (
    <div className="add-faq-form show">
      <h3>Add a New Question</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input
            type="text"
            placeholder="Type question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            />
        </div>
        
        <div className="form-group">
            <textarea
            placeholder="Type answer"
            rows="4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            />
        </div>

        {/* --- Tags Section --- */}
        <div className="form-group">
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Tags</label>
            
            {/* Chips Container */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              {tags.map((tag, index) => (
                <span key={index} style={chipStyle}>
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#666",
                      padding: "0",
                      lineHeight: "1",
                      marginLeft: "2px"
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={currentTagInput}
                onChange={(e) => setCurrentTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type tag and press Enter"
                style={{ ...inputStyle, marginBottom: 0 }} 
              />
              <button 
                type="button"
                onClick={handleAddTag}
                style={{
                  height: "45px",
                  width: "45px",
                  fontSize: "24px",
                  cursor: "pointer",
                  backgroundColor: "#e0e0e0",
                  border: "none",
                  borderRadius: "4px",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#333"
                }}
              >
                +
              </button>
            </div>
        </div>

        <div className="form-buttons">
          <button className="btn add" type="submit">Add</button>
          <button className="btn cancel" onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
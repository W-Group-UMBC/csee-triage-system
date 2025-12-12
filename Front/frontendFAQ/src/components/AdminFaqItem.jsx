import { useState } from "react";

export default function AdminFaqItem({ faq, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // State for the form fields
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  
  // TAGS STATE: Store as an array for the chips
  const [tags, setTags] = useState(faq.tags || []);
  // INPUT STATE: Temporary state for the tag currently being typed
  const [currentTagInput, setCurrentTagInput] = useState("");

  const handleSave = () => {
    const updatedData = {
      question,
      answer,
      tags: tags, // Send the array directly
      faculty: faq.faculty || "CSEE Department",
      index: faq.index !== undefined && faq.index !== null ? faq.index : null
    };
    
    onUpdate(faq.id, updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setTags(faq.tags || []);
    setCurrentTagInput("");
    setIsEditing(false);
  };

  // --- Tag Logic ---
  const handleAddTag = (e) => {
    e.preventDefault(); 
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

  // --- Styles ---
  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#F2F2F2",
    fontSize: "16px",
    fontFamily: "inherit",
    color: "#474747",
    marginBottom: "15px"
  };
  
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "bold" };

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

  return (
    <div className="faq-item" style={{ cursor: "default", position: "relative" }}>
      
      {/* --- Action Buttons (Top Right) --- */}
      <div className="item-actions" style={{ display: "flex", gap: "8px", position: "absolute", top: "24px", right: "24px" }}>
        {!isEditing && (
          <>
            <button 
                className="action-btn edit-btn" 
                onClick={() => setIsEditing(true)}
                title="Edit"
                style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <i className="fa-solid fa-pen" style={{ fontSize: "18px", color: "#666" }}></i>
            </button>
            <button 
                className="action-btn delete-btn" 
                onClick={() => onDelete(faq.id)}
                title="Delete"
                style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <i className="fa-solid fa-trash" style={{ fontSize: "18px", color: "#d9534f" }}></i>
            </button>
          </>
        )}
      </div>

      {/* --- View Mode --- */}
      {!isEditing && (
        <>
          <div className="faq-question" style={{ cursor: "text", userSelect: "text", paddingRight: "100px" }}>
            <span className="question-text" style={{ fontWeight: "bold", fontSize: "20px" }}>
              {faq.question}
            </span>
          </div>

          {/* VIEW MODE CHIPS: Same style, no 'x' button */}
          <div 
            className="faq-tags" 
            style={{ 
              maxHeight: "none", 
              overflow: "visible", 
              padding: "0 24px 10px 24px", 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "8px" 
            }}
          >
            {faq.tags && faq.tags.map((tag, index) => (
              <span key={index} style={chipStyle}>
                {tag}
              </span>
            ))}
          </div>

          <div 
            className="faq-answer" 
            style={{ maxHeight: "none", overflow: "visible", padding: "0 24px 24px 24px" }}
          >
            <p style={{ margin: 0, lineHeight: "1.5" }}>{faq.answer}</p>
          </div>
        </>
      )}

      {/* --- Edit Mode --- */}
      {isEditing && (
        <div style={{ padding: "24px" }}>
          <h3 style={{ marginBottom: "20px", marginTop: 0 }}>Edit Question</h3>
          
          {/* Question */}
          <label style={labelStyle}>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={inputStyle}
          />

          {/* Tags */}
          <label style={labelStyle}>Tags</label>
          <div style={{ marginBottom: "15px" }}>
            
            {/* Chips Container */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              {tags.map((tag, index) => (
                <span key={index} style={chipStyle}>
                  {tag}
                  <button 
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

          {/* Answer */}
          <label style={labelStyle}>Answer</label>
          <textarea
            rows="5"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
            <button 
                onClick={handleCancel} 
                className="btn cancel"
                style={{ backgroundColor: "#2C2C2C", color: "#F5F5F5", padding: "12px 24px", border: "1px solid #2C2C2C" }}
            >
              Cancel
            </button>
            <button 
                onClick={handleSave} 
                className="btn add"
                style={{ backgroundColor: "#2C2C2C", color: "#F5F5F5", padding: "12px 24px", border: "1px solid #2C2C2C" }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
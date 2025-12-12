import { useState } from "react";

// Updated props: 'onSubmit' matches what Faculty.jsx passes down
export default function AddFaqForm({ onSubmit, onCancel }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return alert("Please fill all fields");

    const newFaq = {
      question,
      answer,
      // Convert "tag1, tag2" string into ["tag1", "tag2"] array
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(t => t !== ""),
      faculty: "CSEE Department", 
      index: null
    };

    // Call the parent handler (which calls the API)
    await onSubmit(newFaq);

    // Reset fields
    setQuestion("");
    setAnswer("");
    setTags("");
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

        <div className="form-group">
            <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            />
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
// components/AddFaqForm.jsx
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function AddFaqForm({ onAdded }) {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return alert("Please fill all fields");

    await addDoc(collection(db, "faq"), {
      question,
      answer,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()),
      faculty: "CSEE Department",
    });

    onAdded();
    setShow(false);
    setQuestion("");
    setAnswer("");
    setTags("");
  };

  return (
    <>
      <button className="add-faq-btn" onClick={() => setShow(!show)}>
        Add a question
      </button>

      {show && (
        <div className="add-faq-form show">
          <h3>Add a New Question</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <textarea
              placeholder="Type answer"
              rows="4"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <div className="form-buttons">
              <button className="btn add" type="submit">Add</button>
              <button className="btn cancel" onClick={() => setShow(false)} type="button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

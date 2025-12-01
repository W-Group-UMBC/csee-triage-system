// components/FaqItem.jsx
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function FaqItem({ faq, onDelete }) {
  const handleDelete = async () => {
    if (!confirm("Delete this FAQ?")) return;

    await deleteDoc(doc(db, "faq", faq.id));
    onDelete(faq.id);
  };

  return (
    <div className="faq-item">
      <div className="item-actions">
        <button title="Edit" className="action-btn">✎</button>
        <button title="Delete" className="action-btn" onClick={handleDelete}>🗑</button>
      </div>

      <div className="question">{faq.question}</div>
      <div className="answer">{faq.answer}</div>
    </div>
  );
}

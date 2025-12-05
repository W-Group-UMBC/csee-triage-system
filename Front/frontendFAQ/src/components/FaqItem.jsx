import { useState } from "react";

export default function FaqItem({ faq, adminMode, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <h4>{faq.question}</h4>

        {adminMode && (
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </button>
        )}
      </div>

      {open && (
        <div className="faq-answer">
          <p>{faq.answer}</p>
          {faq.tags?.length > 0 && (
            <div className="tags">
              {faq.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// components/FaqList.jsx
import FaqItem from "./FaqItem";

export default function FaqList({ faqs = [], onDelete, adminMode = false }) {
  return (
    <div className="faq-content">
      {faqs.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        faqs.map((faq) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            onDelete={onDelete}
            adminMode={adminMode}
          />
        ))
      )}
    </div>
  );
}

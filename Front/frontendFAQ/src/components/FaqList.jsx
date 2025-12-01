// components/FaqList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import FaqItem from "./FaqItem";

export default function FaqList({ search }) {
  const [faqs, setFaqs] = useState([]);

  async function loadFaqs() {
    const snapshot = await getDocs(collection(db, "faq"));
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setFaqs(list);
  }

  useEffect(() => {
    loadFaqs();
  }, []);

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faq-content">
      {filtered.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        filtered.map((faq) => (
          <FaqItem key={faq.id} faq={faq} onDelete={loadFaqs} />
        ))
      )}
    </div>
  );
}

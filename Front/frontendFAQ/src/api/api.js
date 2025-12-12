// src/api/api.js

import { auth } from "../firebase/firebase"; // adjust path as needed

export const api = {
 checkAccess: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const token = await user.getIdToken(true); // refresh token to ensure it's valid

    const res = await fetch("http://127.0.0.1:8000/check-access", {
      headers: {
        Authorization: `Bearer ${token}`, // <-- send token here
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Access denied");
    }

    return await res.json();
  },
  
  getAllFaqs: async () => {
    const response = await fetch("http://127.0.0.1:8000/public/faqs");
    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
    }
    return response.json();
  },

  addFaq: async (faqData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    const token = await user.getIdToken();

    const response = await fetch("http://127.0.0.1:8000/faq/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(faqData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to add FAQ");
    }
    return response.json();
  },

  deleteFaq: async (faqId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    const token = await user.getIdToken();

    const response = await fetch(`http://127.0.0.1:8000/faq/${faqId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete FAQ");
    }
    return response.json();
  }
};

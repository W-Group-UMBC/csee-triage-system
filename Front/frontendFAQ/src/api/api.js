import { auth } from "../firebase/firebase";

const API_URL = "http://127.0.0.1:8000"; // Ensure this matches your backend port

export const api = {
  checkAccess: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const token = await user.getIdToken(true);

    const res = await fetch(`${API_URL}/check-access`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Access denied");
    }

    return await res.json();
  },
  
  getAllFaqs: async () => {
    const response = await fetch(`${API_URL}/public/faqs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
    }
    return response.json();
  },

  addFaq: async (faqData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/faq/add`, {
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

  updateFaq: async (faqId, faqData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    
    // Fixed: Was previously 'constSB_token' by mistake
    const token = await user.getIdToken(); 

    const response = await fetch(`${API_URL}/faq/${faqId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(faqData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update FAQ");
    }
    return response.json();
  },

  deleteFaq: async (faqId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/faq/${faqId}`, {
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
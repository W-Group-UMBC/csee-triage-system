export const api = {
  checkAccess: () => authFetch("/secure-data"),
  getAllFaqs: () => authFetch("/faqs"),
  getFaq: (id) => authFetch(`/faq/${id}`),
  getFaqsByTag: (tag) => authFetch(`/faqs/tag/${tag}`),
  addFaq: (faq) =>
    authFetch("/faq/add", {
      method: "POST",
      body: JSON.stringify(faq),
    }),
};

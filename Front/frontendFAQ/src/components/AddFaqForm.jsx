export default function AddFaqForm({ onSubmit, onCancel }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return alert("Please fill all fields");

    // Construct the data object
    const newFaq = {
      question,
      answer,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()),
      faculty: "CSEE Department", // Hardcoded or dynamic based on user
      index: null
    };

    // Pass data to parent instead of writing to DB directly
    await onSubmit(newFaq);

    // Reset form
    setQuestion("");
    setAnswer("");
    setTags("");
  };

  return (
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
          <button className="btn cancel" onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
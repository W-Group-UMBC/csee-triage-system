// components/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-container">
      <input
        type="search"
        placeholder="Search Questions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

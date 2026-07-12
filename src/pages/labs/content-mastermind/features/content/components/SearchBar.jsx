export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar contenido..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
    />
  );
}
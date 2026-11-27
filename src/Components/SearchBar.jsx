/**
 * Controlled search input for filtering recipes by title in real time.
 */
export default function SearchBar({
  value,
  onChange,
  onClear,
  disabled = false,
  placeholder = 'Search recipes by title...',
}) {
  return (
    <div className="search-input-group">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
      {value && (
        <button
          type="button"
          className="clear-search-button"
          onClick={onClear}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </div>
  )
}

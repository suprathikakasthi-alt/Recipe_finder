import HeartIcon from './HeartIcon'

/**
 * Header badge showing total saved recipes and toggling the favorites view.
 */
export default function FavoritesBadge({
  savedCount,
  isActive = false,
  onToggle,
}) {
  return (
    <button
      type="button"
      className={`saved-count-pill ${isActive ? 'is-active' : ''}`}
      onClick={onToggle}
      aria-pressed={isActive}
      aria-live="polite"
      title={isActive ? 'Show all recipes' : 'Filter to saved favorites'}
    >
      <HeartIcon filled={savedCount > 0} />
      <span>Saved: {savedCount}</span>
    </button>
  )
}

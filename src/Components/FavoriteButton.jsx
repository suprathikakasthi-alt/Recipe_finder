import HeartIcon from './HeartIcon'

/**
 * Heart toggle button for saving or unsaving an individual recipe.
 */
export default function FavoriteButton({
  isFavorite = false,
  recipeName = 'recipe',
  onToggle,
}) {
  return (
    <button
      type="button"
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove ${recipeName} from favorites`
          : `Save ${recipeName} to favorites`
      }
      title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  )
}

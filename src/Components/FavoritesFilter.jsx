/**
 * Filter tabs to switch between all recipes and saved favorites.
 */
export default function FavoritesFilter({
  showFavoritesOnly,
  savedCount,
  onChangeView,
}) {
  return (
    <div className="filter-tabs" role="group" aria-label="Recipe view">
      <button
        type="button"
        className={`filter-tab ${!showFavoritesOnly ? 'is-active' : ''}`}
        onClick={() => onChangeView(false)}
      >
        All Recipes
      </button>
      <button
        type="button"
        className={`filter-tab ${showFavoritesOnly ? 'is-active' : ''}`}
        onClick={() => onChangeView(true)}
      >
        Favorites ({savedCount})
      </button>
    </div>
  )
}

import FavoriteButton from './FavoriteButton'

const DIFFICULTY_CLASS_MAP = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
}

/**
 * Displays a single recipe summary inside the responsive grid.
 */
export default function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
}) {
  const totalMinutes =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)
  const difficultyKey = (recipe.difficulty ?? '').toLowerCase()
  const difficultyClass = DIFFICULTY_CLASS_MAP[difficultyKey] ?? 'badge-neutral'
  const mealTypes = Array.isArray(recipe.mealType) ? recipe.mealType : []

  return (
    <article className="recipe-card">
      <div className="recipe-image-wrapper">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="recipe-image"
          loading="lazy"
        />
        {recipe.cuisine && (
          <span className="cuisine-badge">{recipe.cuisine}</span>
        )}
        {onToggleFavorite && (
          <FavoriteButton
            isFavorite={isFavorite}
            recipeName={recipe.name}
            onToggle={() => onToggleFavorite(recipe.id)}
          />
        )}
      </div>

      <div className="recipe-body">
        <div className="recipe-top-meta">
          {recipe.difficulty && (
            <span className={`difficulty-badge ${difficultyClass}`}>
              {recipe.difficulty}
            </span>
          )}
          {typeof recipe.rating === 'number' && (
            <span
              className="recipe-rating"
              aria-label={`Rated ${recipe.rating} out of 5`}
            >
              <span aria-hidden="true">★</span> {recipe.rating.toFixed(1)}
              {typeof recipe.reviewCount === 'number' && (
                <span className="review-count">({recipe.reviewCount})</span>
              )}
            </span>
          )}
        </div>

        <h2 className="recipe-title">{recipe.name}</h2>

        <dl className="recipe-stats">
          <div className="stat-item">
            <dt>Time</dt>
            <dd>{totalMinutes} min</dd>
          </div>
          <div className="stat-item">
            <dt>Servings</dt>
            <dd>{recipe.servings ?? '—'}</dd>
          </div>
          <div className="stat-item">
            <dt>Calories</dt>
            <dd>
              {recipe.caloriesPerServing
                ? `${recipe.caloriesPerServing} kcal`
                : '—'}
            </dd>
          </div>
        </dl>

        {mealTypes.length > 0 && (
          <div className="recipe-tags" aria-label="Meal types">
            {mealTypes.slice(0, 3).map((type) => (
              <span key={type} className="meal-tag">
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

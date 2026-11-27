import { useEffect, useState } from 'react'
import axios from 'axios'
import FavoritesBadge from './Components/FavoritesBadge'
import FavoritesFilter from './Components/FavoritesFilter'
import RecipeCard from './Components/RecipeCard'
import SearchBar from './Components/SearchBar'
import './App.css'

const RECIPES_API_URL = 'https://dummyjson.com/recipes?limit=20'
const FAVORITES_STORAGE_KEY = 'recipe-finder:favorites'
const SKELETON_COUNT = 8

function readStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteIds, setFavoriteIds] = useState(readStoredFavorites)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
    } catch {
      // Ignore storage write errors in restricted browsing environments.
    }
  }, [favoriteIds])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecipes() {
      try {
        const response = await axios.get(RECIPES_API_URL, {
          signal: controller.signal,
        })
        const fetchedRecipes = response.data?.recipes
        setRecipes(Array.isArray(fetchedRecipes) ? fetchedRecipes : [])
        setError('')
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          return
        }
        setError('Could not load recipes right now. Please try again.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadRecipes()

    return () => controller.abort()
  }, [reloadKey])

  function handleRetry() {
    setLoading(true)
    setError('')
    setReloadKey((prev) => prev + 1)
  }

  function handleToggleFavorite(recipeId) {
    setFavoriteIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    )
  }

  const favoriteIdSet = new Set(favoriteIds)
  const savedCount = recipes.filter((recipe) =>
    favoriteIdSet.has(recipe.id),
  ).length
  const totalSavedCount = loading ? favoriteIds.length : savedCount

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredRecipes = recipes.filter((recipe) => {
    if (showFavoritesOnly && !favoriteIdSet.has(recipe.id)) {
      return false
    }
    if (normalizedQuery) {
      return (recipe.name ?? '').toLowerCase().includes(normalizedQuery)
    }
    return true
  })

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-content">
          <p className="eyebrow">Curated Kitchen Collection</p>
          <h1>Recipe Finder</h1>
          <p className="subtitle">
            Explore 20 delicious recipes loaded fresh from around the world.
          </p>
        </div>

        <div className="header-badges">
          <FavoritesBadge
            savedCount={totalSavedCount}
            isActive={showFavoritesOnly}
            onToggle={() => setShowFavoritesOnly((prev) => !prev)}
          />

          {!loading && !error && (
            <div className="recipe-count-pill" aria-live="polite">
              {normalizedQuery || showFavoritesOnly
                ? `Showing ${filteredRecipes.length} of ${recipes.length} recipes`
                : `Showing ${recipes.length} recipes`}
            </div>
          )}
        </div>
      </header>

      <section className="search-toolbar" aria-label="Filter recipes">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          disabled={loading || Boolean(error)}
        />

        <FavoritesFilter
          showFavoritesOnly={showFavoritesOnly}
          savedCount={totalSavedCount}
          onChangeView={setShowFavoritesOnly}
        />
      </section>

      <main className="main-content">
        {loading && (
          <section
            className="recipe-grid"
            aria-label="Loading recipes"
            aria-busy="true"
          >
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <div key={index} className="recipe-card skeleton-card">
                <div className="skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line title" />
                  <div className="skeleton-line medium" />
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && error && (
          <section className="status-panel" role="alert">
            <p className="status-message">{error}</p>
            <button
              type="button"
              className="retry-button"
              onClick={handleRetry}
            >
              Retry
            </button>
          </section>
        )}

        {!loading && !error && recipes.length === 0 && (
          <section className="status-panel">
            <p className="status-message">No recipes were returned.</p>
          </section>
        )}

        {!loading &&
          !error &&
          recipes.length > 0 &&
          filteredRecipes.length === 0 && (
            <section className="status-panel">
              <p className="status-message">
                {showFavoritesOnly && !normalizedQuery
                  ? 'No favorite recipes saved yet. Click the heart icon on any recipe to save it.'
                  : `No recipes match "${searchQuery.trim()}".`}
              </p>
              <div className="status-actions">
                {normalizedQuery && (
                  <button
                    type="button"
                    className="retry-button"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </button>
                )}
                {showFavoritesOnly && (
                  <button
                    type="button"
                    className="retry-button secondary"
                    onClick={() => setShowFavoritesOnly(false)}
                  >
                    View all recipes
                  </button>
                )}
              </div>
            </section>
          )}

        {!loading && !error && filteredRecipes.length > 0 && (
          <section className="recipe-grid" aria-label="Recipes">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoriteIdSet.has(recipe.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

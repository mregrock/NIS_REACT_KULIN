import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie, Genre } from '../types/movie'
import { fetchPopularMovies, fetchGenres } from '../api/tmdb'

interface MovieStore {
  queue: Movie[]
  liked: Movie[]
  disliked: Movie[]
  genres: Genre[]
  selectedGenreId: number | null
  page: number
  loading: boolean
  error: string | null
  genreWeights: Record<number, number>

  loadGenres: () => Promise<void>
  loadMovies: (reset?: boolean) => Promise<void>
  swipeRight: (movie: Movie) => void
  swipeLeft: (movie: Movie) => void
  removeLiked: (id: number) => void
  setGenre: (id: number | null) => void
}

const scoreMovie = (movie: Movie, weights: Record<number, number>) =>
  movie.genre_ids.reduce((sum, id) => sum + (weights[id] ?? 0), 0)

const sortByRelevance = (movies: Movie[], weights: Record<number, number>) =>
  [...movies].sort((a, b) => scoreMovie(b, weights) - scoreMovie(a, weights))

const updateWeights = (
  weights: Record<number, number>,
  genreIds: number[],
  delta: number
): Record<number, number> => {
  const next = { ...weights }
  for (const id of genreIds) {
    next[id] = (next[id] ?? 0) + delta
  }
  return next
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      queue: [],
      liked: [],
      disliked: [],
      genres: [],
      selectedGenreId: null,
      page: 1,
      loading: false,
      error: null,
      genreWeights: {},

      loadGenres: async () => {
        try {
          const data = await fetchGenres()
          set({ genres: data.genres })
        } catch {
          set({ error: 'Не удалось загрузить жанры' })
        }
      },

      loadMovies: async (reset = false) => {
        const { page, selectedGenreId, disliked, liked, genreWeights } = get()
        const nextPage = reset ? 1 : page

        set({ loading: true, error: null })
        try {
          const data = await fetchPopularMovies(nextPage, selectedGenreId ?? undefined)
          const seenIds = new Set([...liked.map((m) => m.id), ...disliked.map((m) => m.id)])
          const fresh = data.results.filter((m) => !seenIds.has(m.id))

          set((s) => {
            const combined = reset ? fresh : [...s.queue, ...fresh]
            return {
              queue: sortByRelevance(combined, genreWeights),
              page: nextPage + 1,
              loading: false,
            }
          })
        } catch {
          set({ loading: false, error: 'Не удалось загрузить фильмы' })
        }
      },

      swipeRight: (movie) => {
        const newWeights = updateWeights(get().genreWeights, movie.genre_ids, 2)
        set((s) => ({
          queue: sortByRelevance(
            s.queue.filter((m) => m.id !== movie.id),
            newWeights
          ),
          liked: s.liked.some((m) => m.id === movie.id) ? s.liked : [movie, ...s.liked],
          genreWeights: newWeights,
        }))
        if (get().queue.length < 3) get().loadMovies()
      },

      swipeLeft: (movie) => {
        const newWeights = updateWeights(get().genreWeights, movie.genre_ids, -1)
        set((s) => ({
          queue: sortByRelevance(
            s.queue.filter((m) => m.id !== movie.id),
            newWeights
          ),
          disliked: [...s.disliked, movie],
          genreWeights: newWeights,
        }))
        if (get().queue.length < 3) get().loadMovies()
      },

      removeLiked: (id) => {
        set((s) => ({ liked: s.liked.filter((m) => m.id !== id) }))
      },

      setGenre: (id) => {
        set({ selectedGenreId: id, queue: [], page: 1 })
        get().loadMovies(true)
      },
    }),
    {
      name: 'movie-tinder',
      partialize: (s) => ({ liked: s.liked, genreWeights: s.genreWeights }),
    }
  )
)

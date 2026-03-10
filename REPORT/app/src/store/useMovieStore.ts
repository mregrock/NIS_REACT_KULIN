import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KpMovie } from '../types/movie'
import { fetchMovies } from '../api/kp'

const MAX_SEEN = 200

const topGenres = (weights: Record<string, number>, n = 2): string[] =>
  Object.entries(weights)
    .filter(([, w]) => w > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([name]) => name)

interface MovieStore {
  queue: KpMovie[]
  liked: KpMovie[]
  seenIds: number[]
  selectedGenre: string | null
  page: number
  loading: boolean
  error: string | null
  genreWeights: Record<string, number>

  loadMovies: (reset?: boolean) => Promise<void>
  swipeRight: (movie: KpMovie) => void
  swipeLeft: (movie: KpMovie) => void
  removeLiked: (id: number) => void
  setGenre: (genre: string | null) => void
  resetAll: () => void
}

const scoreMovie = (movie: KpMovie, weights: Record<string, number>) =>
  movie.genres.reduce((sum, g) => sum + (weights[g.name] ?? 0), 0)

const sortByRelevance = (movies: KpMovie[], weights: Record<string, number>) =>
  [...movies].sort((a, b) => scoreMovie(b, weights) - scoreMovie(a, weights))

const updateWeights = (
  weights: Record<string, number>,
  genres: { name: string }[],
  delta: number
): Record<string, number> => {
  const next = { ...weights }
  for (const { name } of genres) {
    next[name] = (next[name] ?? 0) + delta
  }
  return next
}

const addSeen = (seenIds: number[], id: number): number[] => {
  if (seenIds.includes(id)) return seenIds
  const next = [id, ...seenIds]
  return next.length > MAX_SEEN ? next.slice(0, MAX_SEEN) : next
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      queue: [],
      liked: [],
      seenIds: [],
      selectedGenre: null,
      page: 1,
      loading: false,
      error: null,
      genreWeights: {},

      loadMovies: async (reset = false) => {
        const { page, selectedGenre, seenIds, genreWeights } = get()
        const nextPage = reset ? 1 : page

        set({ loading: true, error: null })
        try {
          const preferred = selectedGenre ? [] : topGenres(genreWeights)
          const data = await fetchMovies(nextPage, selectedGenre ?? undefined, preferred)
          const seenSet = new Set(seenIds)
          const fresh = data.docs.filter((m) => !seenSet.has(m.id))

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
        const newWeights = updateWeights(get().genreWeights, movie.genres, 2)
        set((s) => ({
          queue: sortByRelevance(s.queue.filter((m) => m.id !== movie.id), newWeights),
          liked: s.liked.some((m) => m.id === movie.id) ? s.liked : [movie, ...s.liked],
          seenIds: addSeen(s.seenIds, movie.id),
          genreWeights: newWeights,
        }))
        if (get().queue.length < 3) get().loadMovies()
      },

      swipeLeft: (movie) => {
        const newWeights = updateWeights(get().genreWeights, movie.genres, -1)
        set((s) => ({
          queue: sortByRelevance(s.queue.filter((m) => m.id !== movie.id), newWeights),
          seenIds: addSeen(s.seenIds, movie.id),
          genreWeights: newWeights,
        }))
        if (get().queue.length < 3) get().loadMovies()
      },

      removeLiked: (id) => {
        set((s) => ({ liked: s.liked.filter((m) => m.id !== id) }))
      },

      setGenre: (genre) => {
        set({ selectedGenre: genre, queue: [], page: 1 })
        get().loadMovies(true)
      },

      resetAll: () => {
        set({
          queue: [], liked: [], seenIds: [],
          genreWeights: {}, selectedGenre: null, page: 1,
        })
        get().loadMovies(true)
      },
    }),
    {
      name: 'movie-tinder',
      partialize: (s) => ({ liked: s.liked, genreWeights: s.genreWeights, seenIds: s.seenIds }),
    }
  )
)

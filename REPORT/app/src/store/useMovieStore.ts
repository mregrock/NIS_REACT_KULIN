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

interface LastSwipe {
  movie: KpMovie
  direction: 'left' | 'right'
  prevWeights: Record<string, number>
  prevSeenIds: number[]
  prevSwipeCount: number
  prevLikeCount: number
}

interface MovieStore {
  queue: KpMovie[]
  liked: KpMovie[]
  seenIds: number[]
  selectedGenre: string | null
  minRating: number | null
  decade: { label: string; from: number; to: number } | null
  page: number
  loading: boolean
  error: string | null
  genreWeights: Record<string, number>
  lastSwipe: LastSwipe | null
  undoCount: number
  swipeCount: number
  likeCount: number

  loadMovies: (reset?: boolean, _attempt?: number) => Promise<void>
  swipeRight: (movie: KpMovie) => void
  swipeLeft: (movie: KpMovie) => void
  undo: () => void
  removeLiked: (id: number) => void
  setGenre: (genre: string | null) => void
  setMinRating: (rating: number | null) => void
  setDecade: (decade: { label: string; from: number; to: number } | null) => void
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
      minRating: null,
      decade: null,
      page: 1,
      loading: false,
      error: null,
      genreWeights: {},
      lastSwipe: null,
      undoCount: 0,
      swipeCount: 0,
      likeCount: 0,

      loadMovies: async (reset = false, _attempt = 0) => {
        if (_attempt > 5) {
          set({ loading: false })
          return
        }
        const { page, selectedGenre, seenIds, genreWeights, minRating, decade } = get()
        const nextPage = reset && _attempt === 0 ? 1 : page

        set({ loading: true, error: null })
        try {
          const preferred = selectedGenre ? [] : topGenres(genreWeights)
          const data = await fetchMovies({
            page: nextPage,
            genre: selectedGenre ?? undefined,
            preferredGenres: preferred,
            minRating: minRating ?? undefined,
            decade,
          })
          const seenSet = new Set(seenIds)
          const fresh = data.docs.filter((m) => !seenSet.has(m.id))

          set((s) => {
            const combined = reset && _attempt === 0 ? fresh : [...s.queue, ...fresh]
            return {
              queue: sortByRelevance(combined, s.genreWeights),
              page: nextPage + 1,
              loading: false,
            }
          })

          if (fresh.length === 0 && data.docs.length > 0) {
            get().loadMovies(false, _attempt + 1)
          }
        } catch {
          set({ loading: false, error: 'Не удалось загрузить фильмы' })
        }
      },

      swipeRight: (movie) => {
        const { genreWeights, seenIds, swipeCount, likeCount } = get()
        const newWeights = updateWeights(genreWeights, movie.genres, 2)
        set((s) => ({
          queue: sortByRelevance(s.queue.filter((m) => m.id !== movie.id), newWeights),
          liked: s.liked.some((m) => m.id === movie.id) ? s.liked : [movie, ...s.liked],
          seenIds: addSeen(s.seenIds, movie.id),
          genreWeights: newWeights,
          swipeCount: swipeCount + 1,
          likeCount: likeCount + 1,
          lastSwipe: {
            movie, direction: 'right',
            prevWeights: genreWeights, prevSeenIds: seenIds,
            prevSwipeCount: swipeCount, prevLikeCount: likeCount,
          },
        }))
        if (get().queue.length < 3) get().loadMovies()
      },

      swipeLeft: (movie) => {
        const { genreWeights, seenIds, swipeCount, likeCount } = get()
        const newWeights = updateWeights(genreWeights, movie.genres, -1)
        set((s) => ({
          queue: sortByRelevance(s.queue.filter((m) => m.id !== movie.id), newWeights),
          seenIds: addSeen(s.seenIds, movie.id),
          genreWeights: newWeights,
          swipeCount: swipeCount + 1,
          lastSwipe: {
            movie, direction: 'left',
            prevWeights: genreWeights, prevSeenIds: seenIds,
            prevSwipeCount: swipeCount, prevLikeCount: likeCount,
          },
        }))
        if (get().queue.length < 3) get().loadMovies()
      },

      undo: () => {
        const { lastSwipe } = get()
        if (!lastSwipe) return
        const { movie, direction, prevWeights, prevSeenIds, prevSwipeCount, prevLikeCount } = lastSwipe
        set((s) => ({
          queue: [movie, ...s.queue],
          liked: direction === 'right' ? s.liked.filter((m) => m.id !== movie.id) : s.liked,
          seenIds: prevSeenIds,
          genreWeights: prevWeights,
          swipeCount: prevSwipeCount,
          likeCount: prevLikeCount,
          lastSwipe: null,
          undoCount: s.undoCount + 1,
        }))
      },

      removeLiked: (id) => {
        set((s) => ({ liked: s.liked.filter((m) => m.id !== id) }))
      },

      setGenre: (genre) => {
        set({ selectedGenre: genre, queue: [], page: 1 })
        get().loadMovies(true)
      },

      setMinRating: (rating) => {
        set({ minRating: rating, queue: [], page: 1 })
        get().loadMovies(true)
      },

      setDecade: (decade) => {
        set({ decade, queue: [], page: 1 })
        get().loadMovies(true)
      },

      resetAll: () => {
        set({
          queue: [], liked: [], seenIds: [],
          genreWeights: {}, selectedGenre: null, minRating: null, decade: null,
          page: 1, lastSwipe: null, undoCount: 0, swipeCount: 0, likeCount: 0,
        })
        get().loadMovies(true)
      },
    }),
    {
      name: 'movie-tinder',
      partialize: (s) => ({
        liked: s.liked,
        genreWeights: s.genreWeights,
        seenIds: s.seenIds,
        swipeCount: s.swipeCount,
        likeCount: s.likeCount,
      }),
    }
  )
)

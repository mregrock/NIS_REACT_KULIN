import { AnimatePresence } from 'framer-motion'
import { useMovieStore } from '../store/useMovieStore'
import MovieCard from './MovieCard'

const VISIBLE_CARDS = 3

export default function CardStack() {
  const { queue, genres, swipeLeft, swipeRight, loading } = useMovieStore()

  const visible = queue.slice(0, VISIBLE_CARDS)

  if (loading && queue.length === 0) {
    return (
      <div className="relative w-full max-w-sm aspect-[3/4] mx-auto">
        <div className="absolute inset-0 rounded-3xl bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  if (!loading && queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-zinc-400">
        <span className="text-6xl">🎬</span>
        <p className="text-lg font-medium">Фильмы закончились</p>
        <p className="text-sm">Попробуй сменить жанр</p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto" style={{ height: '480px' }}>
      <AnimatePresence>
        {[...visible].reverse().map((movie, reversedIdx) => {
          const idx = visible.length - 1 - reversedIdx
          const isTop = idx === 0
          const scale = 1 - idx * 0.04
          const yOffset = idx * 12

          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              genres={genres}
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}
              isTop={isTop}
              zIndex={visible.length - idx}
              scale={scale}
              yOffset={yOffset}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

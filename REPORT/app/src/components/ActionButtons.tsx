import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMovieStore } from '../store/useMovieStore'
import { showToast } from './Toast'

export default function ActionButtons() {
  const { queue, swipeLeft, swipeRight, undo, lastSwipe } = useMovieStore()
  const top = queue[0]

  const handleRight = (movie: typeof top) => {
    if (!movie) return
    swipeRight(movie)
    showToast(`❤️ ${movie.name || movie.alternativeName || 'Фильм'} добавлен`, 'like')
  }

  const handleLeft = (movie: typeof top) => {
    if (!movie) return
    swipeLeft(movie)
    showToast(`👎 Пропущено`, 'dislike')
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleLeft(top)
      if (e.key === 'ArrowRight') handleRight(top)
      if (e.key === 'z' || e.key === 'Z') undo()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top])

  return (
    <div className="flex items-center justify-center gap-5 pt-6">
      <motion.button
        onClick={() => handleLeft(top)}
        disabled={!top}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-red-500/50 text-red-400 text-2xl flex items-center justify-center shadow-lg hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Не нравится (←)"
      >
        ✕
      </motion.button>

      <motion.button
        onClick={undo}
        disabled={!lastSwipe}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-zinc-600 text-zinc-400 text-lg flex items-center justify-center shadow-md hover:bg-zinc-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        title="Отменить (Z)"
      >
        ↩
      </motion.button>

      <motion.button
        onClick={() => handleRight(top)}
        disabled={!top}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-green-500/50 text-green-400 text-2xl flex items-center justify-center shadow-lg hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Нравится (→)"
      >
        ♥
      </motion.button>
    </div>
  )
}

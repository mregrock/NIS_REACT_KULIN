import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMovieStore } from '../store/useMovieStore'

export default function ActionButtons() {
  const { queue, swipeLeft, swipeRight } = useMovieStore()
  const top = queue[0]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!top) return
      if (e.key === 'ArrowLeft') swipeLeft(top)
      if (e.key === 'ArrowRight') swipeRight(top)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [top, swipeLeft, swipeRight])

  return (
    <div className="flex items-center justify-center gap-8 pt-6">
      <motion.button
        onClick={() => top && swipeLeft(top)}
        disabled={!top}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-red-500/50 text-red-400 text-2xl flex items-center justify-center shadow-lg hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Не нравится (←)"
      >
        ✕
      </motion.button>

      <motion.button
        onClick={() => top && swipeRight(top)}
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

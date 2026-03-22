import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMovieStore } from '../store/useMovieStore'
import type { KpMovie } from '../types/movie'
import MovieDetailSheet from './MovieDetailSheet'

interface Props {
  open: boolean
  onClose: () => void
}

export default function LikedMovies({ open, onClose }: Props) {
  const { liked, removeLiked, resetAll } = useMovieStore()
  const [detailMovie, setDetailMovie] = useState<KpMovie | null>(null)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-80 bg-zinc-900 z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold">
                Понравилось{' '}
                <span className="text-green-400 ml-1">{liked.length}</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('Сбросить всё? Лайки и предпочтения будут удалены.')) {
                      resetAll()
                      onClose()
                    }
                  }}
                  className="text-xs text-zinc-500 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
                  title="Сбросить всё и начать заново"
                >
                  Сбросить всё
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
              {liked.length === 0 && (
                <p className="text-zinc-500 text-sm text-center mt-8">
                  Ещё ни одного фильма
                </p>
              )}
              <AnimatePresence>
                {liked.map((movie) => {
                  const poster = movie.poster?.previewUrl ?? null
                  return (
                    <motion.div
                      key={movie.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      onClick={() => setDetailMovie(movie)}
                      className="flex items-center gap-3 bg-zinc-800 rounded-2xl p-2 group cursor-pointer hover:bg-zinc-700 transition-colors"
                    >
                      {poster ? (
                        <img
                          src={poster}
                          alt={movie.name ?? movie.alternativeName ?? ''}
                          className="w-12 h-16 object-cover rounded-xl shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-zinc-700 rounded-xl shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {movie.name || movie.alternativeName}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {movie.year} · ★ {(movie.rating.imdb || movie.rating.kp).toFixed(1)}
                        </p>
                        {movie.alternativeName && (
                          <p className="text-xs text-zinc-600 truncate">{movie.alternativeName}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeLiked(movie.id)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-all shrink-0"
                      >
                        ✕
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}

      <MovieDetailSheet
        movie={detailMovie}
        onClose={() => setDetailMovie(null)}
      />
    </AnimatePresence>
  )
}

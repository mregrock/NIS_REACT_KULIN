import { motion, AnimatePresence } from 'framer-motion'
import { useMovieStore } from '../store/useMovieStore'
import { getPosterUrl } from '../api/tmdb'

interface Props {
  open: boolean
  onClose: () => void
}

export default function LikedMovies({ open, onClose }: Props) {
  const { liked, removeLiked } = useMovieStore()

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
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
              {liked.length === 0 && (
                <p className="text-zinc-500 text-sm text-center mt-8">
                  Ещё ни одного фильма
                </p>
              )}
              <AnimatePresence>
                {liked.map((movie) => {
                  const poster = getPosterUrl(movie.poster_path, 'w185')
                  const year = movie.release_date?.slice(0, 4) ?? ''
                  return (
                    <motion.div
                      key={movie.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex items-center gap-3 bg-zinc-800 rounded-2xl p-2 group"
                    >
                      {poster ? (
                        <img
                          src={poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded-xl shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-zinc-700 rounded-xl shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {movie.title}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {year} · ★ {movie.vote_average.toFixed(1)}
                        </p>
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
    </AnimatePresence>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import type { KpMovie } from '../types/movie'
import { useMovieStore } from '../store/useMovieStore'

interface Props {
  movie: KpMovie | null
  onClose: () => void
}

export default function MovieDetailSheet({ movie, onClose }: Props) {
  const { swipeLeft, swipeRight } = useMovieStore()

  const handleLike = () => {
    if (!movie) return
    swipeRight(movie)
    onClose()
  }

  const handleDislike = () => {
    if (!movie) return
    swipeLeft(movie)
    onClose()
  }

  return (
    <AnimatePresence>
      {movie && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl overflow-hidden max-h-[85dvh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mt-3 mb-1 shrink-0 cursor-pointer"
              onClick={onClose}
            />

            <div className="overflow-y-auto flex-1 pb-6">
              {movie.backdrop?.url ? (
                <div className="relative h-48 shrink-0">
                  <img
                    src={movie.backdrop.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                </div>
              ) : (
                <div className="h-4" />
              )}

              <div className="px-5 -mt-2">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {movie.name || movie.alternativeName}
                </h2>
                {movie.name && movie.alternativeName && (
                  <p className="text-zinc-500 text-sm mt-0.5">{movie.alternativeName}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {movie.rating.imdb > 0 && (
                    <div className="flex items-center gap-1.5 bg-zinc-800 rounded-xl px-3 py-1.5">
                      <span className="text-yellow-400 text-xs font-bold">IMDb</span>
                      <span className="text-white font-bold">{movie.rating.imdb.toFixed(1)}</span>
                    </div>
                  )}
                  {movie.rating.kp > 0 && (
                    <div className="flex items-center gap-1.5 bg-zinc-800 rounded-xl px-3 py-1.5">
                      <span className="text-orange-400 text-xs font-bold">КП</span>
                      <span className="text-white font-bold">{movie.rating.kp.toFixed(1)}</span>
                    </div>
                  )}
                  {movie.year && (
                    <span className="text-zinc-400 text-sm">{movie.year}</span>
                  )}
                  {movie.movieLength && (
                    <span className="text-zinc-400 text-sm">{movie.movieLength} мин</span>
                  )}
                  {movie.ageRating && (
                    <span className="text-zinc-500 text-sm border border-zinc-700 rounded px-1.5 py-0.5">
                      {movie.ageRating}+
                    </span>
                  )}
                  {movie.top250 && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-xl font-medium">
                      Топ 250 #{movie.top250}
                    </span>
                  )}
                </div>

                {movie.countries.length > 0 && (
                  <p className="text-zinc-500 text-sm mt-2">
                    {movie.countries.map((c) => c.name).join(', ')}
                  </p>
                )}

                {movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {movie.genres.map((g) => (
                      <span
                        key={g.name}
                        className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full capitalize"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {(movie.description || movie.shortDescription) && (
                  <p className="text-zinc-300 text-sm leading-relaxed mt-4">
                    {movie.description || movie.shortDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 px-5 py-4 border-t border-zinc-800 shrink-0 bg-zinc-900">
              <a
                href={`https://www.kinopoisk.ru/film/${movie.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-colors"
              >
                🎬 Открыть на Кинопоиске
              </a>
              <div className="flex gap-4">
                <motion.button
                  onClick={handleDislike}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 h-12 rounded-2xl bg-zinc-800 border border-red-500/40 text-red-400 font-semibold text-sm hover:bg-red-500/10 transition-colors"
                >
                  ✕ Не интересно
                </motion.button>
                <motion.button
                  onClick={handleLike}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 h-12 rounded-2xl bg-green-500/10 border border-green-500/40 text-green-400 font-semibold text-sm hover:bg-green-500/20 transition-colors"
                >
                  ♥ Нравится
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

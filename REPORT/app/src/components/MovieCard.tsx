import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  type PanInfo,
} from 'framer-motion'
import type { Movie, Genre } from '../types/movie'
import { getPosterUrl } from '../api/tmdb'

interface Props {
  movie: Movie
  genres: Genre[]
  onSwipeLeft: (movie: Movie) => void
  onSwipeRight: (movie: Movie) => void
  isTop: boolean
  zIndex: number
  scale: number
  yOffset: number
}

const SWIPE_THRESHOLD = 100

export default function MovieCard({
  movie,
  genres,
  onSwipeLeft,
  onSwipeRight,
  isTop,
  zIndex,
  scale,
  yOffset,
}: Props) {
  const x = useMotionValue(0)
  const controls = useAnimation()
  const constraintsRef = useRef(null)

  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0])

  const movieGenres = genres
    .filter((g) => movie.genre_ids.includes(g.id))
    .slice(0, 3)

  const year = movie.release_date?.slice(0, 4) ?? ''
  const poster = getPosterUrl(movie.poster_path)

  const handleDragEnd = async (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      await controls.start({ x: 600, opacity: 0, transition: { duration: 0.3 } })
      onSwipeRight(movie)
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      await controls.start({ x: -600, opacity: 0, transition: { duration: 0.3 } })
      onSwipeLeft(movie)
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } })
    }
  }

  return (
    <motion.div
      ref={constraintsRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex }}
      animate={{ scale, y: yOffset }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate }}
        className="relative w-full max-w-sm cursor-grab active:cursor-grabbing select-none"
        whileTap={{ scale: 1.02 }}
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 aspect-[3/4]">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 text-lg">
              Нет постера
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-green-500/30 flex items-start justify-start p-6 rounded-3xl"
            style={{ opacity: likeOpacity }}
          >
            <span className="border-4 border-green-400 text-green-400 font-bold text-3xl px-3 py-1 rounded-xl rotate-[-20deg]">
              НРАВИТСЯ
            </span>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-red-500/30 flex items-start justify-end p-6 rounded-3xl"
            style={{ opacity: nopeOpacity }}
          >
            <span className="border-4 border-red-400 text-red-400 font-bold text-3xl px-3 py-1 rounded-xl rotate-[20deg]">
              ПРОПУСК
            </span>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16">
            <h2 className="text-white font-bold text-xl leading-tight">
              {movie.title}
              {year && <span className="font-normal text-zinc-400 ml-2 text-base">{year}</span>}
            </h2>

            <div className="flex items-center gap-2 mt-1 mb-2">
              <span className="text-yellow-400 text-sm font-semibold">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-zinc-500 text-xs">({movie.vote_count.toLocaleString()})</span>
            </div>

            {movieGenres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {movieGenres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="text-zinc-300 text-sm line-clamp-2 leading-snug">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

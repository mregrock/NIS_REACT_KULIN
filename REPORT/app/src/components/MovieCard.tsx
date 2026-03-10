import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  type PanInfo,
} from 'framer-motion'
import type { KpMovie } from '../types/movie'

interface Props {
  movie: KpMovie
  onSwipeLeft: (movie: KpMovie) => void
  onSwipeRight: (movie: KpMovie) => void
  onDetails: (movie: KpMovie) => void
  isTop: boolean
  zIndex: number
  scale: number
  yOffset: number
}

const SWIPE_THRESHOLD = 100

export default function MovieCard({
  movie,
  onSwipeLeft,
  onSwipeRight,
  onDetails,
  isTop,
  zIndex,
  scale,
  yOffset,
}: Props) {
  const x = useMotionValue(0)
  const controls = useAnimation()
  const constraintsRef = useRef(null)
  const didDrag = useRef(false)

  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0])

  const genres = movie.genres.slice(0, 3)
  const poster = movie.poster?.url ?? null
  const rating = movie.rating.imdb || movie.rating.kp

  const handleDragStart = () => { didDrag.current = true }

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
    setTimeout(() => { didDrag.current = false }, 100)
  }

  const handleClick = () => {
    if (!didDrag.current) onDetails(movie)
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        animate={controls}
        style={{ x, rotate }}
        className="relative w-full max-w-sm cursor-grab active:cursor-grabbing select-none"
        whileTap={{ scale: 1.02 }}
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 aspect-[3/4]">
          {poster ? (
            <img
              src={poster}
              alt={movie.name ?? movie.alternativeName ?? ''}
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
              {movie.name || movie.alternativeName}
              {movie.year && (
                <span className="font-normal text-zinc-400 ml-2 text-base">{movie.year}</span>
              )}
            </h2>

            <div className="flex items-center gap-2 mt-1 mb-2">
              <span className="text-yellow-400 text-sm font-semibold">
                ★ {rating.toFixed(1)}
              </span>
              {movie.top250 && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                  Топ 250 #{movie.top250}
                </span>
              )}
              {movie.ageRating && (
                <span className="text-xs text-zinc-500">{movie.ageRating}+</span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {genres.map((g) => (
                  <span
                    key={g.name}
                    className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full capitalize"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.shortDescription && (
              <p className="text-zinc-300 text-sm line-clamp-2 leading-snug">
                {movie.shortDescription}
              </p>
            )}

            {isTop && (
              <p className="text-zinc-500 text-xs mt-2">Tap для подробностей</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

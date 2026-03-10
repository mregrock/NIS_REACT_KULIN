import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMovieStore } from './store/useMovieStore'
import CardStack from './components/CardStack'
import ActionButtons from './components/ActionButtons'
import LikedMovies from './components/LikedMovies'

export default function App() {
  const { genres, selectedGenreId, liked, loadGenres, loadMovies, setGenre } = useMovieStore()
  const [likedOpen, setLikedOpen] = useState(false)

  useEffect(() => {
    loadGenres()
    loadMovies(true)
  }, [])

  return (
    <div className="min-h-dvh bg-[#0f0f0f] flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-white font-bold text-lg tracking-tight">CineSwipe</span>
        </div>

        <button
          onClick={() => setLikedOpen(true)}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm text-white"
        >
          <span className="text-green-400">♥</span>
          <span>Понравилось</span>
          {liked.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {liked.length > 99 ? '99+' : liked.length}
            </span>
          )}
        </button>
      </header>

      <div className="flex-1 flex flex-col px-4 pt-4 pb-6 max-w-lg mx-auto w-full">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4">
          <GenreChip
            label="Все"
            active={selectedGenreId === null}
            onClick={() => setGenre(null)}
          />
          {genres.map((g) => (
            <GenreChip
              key={g.id}
              label={g.name}
              active={selectedGenreId === g.id}
              onClick={() => setGenre(g.id)}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <CardStack />
          <ActionButtons />

          <p className="text-center text-zinc-600 text-xs mt-5">
            Тяни карточку или используй ← →
          </p>
        </div>
      </div>

      <LikedMovies open={likedOpen} onClose={() => setLikedOpen(false)} />
    </div>
  )
}

function GenreChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-white text-black'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      }`}
    >
      {label}
    </motion.button>
  )
}

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMovieStore } from './store/useMovieStore'
import { GENRE_LIST, DECADE_LIST } from './api/kp'
import CardStack from './components/CardStack'
import ActionButtons from './components/ActionButtons'
import LikedMovies from './components/LikedMovies'
import Toast from './components/Toast'
import StatsSheet from './components/StatsSheet'

const RATING_OPTIONS = [
  { label: 'Любой', value: null },
  { label: '7+', value: 7 },
  { label: '8+', value: 8 },
  { label: '9+', value: 9 },
]

export default function App() {
  const { selectedGenre, liked, loadMovies, setGenre, minRating, setMinRating, decade, setDecade } = useMovieStore()
  const [likedOpen, setLikedOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  useEffect(() => {
    loadMovies(true)
  }, [])

  return (
    <div className="min-h-dvh bg-[#0f0f0f] flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-white font-bold text-lg tracking-tight">CineSwipe</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm text-zinc-300"
            title="Статистика"
          >
            📊
          </button>

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
        </div>
      </header>

      <div className="flex-1 flex flex-col px-4 pt-3 pb-6 max-w-lg mx-auto w-full">
        {/* Жанры */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          <FilterChip
            label="Все"
            active={selectedGenre === null}
            onClick={() => setGenre(null)}
          />
          {GENRE_LIST.map((g) => (
            <FilterChip
              key={g}
              label={g}
              active={selectedGenre === g}
              onClick={() => setGenre(g)}
            />
          ))}
        </div>

        {/* Рейтинг */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 mt-1.5">
          {RATING_OPTIONS.map(({ label, value }) => (
            <FilterChip
              key={label}
              label={label}
              active={minRating === value}
              onClick={() => setMinRating(value)}
              accent="orange"
            />
          ))}
          <div className="w-px bg-zinc-700 mx-1 self-stretch shrink-0" />
          {DECADE_LIST.map((d) => {
            const [num, suffix] = d.label.split('-')
            const label = suffix
              ? <>{num}-<span className="text-[1em]">{suffix}</span></>
              : d.label
            return (
              <FilterChip
                key={d.label}
                label={label}
                active={decade?.label === d.label}
                onClick={() => setDecade(decade?.label === d.label ? null : d)}
                accent="blue"
              />
            )
          })}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <CardStack />
          <ActionButtons />

          <p className="text-center text-zinc-600 text-xs mt-5">
            Тяни карточку или используй ← → · Z — отмена
          </p>
        </div>
      </div>

      <LikedMovies open={likedOpen} onClose={() => setLikedOpen(false)} />
      <StatsSheet open={statsOpen} onClose={() => setStatsOpen(false)} />
      <Toast />
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
  accent = 'white',
}: {
  label: React.ReactNode
  active: boolean
  onClick: () => void
  accent?: 'white' | 'orange' | 'blue'
}) {
  const activeClass =
    accent === 'orange' ? 'bg-orange-500 text-white' :
    accent === 'blue'   ? 'bg-blue-500 text-white' :
                          'bg-white text-black'

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active ? activeClass : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      }`}
    >
      {label}
    </motion.button>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { useMovieStore } from '../store/useMovieStore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function StatsSheet({ open, onClose }: Props) {
  const { swipeCount, likeCount, genreWeights, liked } = useMovieStore()

  const dislikeCount = swipeCount - likeCount
  const likePercent = swipeCount > 0 ? Math.round((likeCount / swipeCount) * 100) : 0

  const topGenres = Object.entries(genreWeights)
    .filter(([, w]) => w > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const maxWeight = topGenres[0]?.[1] ?? 1

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl max-h-[85dvh] flex flex-col overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mt-3 mb-4 shrink-0 cursor-pointer"
              onClick={onClose}
            />

            <div className="overflow-y-auto flex-1 px-5 pb-8">
              <h2 className="text-white font-bold text-xl mb-5">Статистика</h2>

              {swipeCount === 0 ? (
                <p className="text-zinc-500 text-center py-10">
                  Пока нет данных — начни свайпать!
                </p>
              ) : (
                <>
                  {/* Счётчики */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <StatCard label="Свайпов" value={swipeCount} color="text-white" />
                    <StatCard label="Лайков" value={likeCount} color="text-green-400" />
                    <StatCard label="Пропусков" value={dislikeCount} color="text-red-400" />
                  </div>

                  {/* Лайков % */}
                  <div className="bg-zinc-800 rounded-2xl p-4 mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-400 text-sm">Процент лайков</span>
                      <span className="text-white font-bold">{likePercent}%</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${likePercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* В списке */}
                  <div className="bg-zinc-800 rounded-2xl p-4 mb-5 flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">В списке «Понравилось»</span>
                    <span className="text-green-400 font-bold text-lg">{liked.length}</span>
                  </div>

                  {/* Топ жанров */}
                  {topGenres.length > 0 && (
                    <div className="bg-zinc-800 rounded-2xl p-4">
                      <p className="text-zinc-400 text-sm mb-3">Любимые жанры</p>
                      <div className="flex flex-col gap-2.5">
                        {topGenres.map(([name, weight], i) => (
                          <div key={name}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500 text-xs w-4">{i + 1}</span>
                                <span className="text-white text-sm capitalize">{name}</span>
                              </div>
                              <span className="text-zinc-500 text-xs">+{weight}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${
                                  i === 0 ? 'bg-orange-400' :
                                  i === 1 ? 'bg-amber-400' :
                                  'bg-yellow-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(weight / maxWeight) * 100}%` }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-1">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-zinc-500 text-xs text-center">{label}</span>
    </div>
  )
}

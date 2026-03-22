import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastItem {
  id: number
  message: string
  type: 'like' | 'dislike'
}

let toastId = 0
const listeners: ((t: ToastItem) => void)[] = []

export const showToast = (message: string, type: 'like' | 'dislike') => {
  const item: ToastItem = { id: ++toastId, message, type }
  listeners.forEach((fn) => fn(item))
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (item: ToastItem) => {
      setToasts((prev) => [item, ...prev].slice(0, 3))
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id))
      }, 2000)
    }
    listeners.push(handler)
    return () => { listeners.splice(listeners.indexOf(handler), 1) }
  }, [])

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg ${
              t.type === 'like'
                ? 'bg-green-500/90 text-white'
                : 'bg-zinc-700/90 text-zinc-200'
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

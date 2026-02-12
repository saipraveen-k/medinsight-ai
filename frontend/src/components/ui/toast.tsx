'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/90 border-emerald-400 text-white'
      case 'error':
        return 'bg-red-500/90 border-red-400 text-white'
      case 'info':
        return 'bg-cyan-500/90 border-cyan-400 text-white'
      default:
        return 'bg-emerald-500/90 border-emerald-400 text-white'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <X className="h-5 w-5" />
      case 'info':
        return <CheckCircle className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg",
            getToastStyles()
          )}
        >
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <p className="text-sm font-medium">
            {message}
          </p>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose?.(), 300)
            }}
            className="flex-shrink-0 ml-2 hover:opacity-80 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast container for managing multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type?: 'success' | 'error' | 'info'
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => onRemove(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

import { cn } from '@/lib/utils'

'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getRiskGradient, getRiskColor, formatConfidence } from '@/lib/utils'

interface RiskGaugeProps {
  score: number
  level: string
  confidence?: number
  className?: string
}

export function RiskGauge({ score, level, confidence = 85, className }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 80
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'LOW'
      case 'medium': return 'MEDIUM'
      case 'high': return 'HIGH'
      case 'critical': return 'CRITICAL'
      default: return 'UNKNOWN'
    }
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative">
        {/* Background circle */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="rgb(51 65 85 / 0.3)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <motion.circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={level === 'low' ? '#10b981' : level === 'medium' ? '#f59e0b' : level === 'high' ? '#f97316' : '#ef4444'} />
              <stop offset="100%" stopColor={level === 'low' ? '#06b6d4' : level === 'medium' ? '#eab308' : level === 'high' ? '#ef4444' : '#f87171'} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-slate-100">
              {Math.round(animatedScore)}
            </div>
            <div className="text-xs text-slate-400">/100</div>
          </motion.div>
        </div>
      </div>

      {/* Risk label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className={cn(
          "mt-4 px-4 py-2 rounded-full text-sm font-semibold border",
          getRiskColor(level)
        )}
      >
        {getRiskLabel(level)}
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-3 text-xs text-slate-400 text-center max-w-xs"
      >
        Calculated from weighted abnormalities across categories
      </motion.p>

      {/* AI Confidence */}
      {confidence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-2 flex items-center gap-2 text-xs text-slate-500"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          AI Confidence: {formatConfidence(confidence)}%
        </motion.div>
      )}
    </div>
  )
}

import { cn } from '@/lib/utils'

'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PremiumRiskGaugeProps {
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  confidence?: number
  size?: 'sm' | 'md' | 'lg'
  showConfidence?: boolean
}

export function PremiumRiskGauge({ 
  score, 
  level, 
  confidence = 85,
  size = 'lg',
  showConfidence = true 
}: PremiumRiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const getRiskColor = () => {
    switch (level) {
      case 'low':
        return {
          stroke: '#10b981', // emerald
          fill: '#10b98120',
          glow: '#10b98140',
          text: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-500/10'
        }
      case 'medium':
        return {
          stroke: '#f59e0b', // amber
          fill: '#f59e0b20',
          glow: '#f59e0b40',
          text: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-500/10'
        }
      case 'high':
        return {
          stroke: '#f43f5e', // rose
          fill: '#f43f5e20',
          glow: '#f43f5e40',
          text: 'text-rose-600 dark:text-rose-400',
          bg: 'bg-rose-500/10'
        }
      case 'critical':
        return {
          stroke: '#ef4444', // red
          fill: '#ef444420',
          glow: '#ef444440',
          text: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-500/10'
        }
      default:
        return {
          stroke: '#6b7280',
          fill: '#6b728020',
          glow: '#6b728040',
          text: 'text-slate-600 dark:text-slate-400',
          bg: 'bg-slate-500/10'
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-40 h-40'
      case 'md':
        return 'w-48 h-48'
      case 'lg':
        return 'w-56 h-56'
      default:
        return 'w-56 h-56'
    }
  }

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 'text-3xl'
      case 'md':
        return 'text-4xl'
      case 'lg':
        return 'text-5xl'
      default:
        return 'text-5xl'
    }
  }

  const riskColor = getRiskColor()
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center space-y-10">
      {/* Risk Gauge Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.8 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Subtle Background Glow */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-500"
          style={{
            background: `radial-gradient(circle, ${riskColor.glow} 0%, transparent 70%)`,
            opacity: level === 'high' || level === 'critical' ? 0.4 : 0.2
          }}
        />

        {/* SVG Gauge */}
        <svg
          className={`${getSizeClasses()} transform -rotate-90`}
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Risk gauge showing ${Math.round(score)} out of 100`}
        >
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#6b7280"
            strokeWidth="16"
            fill="none"
            opacity="0.15"
            className="transition-colors duration-300"
          />

          {/* Progress Arc */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke={riskColor.stroke}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 2, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.2
            }}
            strokeDasharray={circumference}
            className="drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 12px ${riskColor.glow})`
            }}
          />

          {/* Center Text Group - Unrotated */}
          <g transform="rotate(90 100 100)">
            {/* Main Score */}
            <text
              x="100"
              y="85"
              textAnchor="middle"
              dominantBaseline="middle"
              className={`${getFontSize()} font-extrabold tracking-tight`}
              fill={riskColor.stroke}
              style={{
                textShadow: `0 2px 8px ${riskColor.glow}`
              }}
            >
              {Math.round(animatedScore)}
            </text>
            
            {/* Subtitle */}
            <text
              x="100"
              y="135"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-medium opacity-80"
              fill={riskColor.stroke}
            >
              /100
            </text>
          </g>
        </svg>

        {/* Floating Indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
          style={{
            backgroundColor: riskColor.stroke,
            boxShadow: `0 0 20px ${riskColor.glow}`
          }}
        />
      </motion.div>

      {/* Risk Level Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : 15 
        }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold ${riskColor.text} ${riskColor.bg} border border-current/30 backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: riskColor.stroke }}
          />
          <span className="capitalize tracking-wide">{level} Risk</span>
        </div>
        
        {/* Risk Level Indicator Bar */}
        <div className="flex gap-1">
          {['low', 'medium', 'high', 'critical'].map((risk, index) => {
            const currentLevel = ['low', 'medium', 'high', 'critical'].indexOf(level)
            const riskIndex = ['low', 'medium', 'high', 'critical'].indexOf(risk)
            return (
              <div
                key={risk}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  riskIndex <= currentLevel 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-20 scale-75'
                }`}
                style={{ 
                  backgroundColor: riskIndex <= currentLevel ? riskColor.stroke : '#6b7280' 
                }}
              />
            )
          })}
        </div>
      </motion.div>

      {/* AI Confidence Indicator */}
      {showConfidence && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-3 text-sm text-muted-foreground bg-card/50 rounded-full px-4 py-2 border border-border/50"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-pulse opacity-75" />
            </div>
            <span className="font-medium">AI Analysis</span>
          </div>
          <div className="w-24 bg-muted rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 1 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{confidence}%</span>
        </motion.div>
      )}

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center text-base text-muted-foreground max-w-sm leading-relaxed"
      >
        Risk score calculated from weighted abnormalities across health categories
      </motion.p>
    </div>
  )
}

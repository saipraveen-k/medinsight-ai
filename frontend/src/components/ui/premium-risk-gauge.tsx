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
          stroke: '#10b981',
          fill: '#10b98120',
          glow: '#10b98140',
          text: 'text-emerald-600 dark:text-emerald-400'
        }
      case 'medium':
        return {
          stroke: '#f59e0b',
          fill: '#f59e0b20',
          glow: '#f59e0b40',
          text: 'text-amber-600 dark:text-amber-400'
        }
      case 'high':
        return {
          stroke: '#f43f5e',
          fill: '#f43f5e20',
          glow: '#f43f5e40',
          text: 'text-rose-600 dark:text-rose-400'
        }
      case 'critical':
        return {
          stroke: '#ef4444',
          fill: '#ef444420',
          glow: '#ef444440',
          text: 'text-red-600 dark:text-red-400'
        }
      default:
        return {
          stroke: '#6b7280',
          fill: '#6b728020',
          glow: '#6b728040',
          text: 'text-slate-600 dark:text-slate-400'
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-32 h-32'
      case 'md':
        return 'w-40 h-40'
      case 'lg':
        return 'w-48 h-48'
      default:
        return 'w-48 h-48'
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-2xl'
      case 'md':
        return 'text-3xl'
      case 'lg':
        return 'text-4xl'
      default:
        return 'text-4xl'
    }
  }

  const riskColor = getRiskColor()
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Risk Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.8 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow Effect */}
        <div 
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300`}
          style={{
            background: `radial-gradient(circle, ${riskColor.glow} 0%, transparent 70%)`,
            opacity: level === 'high' || level === 'critical' ? 0.6 : 0.3
          }}
        />

        {/* SVG Gauge */}
        <svg
          className={`${getSizeClasses()} transform -rotate-90`}
          viewBox="0 0 200 200"
        >
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#6b7280"
            strokeWidth="12"
            fill="none"
            opacity="0.2"
          />

          {/* Progress Circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke={riskColor.stroke}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            strokeDasharray={circumference}
            className="drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px ${riskColor.glow})`
            }}
          />

          {/* Center Content */}
          <g transform="rotate(90 100 100)">
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              className={`${getTextSize()} font-bold fill-current`}
              fill={riskColor.stroke}
            >
              {Math.round(animatedScore)}
            </text>
            <text
              x="100"
              y="120"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm fill-current opacity-70"
              fill={riskColor.stroke}
            >
              /100
            </text>
          </g>
        </svg>
      </motion.div>

      {/* Risk Level Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : 10 
        }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${riskColor.text} bg-current/10 border border-current/20`}
      >
        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: riskColor.stroke }} />
        <span className="capitalize">{level} Risk</span>
      </motion.div>

      {/* AI Confidence Indicator */}
      {showConfidence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span>AI Confidence: {confidence}%</span>
        </motion.div>
      )}

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center text-sm text-muted-foreground max-w-xs"
      >
        Calculated from weighted abnormalities across categories
      </motion.p>
    </div>
  )
}

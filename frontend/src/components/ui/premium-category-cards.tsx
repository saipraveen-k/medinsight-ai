'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Heart, 
  Activity, 
  Brain, 
  Droplet, 
  Stethoscope, 
  TestTube 
} from 'lucide-react'

interface CategoryScore {
  category: string
  score: number
  count?: number
  abnormal_count?: number
}

interface PremiumCategoryCardsProps {
  categoryScores: Record<string, number>
  className?: string
}

export function PremiumCategoryCards({ categoryScores, className = '' }: PremiumCategoryCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      cardiac: Heart,
      metabolic: Activity,
      neurological: Brain,
      renal: Droplet,
      hepatic: Stethoscope,
      hematological: TestTube,
      electrolytes: Droplet,
    }
    return iconMap[category.toLowerCase()] || Activity
  }

  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score <= 25) return 'low'
    if (score <= 50) return 'medium'
    if (score <= 75) return 'high'
    return 'critical'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          progress: 'bg-emerald-500',
          text: 'text-emerald-600 dark:text-emerald-400'
        }
      case 'medium':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          progress: 'bg-amber-500',
          text: 'text-amber-600 dark:text-amber-400'
        }
      case 'high':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          progress: 'bg-rose-500',
          text: 'text-rose-600 dark:text-rose-400'
        }
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          progress: 'bg-red-500',
          text: 'text-red-600 dark:text-red-400'
        }
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          progress: 'bg-slate-500',
          text: 'text-slate-600 dark:text-slate-400'
        }
    }
  }

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')
  }

  const categories = Object.entries(categoryScores).map(([category, score]) => {
    const riskLevel = getRiskLevel(score)
    const riskColor = getRiskColor(riskLevel)
    const Icon = getCategoryIcon(category)

    return {
      category,
      score,
      riskLevel,
      riskColor,
      Icon,
      formattedName: formatCategoryName(category)
    }
  })

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {categories.map((item, index) => (
        <motion.div
          key={item.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          onHoverStart={() => setHoveredCard(item.category)}
          onHoverEnd={() => setHoveredCard(null)}
          className={`relative group overflow-hidden rounded-2xl border ${item.riskColor.border} ${item.riskColor.bg} bg-card/80 backdrop-blur-sm p-6 transition-all duration-300`}
          style={{
            boxShadow: hoveredCard === item.category ? `0 0 20px ${item.riskColor.progress.replace('bg-', '').replace('500', '400')}40` : ''
          }}
        >
          {/* Hover Glow Effect */}
          <div 
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
            style={{
              background: `radial-gradient(circle at center, ${item.riskColor.progress.replace('bg-', '').replace('500', '400')}20 0%, transparent 70%)`
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.riskColor.bg}`}>
                <item.Icon className={`h-5 w-5 ${item.riskColor.text}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground truncate">
                  {item.formattedName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Risk Assessment
                </p>
              </div>
            </div>
            
            {/* Score Badge */}
            <div className={`text-right`}>
              <div className={`text-2xl font-bold ${item.riskColor.text}`}>
                {item.score}
              </div>
              <div className="text-xs text-muted-foreground">
                /100
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Risk Level</span>
              <span className={`capitalize font-medium ${item.riskColor.text}`}>
                {item.riskLevel}
              </span>
            </div>
            
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                className={`h-full rounded-full ${item.riskColor.progress} relative overflow-hidden`}
              >
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Tooltip on Hover */}
          {hoveredCard === item.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-900 rounded-lg shadow-lg whitespace-nowrap"
            >
              Based on {Math.max(1, Math.floor(item.score / 25))} abnormal markers
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

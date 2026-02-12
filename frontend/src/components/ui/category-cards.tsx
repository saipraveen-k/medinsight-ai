'use client'

import { motion } from 'framer-motion'
import { getCategoryIcon } from '@/lib/utils'

interface CategoryCardsProps {
  categoryScores: Record<string, number>
  className?: string
}

interface CategoryCard {
  name: string
  score: number
  icon: string
}

export function CategoryCards({ categoryScores, className }: CategoryCardsProps) {
  const categories: CategoryCard[] = Object.entries(categoryScores).map(([name, score]) => ({
    name,
    score,
    icon: getCategoryIcon(name)
  }))

  const getScoreColor = (score: number) => {
    if (score <= 33) return 'from-emerald-500 to-cyan-500'
    if (score <= 66) return 'from-amber-500 to-yellow-500'
    return 'from-orange-500 to-red-500'
  }

  const getBorderColor = (score: number) => {
    if (score <= 33) return 'border-emerald-500/30 hover:border-emerald-400/50'
    if (score <= 66) return 'border-amber-500/30 hover:border-amber-400/50'
    return 'border-red-500/30 hover:border-red-400/50'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", className)}
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
          }}
          className={cn(
            "relative p-4 rounded-2xl border bg-slate-900/50 backdrop-blur-sm transition-all duration-300",
            getBorderColor(category.score)
          )}
        >
          {/* Glow effect on hover */}
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r",
            getScoreColor(category.score)
          )} />

          {/* Icon */}
          <div className="text-2xl mb-2">{category.icon}</div>
          
          {/* Category name */}
          <h3 className="text-xs font-semibold text-slate-300 mb-2 truncate">
            {category.name}
          </h3>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${category.score}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                getScoreColor(category.score)
              )}
            />
          </div>
          
          {/* Score */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-100">
              {category.score}%
            </span>
            {category.score > 66 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                className="w-2 h-2 rounded-full bg-red-400 animate-pulse"
              />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

import { cn } from '@/lib/utils'

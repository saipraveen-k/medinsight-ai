'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Lightbulb, FileText, CheckCircle, AlertTriangle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIInsightsProps {
  insights: {
    summary: string
    abnormal_findings: string[]
    recommendations: string[]
    when_to_consult_doctor: string
    disclaimer: string
  }
  className?: string
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-slate-700/50 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="text-cyan-400">{icon}</div>
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AIInsights({ insights, className }: AIInsightsProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-3xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">AI Insight</h2>
            <p className="text-xs text-slate-400 mt-1">
              Clinical decision-support analysis
            </p>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="divide-y divide-slate-700/30">
        {/* Summary */}
        <CollapsibleSection
          title="Summary"
          icon={<FileText className="h-4 w-4" />}
          defaultOpen={true}
        >
          <p className="text-sm text-slate-300 leading-relaxed">
            {insights.summary}
          </p>
        </CollapsibleSection>

        {/* Clinical Note */}
        <CollapsibleSection
          title="Clinical Note"
          icon={<AlertTriangle className="h-4 w-4" />}
        >
          <div className="space-y-2">
            {insights.abnormal_findings.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{finding}</p>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Recommendations */}
        <CollapsibleSection
          title="Recommendations"
          icon={<CheckCircle className="h-4 w-4" />}
        >
          <div className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* When to consult doctor */}
        <CollapsibleSection
          title="When to Consult Doctor"
          icon={<Calendar className="h-4 w-4" />}
        >
          <p className="text-sm text-slate-300 leading-relaxed">
            {insights.when_to_consult_doctor}
          </p>
        </CollapsibleSection>
      </div>

      {/* Footer disclaimer */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 leading-relaxed">
          {insights.disclaimer}
        </p>
      </div>
    </motion.div>
  )
}

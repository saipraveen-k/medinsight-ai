'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Brain, 
  FileText, 
  AlertTriangle, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ShieldCheck,
  Clock
} from 'lucide-react'

interface AIInsights {
  summary: string
  abnormal_findings: string[]
  recommendations: string[]
  when_to_consult_doctor: string
  disclaimer: string
}

interface PremiumAIInsightsProps {
  insights: AIInsights
  className?: string
}

export function PremiumAIInsights({ insights, className = '' }: PremiumAIInsightsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('summary')

  const sections = [
    {
      id: 'summary',
      icon: Brain,
      title: 'AI Summary',
      content: insights.summary,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/5'
    },
    {
      id: 'abnormal',
      icon: AlertTriangle,
      title: 'Abnormal Findings',
      content: insights.abnormal_findings,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/5',
      isList: true
    },
    {
      id: 'recommendations',
      icon: Lightbulb,
      title: 'Recommendations',
      content: insights.recommendations,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/5',
      isList: true
    },
    {
      id: 'consultation',
      icon: Calendar,
      title: 'When to Consult Doctor',
      content: insights.when_to_consult_doctor,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/5'
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6"
      >
        <div className={`p-3 rounded-xl ${sections[0].bgColor}`}>
          <Brain className={`h-6 w-6 ${sections[0].color}`} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI Insights</h2>
          <p className="text-sm text-muted-foreground">
            Patient-friendly analysis powered by advanced AI
          </p>
        </div>
      </motion.div>

      {/* Accordion Sections */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
        {sections.map((section, index) => {
          const Icon = section.icon
          const isExpanded = expandedSection === section.id
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-border last:border-b-0"
            >
              {/* Section Header */}
              <motion.button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors duration-200 relative overflow-hidden`}
                whileHover={{ backgroundColor: 'rgba(107, 114, 128, 0.5)' }}
              >
                {/* Left Accent Border */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${section.bgColor}`} />
                
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {section.title}
                    </h3>
                    {section.id === 'summary' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Overall health assessment
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-muted-foreground"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </motion.button>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      {section.isList ? (
                        <ul className="space-y-3">
                          {(section.content as string[]).map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                              className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                            >
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${section.bgColor}`} />
                              <span className="flex-1 text-overflow-break">
                                {item}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="text-sm text-muted-foreground leading-relaxed text-overflow-break"
                        >
                          {section.content}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              Medical Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed text-overflow-break">
              {insights.disclaimer}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

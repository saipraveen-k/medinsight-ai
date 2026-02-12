'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, FileText, Brain, TrendingUp, CheckCircle } from 'lucide-react'

interface LoadingStep {
  id: string
  label: string
  icon: React.ReactNode
  duration: number
}

interface LoadingStepperProps {
  isLoading: boolean
  onComplete?: () => void
  className?: string
}

export function LoadingStepper({ isLoading, onComplete, className }: LoadingStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)

  const steps: LoadingStep[] = [
    {
      id: 'extract',
      label: 'Extracting parameters from medical report...',
      icon: <FileText className="h-4 w-4" />,
      duration: 2000
    },
    {
      id: 'calculate',
      label: 'Calculating risk scores across categories...',
      icon: <TrendingUp className="h-4 w-4" />,
      duration: 2500
    },
    {
      id: 'analyze',
      label: 'Generating AI-powered insights...',
      icon: <Brain className="h-4 w-4" />,
      duration: 3000
    }
  ]

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0)
      setStepProgress(0)
      return
    }

    const currentStepData = steps[currentStep]
    if (!currentStepData) return

    const interval = setInterval(() => {
      setStepProgress(prev => {
        if (prev >= 100) {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
            return 0
          } else {
            onComplete?.()
            return 100
          }
        }
        return prev + (100 / (currentStepData.duration / 50))
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isLoading, currentStep, stepProgress, steps.length, onComplete])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50",
        className
      )}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Animated spinner */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-cyan-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-16 h-16 rounded-full bg-cyan-400/20"
              />
            </motion.div>
          </div>

          {/* Current step */}
          <div className="text-center mb-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 text-slate-200"
            >
              <div className="text-cyan-400">
                {steps[currentStep]?.icon}
              </div>
              <p className="text-sm font-medium">
                {steps[currentStep]?.label}
              </p>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs text-slate-500">
                {Math.round(stepProgress)}%
              </span>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index < currentStep
                    ? "bg-emerald-400"
                    : index === currentStep
                    ? "bg-cyan-400 w-8"
                    : "bg-slate-600"
                )}
              />
            ))}
          </div>

          {/* Completion state */}
          {currentStep === steps.length - 1 && stepProgress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center"
            >
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-emerald-400 font-medium">
                Analysis complete!
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

import { cn } from '@/lib/utils'

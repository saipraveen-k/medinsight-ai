'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Parameter {
  name: string
  value: number
  unit: string
  category: string
  normal_min?: number
  normal_max?: number
  is_abnormal: boolean
}

interface MedicalParametersProps {
  parameters: Parameter[]
  className?: string
}

interface ParameterGroup {
  category: string
  parameters: Parameter[]
}

function ParameterCard({ parameter }: { parameter: Parameter }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: parameter.is_abnormal 
          ? "0 0 20px rgba(239, 68, 68, 0.3)" 
          : "0 10px 30px rgba(0,0,0,0.2)"
      }}
      className={cn(
        "p-4 rounded-xl border transition-all duration-300",
        parameter.is_abnormal
          ? "bg-red-500/5 border-red-500/20 hover:border-red-400/40"
          : "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/40"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-200 truncate flex-1">
          {parameter.name}
        </h4>
        <div className="flex items-center gap-1 ml-2">
          {parameter.is_abnormal ? (
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          )}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-lg font-bold text-slate-100">
          {parameter.value}
        </span>
        <span className="text-xs text-slate-400">
          {parameter.unit}
        </span>
      </div>
      
      {parameter.normal_min !== undefined && parameter.normal_max !== undefined && (
        <div className="text-xs text-slate-500">
          Range: {parameter.normal_min} - {parameter.normal_max}
        </div>
      )}
    </motion.div>
  )
}

function CategorySection({ category, parameters }: { category: string; parameters: Parameter[] }) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Group duplicate parameters
  const groupedParams = parameters.reduce((acc, param) => {
    const existing = acc.find(p => p.name === param.name)
    if (existing) {
      existing.values.push(param.value)
      existing.readings++
    } else {
      acc.push({
        ...param,
        values: [param.value],
        readings: 1
      })
    }
    return acc
  }, [] as (Parameter & { values: number[]; readings: number })[])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-200">{category}</h3>
          <span className="text-xs text-slate-400">
            {parameters.length} parameter{parameters.length !== 1 ? 's' : ''}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {groupedParams.map((param, index) => (
            <motion.div
              key={`${param.name}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {param.readings > 1 ? (
                // Grouped display for multiple readings
                <div className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  param.is_abnormal
                    ? "bg-red-500/5 border-red-500/20 hover:border-red-400/40"
                    : "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/40"
                )}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-200 truncate flex-1">
                      {param.name}
                    </h4>
                    <div className="flex items-center gap-1 ml-2">
                      {param.is_abnormal ? (
                        <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-2">
                    {param.readings} reading{param.readings !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min:</span>
                      <span className="font-semibold text-slate-300">
                        {Math.min(...param.values)} {param.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max:</span>
                      <span className="font-semibold text-slate-300">
                        {Math.max(...param.values)} {param.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg:</span>
                      <span className="font-semibold text-slate-300">
                        {(param.values.reduce((a, b) => a + b, 0) / param.values.length).toFixed(1)} {param.unit}
                      </span>
                    </div>
                  </div>
                  
                  {param.normal_min !== undefined && param.normal_max !== undefined && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 text-xs text-slate-500">
                      Range: {param.normal_min} - {param.normal_max}
                    </div>
                  )}
                </div>
              ) : (
                <ParameterCard parameter={param} />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export function MedicalParameters({ parameters, className }: MedicalParametersProps) {
  // Group parameters by category
  const groupedParameters = parameters.reduce((acc, param) => {
    if (!acc[param.category]) {
      acc[param.category] = []
    }
    acc[param.category].push(param)
    return acc
  }, {} as Record<string, Parameter[]>)

  const categories = Object.entries(groupedParameters)

  return (
    <div className={cn("space-y-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-slate-100">Medical Parameters</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-slate-400">Abnormal</span>
          </div>
        </div>
      </motion.div>

      {categories.map(([category, params], index) => (
        <CategorySection
          key={category}
          category={category}
          parameters={params}
        />
      ))}
    </div>
  )
}

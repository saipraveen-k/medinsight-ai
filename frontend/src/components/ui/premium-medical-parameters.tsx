'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Brain,
  Droplet,
  Stethoscope,
  TestTube
} from 'lucide-react'

interface MedicalParameter {
  name: string
  value: number
  unit: string
  category: string
  normal_min?: number
  normal_max?: number
  is_abnormal: boolean
}

interface ProcessedParameter extends MedicalParameter {
  formattedName: string
  isDuplicate?: boolean
  minValue?: number
  maxValue?: number
  avgValue?: number
  count?: number
}

interface PremiumMedicalParametersProps {
  parameters: MedicalParameter[]
  className?: string
}

export function PremiumMedicalParameters({ parameters, className = '' }: PremiumMedicalParametersProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

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

  const groupParametersByCategory = () => {
    const grouped: Record<string, MedicalParameter[]> = {}
    
    parameters.forEach(param => {
      const category = param.category || 'other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(param)
    })

    return grouped
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const formatParameterName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')
  }

  const getStatusIcon = (isAbnormal: boolean) => {
    if (isAbnormal) {
      return <AlertTriangle className="h-4 w-4 text-rose-500" />
    }
    return <CheckCircle className="h-4 w-4 text-emerald-500" />
  }

  const getStatusColor = (isAbnormal: boolean) => {
    return isAbnormal 
      ? 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/20' 
      : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20'
  }

  const groupedParameters = groupParametersByCategory()

  const processDuplicateParameters = (params: MedicalParameter[]) => {
    const paramMap = new Map<string, MedicalParameter[]>()
    
    params.forEach(param => {
      const key = param.name.toLowerCase()
      if (!paramMap.has(key)) {
        paramMap.set(key, [])
      }
      paramMap.get(key)!.push(param)
    })

    return Array.from(paramMap.entries()).map(([name, duplicates]) => {
      if (duplicates.length === 1) {
        return { ...duplicates[0], formattedName: formatParameterName(name) } as ProcessedParameter
      }

      const values = duplicates.map(d => d.value)
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length

      return {
        ...duplicates[0],
        formattedName: formatParameterName(name),
        isDuplicate: true,
        minValue,
        maxValue,
        avgValue: Number(avgValue.toFixed(1)),
        count: duplicates.length
      } as ProcessedParameter
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {Object.entries(groupedParameters).map(([category, params], categoryIndex) => {
        const Icon = getCategoryIcon(category)
        const isExpanded = expandedCategories.has(category)
        const processedParams = processDuplicateParameters(params)
        const abnormalCount = params.filter(p => p.is_abnormal).length

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden"
          >
            {/* Category Header */}
            <motion.button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors duration-200 border-b border-border"
              whileHover={{ backgroundColor: 'rgba(107, 114, 128, 0.5)' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {formatParameterName(category)}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {params.length} parameters
                    </span>
                    {abnormalCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-xs text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="h-3 w-3" />
                        {abnormalCount} abnormal
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.button>

            {/* Parameters List */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isExpanded ? 'auto' : 0, 
                opacity: isExpanded ? 1 : 0 
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {processedParams.map((param, paramIndex) => (
                  <motion.div
                    key={`${param.name}-${paramIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: paramIndex * 0.05 }}
                    className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${getStatusColor(param.is_abnormal)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(param.is_abnormal)}
                          <h4 className="font-medium text-foreground truncate">
                            {param.formattedName}
                          </h4>
                        </div>
                        
                        {param.isDuplicate ? (
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Min:</span>
                              <span className="font-medium text-foreground ml-1">
                                {param.minValue} {param.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Max:</span>
                              <span className="font-medium text-foreground ml-1">
                                {param.maxValue} {param.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg:</span>
                              <span className="font-medium text-foreground ml-1">
                                {param.avgValue} {param.unit}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold text-foreground">
                              {param.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {param.unit}
                            </div>
                          </div>
                        )}

                        {param.normal_min !== undefined && param.normal_max !== undefined && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            <span>Reference: </span>
                            <span className="font-medium text-foreground">
                              {param.normal_min} - {param.normal_max} {param.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

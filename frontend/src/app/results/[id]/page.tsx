'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

interface AnalysisResult {
  upload_id: string
  status: string
  medical_data: {
    parameters: Array<{
      name: string
      value: number
      unit: string
      category: string
      normal_min?: number
      normal_max?: number
      is_abnormal: boolean
    }>
    total_parameters: number
    abnormal_count: number
  }
  risk_score: {
    score: number
    level: string
    category_scores: Record<string, number>
  }
  ai_insights: {
    summary: string
    abnormal_findings: string[]
    recommendations: string[]
    when_to_consult_doctor: string
    disclaimer: string
  }
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState<string>('')

  // Load any saved API key so subsequent calls can reuse it if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('medinsight-openai-key')
      if (stored) {
        setApiKey(stored)
      }
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      fetchResults(params.id as string)
    }
  }, [params.id])

  const fetchResults = async (uploadId: string) => {
    try {
      const response = await fetch(`/api/analysis/${uploadId}`, {
        headers: apiKey ? { 'x-api-key': apiKey } : undefined,
      })
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        setError('Analysis not found')
      }
    } catch (err) {
      setError('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'medium': return <AlertTriangle className="h-8 w-8 text-yellow-600" />
      case 'high': return <AlertTriangle className="h-8 w-8 text-orange-600" />
      case 'critical': return <AlertTriangle className="h-8 w-8 text-red-600" />
      default: return <TrendingUp className="h-8 w-8 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-500/20 via-slate-950 to-indigo-900/70">
          <div className="text-center text-sm text-slate-300">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-sky-400" />
            <p>Loading your analysis results…</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <Card className="max-w-md border-red-500/40 bg-slate-950/90">
            <CardHeader className="text-center">
              <CardTitle className="text-red-300">Error</CardTitle>
              <CardDescription className="text-slate-300">
                {error || 'Results not found'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full bg-sky-500 text-white hover:bg-sky-400">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="bg-gradient-to-br from-sky-500/20 via-slate-950 to-indigo-900/80">
        {/* Header */}
        <header className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-slate-800">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-50">Analysis results</span>
                <span className="text-[11px] text-slate-400">
                  Upload ID: {result.upload_id.slice(0, 8)}…
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Risk Score Card */}
            <Card className="border-slate-800 bg-slate-950/80 shadow-xl shadow-sky-900/40">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-50">Health risk assessment</CardTitle>
                <CardDescription className="text-slate-400">
                  Analysis across {result.medical_data.total_parameters} lab parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                  <div className="text-center">
                    {getRiskIcon(result.risk_score.level)}
                    <div
                      className={`mt-4 rounded-full px-6 py-3 text-sm font-medium uppercase ${getRiskColor(
                        result.risk_score.level
                      )}`}
                    >
                      <div className="text-3xl font-bold">
                        {result.risk_score.score}
                        <span className="text-base text-slate-300">/100</span>
                      </div>
                      <div className="mt-1 tracking-wide">
                        overall {result.risk_score.level} risk
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-sm space-y-2 text-sm text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total parameters</span>
                      <span className="font-medium">{result.medical_data.total_parameters}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Abnormal findings</span>
                      <span className="font-medium text-red-300">
                        {result.medical_data.abnormal_count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Within normal range</span>
                      <span className="font-medium text-emerald-300">
                        {result.medical_data.total_parameters -
                          result.medical_data.abnormal_count}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              {/* Medical Parameters */}
              <Card className="border-slate-800 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="text-slate-50">Medical parameters</CardTitle>
                  <CardDescription className="text-slate-400">
                    Detailed breakdown of your lab results with reference ranges.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 space-y-3 overflow-y-auto pr-1 text-sm">
                    {result.medical_data.parameters.map((param, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border p-3 ${
                          param.is_abnormal
                            ? 'border-red-500/40 bg-red-500/10'
                            : 'border-emerald-500/30 bg-emerald-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="font-medium text-slate-50">{param.name}</div>
                            <div className="text-xs capitalize text-slate-400">
                              {param.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-50">
                              {param.value} {param.unit}
                            </div>
                            {param.normal_min !== undefined &&
                              param.normal_max !== undefined && (
                                <div className="text-xs text-slate-400">
                                  Normal: {param.normal_min}-{param.normal_max} {param.unit}
                                </div>
                              )}
                          </div>
                        </div>
                        {param.is_abnormal && (
                          <div className="mt-2 text-xs font-medium text-red-200">
                            ⚠ Outside the reference range
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-slate-800 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="text-slate-50">AI‑powered explanation</CardTitle>
                  <CardDescription className="text-slate-400">
                    Plain‑language overview with lifestyle‑oriented suggestions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="mb-2 font-medium text-slate-100">Summary</h4>
                      <p className="text-sm text-slate-200">{result.ai_insights.summary}</p>
                    </div>

                    {result.ai_insights.abnormal_findings.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium text-red-200">Abnormal findings</h4>
                        <ul className="space-y-1 text-xs text-slate-200">
                          {result.ai_insights.abnormal_findings.map((finding, index) => (
                            <li key={index}>• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="mb-2 font-medium text-slate-100">Recommendations</h4>
                      <ul className="space-y-1 text-xs text-slate-200">
                        {result.ai_insights.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium text-slate-100">
                        When to consult your doctor
                      </h4>
                      <p className="text-xs text-slate-200">
                        {result.ai_insights.when_to_consult_doctor}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <Card className="border-amber-500/40 bg-amber-500/10">
              <CardContent className="pt-5 text-xs text-amber-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-200" />
                  <div>
                    <h4 className="font-semibold">Medical disclaimer</h4>
                    <p className="mt-1">
                      {result.ai_insights.disclaimer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

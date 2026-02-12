'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2, ShieldCheck, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { PremiumRiskGauge } from '@/components/ui/premium-risk-gauge'
import { PremiumCategoryCards } from '@/components/ui/premium-category-cards'
import { PremiumMedicalParameters } from '@/components/ui/premium-medical-parameters'
import { PremiumAIInsights } from '@/components/ui/premium-ai-insights'
import { LoadingStepper } from '@/components/ui/loading-stepper'
import { ToastContainer, Toast } from '@/components/ui/toast'

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
    level: 'low' | 'medium' | 'high' | 'critical' | string
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type?: 'success' | 'error' | 'info'}>>([])

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
      const response = await fetch(`http://localhost:8000/api/analysis/${uploadId}`, {
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

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleDownloadReport = async () => {
    if (!result || isDownloading) return
    
    setIsDownloading(true)
    
    try {
      const response = await fetch(`http://localhost:8000/api/analysis/${result.upload_id}/download`, {
        method: 'GET',
        headers: apiKey ? { 'x-api-key': apiKey } : undefined,
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const filename = `medinsight_report_${result.upload_id.slice(0, 8)}_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.pdf`
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        addToast('Report downloaded successfully.', 'success')
      } else {
        addToast('Failed to download report. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Download error:', error)
      addToast('An error occurred while downloading the report.', 'error')
    } finally {
      setIsDownloading(false)
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5">

        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-slate-800">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                <Lock className="h-3 w-3" />
                Secure processing
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Risk Gauge */}
            <div className="lg:col-span-1">
              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Overall Risk Assessment</CardTitle>
                  <CardDescription className="text-slate-400">
                    Based on your medical parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumRiskGauge 
                    score={result.risk_score.score} 
                    level={result.risk_score.level as 'low' | 'medium' | 'high' | 'critical'} 
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Category Cards and Parameters */}
            <div className="lg:col-span-2 space-y-8">
              {/* Category Cards */}
              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Health Categories</CardTitle>
                  <CardDescription className="text-slate-400">
                    Risk scores by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumCategoryCards categoryScores={result.risk_score.category_scores} />
                </CardContent>
              </Card>

              {/* Medical Parameters */}
              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Medical Parameters</CardTitle>
                  <CardDescription className="text-slate-400">
                    {result.medical_data.abnormal_count} of {result.medical_data.total_parameters} parameters are outside normal range
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumMedicalParameters parameters={result.medical_data.parameters} />
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">AI-Powered Insights</CardTitle>
                  <CardDescription className="text-slate-400">
                    Generated by advanced medical AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumAIInsights insights={result.ai_insights} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  )
}
// const response = await fetch(`/api/analysis/${uploadId}`, { -74
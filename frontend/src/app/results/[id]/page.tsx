'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2, ShieldCheck, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { RiskGauge } from '@/components/ui/risk-gauge'
import { CategoryCards } from '@/components/ui/category-cards'
import { AIInsights } from '@/components/ui/ai-insights'
import { MedicalParameters } from '@/components/ui/medical-parameters'
import { LoadingStepper } from '@/components/ui/loading-stepper'
import { ToastContainer } from '@/components/ui/toast'

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
      const response = await fetch(`/api/analysis/${result.upload_id}/download`, {
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
    <>
      <LoadingStepper isLoading={loading} />
      
      {!loading && !error && result && (
        <div className="min-h-screen bg-slate-950 text-slate-50">
          <div className="bg-gradient-to-br from-sky-500/10 via-slate-950 to-indigo-900/80">
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
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-50">Analysis Results</span>
                      <span className="text-[11px] text-slate-400">
                        Clinical decision-support tool • ID: {result.upload_id.slice(0, 8)}…
                      </span>
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
                    className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800 backdrop-blur-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800 backdrop-blur-sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-12"
              >
                {/* Risk Score Hero */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <h1 className="text-4xl font-bold text-slate-50 mb-4">
                    Health Risk Assessment
                  </h1>
                  <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                    Comprehensive analysis across {result.medical_data.total_parameters} medical parameters
                    with {result.medical_data.abnormal_count} abnormal findings detected
                  </p>
                  
                  <div className="flex justify-center mb-12">
                    <RiskGauge 
                      score={result.risk_score.score} 
                      level={result.risk_score.level}
                      confidence={85}
                    />
                  </div>
                  
                  {/* Download Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={handleDownloadReport}
                      disabled={isDownloading}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating PDF Report...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download Full Report
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Category Summary Blocks */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-slate-100 mb-6">Risk by Category</h2>
                  <CategoryCards categoryScores={result.risk_score.category_scores} />
                </motion.div>

                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  {/* Medical Parameters */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <MedicalParameters parameters={result.medical_data.parameters} />
                  </motion.div>

                  {/* AI Insights */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <AIInsights insights={result.ai_insights} />
                  </motion.div>
                </div>

                {/* Trust & Footer */}
                <motion.footer
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="border-t border-slate-800/60 pt-8"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      <span>Processed securely. No permanent storage.</span>
                    </div>
                    <div>
                      This is a clinical decision-support tool and does not replace professional medical advice.
                    </div>
                  </div>
                </motion.footer>
              </motion.div>
            </main>
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

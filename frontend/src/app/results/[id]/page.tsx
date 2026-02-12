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

  useEffect(() => {
    if (params.id) {
      fetchResults(params.id as string)
    }
  }, [params.id])

  const fetchResults = async (uploadId: string) => {
    try {
      const response = await fetch(`/api/analysis/${uploadId}`)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error || 'Results not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Analysis Results</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Risk Score Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your Health Risk Assessment</CardTitle>
              <CardDescription>
                Analysis completed for {result.medical_data.total_parameters} medical parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  {getRiskIcon(result.risk_score.level)}
                  <div className={`mt-4 px-6 py-3 rounded-full ${getRiskColor(result.risk_score.level)}`}>
                    <div className="text-3xl font-bold">{result.risk_score.score}/100</div>
                    <div className="text-sm font-medium uppercase">{result.risk_score.level} RISK</div>
                  </div>
                </div>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Parameters:</span>
                    <span className="font-medium">{result.medical_data.total_parameters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Abnormal Findings:</span>
                    <span className="font-medium text-red-600">{result.medical_data.abnormal_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Normal Results:</span>
                    <span className="font-medium text-green-600">
                      {result.medical_data.total_parameters - result.medical_data.abnormal_count}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Medical Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Parameters</CardTitle>
                <CardDescription>
                  Detailed breakdown of your medical test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.medical_data.parameters.map((param, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        param.is_abnormal
                          ? 'border-red-200 bg-red-50'
                          : 'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{param.name}</div>
                          <div className="text-sm text-gray-600">{param.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {param.value} {param.unit}
                          </div>
                          {param.normal_min !== undefined && param.normal_max !== undefined && (
                            <div className="text-sm text-gray-600">
                              Normal: {param.normal_min}-{param.normal_max} {param.unit}
                            </div>
                          )}
                        </div>
                      </div>
                      {param.is_abnormal && (
                        <div className="mt-2 text-sm text-red-600 font-medium">
                          ⚠️ Outside normal range
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Personalized analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-gray-700 text-sm">{result.ai_insights.summary}</p>
                  </div>

                  {result.ai_insights.abnormal_findings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Abnormal Findings</h4>
                      <ul className="space-y-1">
                        {result.ai_insights.abnormal_findings.map((finding, index) => (
                          <li key={index} className="text-sm text-gray-700">• {finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {result.ai_insights.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700">• {rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">When to Consult Doctor</h4>
                    <p className="text-sm text-gray-700">{result.ai_insights.when_to_consult_doctor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Medical Disclaimer</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    {result.ai_insights.disclaimer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

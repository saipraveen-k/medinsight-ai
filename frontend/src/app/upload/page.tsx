'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [apiKey, setApiKey] = useState<string>('')
  const router = useRouter()

  // Load any previously saved API key from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('medinsight-openai-key')
      if (stored) {
        setApiKey(stored)
      }
    }
  }, [])

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    if (typeof window !== 'undefined') {
      if (value) {
        window.localStorage.setItem('medinsight-openai-key', value)
      } else {
        window.localStorage.removeItem('medinsight-openai-key')
      }
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a PDF file')
      setUploadStatus('error')
      return
    }

    setUploading(true)
    setUploadStatus('uploading')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: apiKey ? { 'x-api-key': apiKey } : undefined,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const result = await response.json()
        setUploadId(result.upload_id)
        setUploadStatus('success')
        
        // Redirect to results page after a short delay
        setTimeout(() => {
          router.push(`/results/${result.upload_id}`)
        }, 2000)
      } else {
        const error = await response.json()
        setErrorMessage(error.detail || 'Upload failed')
        setUploadStatus('error')
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
      setUploadStatus('error')
    } finally {
      setUploading(false)
    }
  }, [router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: uploading
  })

  const resetUpload = () => {
    setUploadStatus('idle')
    setUploadProgress(0)
    setErrorMessage('')
    setUploadId(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="bg-gradient-to-br from-sky-500/25 via-[#BBDEF0]/25 to-indigo-900/80">
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
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BBDEF0] shadow-sm shadow-sky-400/40">
                  <FileText className="h-4 w-4 text-sky-900" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-50">Upload medical report</span>
                  <span className="text-[11px] text-slate-400">PDF only · Max 10MB</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
          >
            {/* Upload Card */}
            <Card className="border-slate-800 bg-slate-950/80 shadow-xl shadow-sky-900/40">
              <CardHeader>
                <CardTitle className="text-xl text-slate-50">Upload your lab PDF</CardTitle>
                <CardDescription className="text-slate-400">
                  Drag and drop a lab report PDF, or click to browse your files. We extract CBC,
                  glucose, lipid, kidney and liver markers automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Optional API key entry (overrides backend default key) */}
                <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <label className="block text-xs font-medium text-slate-200">
                    Optional: OpenAI API key for this browser
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Leave empty to use the backend default key from .env"
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Stored only in your browser (localStorage) for this demo. Not shared with the
                    backend or other users.
                  </p>
                </div>

                {uploadStatus === 'idle' && (
                  <div
                    {...getRootProps()}
                    className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                      isDragActive
                        ? 'border-sky-400 bg-sky-500/10'
                        : 'border-slate-700 hover:border-sky-400 hover:bg-slate-900/60'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sky-300 ring-1 ring-sky-500/40">
                      <Upload className="h-7 w-7" />
                    </div>
                    {isDragActive ? (
                      <p className="text-sm font-medium text-sky-200">Drop the PDF here…</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-50">
                          Drag & drop a medical report PDF here
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          or click to browse your files · PDF only · Max 10MB
                        </p>
                      </>
                    )}
                  </div>
                )}

                {uploadStatus === 'uploading' && (
                  <div className="space-y-4 rounded-2xl border border-sky-500/40 bg-slate-900/70 p-6 text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-sky-400" />
                    <h3 className="text-base font-medium text-slate-50">
                      Processing your report…
                    </h3>
                    <p className="text-xs text-slate-400">
                      Extracting parameters, computing risk score and generating AI explanation.
                    </p>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-slate-500">{uploadProgress}% complete</p>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="space-y-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
                    <CheckCircle className="mx-auto h-10 w-10 text-emerald-300" />
                    <h3 className="text-base font-medium text-emerald-100">
                      Upload successful!
                    </h3>
                    <p className="text-xs text-emerald-100/80">
                      Your report has been analyzed. Redirecting to your dashboard…
                    </p>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="space-y-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-red-300" />
                    <h3 className="text-base font-medium text-red-100">Upload failed</h3>
                    <p className="text-xs text-red-100/80">{errorMessage}</p>
                    <Button onClick={resetUpload} variant="outline" className="border-red-400/60 text-red-100 hover:bg-red-500/10">
                      Try again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information / reassurance panel */}
            <div className="space-y-4">
              <Card className="border-slate-800 bg-slate-950/80">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-100">What we analyze</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Optimized for typical lab reports used in primary care checkups.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-[11px] text-slate-300">
                  <div className="rounded-lg bg-slate-900/80 p-3">
                    <p className="font-semibold text-sky-200">🩸 Blood health</p>
                    <p className="mt-1">
                      Hemoglobin, WBC, RBC, platelets, hematocrit — summarized into a single blood
                      health view.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-3">
                    <p className="font-semibold text-amber-200">🍬 Glucose & lipids</p>
                    <p className="mt-1">
                      Fasting glucose, HbA1c and full lipid profile to estimate metabolic and
                      cardiovascular risk.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-3">
                    <p className="font-semibold text-emerald-200">🧪 Kidney & liver</p>
                    <p className="mt-1">
                      Creatinine, urea and ALT to flag potential organ stress early.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-950/80">
                <CardContent className="pt-4 text-[11px] text-slate-400">
                  <p className="font-semibold text-slate-200">Safety first</p>
                  <p className="mt-1">
                    MedInsight AI is a decision-support tool. It explains numbers and highlights
                    patterns, but it does not diagnose disease or replace professional medical
                    advice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

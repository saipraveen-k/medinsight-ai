'use client'

import { useState, useCallback } from 'react'
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
  const router = useRouter()

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
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Upload Medical Report</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Upload Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your Medical Report</CardTitle>
              <CardDescription>
                Drag and drop your PDF medical report or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadStatus === 'idle' && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600 font-medium">Drop the PDF here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop a medical report PDF here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supported format: PDF (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {uploadStatus === 'uploading' && (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <h3 className="text-lg font-medium">Processing your report...</h3>
                  <p className="text-gray-600">Analyzing medical parameters and generating insights</p>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium text-green-600">Upload Successful!</h3>
                  <p className="text-gray-600">Your report has been processed successfully.</p>
                  <p className="text-sm text-blue-600">Redirecting to results...</p>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="text-center space-y-4">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                  <h3 className="text-lg font-medium text-red-600">Upload Failed</h3>
                  <p className="text-gray-600">{errorMessage}</p>
                  <Button onClick={resetUpload} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secure Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Your medical reports are processed securely and are not stored permanently.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fast Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Get instant AI-powered analysis of your medical parameters within seconds.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinical Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  This tool assists but does not replace professional medical advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, TrendingUp, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MedInsight AI</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/upload">
                <Button variant="outline">Upload Report</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Understand Your Medical Reports with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your medical reports and get instant AI-powered analysis, risk scoring, 
            and patient-friendly explanations.
          </p>
          <Link href="/upload">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-5 w-5" />
              Analyze Your Report
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Smart Analysis</CardTitle>
              <CardDescription>
                AI extracts and analyzes medical parameters from your PDF reports
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Risk Scoring</CardTitle>
              <CardDescription>
                Get instant health risk assessment with visual indicators
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Patient-Friendly</CardTitle>
              <CardDescription>
                Simple explanations and recommendations you can understand
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-2xl font-bold text-center mb-6">Platform Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1,234</div>
              <div className="text-gray-600">Reports Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-gray-600">Available</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2024 MedInsight AI. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            This is a clinical decision-support tool and does not replace professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

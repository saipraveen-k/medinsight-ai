'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, TrendingUp, Heart, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="bg-gradient-to-br from-sky-500/25 via-[#BBDEF0]/35 to-indigo-900/80">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#BBDEF0] shadow-sm shadow-sky-400/40">
              <Heart className="h-5 w-5 text-sky-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-sky-50">
                MedInsight AI
              </span>
              <span className="text-xs text-slate-400">
                Automated Medical Report Intelligence
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-400 md:inline">
              Clinical decision-support • Not a diagnosis tool
            </span>
            <Link href="/upload">
              <Button className="bg-sky-500 text-white shadow-lg shadow-sky-500/40 hover:bg-sky-400">
                <Upload className="mr-2 h-4 w-4" />
                Upload Report
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero + Preview */}
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:pt-16">
        {/* Left column: copy & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-sky-200 shadow-sm ring-1 ring-sky-500/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            Safer, explainable AI for lab reports
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Turn confusing{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
              medical PDFs
            </span>{" "}
            into clear insights.
          </h1>

          <p className="max-w-xl text-base text-slate-300 sm:text-lg">
            Upload a lab report PDF and get instant AI-powered extraction of key
            parameters, explainable risk scoring on a 0–100 scale, and
            patient‑friendly guidance you can take to your doctor.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-sky-500 px-6 text-white shadow-lg shadow-sky-400/60 hover:bg-sky-400"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analyze a Report
              </Button>
            </Link>
            <span className="text-xs text-slate-400 sm:text-sm">
              No signup • Runs locally for this demo • PDF only (max 10MB)
            </span>
          </div>

          <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-900/70 p-4 shadow-sm ring-1 ring-sky-500/30">
              <p className="text-2xl font-semibold text-sky-200">CBC & Metabolic</p>
              <p className="mt-1 text-xs text-slate-300">
                Hemoglobin, WBC, RBC, platelets, glucose, HbA1c and more.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/70 p-4 shadow-sm ring-1 ring-emerald-500/30">
              <p className="text-2xl font-semibold text-emerald-200">Heart & Kidney</p>
              <p className="mt-1 text-xs text-slate-300">
                Lipid profile, creatinine, urea with grouped risk insights.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/70 p-4 shadow-sm ring-1 ring-indigo-500/30">
              <p className="text-2xl font-semibold text-indigo-200">Explainable AI</p>
              <p className="mt-1 text-xs text-slate-300">
                Clear narrative, not diagnosis. Always with medical disclaimers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right column: dashboard-style preview */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 flex flex-1 justify-center lg:mt-0"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/40 via-cyan-400/20 to-indigo-500/60 blur-2xl" />
            <Card className="relative overflow-hidden rounded-3xl border border-sky-100/40 bg-slate-950/80 shadow-2xl backdrop-blur">
              <CardHeader className="border-b border-slate-800/60 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-50">
                      Sample Health Overview
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Auto-generated from a single PDF lab report
                    </CardDescription>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/40">
                    Low risk
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Health Score
                    </span>
                    <span className="text-4xl font-semibold text-slate-50">
                      18<span className="text-base text-slate-500">/100</span>
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      Calculated via weighted abnormalities across all panels.
                    </span>
                  </div>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 via-sky-500/10 to-indigo-500/40 shadow-inner shadow-sky-500/40">
                    <div className="text-center">
                      <span className="text-xs font-semibold text-emerald-200">
                        Mostly
                      </span>
                      <div className="text-sm font-semibold text-emerald-200">
                        within range
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/15 p-3">
                    <p className="text-[11px] font-semibold text-emerald-200">
                      🩸 Blood Health
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-100">
                      Hb, WBC, RBC, platelets all within reference ranges.
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-400/40 bg-amber-500/15 p-3">
                    <p className="text-[11px] font-semibold text-amber-100">
                      🍬 Glucose Health
                    </p>
                    <p className="mt-1 text-[11px] text-amber-50">
                      Fasting glucose slightly elevated; HbA1c at the upper edge.
                    </p>
                  </div>
                  <div className="rounded-lg border border-sky-400/40 bg-sky-500/15 p-3">
                    <p className="text-[11px] font-semibold text-sky-100">
                      ❤️ Heart Risk
                    </p>
                    <p className="mt-1 text-[11px] text-sky-50">
                      LDL mildly high; HDL protective. Lifestyle focus recommended.
                    </p>
                  </div>
                  <div className="rounded-lg border border-indigo-400/40 bg-indigo-500/15 p-3">
                    <p className="text-[11px] font-semibold text-indigo-100">
                      🧪 Kidney & Liver
                    </p>
                    <p className="mt-1 text-[11px] text-indigo-50">
                      Creatinine, urea and ALT within normal limits.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900/80 p-3 text-[11px] text-slate-300 ring-1 ring-slate-700/80">
                  <span className="font-semibold text-slate-50">AI summary · </span>
                  Most results look reassuring. A few values are slightly outside
                  the ideal range; discuss these trends and lifestyle changes with
                  your clinician rather than making decisions on your own.
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© 2024 MedInsight AI. All rights reserved.</p>
          <p>
            This is a clinical decision-support tool and does not replace professional
            medical advice.
          </p>
        </div>
      </footer>
      </div>
    </div>
  )
}

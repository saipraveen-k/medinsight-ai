'use client'

import { motion } from 'framer-motion'
import {
  Upload,
  FileText,
  TrendingUp,
  Heart,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">

      {/* ================= BACKGROUND WRAPPER ================= */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5">

        {/* ================= HEADER ================= */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-wide">
                  MedInsight AI
                </span>
                <span className="text-xs text-muted-foreground">
                  Clinical decision-support tool
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                Not a diagnosis tool
              </div>

              <ThemeToggle />

              <Link href="/upload">
                <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 transition-all duration-300">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Report
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-medium text-primary ring-1 ring-primary/40">
                <ShieldCheck className="h-3.5 w-3.5" />
                Safer, Explainable AI for Lab Reports
              </div>

              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl xl:text-6xl">
                Transform confusing{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  medical PDFs
                </span>{" "}
                into clear, actionable insights.
              </h1>

              <p className="max-w-xl text-lg text-muted-foreground">
                Instantly extract key lab parameters, calculate explainable risk
                scores, and receive AI-generated guidance you can confidently
                discuss with your doctor.
              </p>

              <div className="flex items-center gap-4">
                <Link href="/upload">
                  <Button size="lg" className="bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/50 hover:bg-primary/90">
                    <Upload className="mr-2 h-5 w-5" />
                    Analyze Report
                  </Button>
                </Link>

                <span className="text-sm text-muted-foreground">
                  No signup • PDF only • Demo mode
                </span>
              </div>
            </motion.div>

            {/* RIGHT DASHBOARD PREVIEW */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-xl">
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/50 blur-3xl animate-pulse-glow" />

                <Card className="relative rounded-3xl border border-border bg-card/90 shadow-2xl backdrop-blur-xl">
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">
                          Sample Health Overview
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          Generated from uploaded PDF
                        </CardDescription>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-400/40">
                        Low Risk
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-6">

                    {/* Score Row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Health Score
                        </p>
                        <div className="text-5xl font-semibold">
                          18<span className="text-lg text-muted-foreground">/100</span>
                        </div>
                      </div>

                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 via-primary/10 to-accent/40">
                        <div className="text-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                          Mostly <br /> within range
                        </div>
                      </div>
                    </div>

                    {/* Mini Risk Panels */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {[
                        "Blood Health",
                        "Glucose Panel",
                        "Cardiac Risk",
                        "Kidney & Liver",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-border bg-card/80 p-3 overflow-hidden"
                        >
                          <p className="font-semibold text-primary truncate">{item}</p>
                          <p className="mt-1 text-muted-foreground text-overflow-break">
                            Within reference range.
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-card/90 p-3 text-xs text-muted-foreground ring-1 ring-border">
                      <span className="font-semibold text-foreground">
                        AI Summary ·
                      </span>{" "}
                      Overall reassuring results. Minor elevations should be
                      reviewed with your clinician.
                    </div>

                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              {[
                { icon: Upload, title: "Upload PDF" },
                { icon: TrendingUp, title: "AI Analysis" },
                { icon: FileText, title: "Get Insights" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl border border-border bg-card/80 p-8 overflow-hidden"
                >
                  <item.icon className="mx-auto mb-4 h-6 w-6 text-primary" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground text-overflow-break">
                    AI-powered medical understanding in seconds.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COMPARISON SECTION ================= */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 overflow-hidden">
              <h3 className="text-xl font-semibold text-destructive mb-4">
                Raw Medical Report
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Hard to interpret values</li>
                <li>• No prioritization</li>
                <li>• Medical jargon overload</li>
                <li>• Anxiety-inducing format</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-8 overflow-hidden">
              <h3 className="text-xl font-semibold text-primary mb-4">
                AI-Powered Dashboard
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li>• Clear 0–100 risk scoring</li>
                <li>• Category grouping</li>
                <li>• Prioritized abnormalities</li>
                <li>• Actionable guidance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-3 w-3" />
            Processed securely. No permanent storage.
          </div>
          © 2026 MedInsight AI • Built by BIT BROTHERS
        </footer>

      </div>
    </div>
  )
}
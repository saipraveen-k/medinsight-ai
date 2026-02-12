# MedInsight AI - Premium Medical Analytics Dashboard

## Problem Statement
Patients receive medical reports (PDF format) that are difficult to interpret. This system extracts key medical parameters, compares them with reference ranges, detects abnormalities, calculates health risk scores, and generates simplified AI explanations for patients.

## 🚀 What's New - Premium SaaS Upgrade

Transformed from MVP to a **premium medical analytics dashboard** with:

### 🎯 **Enhanced Risk Visualization**
- **Animated radial progress gauge** with smooth fill animations
- **Color-coded risk mapping** (Green/Yellow/Red for risk levels)
- **AI confidence indicators** with percentage display
- **Category-based risk cards** with progress bars

### 📊 **Professional UI/UX**
- **Dark healthcare theme** with modern glass effects
- **Micro-interactions** with Framer Motion animations
- **Step-based loading experience** with progress indicators
- **Hospital-grade PDF export** with professional medical report styling

### 🧠 **AI Insights Panel**
- **Structured accordion panels** for organized information
- **Collapsible sections** for clinical notes and recommendations
- **Category-grouped medical parameters** with duplicate handling
- **Trust indicators** and medical disclaimers

### 📥 **PDF Export Feature**
- **Professional medical report** generation
- **Complete analysis export** with risk scores and AI insights
- **Hospital-grade document** styling and formatting
- **One-click download** with loading states and toast notifications

## Tech Stack
- **Frontend**: Next.js 14 + Tailwind + shadcn/ui + Framer Motion + Recharts
- **Backend**: FastAPI + Python + ReportLab (PDF generation)
- **AI**: LangChain + OpenAI/Gemini
- **Data**: pdfplumber + Pandas
- **Charts**: Recharts with custom visualizations
- **Database**: SQLite
- **UI Components**: Custom premium components (RiskGauge, CategoryCards, AIInsights)
- **Animations**: Framer Motion with micro-interactions

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (for backend default). Optional: per-browser key via UI.

### Installation

#### Backend
```bash
cd backend
pip install -r requirements.txt

# create .env from example if needed
cp .env.example .env

# add your default OpenAI key in .env (used when UI key is empty)
# OPENAI_API_KEY=your_openai_api_key_here

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` and:

### Network Access (like Streamlit)
For access from other devices on your network:
- **Frontend**: http://YOUR_IP:3000  
- **Backend API**: http://YOUR_IP:8000
- **API Docs**: http://YOUR_IP:8000/docs

Find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

- Go to the **Upload** page
- (Optional) Paste an OpenAI API key in the field at the top of the card – this key is stored only in your browser and overrides the backend `.env` key for that browser
- Drag-and-drop a **PDF file (max 10MB)** and wait for analysis

## Features

### 🏥 **Core Medical Analysis**
- 📄 PDF medical report upload and processing (max 10MB)
- 🧠 AI-powered medical parameter extraction with high accuracy
- 📊 Advanced risk scoring (0–100 scale) with category breakdowns
- 💡 Patient-friendly AI explanations with clinical insights
- 📈 Interactive visualizations and animated charts

### 🎨 **Premium Dashboard Experience**
- 🌟 **Animated Risk Gauge**: Radial progress with color-coded risk levels
- 📋 **Category Cards**: Interactive risk breakdown by medical category
- 🧩 **Parameter Grouping**: Organized by category with duplicate handling
- ✨ **Micro-interactions**: Smooth animations and hover effects
- � **Fully Responsive**: Mobile-optimized premium interface

### 📥 **Professional Export**
- 📄 **Hospital-Grade PDF**: Professional medical report styling
- 📊 **Complete Analysis**: Risk scores, findings, and AI insights
- 🔒 **Secure Processing**: No permanent storage, privacy-focused
- ⚡ **One-Click Download**: Fast generation with progress indicators

### 🔒 **Trust & Safety**
- �️ **Medical Disclaimer**: Clinical decision-support labeling
- 🔐 **Privacy First**: Secure processing with no data retention
- ⚕️ **Professional Standards**: Healthcare-grade UI/UX design
- 📋 **Transparent AI**: Explainable insights with confidence scores

Backend persists each analysis JSON to `backend/storage/processed/{upload_id}.json` so
`/api/analysis/{upload_id}` remains stable for demo and page refresh.

## Architecture
```
Frontend (Next.js + Premium Components)
    ↔ Backend (FastAPI + PDF Generation)
        ↔ AI Services (LangChain + OpenAI/Gemini)
            ↔ Medical Analysis (PDF Processing + Risk Scoring)
```

### 🏗️ **Component Architecture**
- **RiskGauge**: Animated radial progress component
- **CategoryCards**: Interactive risk category display
- **AIInsights**: Structured accordion panels
- **MedicalParameters**: Grouped parameter display
- **LoadingStepper**: Step-based progress indicator
- **ToastContainer**: Notification system
- **PDFGenerator**: Professional report generation

## Disclaimer
This is a clinical decision-support tool and does not replace professional medical advice.

## 🏆 **Hackathon Impact**

### **Investor-Ready Features**
- ✅ **SaaS-Level Polish**: Premium medical analytics dashboard
- ✅ **Professional Design**: Healthcare-grade UI/UX
- ✅ **Complete Feature Set**: End-to-end medical analysis workflow
- ✅ **Export Capability**: Professional PDF report generation
- ✅ **Trust Elements**: Medical disclaimers and privacy indicators

### **Technical Excellence**
- 🚀 **Modern Stack**: Next.js 14, FastAPI, Framer Motion
- 🎨 **Design System**: Consistent spacing, colors, and interactions
- 📊 **Data Visualization**: Custom charts and risk gauges
- 🔧 **Scalable Architecture**: Modular components and services
- 🧪 **Quality Code**: TypeScript, proper error handling, responsive design

## License
MIT

---

**© 2026 MedInsight AI. All rights reserved made by BIT BROTHERS.**

*Clinical decision-support tool • Not a replacement for professional medical advice*

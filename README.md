# MedInsight AI - Automated Medical Report Analysis System

## Problem Statement
Patients receive medical reports (PDF format) that are difficult to interpret. This system extracts key medical parameters, compares them with reference ranges, detects abnormalities, calculates health risk scores, and generates simplified AI explanations for patients.

## Tech Stack
- **Frontend**: Next.js + Tailwind + shadcn/ui + Framer Motion
- **Backend**: FastAPI + Python
- **AI**: LangChain + OpenAI/Gemini
- **Data**: pdfplumber + Pandas
- **Charts**: Recharts
- **Database**: SQLite

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (or Gemini)

### Installation

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- 📄 PDF medical report upload and processing
- 🧠 AI-powered medical parameter extraction
- 📊 Risk scoring with visual indicators
- 💡 Patient-friendly explanations
- 📈 Interactive charts and visualizations
- 📱 Responsive modern UI

## Architecture
```
Frontend (Next.js) ↔ Backend (FastAPI) ↔ AI Services (LLM)
```

## Disclaimer
This is a clinical decision-support tool and does not replace professional medical advice.

## License
MIT

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

uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` and:
- Go to the **Upload** page
- (Optional) Paste an OpenAI API key in the field at the top of the card – this key is stored only in your browser and overrides the backend `.env` key for that browser
- Drag-and-drop a **PDF file (max 10MB)** and wait for analysis

## Features
- 📄 PDF medical report upload and processing
- 🧠 AI-powered medical parameter extraction
- 📊 Risk scoring with visual indicators (0–100 scale; Low/Moderate/High)
- 💡 Patient-friendly explanations
- 📈 Interactive charts and visualizations
- 📱 Responsive modern UI

Backend persists each analysis JSON to `backend/storage/processed/{upload_id}.json` so
`/api/analysis/{upload_id}` remains stable for demo and page refresh.

## Architecture
```
Frontend (Next.js) ↔ Backend (FastAPI) ↔ AI Services (LLM)
```

## Disclaimer
This is a clinical decision-support tool and does not replace professional medical advice.

## License
MIT

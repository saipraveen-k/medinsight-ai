# MedInsight AI - Quick Start Guide

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key (or Gemini)

### 1. Clone & Setup
```bash
git clone https://github.com/saipraveen-k/medinsight-ai
cd medinsight-ai
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Local Access:**
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:8000
  - API Docs: http://localhost:8000/docs

- **Network Access (from other devices on same network):**
  - Frontend: http://YOUR_IP:3000
  - Backend API: http://YOUR_IP:8000
  - API Docs: http://YOUR_IP:8000/docs

To find YOUR_IP, run: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

## 🎯 MVP Features

### ✅ Working Features
- PDF medical report upload
- Medical parameter extraction
- Risk scoring algorithm
- AI-powered insights
- Modern responsive UI
- Real-time processing status

### 🔄 Test Flow
1. Go to http://localhost:3000
2. Click "Upload Report" or drag-drop a PDF
3. Wait for processing (simulated progress)
4. View results with risk score and insights

## 🛠️ Development Commands

### Backend
```bash
# Start server (network accessible)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Check API docs
curl http://localhost:8000/docs
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Key Components

### Backend Services
- `PDFProcessor`: Extracts text from PDFs
- `MedicalAnalyzer`: Identifies medical parameters
- `RiskScorer`: Calculates health risk scores
- `AIService`: Generates AI insights

### Frontend Pages
- `/`: Landing page with features
- `/upload`: File upload interface
- `/results/[id]`: Analysis results display

## 🔧 Configuration

### Environment Variables (.env)
```bash
OPENAI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./storage/medinsight.db
```

### Docker Setup
```bash
docker-compose up --build
```

## 📝 Notes

- **Lint Errors**: Expected until dependencies are installed
- **Database**: SQLite with auto-initialization
- **File Storage**: Local storage in `/storage` directory
- **AI Integration**: OpenAI GPT-3.5 for insights
- **Processing Time**: <30 seconds for typical reports

## 🎨 UI Features

- Modern design with Tailwind CSS
- shadcn/ui components
- Framer Motion animations
- Responsive mobile layout
- Real-time progress indicators
- Interactive risk score display

## 🚨 Important

This is a **clinical decision-support tool** and does not replace professional medical advice. Always include appropriate disclaimers in production use.

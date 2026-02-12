# MedInsight AI - Complete Setup & Installation Guide

## 🚀 Quick Overview

This guide provides step-by-step instructions for setting up the complete MedInsight AI development environment on your local machine.

**Repository Location**: `C:\tempp\projects\medinsight-ai\`

---

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: Minimum 5GB free space
- **Internet**: Stable connection for API calls

### Required Software

#### 1. Node.js (Version 18 or higher)
```bash
# Check if installed
node --version

# If not installed, download from:
# https://nodejs.org/en/download/
```

#### 2. Python (Version 3.9 or higher)
```bash
# Check if installed
python --version
# or
python3 --version

# If not installed, download from:
# https://www.python.org/downloads/
```

#### 3. Git
```bash
# Check if installed
git --version

# If not installed, download from:
# https://git-scm.com/downloads/
```

#### 4. OpenAI API Key
- Sign up at: https://platform.openai.com/
- Create API key: https://platform.openai.com/account/api-keys
- Note: Free tier available for testing

---

## 🗂️ Repository Setup

### 1. Clone or Navigate to Repository
```bash
# If you have the repository locally, navigate to it:
cd C:\tempp\projects\medinsight-ai

# If you need to clone it (replace with actual repo URL):
git clone <repository-url> medinsight-ai
cd medinsight-ai
```

### 2. Verify Repository Structure
```bash
# Should see this structure:
C:\tempp\projects\medinsight-ai\
├── frontend/                 # Next.js application
├── backend/                  # FastAPI application
├── docs/                     # Documentation
├── docker-compose.yml        # Development environment
├── QUICK_START.md           # Quick setup
├── README.md                # Project overview
└── SETUP_GUIDE.md           # This file
```

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd C:\tempp\projects\medinsight-ai\backend
```

### 2. Create Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

### 3. Install Python Dependencies
```bash
# Install required packages
pip install -r requirements.txt

# Verify installation
pip list
```

### 4. Set Up Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit .env file (use any text editor)
# Add your default OpenAI API key (used when UI key is empty):
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./storage/medinsight.db
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### 5. Initialize Database
```bash
# Create storage directories
mkdir -p storage/uploads storage/processed

# Initialize database
python -c "from app.database.connection import init_db; init_db()"
```

### 6. Test Backend Server
```bash
# Start FastAPI server
uvicorn app.main:app --reload --port 8000

# You should see output like:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Started reloader process
# INFO:     Started server process
```

### 7. Verify Backend is Working
```bash
# Test health endpoint in new terminal
curl http://localhost:8000/health

# Should return:
# {"status": "healthy", "service": "MedInsight AI"}
```

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
# Open new terminal and navigate:
cd C:\tempp\projects\medinsight-ai\frontend
```

### 2. Install Node.js Dependencies
```bash
# Install packages
npm install

# Verify installation
npm list --depth=0
```

### 3. Set Up Environment Variables
```bash
# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

# Or create manually with content:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```
cd C:\tempp\projects\medinsight-ai\frontend
npm install @radix-ui/react-slot class-variance-authority

cd C:\tempp\projects\medinsight-ai\frontend
npm install tailwind-merge
npm run dev
### 4. Test Frontend Development Server
```bash
# Start Next.js development server
npm run dev

# You should see output like:
# ✓ Ready in seconds
# - Local:        http://localhost:3000
```

### 5. Verify Frontend is Working
- Open browser to: http://localhost:3000
- You should see the MedInsight AI homepage

---

## 🐳 Docker Alternative Setup

### Using Docker Compose (Recommended)

#### 1. Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop

#### 2. Run with Docker Compose
```bash
# Navigate to project root
cd C:\tempp\projects\medinsight-ai

# Set environment variables
set OPENAI_API_KEY=your_openai_api_key_here

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

#### 3. Stop Docker Services
```bash
# Stop all services
docker-compose down

# Remove containers and volumes (clean start)
docker-compose down -v
```

---

## 🧪 Verification & Testing

### 1. Complete System Test
```bash
# Test 1: Backend Health
curl http://localhost:8000/health

# Test 2: Frontend Access
# Open http://localhost:3000 in browser

# Test 3: API Documentation
# Open http://localhost:8000/docs in browser
```

### 2. Upload Test File
```bash
# Ensure storage directories exist
mkdir -p storage/uploads storage/processed

# You can use any medical report PDF for testing (max 10MB).
# Test upload via API (backend will run full pipeline and persist a JSON result):
curl -X POST \
  http://localhost:8000/api/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@test_report.pdf'
```

To retrieve the analysis later (as used by the frontend results page):

```bash
curl http://localhost:8000/api/analysis/<upload_id_returned_from_upload>
```

### 3. Check File Structure
```bash
# Verify all directories exist:
C:\tempp\projects\medinsight-ai\
├── backend/
│   ├── venv/                  # Python virtual environment
│   ├── storage/
│   │   ├── uploads/           # PDF uploads
│   │   ├── processed/         # Processed data
│   │   └── medinsight.db      # SQLite database
│   └── app/                   # Application code
├── frontend/
│   ├── node_modules/          # Node dependencies
│   ├── .next/                 # Next.js build cache
│   └── src/                   # Source code
└── docs/                      # Documentation
```

---

## 🔧 Common Issues & Solutions

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Solution: Activate virtual environment
# Windows:
C:\tempp\projects\medinsight-ai\backend\venv\Scripts\activate

# macOS/Linux:
source C:\tempp\projects\medinsight-ai/backend/venv/bin/activate

# Then reinstall dependencies
pip install -r requirements.txt
```

#### Issue: "sqlite3.OperationalError: unable to open database file"
```bash
# Solution: Create storage directories and initialize database
cd C:\tempp\projects\medinsight-ai\backend
mkdir -p storage/uploads storage/processed
python -c "from app.database.connection import init_db; init_db()"
```

#### Issue: "openai.AuthenticationError: No API key provided"
```bash
# Solution: Add API key to .env file
cd C:\tempp\projects\medinsight-ai\backend
notepad .env
# Add: OPENAI_API_KEY=your_actual_api_key_here
```

### Frontend Issues

#### Issue: "Cannot find module 'react'"
```bash
# Solution: Install dependencies
cd C:\tempp\projects\medinsight-ai\frontend
npm install
# If issues persist, delete node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Port 3000 already in use"
```bash
# Solution: Kill process or use different port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use different port:
npm run dev -- -p 3001
```

#### Issue: "CORS errors in browser"
```bash
# Solution: Check backend CORS configuration
# Ensure .env file includes:
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### Docker Issues

#### Issue: "docker: command not found"
```bash
# Solution: Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop/
```

#### Issue: "port already allocated"
```bash
# Solution: Stop existing containers
docker-compose down
# Or use different ports in docker-compose.yml
```

---

## 📱 IDE Setup Recommendations

### Visual Studio Code Extensions
```bash
# Recommended extensions:
- Python (Microsoft)
- Python Docstring Generator (Nils Werner)
- Pylance (Microsoft)
- ES7+ React/Redux/React-Native snippets (dsznajder)
- Tailwind CSS IntelliSense (tailwindlabs)
- GitLens (GitKraken)
- Docker (Microsoft)
```

### VS Code Workspace Settings
```json
// .vscode/settings.json
{
  "python.defaultInterpreterPath": "C:\\tempp\\projects\\medinsight-ai\\backend\\venv\\Scripts\\python.exe",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": ["javascript", "typescript", "react", "html"],
  "editor.formatOnSave": true
}
```

---

## 🚀 Next Steps After Setup

### 1. Explore the Application
- Visit: http://localhost:3000
- Upload a sample medical report
- Review the analysis results

### 2. Read the Documentation
```bash
# Main documentation index:
C:\tempp\projects\medinsight-ai\docs\INDEX.md

# Quick start guide:
C:\tempp\projects\medinsight-ai\QUICK_START.md

# Architecture overview:
C:\tempp\projects\medinsight-ai\docs\ARCHITECTURE.md
```

### 3. Review the Code
```bash
# Backend main application:
C:\tempp\projects\medinsight-ai\backend\app\main.py

# Frontend main page:
C:\tempp\projects\medinsight-ai\frontend\src\app\page.tsx

# API endpoints:
C:\tempp\projects\medinsight-ai\backend\app\api\routes\
```

### 4. Test the Full Flow
1. Upload a PDF medical report
2. Wait for processing (should be <30 seconds)
3. Review the risk score and AI insights
4. Check the parameter breakdown
5. Refresh the results page – data is loaded from the stored JSON via `/api/analysis/{upload_id}`

---

## 📞 Troubleshooting Resources

### Documentation References
- **Complete API Guide**: `docs\API_REFERENCE.md`
- **Architecture Details**: `docs/ARCHITECTURE.md`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **FAQ**: `docs/FAQ.md`

### Common Commands Reference
```bash
# Backend commands:
cd C:\tempp\projects\medinsight-ai\backend
source venv/Scripts/activate  # Windows
uvicorn app.main:app --reload --port 8000

# Frontend commands:
cd C:\tempp\projects\medinsight-ai\frontend
npm run dev
npm run build
npm test

# Docker commands:
cd C:\tempp\projects\medinsight-ai
docker-compose up --build
docker-compose down
```

### Getting Help
- **Technical Issues**: Check `docs/TROUBLESHOOTING.md`
- **API Questions**: Review `docs/API_REFERENCE.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **General Help**: Review `docs/FAQ.md`

---

## ✅ Setup Verification Checklist

### Backend Setup ✅
- [ ] Python 3.9+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Environment variables configured (`.env` file)
- [ ] Database initialized
- [ ] Server starts successfully (`uvicorn app.main:app`)
- [ ] Health endpoint accessible (`http://localhost:8000/health`)

### Frontend Setup ✅
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Development server starts (`npm run dev`)
- [ ] Application accessible (`http://localhost:3000`)

### Integration ✅
- [ ] Backend and frontend can communicate
- [ ] CORS properly configured
- [ ] File upload functionality works
- [ ] API endpoints respond correctly
- [ ] Database operations work

### Optional: Docker Setup ✅
- [ ] Docker Desktop installed
- [ ] `docker-compose up --build` works
- [ ] All services accessible
- [ ] No port conflicts

---

## 🎯 You're Ready!

Once you've completed all the steps in this checklist, your MedInsight AI development environment is fully set up and ready for development, testing, or demonstration.

**Access Points:**
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

**Happy coding! 🚀**

---

*Last updated: February 2026*  
*Repository: C:\tempp\projects\medinsight-ai*

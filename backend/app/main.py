from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from pathlib import Path
import uuid
from typing import Optional

from app.services.pdf_processor import PDFProcessor
from app.services.medical_analyzer import MedicalAnalyzer
from app.services.risk_scorer import RiskScorer
from app.services.ai_service import AIService
from app.models.medical import AnalysisResponse, UploadResponse
from app.database.connection import init_db

app = FastAPI(
    title="MedInsight AI API",
    description="Automated Medical Report Analysis System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_processor = PDFProcessor()
medical_analyzer = MedicalAnalyzer()
risk_scorer = RiskScorer()
ai_service = AIService()

# Storage directories
UPLOAD_DIR = Path("storage/uploads")
PROCESSED_DIR = Path("storage/processed")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "MedInsight AI API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "MedInsight AI"}

@app.post("/api/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process a medical report PDF
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Generate unique ID
    upload_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{upload_id}_{file.filename}"
    
    # Save uploaded file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    
    # Start processing (async)
    try:
        # Extract text from PDF
        text_content = pdf_processor.extract_text(file_path)
        
        # Analyze medical parameters
        medical_data = medical_analyzer.extract_parameters(text_content)
        
        # Calculate risk score
        risk_score = risk_scorer.calculate_risk_score(medical_data)
        
        # Generate AI insights
        ai_insights = await ai_service.generate_insights(medical_data, risk_score)
        
        # Prepare response
        response = AnalysisResponse(
            upload_id=upload_id,
            filename=file.filename,
            medical_data=medical_data,
            risk_score=risk_score,
            ai_insights=ai_insights,
            status="completed"
        )
        
        return UploadResponse(
            upload_id=upload_id,
            message="File uploaded and processed successfully",
            status="completed"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/api/analysis/{upload_id}")
async def get_analysis(upload_id: str):
    """
    Retrieve analysis results for a specific upload
    """
    # In a real implementation, you would fetch from database
    # For MVP, return mock data or check if file exists
    file_path = UPLOAD_DIR / f"{upload_id}_*.pdf"
    
    if not any(UPLOAD_DIR.glob(f"{upload_id}_*.pdf")):
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Mock response for now - in real implementation, fetch from database
    return {
        "upload_id": upload_id,
        "status": "completed",
        "medical_data": {
            "parameters": [
                {"name": "Glucose", "value": 95, "unit": "mg/dL", "category": "metabolic"},
                {"name": "Cholesterol", "value": 210, "unit": "mg/dL", "category": "metabolic"}
            ]
        },
        "risk_score": 35,
        "risk_level": "medium",
        "ai_insights": {
            "summary": "Your results show mostly normal values with slight elevation in cholesterol.",
            "recommendations": ["Consider dietary changes", "Regular exercise recommended"]
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from pathlib import Path
import uuid
from typing import Optional
import json
import time

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
async def upload_file(
    file: UploadFile = File(...),
    api_key: Optional[str] = Header(default=None, alias="x-api-key"),
):
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

            # Enforce 10MB max size for hackathon demo stability
            max_size_bytes = 10 * 1024 * 1024
            if len(content) > max_size_bytes:
                raise HTTPException(status_code=400, detail="File too large (max 10MB)")

            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
    
    # Start processing (sync for MVP)
    try:
        start_time = time.time()

        # Extract text from PDF
        text_content = pdf_processor.extract_text(file_path)
        
        # Analyze medical parameters
        medical_data = medical_analyzer.extract_parameters(text_content)
        
        # Calculate risk score
        risk_score = risk_scorer.calculate_risk_score(medical_data)
        
        # Generate AI insights
        ai_insights = await ai_service.generate_insights(
            medical_data=medical_data,
            risk_score=risk_score,
            api_key_override=api_key,
        )
        processing_time = time.time() - start_time
        
        # Prepare response
        response = AnalysisResponse(
            upload_id=upload_id,
            filename=file.filename,
            medical_data=medical_data,
            risk_score=risk_score,
            ai_insights=ai_insights,
            status="completed",
            processing_time=processing_time,
        )

        # Persist analysis for demo-stable retrieval
        try:
            analysis_path = PROCESSED_DIR / f"{upload_id}.json"
            with open(analysis_path, "w", encoding="utf-8") as f:
                json.dump(response.model_dump(), f, ensure_ascii=False, indent=2)
        except Exception as e:
            # Do not fail the request if persistence fails; just log in real setup
            pass
        
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
    Retrieve analysis results for a specific upload.

    For the hackathon MVP, results are stored as JSON files in storage/processed.
    """
    analysis_path = PROCESSED_DIR / f"{upload_id}.json"

    if not analysis_path.exists():
        raise HTTPException(status_code=404, detail="Analysis not found")

    try:
        with open(analysis_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load analysis: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

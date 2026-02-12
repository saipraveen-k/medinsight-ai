from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum

class ParameterCategory(str, Enum):
    CARDIAC = "cardiac"
    METABOLIC = "metabolic"
    RENAL = "renal"
    HEPATIC = "hepatic"
    HEMATOLOGICAL = "hematological"
    ELECTROLYTES = "electrolytes"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class MedicalParameter(BaseModel):
    name: str
    value: float
    unit: str
    category: ParameterCategory
    normal_min: Optional[float] = None
    normal_max: Optional[float] = None
    is_abnormal: bool = False

class MedicalData(BaseModel):
    parameters: List[MedicalParameter]
    total_parameters: int
    abnormal_count: int

class RiskScore(BaseModel):
    score: int  # 0-100
    level: RiskLevel
    category_scores: Dict[str, float]

class AIInsights(BaseModel):
    summary: str
    abnormal_findings: List[str]
    recommendations: List[str]
    when_to_consult_doctor: str
    disclaimer: str

class AnalysisResponse(BaseModel):
    upload_id: str
    filename: str
    medical_data: MedicalData
    risk_score: RiskScore
    ai_insights: AIInsights
    status: str
    processing_time: Optional[float] = None

class UploadResponse(BaseModel):
    upload_id: str
    message: str
    status: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

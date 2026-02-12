# MedInsight AI - API Reference

## 🚀 Base URL

```
Development: http://localhost:8000
Production: https://api.medinsight.ai
Repository: C:\tempp\projects\medinsight-ai\
```

## 📋 API Overview

The MedInsight AI API provides endpoints for uploading medical reports, processing them with AI, and retrieving analysis results.

### Authentication
**Current**: No authentication required (MVP)
**Future**: API key-based authentication

### Rate Limiting
**Current**: No rate limiting (MVP)
**Future**: 100 requests per minute per API key

---

## 📤 Endpoints

### 1. Upload Medical Report

Upload and process a medical report PDF file.

```http
POST /api/upload
Content-Type: multipart/form-data
```

#### Request

**Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | Medical report PDF (max 10MB) |

**Example Request**
```bash
curl -X POST \
  http://localhost:8000/api/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@medical_report.pdf'
```

#### Response

**Success Response (200)**
```json
{
  "upload_id": "uuid-string",
  "message": "File uploaded and processed successfully",
  "status": "completed"
}
```

**Error Responses**
```json
// 400 Bad Request - Invalid file
{
  "detail": "Only PDF files are supported"
}

// 413 Payload Too Large
{
  "detail": "File too large"
}

// 500 Internal Server Error
{
  "detail": "Processing failed: PDF extraction error"
}
```

---

### 2. Get Analysis Results

Retrieve analysis results for a previously uploaded report.

```http
GET /api/analysis/{upload_id}
```

#### Request

**Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| upload_id | string | Yes | Unique identifier from upload response |

**Example Request**
```bash
curl http://localhost:8000/api/analysis/uuid-string
```

#### Response

**Success Response (200)**
```json
{
  "upload_id": "uuid-string",
  "status": "completed",
  "medical_data": {
    "parameters": [
      {
        "name": "glucose",
        "value": 95.0,
        "unit": "mg/dL",
        "category": "metabolic",
        "normal_min": 70.0,
        "normal_max": 100.0,
        "is_abnormal": false
      },
      {
        "name": "cholesterol",
        "value": 210.0,
        "unit": "mg/dL",
        "category": "metabolic",
        "normal_min": 0.0,
        "normal_max": 200.0,
        "is_abnormal": true
      }
    ],
    "total_parameters": 2,
    "abnormal_count": 1
  },
  "risk_score": {
    "score": 35,
    "level": "medium",
    "category_scores": {
      "metabolic": 40,
      "cardiac": 0,
      "renal": 0,
      "hepatic": 0,
      "hematological": 0,
      "electrolytes": 0
    }
  },
  "ai_insights": {
    "summary": "Your results show mostly normal values with slight elevation in cholesterol.",
    "abnormal_findings": [
      "Cholesterol: 210 mg/dL (Normal: 0-200 mg/dL)"
    ],
    "recommendations": [
      "Consider dietary modifications",
      "Increase physical activity",
      "Schedule follow-up with healthcare provider"
    ],
    "when_to_consult_doctor": "Schedule routine appointment within 1-2 weeks",
    "disclaimer": "This AI-generated analysis is for informational purposes only and does not replace professional medical advice."
  }
}
```

**Error Responses**
```json
// 404 Not Found
{
  "detail": "Analysis not found"
}

// 400 Bad Request
{
  "detail": "Invalid upload ID format"
}
```

---

### 3. Health Check

Check API service health and status.

```http
GET /health
```

#### Response

**Success Response (200)**
```json
{
  "status": "healthy",
  "service": "MedInsight AI",
  "version": "1.0.0",
  "timestamp": "2024-02-12T10:30:00Z"
}
```

---

### 4. Root Endpoint

API information and documentation links.

```http
GET /
```

#### Response

**Success Response (200)**
```json
{
  "message": "MedInsight AI API is running",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

---

## 📊 Data Models

### MedicalParameter

```typescript
interface MedicalParameter {
  name: string;           // Parameter name (e.g., "glucose")
  value: number;          // Numeric value
  unit: string;           // Unit of measurement (e.g., "mg/dL")
  category: string;       // Medical category
  normal_min?: number;   // Lower bound of normal range
  normal_max?: number;   // Upper bound of normal range
  is_abnormal: boolean;   // Whether value is outside normal range
}
```

### MedicalData

```typescript
interface MedicalData {
  parameters: MedicalParameter[];  // List of extracted parameters
  total_parameters: number;        // Total parameters found
  abnormal_count: number;          // Count of abnormal values
}
```

### RiskScore

```typescript
interface RiskScore {
  score: number;                    // 0-100 risk score
  level: "low" | "medium" | "high" | "critical";  // Risk category
  category_scores: Record<string, number>;  // Scores by category
}
```

### AIInsights

```typescript
interface AIInsights {
  summary: string;                  // Patient-friendly summary
  abnormal_findings: string[];      // List of abnormal results
  recommendations: string[];        // Health recommendations
  when_to_consult_doctor: string;   // Medical consultation urgency
  disclaimer: string;               // Medical disclaimer
}
```

---

## 🔧 Error Handling

### Standard Error Format

```json
{
  "error": "error_type",
  "detail": "Human-readable error message",
  "timestamp": "2024-02-12T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File size exceeds limit |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Scenarios

#### File Upload Errors
```json
// Invalid file type
{
  "error": "invalid_file_type",
  "detail": "Only PDF files are supported"
}

// File too large
{
  "error": "file_too_large",
  "detail": "File size exceeds 10MB limit"
}

// Corrupted PDF
{
  "error": "pdf_corrupted",
  "detail": "Unable to process PDF file"
}
```

#### Processing Errors
```json
// AI service unavailable
{
  "error": "ai_service_unavailable",
  "detail": "AI insights temporarily unavailable"
}

// Database error
{
  "error": "database_error",
  "detail": "Unable to store analysis results"
}
```

---

## 🚀 SDK Examples

### JavaScript/TypeScript

```typescript
class MedInsightAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async uploadReport(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.upload_id;
  }

  async getAnalysis(uploadId: string) {
    const response = await fetch(`${this.baseURL}/api/analysis/${uploadId}`);
    
    if (!response.ok) {
      throw new Error(`Analysis not found: ${response.statusText}`);
    }

    return response.json();
  }
}

// Usage
const api = new MedInsightAPI();
const uploadId = await api.uploadReport(file);
const results = await api.getAnalysis(uploadId);
```

### Python

```python
import requests

class MedInsightAPI:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url

    def upload_report(self, file_path: str) -> str:
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{self.base_url}/api/upload", files=files)
        
        response.raise_for_status()
        return response.json()['upload_id']

    def get_analysis(self, upload_id: str) -> dict:
        response = requests.get(f"{self.base_url}/api/analysis/{upload_id}")
        response.raise_for_status()
        return response.json()

# Usage
api = MedInsightAPI()
upload_id = api.upload_report("medical_report.pdf")
results = api.get_analysis(upload_id)
```

---

## 🧪 Testing

### Local Testing

```bash
# Start the backend server
cd C:\tempp\projects\medinsight-ai\backend
uvicorn app.main:app --reload --port 8000

# Test upload endpoint
curl -X POST \
  http://localhost:8000/api/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@test_report.pdf'

# Test analysis endpoint
curl http://localhost:8000/api/analysis/{upload_id}

# Test health check
curl http://localhost:8000/health
```

### Integration Testing

```javascript
// Example integration test
describe('MedInsight API', () => {
  test('should upload and analyze medical report', async () => {
    const api = new MedInsightAPI();
    
    // Upload file
    const file = new File(['test'], 'report.pdf', { type: 'application/pdf' });
    const uploadId = await api.uploadReport(file);
    expect(uploadId).toBeDefined();
    
    // Get analysis
    const results = await api.getAnalysis(uploadId);
    expect(results.medical_data).toBeDefined();
    expect(results.risk_score).toBeDefined();
    expect(results.ai_insights).toBeDefined();
  });
});
```

---

## 📝 Notes & Limitations

### Current Limitations (MVP)
- **No Authentication**: Open API for demo purposes
- **File Size**: Limited to 10MB PDF files
- **Processing Time**: May take up to 30 seconds
- **AI Fallbacks**: Basic rule-based system if AI fails
- **Data Persistence**: Results stored temporarily

### Future Enhancements
- **API Authentication**: API key-based access
- **Batch Processing**: Multiple file uploads
- **Webhook Support**: Async processing notifications
- **Advanced Analytics**: Historical data analysis
- **Export Formats**: PDF, JSON, CSV export options

### Security Considerations
- **File Validation**: All uploads scanned and validated
- **Data Privacy**: No personal data stored permanently
- **Rate Limiting**: Protection against abuse
- **HTTPS Required**: Secure communication in production

---

## 📞 Support

### API Documentation
- **Interactive Docs**: Available at `/docs` (Swagger UI)
- **OpenAPI Spec**: Available at `/openapi.json`

### Troubleshooting
- **Common Issues**: Check `docs/TROUBLESHOOTING.md`
- **FAQ**: See `docs/FAQ.md`
- **Issues**: Report via GitHub issues

### Contact
- **Technical Support**: api-support@medinsight.ai
- **Documentation**: docs@medinsight.ai

---

## 📁 File Locations

### Backend API Files
```
C:\tempp\projects\medinsight-ai\backend\
├── app/
│   ├── main.py              # FastAPI application
│   ├── api/
│   │   └── routes/           # API endpoint definitions
│   ├── services/            # Business logic
│   └── models/              # Data models
├── storage/                 # Runtime data
└── requirements.txt         # Dependencies
```

### API Documentation
```
C:\tempp\projects\medinsight-ai\docs\
├── API_REFERENCE.md          # This file
├── INDEX.md                 # Documentation navigation
└── TROUBLESHOOTING.md       # Common issues
```

### Testing Files
```
C:\tempp\projects\medinsight-ai\backend\
├── tests/                   # Test files
│   ├── test_api.py          # API tests
│   └── test_services.py     # Service tests
└── conftest.py             # Test configuration
```

---

## 🚀 Quick Reference

### API Endpoints Summary
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload and process medical report |
| GET | `/api/analysis/{id}` | Retrieve analysis results |
| GET | `/health` | System health check |
| GET | `/` | API information |

### File Upload Requirements
- **Format**: PDF only
- **Size**: Maximum 10MB
- **Content**: Medical test results
- **Storage**: Temporary, auto-deleted

### Processing Times
- **Simple Reports**: 15-30 seconds
- **Complex Reports**: 30-60 seconds
- **Large Files**: May take longer

---

*API version: 1.0.0*  
*Last updated: February 2024*  
*Repository: C:\tempp\projects\medinsight-ai*

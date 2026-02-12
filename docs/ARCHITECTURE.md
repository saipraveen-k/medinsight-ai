# MedInsight AI - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │    │   FastAPI       │    │   AI Services   │
│   (Frontend)    │◄──►│   Backend       │◄──►│   (LLM Pipeline)│
│                 │    │                 │    │                 │
│ • File Upload   │    │ • PDF Processing│    │ • LangChain     │
│ • Dashboard     │    │ • Data Extraction│   │ • OpenAI/Gemini │
│ • Results View  │    │ • Risk Scoring  │    │ • Prompt Engine │
│ • Charts        │    │ • API Endpoints │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   SQLite/JSON   │    │   PDF Storage   │
│   Storage       │    │   Database      │    │   (Temporary)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Data Flow Architecture

### 1. Upload Flow
```
User selects PDF → Frontend validation → Backend API → File storage → Processing queue
```

**Detailed Steps:**
1. **Frontend**: File validation (PDF only, <10MB)
2. **Backend**: Receive file, generate unique ID
3. **Storage**: Save to `C:\tempp\projects\medinsight-ai\backend\storage\uploads\`
4. **Queue**: Add to processing pipeline
5. **Response**: Return upload ID to frontend

### 2. Processing Pipeline
```
PDF file → Text extraction → Parameter identification → Risk calculation → AI insights → Storage
```

**Pipeline Stages:**
1. **Text Extraction**: pdfplumber processes PDF
2. **Parameter Analysis**: Regex + medical term matching
3. **Risk Scoring**: Weighted algorithm calculation
4. **AI Insights**: LLM generates explanations
5. **Result Storage**: Database + cache update

### 3. Results Flow
```
Frontend polls API → Database query → Results formatting → UI display
```

**Real-time Updates:**
- WebSocket connection for live status
- Progress indicators (0-100%)
- Error handling and retry logic

## 🏛️ Component Architecture

### Frontend Components 🆕

```
C:\tempp\projects\medinsight-ai\frontend\src\
├── app/
│   ├── page.tsx              # Landing page with premium design
│   ├── upload/page.tsx       # Upload interface with step indicators
│   └── results/[id]/page.tsx # Results dashboard with premium components
├── components/
│   ├── ui/                   # shadcn/ui base components
│   │   ├── risk-gauge.tsx      # 🆕 Animated radial progress indicator
│   │   ├── category-cards.tsx   # 🆕 Interactive risk category display
│   │   ├── ai-insights.tsx      # 🆕 Structured accordion panels
│   │   ├── medical-parameters.tsx # 🆕 Grouped parameter display
│   │   ├── loading-stepper.tsx # 🆕 Step-based progress indicator
│   │   └── toast.tsx           # 🆕 Modern notification system
│   ├── upload/               # Upload-specific components
│   ├── results/              # Results display components
│   └── common/               # Shared utilities
├── lib/
│   ├── api.ts                # API client
│   └── utils.ts              # 🆕 Helper functions with risk color mapping
└── hooks/
    ├── use-upload.ts         # Upload state management
    └── use-analysis.ts       # Analysis data fetching
```

### Backend Services

```
C:\tempp\projects\medinsight-ai\backend\app\
├── main.py                   # FastAPI application entry
├── services/
│   ├── pdf_processor.py      # PDF text extraction
│   ├── medical_analyzer.py   # Medical parameter analysis
│   ├── risk_scorer.py        # Risk calculation algorithm
│   ├── ai_service.py         # LLM integration
│   └── pdf_generator.py      # 🆕 Professional PDF report generation
├── models/
│   └── medical.py            # Pydantic data models
├── database/
│   └── connection.py         # SQLite database layer
└── api/
    └── routes/               # API endpoint definitions
```

## 🗄️ Database Architecture

### Schema Design

```sql
-- File uploads tracking
CREATE TABLE uploads (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    status TEXT DEFAULT 'uploading',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);

-- Analysis results storage
CREATE TABLE analysis_results (
    upload_id TEXT PRIMARY KEY,
    extracted_data JSON,      -- Medical parameters
    risk_score INTEGER,       -- 0-100 scale
    risk_level TEXT,          -- low/medium/high/critical
    ai_insights JSON,         -- AI-generated content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (upload_id) REFERENCES uploads(id)
);

-- Medical reference ranges
CREATE TABLE reference_ranges (
    parameter_name TEXT PRIMARY KEY,
    normal_min REAL,
    normal_max REAL,
    unit TEXT,
    category TEXT             -- cardiac/metabolic/renal/etc.
);
```

### Database Location
```
C:\tempp\projects\medinsight-ai\backend\storage\medinsight.db
```

### Data Relationships

```
Uploads (1) ←→ (1) Analysis Results
    ↓
Reference Ranges (many) ← Used for validation
```

## 🤖 AI Service Architecture

### Multi-Stage Prompting

```
Medical Data → Extraction Prompt → Parameter Validation → Risk Analysis → Explanation Prompt → Final Insights
```

### Prompt Engineering Strategy

1. **Extraction Stage**
   - Goal: Identify medical parameters
   - Model: GPT-3.5-turbo
   - Output: Structured JSON

2. **Explanation Stage**
   - Goal: Patient-friendly explanations
   - Model: GPT-3.5-turbo
   - Constraints: 8th-grade reading level

3. **Clinical Stage** (Optional)
   - Goal: Clinical decision support
   - Model: GPT-4 (if available)
   - Audience: Healthcare providers

### Fallback Mechanisms

```
Primary AI (OpenAI) → Secondary AI (Gemini) → Rule-based System → Error Response
```

## 📊 Risk Scoring Architecture

### Algorithm Design

```python
# Weighted category scoring
category_weights = {
    'cardiac': 0.25,      # Heart-related metrics
    'metabolic': 0.20,    # Glucose, cholesterol
    'renal': 0.15,        # Kidney function
    'hepatic': 0.15,      # Liver enzymes
    'hematological': 0.15, # Blood counts
    'electrolytes': 0.10   # Mineral balance
}

# Severity multipliers
severity_multipliers = {
    'mild': 1.0,      # 0-20% outside range
    'moderate': 1.5,   # 20-50% outside range
    'severe': 2.0,     # 50-100% outside range
    'critical': 3.0    # >100% outside range
}
```

### Risk Level Classification

- **Low (0-25)**: All parameters normal
- **Medium (26-50)**: 1-2 parameters slightly abnormal
- **High (51-75)**: Multiple parameters significantly abnormal
- **Critical (76-100)**: Life-threatening abnormalities

## 🔧 Technology Stack Architecture

### Frontend Stack 🆕
```
C:\tempp\projects\medinsight-ai\frontend\
Next.js 14 (React 18)
├── Tailwind CSS (Styling)
├── shadcn/ui (Component library)
├── 🆕 Framer Motion (Animations & micro-interactions)
├── Recharts (Data visualization)
├── React Dropzone (File upload)
├── Lucide React (Icons)
├── 🆕 Custom Premium Components:
│   ├── RiskGauge (Animated radial progress)
│   ├── CategoryCards (Interactive risk display)
│   ├── AIInsights (Structured accordion panels)
│   ├── MedicalParameters (Grouped display)
│   ├── LoadingStepper (Step-based progress)
│   └── ToastContainer (Modern notifications)
└── TypeScript (Type safety)
```

### Backend Stack
```
C:\tempp\projects\medinsight-ai\backend\
FastAPI (Python 3.9+)
├── pdfplumber (PDF processing)
├── Pandas (Data manipulation)
├── LangChain (LLM orchestration)
├── OpenAI/Gemini (AI models)
├── SQLite (Database)
├── Pydantic (Data validation)
├── 🆕 ReportLab (Professional PDF generation)
├── 🆕 Pillow (Image processing for PDF)
└── Uvicorn (ASGI server)
```

## 🆕 Premium Component Architecture

### Risk Visualization System
```
RiskGauge Component:
├── Animated SVG radial progress
├── Color-coded risk levels (Green/Yellow/Red)
├── AI confidence indicators
├── Smooth fill animations (1.5s duration)
└── Responsive design with Framer Motion

CategoryCards Component:
├── Interactive risk category display
├── Progress bars with gradient fills
├── Hover effects with glow animations
├── Icon-based categorization
└── Staggered animation on load
```

### AI Insights System
```
AIInsights Component:
├── Structured accordion panels
├── Collapsible sections (Summary/Clinical/Recommendations)
├── Icon indicators for each section
├── Glass blur background effects
└── Custom bullet point styling
```

### Medical Data Display
```
MedicalParameters Component:
├── Category-based parameter grouping
├── Duplicate parameter handling (Min/Max/Avg)
├── Status indicators (Normal/Abnormal)
├── Expandable category sections
└── Reference range display
```

### PDF Export System 🆕
```
PDFGenerator Service:
├── ReportLab integration for professional PDFs
├── Hospital-grade document styling
├── Structured report sections:
│   ├── Professional header with branding
│   ├── Health score visualization
│   ├── Category breakdown tables
│   ├── Abnormal findings lists
│   ├── AI insights and recommendations
│   └── Medical disclaimer
├── Proper margins and typography
└── Streaming response for downloads
```

### Infrastructure Stack
```
Development
├── Docker Compose (Containerization)
├── Local SQLite (Database)
└── File-based storage

Production (Future)
├── Kubernetes (Orchestration)
├── PostgreSQL (Database)
├── S3/Cloud Storage (File storage)
└── Redis (Caching)
```

## 🔒 Security Architecture

### Data Protection
```
Input Validation → File Scanning → Secure Storage → Data Encryption → Access Control
```

### Security Measures
- **File Upload Validation**: PDF only, size limits
- **Data Sanitization**: Input cleaning and validation
- **Secure Storage**: Temporary file cleanup
- **API Security**: CORS, rate limiting
- **Privacy**: No persistent personal data

## 🚀 Performance Architecture

### Optimization Strategies

#### Frontend
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Next.js Image component
- **Caching**: Browser and API response caching
- **Bundle Analysis**: Webpack optimization

#### Backend
- **Async Processing**: Background task queue
- **Database Indexing**: Query optimization
- **Connection Pooling**: Database efficiency
- **Memory Management**: Large file handling

### Performance Targets
- **Upload Processing**: <30 seconds
- **API Response**: <2 seconds
- **Page Load**: <3 seconds
- **File Size Limit**: 10MB

## 🔄 Scalability Architecture

### Horizontal Scaling
```
Load Balancer → Multiple Frontend Instances → Multiple Backend Instances → Shared Database
```

### Scaling Strategies
- **Frontend**: CDN + edge caching
- **Backend**: Container orchestration
- **Database**: Read replicas + sharding
- **Storage**: Distributed file system

## 📈 Monitoring Architecture

### Health Checks
```
Frontend Health → API Health → Database Health → AI Service Health → Overall Status
```

### Monitoring Points
- **Application Metrics**: Response times, error rates
- **Business Metrics**: Upload success, processing time
- **System Metrics**: CPU, memory, disk usage
- **AI Metrics**: Token usage, model performance

## 🧪 Testing Architecture

### Test Pyramid
```
E2E Tests (Few) → Integration Tests (More) → Unit Tests (Most)
```

### Testing Strategy
- **Frontend**: Jest + React Testing Library
- **Backend**: Pytest + Test coverage
- **API**: Integration tests with real data
- **E2E**: Cypress for user flows

## 🚀 Deployment Architecture

### Development Environment
```
Local Development → Docker Compose → Hot Reload → Debug Mode
```

### Production Pipeline
```
Git Push → CI/CD Pipeline → Build Tests → Security Scan → Deploy → Health Check
```

### Deployment Targets
- **Staging**: Pre-production testing
- **Production**: Live user traffic
- **Canary**: Gradual rollout
- **Blue-Green**: Zero-downtime deployment

## 📁 File System Architecture

### Development Structure
```
C:\tempp\projects\medinsight-ai\
├── frontend/                 # Next.js application
├── backend/                  # FastAPI application
├── docs/                     # Documentation
├── storage/                  # Runtime data
│   ├── uploads/              # Temporary PDF files
│   ├── processed/            # Processed data
│   └── medinsight.db         # SQLite database
├── docker-compose.yml        # Development environment
├── QUICK_START.md            # Quick setup guide
└── README.md                 # Project overview
```

### Runtime Data Locations
```
C:\tempp\projects\medinsight-ai\backend\storage\
├── uploads/                  # User-uploaded PDFs
│   ├── uuid-filename.pdf    # Temporary storage
│   └── .gitkeep             # Directory marker
├── processed/               # Analysis results
│   ├── uuid-analysis.json  # Processed data
│   └── .gitkeep             # Directory marker
└── medinsight.db           # SQLite database
```

---

*This architecture is designed for hackathon MVP success while maintaining production-quality standards for future scaling.*

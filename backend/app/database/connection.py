import sqlite3
from pathlib import Path
from typing import Optional

# Database path
DB_PATH = Path("storage/medinsight.db")

def init_db():
    """
    Initialize the SQLite database with required tables
    """
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create uploads table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS uploads (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'uploading',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP NULL
        )
    ''')
    
    # Create analysis_results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis_results (
            upload_id TEXT PRIMARY KEY,
            extracted_data TEXT,  -- JSON string
            risk_score INTEGER,
            risk_level TEXT,
            ai_insights TEXT,  -- JSON string
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (upload_id) REFERENCES uploads(id)
        )
    ''')
    
    # Create reference_ranges table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reference_ranges (
            parameter_name TEXT PRIMARY KEY,
            normal_min REAL,
            normal_max REAL,
            unit TEXT,
            category TEXT
        )
    ''')
    
    # Insert reference data
    reference_data = [
        ('glucose', 70, 100, 'mg/dL', 'metabolic'),
        ('fasting glucose', 70, 100, 'mg/dL', 'metabolic'),
        ('cholesterol', 0, 200, 'mg/dL', 'metabolic'),
        ('ldl', 0, 100, 'mg/dL', 'metabolic'),
        ('hdl', 40, 100, 'mg/dL', 'metabolic'),
        ('triglycerides', 0, 150, 'mg/dL', 'metabolic'),
        ('systolic', 90, 120, 'mmHg', 'cardiac'),
        ('diastolic', 60, 80, 'mmHg', 'cardiac'),
        ('heart rate', 60, 100, 'bpm', 'cardiac'),
        ('hemoglobin', 12, 16, 'g/dL', 'hematological'),
        ('wbc', 4000, 11000, 'cells/μL', 'hematological'),
        ('rbc', 4.2, 5.4, 'million/μL', 'hematological'),
        ('platelets', 150000, 450000, 'cells/μL', 'hematological'),
        ('creatinine', 0.6, 1.3, 'mg/dL', 'renal'),
        ('bun', 7, 20, 'mg/dL', 'renal'),
        ('sodium', 135, 145, 'mmol/L', 'electrolytes'),
        ('potassium', 3.5, 5.0, 'mmol/L', 'electrolytes'),
        ('calcium', 8.5, 10.5, 'mg/dL', 'electrolytes'),
        ('alt', 0, 40, 'U/L', 'hepatic'),
        ('ast', 0, 40, 'U/L', 'hepatic'),
        ('alkaline phosphatase', 30, 120, 'U/L', 'hepatic'),
    ]
    
    cursor.executemany('''
        INSERT OR REPLACE INTO reference_ranges 
        (parameter_name, normal_min, normal_max, unit, category)
        VALUES (?, ?, ?, ?, ?)
    ''', reference_data)
    
    conn.commit()
    conn.close()
    
    print(f"Database initialized at {DB_PATH}")

def get_connection() -> sqlite3.Connection:
    """
    Get database connection
    """
    return sqlite3.connect(DB_PATH)

def save_upload(upload_id: str, filename: str, file_path: str, status: str = 'uploading'):
    """
    Save upload information to database
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO uploads (id, filename, file_path, status)
        VALUES (?, ?, ?, ?)
    ''', (upload_id, filename, file_path, status))
    
    conn.commit()
    conn.close()

def update_upload_status(upload_id: str, status: str):
    """
    Update upload status
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    if status == 'completed':
        cursor.execute('''
            UPDATE uploads 
            SET status = ?, completed_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (status, upload_id))
    else:
        cursor.execute('''
            UPDATE uploads SET status = ? WHERE id = ?
        ''', (status, upload_id))
    
    conn.commit()
    conn.close()

def save_analysis_result(upload_id: str, extracted_data: str, risk_score: int, 
                        risk_level: str, ai_insights: str):
    """
    Save analysis results to database
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO analysis_results 
        (upload_id, extracted_data, risk_score, risk_level, ai_insights)
        VALUES (?, ?, ?, ?, ?)
    ''', (upload_id, extracted_data, risk_score, risk_level, ai_insights))
    
    conn.commit()
    conn.close()

def get_analysis_result(upload_id: str) -> Optional[dict]:
    """
    Get analysis result from database
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT ar.*, u.filename, u.status 
        FROM analysis_results ar
        JOIN uploads u ON ar.upload_id = u.id
        WHERE ar.upload_id = ?
    ''', (upload_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if result:
        columns = [desc[0] for desc in cursor.description]
        return dict(zip(columns, result))
    
    return None

def get_upload_status(upload_id: str) -> Optional[str]:
    """
    Get upload status
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT status FROM uploads WHERE id = ?', (upload_id,))
    result = cursor.fetchone()
    conn.close()
    
    return result[0] if result else None

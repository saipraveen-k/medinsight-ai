import pdfplumber
import re
from pathlib import Path
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class PDFProcessor:
    def __init__(self):
        self.medical_terms = {
            'blood_glucose': ['glucose', 'blood sugar', 'fasting glucose'],
            'cholesterol': ['cholesterol', 'ldl', 'hdl', 'triglycerides'],
            'blood_pressure': ['blood pressure', 'bp', 'systolic', 'diastolic'],
            'heart_rate': ['heart rate', 'pulse', 'hr'],
            'hemoglobin': ['hemoglobin', 'hgb', 'hgb'],
            'white_blood_cells': ['wbc', 'white blood cells', 'leukocytes'],
            'red_blood_cells': ['rbc', 'red blood cells', 'erythrocytes'],
            'platelets': ['platelets', 'plt'],
            'creatinine': ['creatinine', 'cr', 'serum creatinine'],
            'bun': ['bun', 'blood urea nitrogen'],
            'sodium': ['sodium', 'na'],
            'potassium': ['potassium', 'k'],
            'calcium': ['calcium', 'ca'],
            'liver_enzymes': ['alt', 'ast', 'sgpt', 'sgot', 'alkaline phosphatase']
        }
    
    def extract_text(self, file_path: Path) -> str:
        """
        Extract text from PDF file
        """
        try:
            text_content = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content += page_text + "\n"
            
            logger.info(f"Extracted {len(text_content)} characters from PDF")
            return text_content
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise Exception(f"PDF processing failed: {str(e)}")
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize extracted text
        """
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common artifacts
        text = re.sub(r'Page \d+ of \d+', '', text)
        text = re.sub(r'\f', '', text)  # Form feeds
        
        return text.strip()
    
    def extract_medical_values(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract medical values using regex patterns
        """
        extracted_values = []
        
        # Pattern for medical values (number + unit)
        value_pattern = r'([a-zA-Z\s]+)[:\s]*(\d+\.?\d*)\s*([a-zA-Z/°%]*)'
        
        matches = re.findall(value_pattern, text, re.IGNORECASE)
        
        for match in matches:
            name = match[0].strip()
            value = match[1]
            unit = match[2].strip()
            
            # Skip if value looks like a page number or other non-medical data
            if self._is_medical_parameter(name):
                extracted_values.append({
                    'name': name,
                    'value': float(value),
                    'unit': unit
                })
        
        return extracted_values
    
    def _is_medical_parameter(self, name: str) -> bool:
        """
        Check if a parameter name is likely medical
        """
        name_lower = name.lower()
        
        for category, terms in self.medical_terms.items():
            for term in terms:
                if term in name_lower:
                    return True
        
        # Additional check for common medical patterns
        medical_patterns = [
            r'\b(hemoglobin|glucose|cholesterol|pressure|rate|count)\b',
            r'\b(sodium|potassium|calcium|creatinine)\b',
            r'\b(alt|ast|ldl|hdl|wbc|rbc)\b'
        ]
        
        for pattern in medical_patterns:
            if re.search(pattern, name_lower):
                return True
        
        return False
    
    def process_pdf(self, file_path: Path) -> Dict[str, Any]:
        """
        Main method to process PDF and extract medical data
        """
        # Extract text
        raw_text = self.extract_text(file_path)
        
        # Clean text
        clean_text = self.clean_text(raw_text)
        
        # Extract medical values
        medical_values = self.extract_medical_values(clean_text)
        
        return {
            'raw_text': raw_text,
            'clean_text': clean_text,
            'medical_values': medical_values,
            'total_parameters': len(medical_values)
        }

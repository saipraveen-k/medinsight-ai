import re
from typing import List, Dict, Any
from app.models.medical import MedicalParameter, MedicalData, ParameterCategory

class MedicalAnalyzer:
    def __init__(self):
        self.reference_ranges = {
            # Metabolic / glucose health
            'glucose': {'min': 70, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'fasting glucose': {'min': 70, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'fasting blood glucose': {'min': 70, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'blood sugar': {'min': 70, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'fbs': {'min': 70, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'hba1c': {'min': 4.0, 'max': 5.6, 'unit': '%', 'category': ParameterCategory.METABOLIC},

            # Lipid profile / heart risk
            'total cholesterol': {'min': 0, 'max': 200, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'cholesterol': {'min': 0, 'max': 200, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'ldl': {'min': 0, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'hdl': {'min': 40, 'max': 100, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            'triglycerides': {'min': 0, 'max': 150, 'unit': 'mg/dL', 'category': ParameterCategory.METABOLIC},
            
            # Cardiac parameters
            'systolic': {'min': 90, 'max': 120, 'unit': 'mmHg', 'category': ParameterCategory.CARDIAC},
            'diastolic': {'min': 60, 'max': 80, 'unit': 'mmHg', 'category': ParameterCategory.CARDIAC},
            'heart rate': {'min': 60, 'max': 100, 'unit': 'bpm', 'category': ParameterCategory.CARDIAC},
            'pulse': {'min': 60, 'max': 100, 'unit': 'bpm', 'category': ParameterCategory.CARDIAC},
            
            # Hematological parameters
            'hemoglobin': {'min': 12, 'max': 16, 'unit': 'g/dL', 'category': ParameterCategory.HEMATOLOGICAL},
            'wbc': {'min': 4000, 'max': 11000, 'unit': 'cells/μL', 'category': ParameterCategory.HEMATOLOGICAL},
            'rbc': {'min': 4.2, 'max': 5.4, 'unit': 'million/μL', 'category': ParameterCategory.HEMATOLOGICAL},
            'platelets': {'min': 150000, 'max': 450000, 'unit': 'cells/μL', 'category': ParameterCategory.HEMATOLOGICAL},
            'hematocrit': {'min': 36, 'max': 46, 'unit': '%', 'category': ParameterCategory.HEMATOLOGICAL},
            
            # Renal parameters
            'creatinine': {'min': 0.6, 'max': 1.3, 'unit': 'mg/dL', 'category': ParameterCategory.RENAL},
            'bun': {'min': 7, 'max': 20, 'unit': 'mg/dL', 'category': ParameterCategory.RENAL},
            'urea': {'min': 15, 'max': 40, 'unit': 'mg/dL', 'category': ParameterCategory.RENAL},
            
            # Electrolytes
            'sodium': {'min': 135, 'max': 145, 'unit': 'mmol/L', 'category': ParameterCategory.ELECTROLYTES},
            'potassium': {'min': 3.5, 'max': 5.0, 'unit': 'mmol/L', 'category': ParameterCategory.ELECTROLYTES},
            'calcium': {'min': 8.5, 'max': 10.5, 'unit': 'mg/dL', 'category': ParameterCategory.ELECTROLYTES},
            
            # Hepatic parameters
            'alt': {'min': 0, 'max': 40, 'unit': 'U/L', 'category': ParameterCategory.HEPATIC},
            'sgpt': {'min': 0, 'max': 40, 'unit': 'U/L', 'category': ParameterCategory.HEPATIC},
            'ast': {'min': 0, 'max': 40, 'unit': 'U/L', 'category': ParameterCategory.HEPATIC},
            'alkaline phosphatase': {'min': 30, 'max': 120, 'unit': 'U/L', 'category': ParameterCategory.HEPATIC},
        }
    
    def extract_parameters(self, text: str) -> MedicalData:
        """
        Extract medical parameters from text and categorize them
        """
        extracted_values = []
        
        # Use regex to find medical values
        # Pattern: parameter name followed by value and unit
        pattern = r'([a-zA-Z\s]+?)\s*[:\-]?\s*(\d+\.?\d*)\s*([a-zA-Z/°%]*)'
        
        matches = re.findall(pattern, text, re.IGNORECASE)
        
        for match in matches:
            name = match[0].strip().lower()
            value = float(match[1])
            unit = match[2].strip()
            
            # Try to match with known parameters
            param_info = self._match_parameter(name)
            
            if param_info:
                # Check if value is within normal range
                is_abnormal = self._is_abnormal(value, param_info)
                
                parameter = MedicalParameter(
                    name=param_info['name'],
                    value=value,
                    unit=param_info['unit'],
                    category=param_info['category'],
                    normal_min=param_info['min'],
                    normal_max=param_info['max'],
                    is_abnormal=is_abnormal
                )
                extracted_values.append(parameter)
        
        # Count abnormal parameters
        abnormal_count = sum(1 for param in extracted_values if param.is_abnormal)
        
        return MedicalData(
            parameters=extracted_values,
            total_parameters=len(extracted_values),
            abnormal_count=abnormal_count
        )
    
    def _match_parameter(self, name: str) -> Dict[str, Any]:
        """
        Match extracted parameter name with known parameters
        """
        name_lower = name.lower()
        
        # Direct matches
        if name_lower in self.reference_ranges:
            return {
                'name': name_lower,
                **self.reference_ranges[name_lower]
            }
        
        # Partial matches
        for param_name, param_data in self.reference_ranges.items():
            if param_name in name_lower or name_lower in param_name:
                return {
                    'name': param_name,
                    **param_data
                }
        
        # Fallback: try to identify by keywords (grouping similar markers)
        if any(keyword in name_lower for keyword in ['hba1c', 'glycated']):
            return {'name': 'hba1c', **self.reference_ranges['hba1c']}

        if any(keyword in name_lower for keyword in ['fasting blood glucose', 'fbs']):
            return {'name': 'fasting blood glucose', **self.reference_ranges['fasting blood glucose']}

        if any(keyword in name_lower for keyword in ['glucose', 'sugar']):
            return {'name': 'glucose', **self.reference_ranges['glucose']}

        elif any(keyword in name_lower for keyword in ['total cholesterol']):
            return {'name': 'total cholesterol', **self.reference_ranges['total cholesterol']}

        elif any(keyword in name_lower for keyword in ['cholesterol', 'ldl', 'hdl', 'triglyceride']):
            return {'name': 'cholesterol', **self.reference_ranges['cholesterol']}

        elif any(keyword in name_lower for keyword in ['hemoglobin', 'hgb']):
            return {'name': 'hemoglobin', **self.reference_ranges['hemoglobin']}
        
        return None
    
    def _is_abnormal(self, value: float, param_info: Dict[str, Any]) -> bool:
        """
        Check if a value is outside the normal range
        """
        min_val = param_info.get('min')
        max_val = param_info.get('max')
        
        if min_val is not None and value < min_val:
            return True
        if max_val is not None and value > max_val:
            return True
        
        return False
    
    def get_abnormal_parameters(self, medical_data: MedicalData) -> List[MedicalParameter]:
        """
        Get list of abnormal parameters
        """
        return [param for param in medical_data.parameters if param.is_abnormal]

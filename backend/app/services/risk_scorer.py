from typing import Dict, List
from app.models.medical import MedicalData, RiskScore, RiskLevel, MedicalParameter, ParameterCategory

class RiskScorer:
    def __init__(self):
        # Category weights for risk calculation
        self.category_weights = {
            ParameterCategory.CARDIAC: 0.25,
            ParameterCategory.METABOLIC: 0.20,
            ParameterCategory.RENAL: 0.15,
            ParameterCategory.HEPATIC: 0.15,
            ParameterCategory.HEMATOLOGICAL: 0.15,
            ParameterCategory.ELECTROLYTES: 0.10
        }
        
        # Severity multipliers for abnormal values
        self.severity_multipliers = {
            'mild': 1.0,      # 0-20% outside range
            'moderate': 1.5,   # 20-50% outside range
            'severe': 2.0,     # 50-100% outside range
            'critical': 3.0    # >100% outside range
        }
    
    def calculate_risk_score(self, medical_data: MedicalData) -> RiskScore:
        """
        Calculate overall risk score from medical data
        """
        category_scores = {}
        total_score = 0
        
        # Calculate score for each category
        for category in ParameterCategory:
            category_params = [
                param for param in medical_data.parameters 
                if param.category == category
            ]
            
            if category_params:
                category_score = self._calculate_category_score(category_params)
                category_scores[category.value] = category_score
                total_score += category_score * self.category_weights[category]
            else:
                category_scores[category.value] = 0
        
        # Ensure score is within 0-100 range
        total_score = min(max(total_score, 0), 100)
        
        # Determine risk level
        risk_level = self._determine_risk_level(total_score)
        
        return RiskScore(
            score=int(total_score),
            level=risk_level,
            category_scores=category_scores
        )
    
    def _calculate_category_score(self, parameters: List[MedicalParameter]) -> float:
        """
        Calculate risk score for a specific category
        """
        if not parameters:
            return 0.0
        
        category_total = 0.0
        
        for param in parameters:
            if param.is_abnormal:
                param_score = self._calculate_parameter_score(param)
                category_total += min(param_score, 25)  # Cap per parameter
        
        return min(category_total, 100)  # Cap category score at 100
    
    def _calculate_parameter_score(self, param: MedicalParameter) -> float:
        """
        Calculate risk score for individual parameter
        """
        if not param.is_abnormal or param.normal_min is None or param.normal_max is None:
            return 0.0
        
        value = param.value
        normal_min = param.normal_min
        normal_max = param.normal_max
        
        # Calculate deviation percentage
        if value < normal_min:
            deviation = (normal_min - value) / normal_min
        elif value > normal_max:
            deviation = (value - normal_max) / normal_max
        else:
            return 0.0
        
        # Determine severity
        severity = self._determine_severity(deviation)
        multiplier = self.severity_multipliers[severity]
        
        # Base score calculation (0-25 points per parameter)
        base_score = min(deviation * 100, 25)
        
        return base_score * multiplier
    
    def _determine_severity(self, deviation: float) -> str:
        """
        Determine severity level based on deviation
        """
        if deviation <= 0.2:
            return 'mild'
        elif deviation <= 0.5:
            return 'moderate'
        elif deviation <= 1.0:
            return 'severe'
        else:
            return 'critical'
    
    def _determine_risk_level(self, score: float) -> RiskLevel:
        """
        Determine risk level based on overall score
        """
        if score <= 25:
            return RiskLevel.LOW
        elif score <= 50:
            return RiskLevel.MEDIUM
        elif score <= 75:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL
    
    def get_risk_factors(self, medical_data: MedicalData) -> List[str]:
        """
        Get list of risk factors contributing to high score
        """
        risk_factors = []
        
        for param in medical_data.parameters:
            if param.is_abnormal:
                severity = self._determine_severity(
                    self._calculate_deviation(param)
                )
                
                risk_factors.append(
                    f"{param.name.title()}: {severity} abnormality"
                )
        
        return risk_factors
    
    def _calculate_deviation(self, param: MedicalParameter) -> float:
        """
        Calculate deviation for a parameter
        """
        if not param.is_abnormal or param.normal_min is None or param.normal_max is None:
            return 0.0
        
        value = param.value
        normal_min = param.normal_min
        normal_max = param.normal_max
        
        if value < normal_min:
            return (normal_min - value) / normal_min
        elif value > normal_max:
            return (value - normal_max) / normal_max
        else:
            return 0.0

import os
from typing import Dict, Any, List, Optional

from app.models.medical import MedicalData, RiskScore, AIInsights, RiskLevel
import openai
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        # Default providers from environment; can be overridden per request via header.
        self.default_openai_key = os.getenv("OPENAI_API_KEY")
        self.default_gemini_key = os.getenv("GEMINI_API_KEY")
        
        # System prompts for different stages
        self.extraction_prompt = """
        You are a medical data extraction expert. Extract medical parameters from the following text and return them in a structured format.

        Focus on these categories:
        - Cardiac: blood pressure, heart rate
        - Metabolic: glucose, cholesterol, triglycerides
        - Renal: creatinine, BUN
        - Hepatic: liver enzymes (ALT, AST)
        - Hematological: blood counts
        - Electrolytes: sodium, potassium, calcium

        Return only the JSON response.
        """
        
        self.explanation_prompt = """
        You are a patient educator specializing in explaining medical results in simple, understandable terms.

        Guidelines:
        - Use 8th-grade reading level
        - Keep explanations under 200 words
        - Focus on what the patient needs to know
        - Include actionable recommendations
        - Always include medical disclaimer

        Structure your response with:
        1. Simple summary of results
        2. What abnormal values mean
        3. Lifestyle recommendations
        4. When to consult a doctor
        """
        
        self.clinical_prompt = """
        You are a clinical decision support assistant. Provide clinical insights based on medical results.

        Focus on:
        - Key abnormal findings
        - Potential underlying conditions
        - Recommended follow-up tests
        - Urgency assessment

        Be concise and medically accurate.
        """
    
    async def generate_insights(
        self,
        medical_data: MedicalData,
        risk_score: RiskScore,
        api_key_override: Optional[str] = None,
    ) -> AIInsights:
        """
        Generate AI-powered insights from medical data
        """
        try:
            # Prepare medical summary for LLM
            medical_summary = self._prepare_medical_summary(medical_data, risk_score)
            
            # Generate patient-friendly explanation
            explanation = await self._generate_patient_explanation(
                medical_summary,
                api_key_override=api_key_override,
            )
            
            # Generate clinical insights
            clinical_insights = await self._generate_clinical_insights(medical_summary)
            
            # Extract abnormal findings
            abnormal_findings = self._extract_abnormal_findings(medical_data)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(medical_data, risk_score)
            
            # Determine when to consult doctor
            when_to_consult = self._determine_consultation_urgency(risk_score)
            
            return AIInsights(
                summary=explanation['summary'],
                abnormal_findings=abnormal_findings,
                recommendations=recommendations,
                when_to_consult_doctor=when_to_consult,
                disclaimer="This AI-generated analysis is for informational purposes only and does not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions."
            )
            
        except Exception as e:
            # Fallback to basic insights if AI service fails
            return self._generate_fallback_insights(medical_data, risk_score)
    
    def _prepare_medical_summary(self, medical_data: MedicalData, risk_score: RiskScore) -> str:
        """
        Prepare a summary of medical data for AI processing
        """
        summary = f"Medical Analysis Results:\n\n"
        summary += f"Overall Risk Score: {risk_score.score}/100 ({risk_score.level.value.upper()})\n\n"
        summary += f"Total Parameters: {medical_data.total_parameters}\n"
        summary += f"Abnormal Parameters: {medical_data.abnormal_count}\n\n"
        
        if medical_data.parameters:
            summary += "Parameter Details:\n"
            for param in medical_data.parameters:
                status = "ABNORMAL" if param.is_abnormal else "Normal"
                summary += f"- {param.name.title()}: {param.value} {param.unit} ({status})\n"
        
        return summary
    
    async def _generate_patient_explanation(
        self,
        medical_summary: str,
        api_key_override: Optional[str] = None,
    ) -> Dict[str, str]:
        """
        Generate patient-friendly explanation using AI
        """
        try:
            # Choose API key: UI override takes precedence, then backend env.
            api_key = api_key_override or self.default_openai_key
            if not api_key:
                raise RuntimeError("No OpenAI API key configured")

            client = openai.OpenAI(api_key=api_key)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.explanation_prompt},
                    {"role": "user", "content": medical_summary}
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            explanation_text = response.choices[0].message.content
            
            # Parse the response into structured format
            return {
                "summary": explanation_text
            }
            
        except Exception:
            return {
                "summary": "Your medical results have been analyzed. Please review the detailed findings below and consult with your healthcare provider for personalized advice."
            }
    
    async def _generate_clinical_insights(self, medical_summary: str) -> str:
        """
        Generate clinical insights for healthcare providers
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.clinical_prompt},
                    {"role": "user", "content": medical_summary}
                ],
                max_tokens=200,
                temperature=0.2
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return "Clinical analysis completed. Review individual parameter results for detailed assessment."
    
    def _extract_abnormal_findings(self, medical_data: MedicalData) -> List[str]:
        """
        Extract abnormal findings from medical data
        """
        abnormal_findings = []
        
        for param in medical_data.parameters:
            if param.is_abnormal:
                finding = f"{param.name.title()}: {param.value} {param.unit}"
                if param.normal_min is not None and param.normal_max is not None:
                    finding += f" (Normal: {param.normal_min}-{param.normal_max} {param.unit})"
                abnormal_findings.append(finding)
        
        return abnormal_findings
    
    def _generate_recommendations(self, medical_data: MedicalData, risk_score: RiskScore) -> List[str]:
        """
        Generate general recommendations based on results
        """
        recommendations = []
        
        if risk_score.level == RiskLevel.LOW:
            recommendations.extend([
                "Continue regular health monitoring",
                "Maintain healthy lifestyle habits",
                "Schedule routine check-ups as recommended"
            ])
        elif risk_score.level == RiskLevel.MEDIUM:
            recommendations.extend([
                "Consider dietary modifications",
                "Increase physical activity",
                "Schedule follow-up with healthcare provider"
            ])
        elif risk_score.level == RiskLevel.HIGH:
            recommendations.extend([
                "Immediate consultation with healthcare provider recommended",
                "Significant lifestyle changes may be necessary",
                "Consider additional diagnostic testing"
            ])
        else:  # CRITICAL
            recommendations.extend([
                "Seek immediate medical attention",
                "Follow-up with healthcare provider within 24-48 hours",
                "May require urgent medical intervention"
            ])
        
        # Category-specific recommendations
        categories_with_abnormal = set()
        for param in medical_data.parameters:
            if param.is_abnormal:
                categories_with_abnormal.add(param.category)
        
        if ParameterCategory.METABOLIC in categories_with_abnormal:
            recommendations.append("Focus on balanced diet and blood sugar management")
        
        if ParameterCategory.CARDIAC in categories_with_abnormal:
            recommendations.append("Monitor blood pressure regularly and reduce sodium intake")
        
        if ParameterCategory.RENAL in categories_with_abnormal:
            recommendations.append("Stay hydrated and monitor kidney function")
        
        return recommendations[:6]  # Limit to 6 recommendations
    
    def _determine_consultation_urgency(self, risk_score: RiskScore) -> str:
        """
        Determine when patient should consult doctor
        """
        if risk_score.level == RiskLevel.CRITICAL:
            return "Seek immediate medical attention or call emergency services"
        elif risk_score.level == RiskLevel.HIGH:
            return "Schedule appointment with healthcare provider within 1-2 days"
        elif risk_score.level == RiskLevel.MEDIUM:
            return "Schedule routine appointment within 1-2 weeks"
        else:
            return "Continue regular follow-up schedule"
    
    def _generate_fallback_insights(self, medical_data: MedicalData, risk_score: RiskScore) -> AIInsights:
        """
        Generate basic insights when AI service is unavailable
        """
        abnormal_findings = self._extract_abnormal_findings(medical_data)
        recommendations = self._generate_recommendations(medical_data, risk_score)
        when_to_consult = self._determine_consultation_urgency(risk_score)
        
        summary = f"Your medical analysis shows a {risk_score.level.value} risk level with {medical_data.abnormal_count} abnormal parameters out of {medical_data.total_parameters} total parameters tested."
        
        return AIInsights(
            summary=summary,
            abnormal_findings=abnormal_findings,
            recommendations=recommendations,
            when_to_consult_doctor=when_to_consult,
            disclaimer="This analysis is for informational purposes only and does not replace professional medical advice."
        )

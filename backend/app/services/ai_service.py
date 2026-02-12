import os
from typing import Dict, List, Optional, Any

from app.models.medical import (
    MedicalData,
    RiskScore,
    AIInsights,
    RiskLevel,
    ParameterCategory,
)

import openai
from dotenv import load_dotenv

load_dotenv()


class AIService:
    """
    Advanced AI Service:
    - Multi-stage prompting
    - Primary OpenAI + fallback
    - Clinical layer
    - Production-safe error handling
    """

    def __init__(self):
        self.default_openai_key = os.getenv("OPENAI_API_KEY")
        self.default_gemini_key = os.getenv("GEMINI_API_KEY")

        self.explanation_prompt = """
You are a medical educator. Explain results clearly at 8th-grade level.
Be concise.
Focus on:
1. Overall risk meaning
2. Abnormal findings impact
3. Practical recommendations
4. When to consult doctor
Always include disclaimer tone.
"""

        self.clinical_prompt = """
You are a clinical decision-support assistant.
Provide:
- Key abnormal findings
- Possible medical implications
- Suggested follow-up tests
- Urgency classification
Be concise and medically precise.
"""

    # ============================================================
    # PUBLIC ENTRY POINT
    # ============================================================

    async def generate_insights(
        self,
        medical_data: MedicalData,
        risk_score: RiskScore,
        api_key_override: Optional[str] = None,
    ) -> AIInsights:

        medical_summary = self._prepare_medical_summary(
            medical_data,
            risk_score,
        )

        explanation_text = await self._generate_patient_explanation(
            medical_summary,
            api_key_override,
        )

        clinical_text = await self._generate_clinical_insights(
            medical_summary,
            api_key_override,
        )

        abnormal_findings = self._extract_abnormal_findings(medical_data)
        recommendations = self._generate_recommendations(
            medical_data,
            risk_score,
        )
        when_to_consult = self._determine_consultation_urgency(risk_score)

        final_summary = explanation_text
        if clinical_text:
            final_summary += "\n\nClinical Note:\n" + clinical_text

        return AIInsights(
            summary=final_summary,
            abnormal_findings=abnormal_findings,
            recommendations=recommendations,
            when_to_consult_doctor=when_to_consult,
            disclaimer="This AI-generated analysis is for informational purposes only and does not replace professional medical advice.",
        )

    # ============================================================
    # SUMMARY PREPARATION
    # ============================================================

    def _prepare_medical_summary(
        self,
        medical_data: MedicalData,
        risk_score: RiskScore,
    ) -> str:

        summary = f"Overall Risk Score: {risk_score.score}/100 ({risk_score.level.value}).\n"
        summary += f"Abnormal Parameters: {medical_data.abnormal_count}/{medical_data.total_parameters}\n\n"

        for param in medical_data.parameters:
            status = "abnormal" if param.is_abnormal else "normal"
            summary += (
                f"{param.name}: {param.value} {param.unit} "
                f"(Normal: {param.normal_min}-{param.normal_max}) "
                f"Status: {status}\n"
            )

        return summary

    # ============================================================
    # PATIENT EXPLANATION
    # ============================================================

    async def _generate_patient_explanation(
        self,
        medical_summary: str,
        api_key_override: Optional[str],
    ) -> str:

        api_key = api_key_override or self.default_openai_key
        if not api_key:
            return self._fallback_summary(medical_summary)

        try:
            client = openai.OpenAI(api_key=api_key)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.explanation_prompt},
                    {"role": "user", "content": medical_summary},
                ],
                max_tokens=350,
                temperature=0.3,
            )

            return response.choices[0].message.content

        except Exception:
            return self._fallback_summary(medical_summary)

    # ============================================================
    # CLINICAL INSIGHTS
    # ============================================================

    async def _generate_clinical_insights(
        self,
        medical_summary: str,
        api_key_override: Optional[str],
    ) -> str:

        api_key = api_key_override or self.default_openai_key
        if not api_key:
            return ""

        try:
            client = openai.OpenAI(api_key=api_key)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.clinical_prompt},
                    {"role": "user", "content": medical_summary},
                ],
                max_tokens=200,
                temperature=0.2,
            )

            return response.choices[0].message.content

        except Exception:
            return ""

    # ============================================================
    # FALLBACK SUMMARY
    # ============================================================

    def _fallback_summary(self, medical_summary: str) -> str:
        return (
            "AI explanation unavailable. "
            "Review abnormal findings below and consult a healthcare provider."
        )

    # ============================================================
    # ABNORMAL FINDINGS
    # ============================================================

    def _extract_abnormal_findings(self, medical_data: MedicalData) -> List[str]:

        findings = []

        for param in medical_data.parameters:
            if param.is_abnormal:
                findings.append(
                    f"{param.name.title()}: {param.value} {param.unit} "
                    f"(Normal: {param.normal_min}-{param.normal_max})"
                )

        return findings

    # ============================================================
    # RECOMMENDATIONS
    # ============================================================

    def _generate_recommendations(
        self,
        medical_data: MedicalData,
        risk_score: RiskScore,
    ) -> List[str]:

        recommendations = []

        # Risk-level based
        if risk_score.level == RiskLevel.LOW:
            recommendations.append("Maintain healthy lifestyle habits.")
        elif risk_score.level == RiskLevel.MEDIUM:
            recommendations.append("Consider dietary and exercise improvements.")
        elif risk_score.level == RiskLevel.HIGH:
            recommendations.append("Consult a healthcare provider soon.")
        else:
            recommendations.append("Seek immediate medical attention.")

        # Category-based
        abnormal_categories = {
            param.category
            for param in medical_data.parameters
            if param.is_abnormal
        }

        if ParameterCategory.METABOLIC in abnormal_categories:
            recommendations.append("Focus on blood sugar and cholesterol control.")

        if ParameterCategory.CARDIAC in abnormal_categories:
            recommendations.append("Monitor blood pressure and heart health.")

        if ParameterCategory.RENAL in abnormal_categories:
            recommendations.append("Hydration and kidney monitoring recommended.")

        if ParameterCategory.HEPATIC in abnormal_categories:
            recommendations.append("Limit alcohol and monitor liver enzymes.")

        if ParameterCategory.ELECTROLYTES in abnormal_categories:
            recommendations.append("Maintain proper mineral balance and hydration.")

        return recommendations[:6]

    # ============================================================
    # CONSULTATION URGENCY
    # ============================================================

    def _determine_consultation_urgency(
        self,
        risk_score: RiskScore,
    ) -> str:

        if risk_score.level == RiskLevel.CRITICAL:
            return "Seek emergency medical care immediately."
        elif risk_score.level == RiskLevel.HIGH:
            return "Schedule appointment within 1-2 days."
        elif risk_score.level == RiskLevel.MEDIUM:
            return "Schedule follow-up within 1-2 weeks."
        else:
            return "Continue regular health monitoring."
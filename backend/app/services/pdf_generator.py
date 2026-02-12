from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import io
from typing import Dict, Any, List
import os

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Custom styles for the PDF report"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.darkblue,
            alignment=TA_CENTER,
            borderWidth=0,
            borderColor=colors.transparent
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=20,
            textColor=colors.darkblue,
            alignment=TA_LEFT,
            borderWidth=0
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue,
            alignment=TA_LEFT,
            borderWidth=0,
            borderPadding=5
        ))
        
        # Body text style
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            textColor=colors.black,
            alignment=TA_LEFT,
            leading=14
        ))
        
        # Risk score style
        self.styles.add(ParagraphStyle(
            name='RiskScore',
            parent=self.styles['Normal'],
            fontSize=36,
            spaceAfter=10,
            textColor=colors.darkblue,
            alignment=TA_CENTER,
            borderWidth=0
        ))
        
        # Risk level style
        self.styles.add(ParagraphStyle(
            name='RiskLevel',
            parent=self.styles['Normal'],
            fontSize=18,
            spaceAfter=20,
            alignment=TA_CENTER,
            borderWidth=0
        ))
    
    def _get_risk_level_color(self, level: str) -> colors.Color:
        """Get color based on risk level"""
        risk_colors = {
            'low': colors.green,
            'medium': colors.orange,
            'high': colors.red,
            'critical': colors.darkred
        }
        return risk_colors.get(level.lower(), colors.black)
    
    def generate_report(self, analysis_data: Dict[str, Any]) -> io.BytesIO:
        """Generate a professional medical report PDF"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # Header Section
        story.extend(self._create_header(analysis_data))
        story.append(Spacer(1, 0.3 * inch))
        
        # Health Score Section
        story.extend(self._create_health_score_section(analysis_data))
        story.append(Spacer(1, 0.3 * inch))
        
        # Category Breakdown
        story.extend(self._create_category_breakdown(analysis_data))
        story.append(Spacer(1, 0.3 * inch))
        
        # Abnormal Findings Section
        story.extend(self._create_abnormal_findings_section(analysis_data))
        story.append(Spacer(1, 0.3 * inch))
        
        # AI Summary Section
        story.extend(self._create_ai_summary_section(analysis_data))
        story.append(Spacer(1, 0.3 * inch))
        
        # Footer/Disclaimer
        story.extend(self._create_disclaimer_section(analysis_data))
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    def _create_header(self, data: Dict[str, Any]) -> List:
        """Create report header"""
        elements = []
        
        # Logo and title
        title_table = Table([
            [
                Paragraph("MedInsight AI", self.styles['CustomTitle']),
                Paragraph(f"Report ID: {data.get('upload_id', 'N/A')[:8]}...", self.styles['CustomBody'])
            ],
            [
                Paragraph("Clinical Decision-Support Tool", self.styles['CustomBody']),
                Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", self.styles['CustomBody'])
            ]
        ], colWidths=[4*inch, 2*inch])
        
        title_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        elements.append(title_table)
        elements.append(Spacer(1, 0.2 * inch))
        
        # Horizontal line
        elements.append(Spacer(1, 0.1 * inch))
        
        return elements
    
    def _create_health_score_section(self, data: Dict[str, Any]) -> List:
        """Create health score section"""
        elements = []
        
        risk_score = data.get('risk_score', {})
        score = risk_score.get('score', 0)
        level = risk_score.get('level', 'unknown').upper()
        
        elements.append(Paragraph("Health Risk Assessment", self.styles['CustomSubtitle']))
        
        # Risk score display
        score_color = self._get_risk_level_color(level.lower())
        
        # Risk score display
        elements.append(Paragraph(str(score), ParagraphStyle(
            name='BigScore',
            parent=self.styles['Normal'],
            fontSize=48,
            textColor=colors.darkblue,
            alignment=TA_CENTER,
            spaceAfter=10
        )))

        elements.append(Spacer(1, 0.35 * inch))

        # Risk Level
        elements.append(Paragraph(
            level,
            ParagraphStyle(
                name='DynamicRiskLevel',
                parent=self.styles['Normal'],
                fontSize=20,
                textColor=score_color,
                alignment=TA_CENTER,
                spaceAfter=25
            )
        ))
        
        # Summary stats
        medical_data = data.get('medical_data', {})
        total_params = medical_data.get('total_parameters', 0)
        abnormal_count = medical_data.get('abnormal_count', 0)
        normal_count = total_params - abnormal_count
        
        stats_table = Table([
            ['Total Parameters Analyzed', str(total_params)],
            ['Normal Findings', f"{normal_count} ({(normal_count/total_params*100):.1f}%)" if total_params > 0 else "0"],
            ['Abnormal Findings', f"{abnormal_count} ({(abnormal_count/total_params*100):.1f}%)" if total_params > 0 else "0"]
        ], colWidths=[3*inch, 2*inch])
        
        stats_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
        ]))
        
        elements.append(stats_table)
        
        return elements
    
    def _create_category_breakdown(self, data: Dict[str, Any]) -> List:
        """Create category breakdown section"""
        elements = []
        
        elements.append(Paragraph("Risk by Category", self.styles['CustomSubtitle']))
        
        category_scores = data.get('risk_score', {}).get('category_scores', {})
        
        if category_scores:
            category_data = [['Category', 'Risk Score', 'Status']]
            
            for category, score in category_scores.items():
                if score <= 33:
                    status = 'Low Risk'
                    status_color = colors.green
                elif score <= 66:
                    status = 'Medium Risk'
                    status_color = colors.orange
                else:
                    status = 'High Risk'
                    status_color = colors.red
                
                category_data.append([category, f"{score}%", status])
            
            category_table = Table(category_data, colWidths=[2.5*inch, 1.5*inch, 2*inch])
            
            # Style the table
            table_style = [
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ]
            
            # Color code status cells
            for i, (_, score, status) in enumerate(category_data[1:], start=1):
                if 'Low' in status:
                    table_style.append(('TEXTCOLOR', (2, i), (2, i), colors.green))
                elif 'Medium' in status:
                    table_style.append(('TEXTCOLOR', (2, i), (2, i), colors.orange))
                elif 'High' in status:
                    table_style.append(('TEXTCOLOR', (2, i), (2, i), colors.red))
            
            category_table.setStyle(TableStyle(table_style))
            elements.append(category_table)
        
        return elements
    
    def _create_abnormal_findings_section(self, data: Dict[str, Any]) -> List:
        """Create abnormal findings section"""
        elements = []
        
        elements.append(Paragraph("Abnormal Findings", self.styles['CustomSubtitle']))
        
        medical_data = data.get('medical_data', {})
        parameters = medical_data.get('parameters', [])
        
        # Filter abnormal parameters
        abnormal_params = [p for p in parameters if p.get('is_abnormal', False)]
        
        if abnormal_params:
            findings_data = [['Parameter', 'Value', 'Reference Range', 'Category']]
            
            for param in abnormal_params:
                name = param.get('name', 'N/A')
                value = f"{param.get('value', 'N/A')} {param.get('unit', '')}"
                ref_min = param.get('normal_min')
                ref_max = param.get('normal_max')
                ref_range = f"{ref_min} - {ref_max}" if ref_min is not None and ref_max is not None else "N/A"
                category = param.get('category', 'N/A')
                
                findings_data.append([name, value, ref_range, category])
            
            findings_table = Table(findings_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 1.5*inch])
            
            findings_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.darkred),  # Red text for abnormal values
            ]))
            
            elements.append(findings_table)
        else:
            elements.append(Paragraph("No abnormal findings detected. All parameters are within normal ranges.", self.styles['CustomBody']))
        
        return elements
    
    def _create_ai_summary_section(self, data: Dict[str, Any]) -> List:
        """Create AI summary section"""
        elements = []
        
        elements.append(Paragraph("AI-Powered Analysis", self.styles['CustomSubtitle']))
        
        ai_insights = data.get('ai_insights', {})
        
        # Summary
        if ai_insights.get('summary'):
            elements.append(Paragraph("Summary", self.styles['SectionHeader']))
            elements.append(Paragraph(ai_insights['summary'], self.styles['CustomBody']))
            elements.append(Spacer(1, 0.1 * inch))
        
        # Recommendations
        if ai_insights.get('recommendations'):
            elements.append(Paragraph("Recommendations", self.styles['SectionHeader']))
            for rec in ai_insights['recommendations']:
                elements.append(Paragraph(f"• {rec}", self.styles['CustomBody']))
            elements.append(Spacer(1, 0.1 * inch))
        
        # When to consult doctor
        if ai_insights.get('when_to_consult_doctor'):
            elements.append(Paragraph("When to Consult Your Doctor", self.styles['SectionHeader']))
            elements.append(Paragraph(ai_insights['when_to_consult_doctor'], self.styles['CustomBody']))
        
        return elements
    
    def _create_disclaimer_section(self, data: Dict[str, Any]) -> List:
        """Create disclaimer section"""
        elements = []
        
        elements.append(Spacer(1, 0.2 * inch))
        
        disclaimer_text = (
            "Medical Disclaimer: This report is generated by an AI system and is intended for informational purposes only. "
            "It is not a substitute for professional medical advice, diagnosis, or treatment. "
            "Always seek the advice of your physician or other qualified health provider with any questions you may have "
            "regarding a medical condition. Do not disregard professional medical advice or delay in seeking it "
            "because of something you have read in this report."
        )
        
        disclaimer = Paragraph(disclaimer_text, ParagraphStyle(
            name='Disclaimer',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_LEFT,
            leading=11
        ))
        
        elements.append(disclaimer)
        elements.append(Spacer(1, 0.1 * inch))
        
        footer_text = "MedInsight AI - Clinical Decision-Support Tool"
        footer = Paragraph(footer_text, ParagraphStyle(
            name='Footer',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.darkblue,
            alignment=TA_CENTER,
            borderWidth=1,
            borderColor=colors.darkblue,
            borderPadding=5
        ))
        
        elements.append(footer)
        
        return elements

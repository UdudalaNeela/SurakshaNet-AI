import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from datetime import datetime

class PDFService:
    def generate_incident_report(self, report_data: dict, filepath: str):
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Title
        title_style = styles['Title']
        story.append(Paragraph("SurakshaNet AI Incident Report", title_style))
        story.append(Spacer(1, 12))
        
        # Meta info
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        story.append(Paragraph(f"Report ID: {report_data.get('id', 'N/A')}", styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Summary
        story.append(Paragraph("Incident Summary", styles['Heading2']))
        story.append(Paragraph(report_data.get('summary', 'No summary provided.'), styles['Normal']))
        story.append(Spacer(1, 12))
        
        # AI Findings
        story.append(Paragraph("AI Findings & Risk Analysis", styles['Heading2']))
        findings_data = [
            ["Category", report_data.get('category', 'N/A')],
            ["Risk Level", report_data.get('risk_level', 'N/A')],
            ["Probability", f"{report_data.get('probability', 0)}%"],
        ]
        t = Table(findings_data, colWidths=[150, 300])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.beige),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        story.append(t)
        story.append(Spacer(1, 12))
        
        # Explanation
        story.append(Paragraph(report_data.get('explanation', ''), styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Recommendations
        story.append(Paragraph("Safety Recommendations", styles['Heading2']))
        for rec in report_data.get('recommendations', []):
            story.append(Paragraph(f"• {rec}", styles['Normal']))

        doc.build(story)
        return filepath

pdf_service = PDFService()

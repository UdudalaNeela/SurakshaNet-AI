import json
from services.gemini_service import gemini_service
import logging

logger = logging.getLogger(__name__)

class ScamDetectorService:
    async def analyze_text(self, text: str) -> dict:
        prompt = f"""
        You are an expert cybersecurity and fraud detection AI. 
        Analyze the following text for potential scams, phishing, or fraud.
        Return the result strictly as a JSON object with the following schema:
        {{
            "probability": int (0-100),
            "category": string (e.g., 'Phishing', 'Digital Arrest', 'UPI Fraud', 'Job Scam', 'Safe'),
            "risk_level": string ('Low', 'Medium', 'High', 'Critical'),
            "confidence": int (0-100),
            "explanation": string (detailed reasoning),
            "recommendations": [list of strings for user safety]
        }}
        
        Text to analyze:
        "{text}"
        """
        
        try:
            response_text = await gemini_service.generate_content(prompt)
            # Clean up response in case Gemini wraps it in markdown code blocks
            clean_text = response_text.replace('```json', '').replace('```', '').strip()
            result = json.loads(clean_text)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from Gemini: {response_text}")
            return self._get_fallback_response(text)
        except Exception as e:
            logger.error(f"Scam detection error: {e}")
            return self._get_fallback_response(text)

    def _get_fallback_response(self, text: str) -> dict:
        return {
            "probability": 50,
            "category": "Unknown",
            "risk_level": "Medium",
            "confidence": 0,
            "explanation": "Failed to parse AI response or AI service unavailable. Proceed with caution.",
            "recommendations": ["Do not share personal information.", "Verify the sender independently."]
        }

scam_detector = ScamDetectorService()

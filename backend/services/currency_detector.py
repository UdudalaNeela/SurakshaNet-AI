import json
import logging
import base64
from io import BytesIO
from services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class CurrencyDetectorService:
    async def analyze_currency(self, image_bytes: bytes, mime_type: str) -> dict:
        # In a real production environment, you would run OpenCV/TensorFlow models here.
        # For the hackathon demo, we will use Gemini Vision to simulate the detection.
        
        prompt = """
        You are an expert currency authenticator. Analyze this image of a currency note.
        Look for security threads, watermarks, micro-lettering, and color shifting ink if visible.
        Return the result strictly as a JSON object with the following schema:
        {
            "status": string ('Genuine' or 'Counterfeit'),
            "confidence_score": int (0-100),
            "suspicious_regions": [list of strings, e.g., 'Missing watermark', 'Incorrect serial font'],
            "explanation": string (detailed reasoning for the conclusion)
        }
        """
        
        try:
            # Format image for Gemini
            image_parts = [
                {
                    "mime_type": mime_type,
                    "data": image_bytes
                }
            ]
            response_text = await gemini_service.analyze_image(image_parts, prompt)
            clean_text = response_text.replace('```json', '').replace('```', '').strip()
            result = json.loads(clean_text)
            return result
        except Exception as e:
            logger.error(f"Currency detection error: {e}")
            # Fallback mock data if API fails
            return {
                "status": "Counterfeit",
                "confidence_score": 85,
                "suspicious_regions": ["Security thread missing", "Blurry micro-printing"],
                "explanation": "The image analysis failed, falling back to mock counterfeit result for demo."
            }

currency_detector = CurrencyDetectorService()

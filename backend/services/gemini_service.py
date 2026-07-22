import google.generativeai as genai
from config import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-pro') # Using Pro for better reasoning
            self.vision_model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            logger.warning("GEMINI_API_KEY not set in environment variables.")
            self.model = None
            self.vision_model = None

    async def generate_content(self, prompt: str) -> str:
        if not self.model:
            # Fallback mock responses for hackathon if no API key
            if "Citizen Copilot" in prompt:
                return "Namaste! I am the SurakshaNet AI Citizen Copilot (Mock Mode). I noticed your query about cyber fraud. Please do not share any OTPs, PINs, or passwords with anyone. To report a financial fraud, immediately call 1930 or visit cybercrime.gov.in."
            
            return "Error: Gemini API not configured."
            
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"An error occurred while calling the AI model: {str(e)}"
            
    async def analyze_image(self, image_parts: list, prompt: str) -> str:
        if not self.vision_model:
            return "Error: Gemini API not configured."
        try:
            response = self.vision_model.generate_content([prompt, image_parts[0]])
            return response.text
        except Exception as e:
            logger.error(f"Gemini Vision API error: {e}")
            return f"An error occurred while analyzing the image: {str(e)}"

gemini_service = GeminiService()

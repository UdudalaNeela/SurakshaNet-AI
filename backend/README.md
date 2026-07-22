# SurakshaNet AI Backend

This is the production-ready FastAPI backend for the SurakshaNet AI platform.

## Features
- FastAPI & Async MongoDB (Motor)
- JWT Authentication (Passlib/Bcrypt)
- Google Gemini API integration (Text & Vision)
- NetworkX for Fraud Ring Detection
- ReportLab for PDF generation
- Fully modular structure

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your details (MongoDB URI, Gemini API Key, etc.).

4. Run the server:
   ```bash
   python -m uvicorn app:app --reload
   ```

5. Access API Docs:
   Navigate to `http://localhost:8000/docs` to view the full Swagger UI documentation.

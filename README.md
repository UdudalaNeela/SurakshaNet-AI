# SurakshaNet AI

## AI-Powered Digital Public Safety Intelligence Platform

SurakshaNet AI is an enterprise-grade, AI-powered Digital Public Safety Intelligence Platform developed for the **ET AI Hackathon**. The platform empowers citizens, cybercrime investigators, financial institutions, and government agencies to proactively detect, investigate, and prevent digital fraud using advanced Artificial Intelligence.

Unlike conventional cybercrime reporting systems, SurakshaNet AI combines multiple specialized AI engines—including Natural Language Processing (NLP), Computer Vision, Speech Intelligence, Graph Intelligence, Geospatial Intelligence, and Generative AI—into a unified Decision Intelligence Platform capable of fraud detection, investigation assistance, organized cybercrime analysis, and explainable decision support.

---

# Problem Statement

India is witnessing an unprecedented rise in cyber-enabled crimes such as Digital Arrest scams, phishing attacks, UPI fraud, QR code scams, counterfeit currency circulation, voice cloning attacks, and identity theft. Existing cybercrime reporting systems are largely reactive, requiring manual investigations across disconnected platforms.

SurakshaNet AI addresses this challenge by providing an intelligent, AI-assisted ecosystem that enables proactive fraud detection, automated investigation workflows, and real-time cyber intelligence for citizens and law enforcement agencies.

---

# Key Features

## Citizen Portal

* AI Scam Message Detection
* Digital Arrest Detection
* QR Code Verification
* Counterfeit Currency Detection
* Complaint Registration
* Complaint Tracking
* Evidence Upload
* AI Cyber Safety Assistant
* Multilingual Support
* Real-Time Guidance

---

## Cyber Crime Officer Portal

* Investigation Dashboard
* Complaint Management
* Fraud Relationship Graph
* Crime Heatmap
* Evidence Intelligence
* AI Investigation Assistant
* AI Case Summaries
* Investigation Timeline
* Risk Assessment

---

## Administrator Portal

* User Management
* Officer Management
* Platform Monitoring
* Analytics Dashboard
* Threat Intelligence Reports
* Audit Logs
* System Health Monitoring

---

# AI Modules

## Natural Language Processing

* Scam Classification
* Phishing Detection
* Threat Analysis
* Entity Extraction
* Complaint Understanding

---

## Computer Vision

* Counterfeit Currency Verification
* QR Code Verification
* OCR
* Security Feature Analysis
* Document Verification

---

## Speech Intelligence

* Digital Arrest Detection
* Voice Clone Detection
* Emotion Analysis
* Speech-to-Text
* Speaker Identification

---

## Graph Intelligence

* Fraud Network Detection
* Relationship Analysis
* Scam Cluster Discovery
* Entity Correlation
* Neo4j Graph Analytics

---

## Geospatial Intelligence

* Crime Heatmaps
* Regional Risk Analysis
* Fraud Hotspots
* Location Analytics
* Trend Prediction

---

## Generative AI

Powered by Google Gemini

* Investigation Assistance
* FIR Draft Generation
* AI Investigation Summaries
* Citizen Assistance
* Explainable AI Responses

---

# Technology Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* JavaScript

## Backend

* FastAPI
* Python

## Artificial Intelligence

* Google Gemini
* OpenCV
* Whisper
* YOLO
* HuggingFace Transformers
* PyTorch
* TensorFlow
* Scikit-learn

## Database

* PostgreSQL
* Neo4j
* Redis

## DevOps

* Docker
* Nginx
* GitHub Actions

---

# System Architecture

```
Citizens
Cyber Crime Officers
Administrators
        │
        ▼
React Frontend
        │
        ▼
FastAPI API Gateway
        │
        ▼
Authentication & Authorization
        │
        ▼
Backend Microservices
│
├── Complaint Service
├── Investigation Service
├── AI Service
├── Notification Service
├── Analytics Service
└── Audit Service
        │
        ▼
Decision Intelligence Engine
│
├── NLP Engine
├── Vision Engine
├── Speech Engine
├── Graph Engine
├── Geo Engine
└── Gemini AI
        │
        ▼
Data Layer
│
├── PostgreSQL
├── Neo4j
├── Redis
└── Object Storage
```

---

# Project Structure

```
SurakshaNet-AI/

backend/
│
├── api/
├── ai/
├── auth/
├── database/
├── models/
├── services/
├── middleware/
└── tests/

frontend/
│
├── src/
├── components/
├── pages/
└── assets/

docs/

datasets/

models/

presentation/

README.md

docker-compose.yml
```

---

# Installation

## Clone Repository

```
git clone https://github.com/yourusername/SurakshaNet-AI.git

cd SurakshaNet-AI
```

---

## Backend Setup

```
cd backend

python -m venv .venv

source .venv/bin/activate

Windows

.venv\Scripts\activate

pip install -r requirements.txt
```

---

## Frontend Setup

```
cd frontend

npm install
```

---

## Run Backend

```
uvicorn main:app --reload
```

---

## Run Frontend

```
npm run dev
```

---

## Open Application

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:8000
```

Swagger API

```
http://localhost:8000/docs
```

---

# API Endpoints

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | /api/scam/analyze    | Analyze Scam Message              |
| POST   | /api/audio/analyze   | Digital Arrest Detection          |
| POST   | /api/currency/verify | Counterfeit Currency Verification |
| POST   | /api/qr/verify       | QR Code Verification              |
| POST   | /api/complaints      | Register Complaint                |
| GET    | /api/graph           | Fraud Relationship Graph          |
| GET    | /api/heatmap         | Crime Heatmap                     |
| GET    | /api/dashboard       | Officer Dashboard                 |

---

# AI Workflow

```
Citizen Upload

↓

AI Analysis

↓

Threat Detection

↓

Evidence Extraction

↓

Decision Intelligence Engine

↓

Risk Assessment

↓

Citizen Notification

↓

Officer Investigation

↓

Fraud Network Update

↓

Case Resolution
```

---

# Evaluator Demo Guide

Welcome to the **SurakshaNet AI** demonstration. The platform can be evaluated from three different perspectives: Citizen, Cyber Crime Officer, and System Administrator.

---

## Citizen Experience

### Login

URL

```
http://localhost:3000/login
```

Select **Citizen Portal**

Email

```
demo@surakshanet.ai
```

Password

```
Password123!
```

You may also register a new citizen account using the live registration flow.

### Features to Test

* AI Scam Checker
* Report Cyber Crime
* Upload Evidence
* Complaint Tracking
* Counterfeit Currency Verification
* QR Code Verification

---

## Cyber Crime Officer Experience

### Login

URL

```
http://localhost:3000/login
```

Select **Cyber Crime Officer**

Officer ID

```
OFF-101
```

Official Email

```
officer@surakshanet.com
```

Password

```
password123
```

### Features to Test

* Investigation Dashboard
* Review Citizen Complaints
* Fraud Relationship Graph
* Crime Heatmap
* AI Investigation Assistant
* Generate Investigation Summary

---

## Administrator Experience

### Login

URL

```
http://localhost:3000/login
```

Select **Admin Portal**

Email

```
admin@surakshanet.com
```

Password

```
password123
```

### Features to Test

* Global Dashboard
* User Management
* Officer Management
* Analytics Dashboard
* Audit Logs
* Platform Monitoring

---

## Evaluator Note

All platform modules are connected through a live backend infrastructure. Complaints submitted by citizens are immediately available within the Cyber Crime Officer dashboard. AI modules analyze submitted evidence, perform fraud detection, generate risk assessments, and provide explainable recommendations to support investigations.

---

# Testing

Backend

```
pytest
```

Frontend

```
npm test
```

---

# Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Secure Password Hashing
* Audit Logging
* Input Validation
* API Rate Limiting
* HTTPS Ready
* Explainable AI Decision Logs

---

# Future Roadmap

* Mobile Application
* Deepfake Detection
* AI Voice Biometrics
* National Cyber Threat Intelligence
* Predictive Cybercrime Analytics
* Multi-language Voice Assistant
* Banking Integration
* Telecom Integration
* Government API Integration

---

# Team

**Team Agriverse**

ET AI Hackathon

* Ududala Neela


---

# License

This project was developed for the **ET AI Hackathon**.

Licensed under the **MIT License**.

---

# Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

**Made with ❤️ for a Safer Digital India 🇮🇳**

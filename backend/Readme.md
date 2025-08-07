# 🚀 WIMSY Backend API

<div align="center">
  <img src="https://img.shields.io/badge/Framework-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/TTS-Murf_AI-FF6B6B?style=for-the-badge" alt="Murf AI"/>
</div>

This is the backend service for the WIMSY AI Voice Agent. It provides RESTful API endpoints to power the voice agent functionality, including text-to-speech conversion using the Murf AI API.

## 📋 Table of Contents

- [Setup](#-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
  - [Health Check](#health-check)
  - [Welcome Message](#welcome-message)
  - [Text-to-Speech Conversion](#text-to-speech-conversion)
  - [Audio Upload](#audio-upload)
- [Models](#-models)
- [Error Handling](#-error-handling)

## 🔧 Setup

```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

The API will be available at `http://localhost:5000`

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
MURF_AI_API_KEY=your_api_key_here
```

You can get your Murf AI API key by signing up at [murf.ai](https://murf.ai).

## 🌐 API Endpoints

### Health Check

**Endpoint:** `GET /health`

Checks if the server is up and running.

**Response:**
```html
<h1>Service is running fully fit 📈</h1>
```

**Example:**
```bash
curl http://localhost:5000/health
```

### Welcome Message

**Endpoint:** `GET /`

Returns a welcome message for the application.

**Response:**
```json
{
  "message": "Welcome to the FastAPI AI-Powered Voice Agent application!"
}
```

**Example:**
```bash
curl http://localhost:5000/
```

### Text-to-Speech Conversion

**Endpoint:** `POST /server`

Converts text to speech using the Murf AI API.

**Request Body:**
```json
{
  "text": "The text you want to convert to speech"
}
```

**Response:**
```json
{
  "audioUrl": "https://cdn.murf.ai/speech/123456abcdef.mp3"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/server \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, I am WIMSY, your AI-powered voice agent!"}'
```

### Audio Upload

**Endpoint:** `POST /upload`

Uploads an audio file to the server. The file will be stored in the `public` directory.

**Request:**
- Must be a multipart/form-data request
- File field name should be `audio`
- Supports audio files (webm, wav, mp3, etc.)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "recording.webm"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/upload \
  -F "audio=@recording.webm" 
```

## 📝 Models

### TextToSpeechRequest

```python
class TextToSpeechRequest(BaseModel):
    text: str
```

This model is used to validate the request body for the `/server` endpoint.

### Audio Upload

For the `/upload` endpoint, FastAPI's `UploadFile` class is used to handle the incoming file. This provides:
- File-like interface
- Asynchronous I/O operations
- Metadata like filename and content type

## ❌ Error Handling

The API provides appropriate error responses for various scenarios:

| Error | Status Code | Response |
|-------|-------------|----------|
| Missing API Key | 500 | `{"error": "MURF_AI_API_KEY not found"}` |
| Request Error | 500 | `{"error": "[Error message]"}` |
| JSON Decode Error | 500 | `{"error": "Failed to decode JSON response"}` |
| File Upload Error | 500 | `{"error": "[Error message]"}` |
| Invalid File Type | 422 | `{"error": "Unsupported file type"}` |

## 🧩 Project Structure

```
backend/
├── main.py          # FastAPI application setup and initialization
├── models.py        # Pydantic data models
├── routes.py        # API route definitions
├── requirements.txt # Python dependencies
├── public/          # Directory for storing uploaded audio files
└── README.md        # This file
```

## 🔍 Implementation Details

The backend follows a modular architecture:

1. `main.py` initializes the FastAPI application, configures CORS, and includes the router from `routes.py`.
2. `models.py` defines Pydantic models for request validation.
3. `routes.py` contains all the API endpoints and their implementation.
4. `public/` directory is automatically created when needed to store uploaded audio files.

## 💻 Development

To access the interactive API documentation, visit:
- Swagger UI: `http://localhost:5000/docs`
- ReDoc: `http://localhost:5000/redoc`

---

<div align="center">
  <p>Built with ❤️ for the 30-Day AI Voice Agent Challenge</p>
</div>

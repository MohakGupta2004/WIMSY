# 🚀 WIMSY Backend API

<div align="center">
  <img src="https://img.shields.io/badge/Framework-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/TTS-Murf_AI-FF6B6B?style=for-the-badge" alt="Murf AI"/>
  <img src="https://img.shields.io/badge/STT-AssemblyAI-purple?style=for-the-badge" alt="AssemblyAI"/>
  <img src="https://img.shields.io/badge/WebSocket-Real--time-green?style=for-the-badge" alt="WebSocket"/>
</div>

This is the backend service for the WIMSY AI Voice Agent. It provides RESTful API endpoints and WebSocket connections to power the voice agent functionality, including text-to-speech conversion using Murf AI and speech-to-text transcription using AssemblyAI.

## 📋 Table of Contents

- [Setup](#-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
  - [Health Check](#health-check)
  - [Welcome Message](#welcome-message)
  - [Text-to-Speech Conversion](#text-to-speech-conversion)
  - [Audio Upload](#audio-upload)
  - [Audio Transcription](#audio-transcription)
  - [Live Transcription WebSocket](#live-transcription-websocket)
  - [Echo Bot v2: Transcribe & Murf Voice Playback](#echo-bot-v2-transcribe--murf-voice-playback)
  - [LLM Query: Gemini AI Text Generation](#llm-query-gemini-ai-text-generation)
  - [Agent Chat: Session-based Conversational AI](#agent-chat-session-based-conversational-ai)
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
MURF_AI_API_KEY=your_murf_api_key_here
ASSEMBLY_AI_API_KEY=your_assemblyai_api_key_here
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
```

You can get your API keys by signing up at:
- [Murf AI](https://murf.ai) for text-to-speech
- [AssemblyAI](https://www.assemblyai.com/) for speech-to-text
- [Google AI Studio](https://ai.google.dev/) for Gemini LLM access

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

### Audio Transcription

**Endpoint:** `POST /transcribe`

Transcribes an audio file using the AssemblyAI API.

**Request:**
- Must be a multipart/form-data request
- File field name should be `audio`
- Supports audio files (webm, wav, mp3, etc.)

**Response:**
```json
{
  "text": "This is the transcribed text from the audio file."
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/transcribe \
  -F "audio=@recording.webm"
```

### Live Transcription WebSocket

**Endpoint:** `WebSocket /transcribe`

Provides real-time audio transcription via WebSocket connection. This endpoint accepts streaming audio data and returns live transcription results.

**Connection:**
```javascript
const websocket = new WebSocket('ws://localhost:5000/transcribe');
```

**Input Format:**
- Base64 encoded audio data: `data:audio/webm;base64,{audio_data}`
- Control messages: `{"type": "recording_stopped"}` or `{"type": "close_connection"}`

**Output Format:**
```json
{
  "text": "Live transcription text",
  "is_final": false
}
```

**Features:**
- Real-time streaming transcription
- Persistent connection for multiple recordings
- Format turns for better readability
- Thread-safe event handling

### Echo Bot v2: Transcribe & Murf Voice Playback

**Endpoint:** `POST /tts/echo`

Accepts an audio file, transcribes it using AssemblyAI, then generates new audio using Murf AI and returns the Murf audio URL and transcript.

**Request:**
- Multipart/form-data with file field name `audio`

**Response:**
```json
{
  "audioUrl": "https://cdn.murf.ai/speech/abcdef123456.mp3",
  "transcribedText": "Your transcribed text here."
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/tts/echo \
  -F "audio=@recording.webm"
```

**Workflow:**
1. Receives audio from client
2. Transcribes audio using AssemblyAI
3. Sends transcript to Murf AI for voice synthesis
4. Returns Murf-generated audio URL and transcript to client

**Frontend:**
- Plays Murf-generated audio in the UI
- Displays transcript for each recording session

### LLM Query: Gemini AI Text Generation

**Endpoint:** `POST /llm/query`

Accepts a text query and generates an AI response using Google's Gemini 2.5 Flash model. The response is tailored with a cat-themed assistant persona named WIMSY.

**Request Body:**
```json
{
  "query": "Your question or request for the AI assistant"
}
```

**Response:**
```json
{
  "response": "AI-generated response from Gemini model"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/llm/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Tell me a cat joke"}'
```

**Features:**
- Natural language understanding and generation
- Cat-themed AI assistant persona
- Fast response times with Gemini 2.5 Flash model
- Contextual understanding of queries
- Detailed error reporting

### Agent Chat: Session-based Conversational AI

**Endpoint:** `POST /agent/chat/{session_id}`

A complete conversational AI endpoint that maintains chat history per session. Accepts audio input, transcribes it, generates AI responses using Gemini, and returns Murf-generated audio.

**Request:**
- Path parameter: `session_id` (string) - Unique identifier for the conversation session
- Multipart/form-data with file field name `audio`

**Response:**
```json
{
  "audioUrl": "https://cdn.murf.ai/speech/generated_response.mp3",
  "LLM_Response": "AI-generated text response from Gemini"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/agent/chat/user_12345 \
  -F "audio=@recording.webm"
```

**Features:**
- Session-based conversation memory
- Complete STT → LLM → TTS pipeline
- Robust error handling with fallback audio responses
- Automatic conversation history management
- Cat-themed AI assistant persona

**Error Handling:**
- If transcription fails: Returns fallback audio "Sorry, I am unable to process your request at the moment"
- If LLM fails: Returns error audio with friendly message
- If TTS fails: Returns appropriate error response
- All errors include both JSON error messages and audio fallbacks

## 📝 Models

### TextToSpeechRequest

```python
class TextToSpeechRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    style: Optional[str] = None
```

This model is used to validate the request body for the `/server` endpoint.

### LLMQuery

```python
class LLMQuery(BaseModel):
    query: str
```

This model is used to validate the request body for the `/llm/query` endpoint.

### TranscriptionRequest

```python
class TranscriptionRequest(BaseModel):
    audio_data: str
```

This model is used for WebSocket transcription requests.

### TranscriptionResponse

```python
class TranscriptionResponse(BaseModel):
    text: str
    is_final: bool = False
```

This model represents the response format for transcription results.

### Audio Upload

For the `/upload` endpoint, FastAPI's `UploadFile` class is used to handle the incoming file. This provides:
- File-like interface
- Asynchronous I/O operations
- Metadata like filename and content type

## ❌ Error Handling

The API provides robust error handling with both JSON responses and audio fallbacks for a better user experience:

| Error Scenario | Status Code | JSON Response | Audio Fallback |
|----------------|-------------|---------------|----------------|
| Missing Murf AI API Key | 500 | `{"error": "MURF_AI_API_KEY not found"}` | - |
| Missing AssemblyAI API Key | 500 | `{"error": "ASSEMBLY_AI_API_KEY not found"}` | - |
| Missing Google GenAI API Key | 500 | `{"error": "GOOGLE_GENAI_API_KEY not found"}` | - |
| Transcription Failure | 200 | `{"error": "Transcription failed", "audioUrl": "..."}` | "Sorry, I am unable to process your request at the moment" |
| Empty Transcription | 200 | `{"error": "No text found", "audioUrl": "..."}` | "No text found in transcription. Please try again" |
| LLM Processing Error | 200 | `{"error": "LLM error", "audioUrl": "..."}` | "Sorry, I am unable to process your request at the moment" |
| TTS Generation Error | 500 | `{"error": "TTS generation failed"}` | - |
| Network/Request Error | 500 | `{"error": "[Error message]"}` | - |
| JSON Decode Error | 500 | `{"error": "Failed to decode JSON response"}` | - |
| File Upload Error | 500 | `{"error": "[Error message]"}` | - |
| WebSocket Error | - | `{"error": "[Error message]"}` | - |
| Invalid File Type | 422 | `{"error": "Unsupported file type"}` | - |

**Key Features:**
- **Graceful Degradation**: Critical errors return both error messages and fallback audio
- **User-Friendly Messages**: Audio responses use natural language instead of technical errors
- **Session Preservation**: Chat history is maintained even when individual requests fail
- **Comprehensive Logging**: All errors are logged with full stack traces for debugging

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
2. `models.py` defines Pydantic models for request validation and response formatting.
3. `routes.py` contains all the API endpoints, WebSocket handlers, and their implementation.
4. `public/` directory is automatically created when needed to store uploaded audio files.

## 🔧 Key Technologies

- **FastAPI**: Modern, fast web framework for building APIs
- **WebSockets**: Real-time bidirectional communication for live transcription
- **AssemblyAI Streaming SDK**: Real-time speech-to-text processing
- **Google Gemini 2.5**: Advanced large language model for AI text generation
- **Asyncio**: Asynchronous programming for handling concurrent requests
- **Thread-safe Operations**: Proper handling of cross-thread communication

## 💻 Development

To access the interactive API documentation, visit:
- Swagger UI: `http://localhost:5000/docs`
- ReDoc: `http://localhost:5000/redoc`

---

<div align="center">
  <p>Built with ❤️ for the 30-Day AI Voice Agent Challenge</p>
</div>

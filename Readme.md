# 🐱 WIMSY - 30 Day AI Voice Agent Challenge

<div align="center">
  <img src="https://img.shields.io/badge/Challenge-In%20Progress-blue?style=for-the-badge" alt="Challenge Status"/>
  <img src="https://img.shields.io/badge/Days%20Completed-10%2F30-green?style=for-the-badge" alt="Progress"/>
  <img src="https://img.shields.io/badge/Made%20with-Murf%20AI-orange?style=for-the-badge" alt="Made with Murf AI"/>
  <img src="https://img.shields.io/badge/Transcription-AssemblyAI-purple?style=for-the-badge" alt="AssemblyAI"/>
  <img src="https://img.shields.io/badge/LLM-Gemini--2.5--flash-blue?style=for-the-badge" alt="Gemini LLM"/>
</div>

This repository documents my journey through the **30-Day AI Voice Agent Challenge** by Murf AI. Follow along as I build a fully functional AI-powered voice companion from scratch, one day at a time!

## 🚀 About WIMSY

**WIMSY** (Wonderfully Intelligent Messaging System, Yay!) is an AI-powered voice agent being built incrementally over 30 days. Each day of this challenge brings a new feature or enhancement to the project.

The goal is to create a voice agent that can:
- Convert text to realistic speech using Murf AI's TTS API
- Record and transcribe audio using AssemblyAI
- Provide live real-time transcription during recording
- Upload and process audio files
- Interact with users through a clean, intuitive interface
- Demonstrate the power of modern voice technology

### ✨ Key Features (So Far)

- RESTful API server with FastAPI
- Text-to-Speech conversion via Murf AI
- Echo Bot with audio recording and playback
- Audio file uploads with progress visualization
- Server-side transcription using AssemblyAI
- Live real-time transcription during recording
- WebSocket-based streaming for continuous transcription
- Persistent transcript history with clear functionality
- AI-powered text responses via Google's Gemini 2.5 flash model
- Conversational chat history with session IDs
- End-to-end voice chat: speak, transcribe, LLM, TTS, audio reply
- Clean separation of concerns with model-view-controller pattern
- Modern UI with Tailwind CSS and responsive design

## 🛠️ Built With

* **Backend:** [Python 3](https://www.python.org/) with [FastAPI](https://fastapi.tiangolo.com/)
* **Frontend:** HTML, CSS, [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
* **Voice Technology:** [Murf AI API](https://murf.ai/api) for Text-to-Speech
* **Transcription:** [AssemblyAI](https://www.assemblyai.com/) for Speech-to-Text
* **Language Model:** [Google Gemini 2.5](https://ai.google.dev/) for AI text responses
* **Real-time Communication:** WebSockets for live transcription
* **Environment:** [Python venv](https://docs.python.org/3/library/venv.html) for dependency isolation

## 🏁 Getting Started

To get WIMSY running locally, follow these steps:

### Prerequisites

* Python 3.8+
* A Murf AI API key (sign up at [murf.ai](https://murf.ai))
* An AssemblyAI API key (sign up at [assemblyai.com](https://www.assemblyai.com/))
* A Google Generative AI API key (sign up at [ai.google.dev](https://ai.google.dev/))
* Modern web browser with microphone access

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Pramit3129/WIMSY.git
   ```

2. **Set up environment variables**
   ```sh
   # Create a .env file in the backend directory
   echo "MURF_AI_API_KEY=your_murf_api_key_here" > backend/.env
   echo "ASSEMBLY_AI_API_KEY=your_assemblyai_api_key_here" >> backend/.env
   echo "GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here" >> backend/.env
   ```

3. **Backend Setup**
   ```sh
   # Navigate to the backend directory
   cd backend

   # Create and activate a virtual environment
   python3 -m venv venv
   source venv/bin/activate

   # Install Python dependencies
   pip install -r requirements.txt

   # Run the FastAPI server
   uvicorn main:app --host 0.0.0.0 --port 5000 --reload
   ```
   The backend server will be running at `http://localhost:5000`.

4. **Frontend Setup**
   ```sh
   # Open a new terminal and navigate to the frontend directory
   cd frontend

   # Use VS Code Live Server or any static file server
   # For example, with Python:
   python3 -m http.server 3000
   ```
   Access the frontend at `http://localhost:3000`.

## 📈 Challenge Progress

* **Day 1:** 🏗️ **Project Foundation**
  * Set up FastAPI backend server
  * Created a simple HTML/JS frontend
  * Established client-server communication
  * Applied proper project structure

* **Day 2:** 🔊 **Text-to-Speech Integration**
  * Implemented `/server` endpoint for TTS
  * Added Pydantic models for request validation
  * Integrated Murf AI's REST TTS API
  * Set up secure environment variables for API keys

* **Day 3:** 🎨 **UI Enhancement & CORS Setup**
  * Added responsive UI with Tailwind CSS
  * Implemented CORS to allow cross-origin requests
  * Enhanced error handling in API endpoints
  * Added loading animations and visual feedback

* **Day 4:** 🎤 **Echo Bot Implementation**
  * Created an Echo Bot that records user's voice
  * Implemented MediaRecorder API for browser audio recording
  * Added recording timer and visual indicators
  * Built audio playback functionality

* **Day 5:** 📤 **Audio Upload Feature**
  * Created backend endpoint to receive and save audio files
  * Implemented frontend audio upload functionality
  * Added upload progress bar with visual feedback
  * Enhanced UX with success/error notifications
  * Properly managed microphone resources

* **Day 6:** 🎯 **Server-Side Transcription**
  * Integrated AssemblyAI for speech-to-text conversion
  * Created `/transcribe` endpoint for audio file transcription
  * Added live real-time transcription during recording
  * Implemented WebSocket streaming for continuous transcription
  * Built persistent transcript history with clear functionality
  * Enhanced UI with transcription display and management controls

* **Day 7:** ✨ **Echo Bot v2 — Murf AI Voice Playback & Transcript Display**
  * Created `/tts/echo` endpoint to accept audio, transcribe it, and generate Murf AI voice
  * Integrated AssemblyAI for transcription and Murf AI for voice synthesis
  * Frontend now plays back Murf-generated audio instead of the original recording
  * Transcript of each recording is displayed in the UI for every session
  * Enhanced user experience with real-time feedback and professional voice output
  * Demo ready for sharing and public feedback

* **Day 8:** 🧠 **Gemini LLM Integration**
  * Created `/llm/query` endpoint for AI text generation
  * Integrated Google's Gemini 2.5 Flash model for natural language responses
  * Customized system instructions for cat-themed AI assistant persona
  * Added robust error handling and validation
  * Implemented proper API key security with environment variables
  * Set up for future conversational features and voice agent intelligence

* **Day 9:** 🗣️ **LLM Audio Chat Integration**
  * Updated `/llm/query` endpoint to accept audio input
  * Orchestrated STT → LLM → TTS pipeline for spoken queries and AI voice replies
  * Frontend plays Murf-generated LLM response audio in the UI
  * Achieved seamless voice-to-voice AI conversation
  * Demo video posted on LinkedIn

* **Day 10:** 🗂️ **Conversational Chat History with Session IDs**
  * Created `/agent/chat/{session_id}` endpoint for session-based chat history
  * Chat history stored in a global in-memory dictionary for each session
  * Each session remembers previous messages for contextual LLM responses
  * UI stores session ID in the URL and auto-restarts recording after each reply
  * Achieved a complete working conversational bot with persistent memory
  * Demo video posted on LinkedIn

* **Days 11-30:** Coming soon!

## 📝 Project Structure

```
WIMSY/
├── backend/
│   ├── main.py        # FastAPI application entry point
│   ├── models.py      # Pydantic data models
│   ├── routes.py      # API route definitions
│   ├── requirements.txt # Python dependencies
│   └── public/        # Folder for uploaded audio files
├── frontend/
│   ├── index.html     # Main HTML interface
│   ├── index.js       # Frontend JavaScript
│   ├── package.json   # Frontend dependencies
│   └── *.png          # UI assets and images
└── Readme.md          # Project documentation
```

## 🔮 Future Enhancements

* Interactive voice responses
* Custom voice selection
* Conversation memory
* Voice recognition integration
* Speech-to-text capabilities
* Extended recording options
* Cloud storage for audio files

---

<div align="center">
  <h3>🐾 Follow my 30-day challenge journey on <a href="https://www.linkedin.com/in/pramit-manna-651350307/">LinkedIn</a>! 🐾</h3>
</div>
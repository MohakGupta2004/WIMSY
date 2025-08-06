# 🐱 WIMSY - 30 Day AI Voice Agent Challenge

<div align="center">
  <img src="https://img.shields.io/badge/Challenge-In%20Progress-blue?style=for-the-badge" alt="Challenge Status"/>
  <img src="https://img.shields.io/badge/Days%20Completed-5%2F30-green?style=for-the-badge" alt="Progress"/>
  <img src="https://img.shields.io/badge/Made%20with-Murf%20AI-orange?style=for-the-badge" alt="Made with Murf AI"/>
</div>

This repository documents my journey through the **30-Day AI Voice Agent Challenge** by Murf AI. Follow along as I build a fully functional AI-powered voice companion from scratch, one day at a time!

## 🚀 About WIMSY

**WIMSY** (Wonderfully Intelligent Messaging System, Yay!) is an AI-powered voice agent being built incrementally over 30 days. Each day of this challenge brings a new feature or enhancement to the project.

The goal is to create a voice agent that can:
- Convert text to realistic speech using Murf AI's TTS API
- Interact with users through a clean, intuitive interface
- Demonstrate the power of modern voice technology

### ✨ Key Features (So Far)

- RESTful API server with FastAPI
- Text-to-Speech conversion via Murf AI
- Echo Bot with audio recording and playback
- Audio file uploads with progress visualization
- Clean separation of concerns with model-view-controller pattern
- Modern UI with Tailwind CSS

## 🛠️ Built With

* **Backend:** [Python 3](https://www.python.org/) with [FastAPI](https://fastapi.tiangolo.com/)
* **Frontend:** HTML, CSS, [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
* **Voice Technology:** [Murf AI API](https://murf.ai/api)
* **Environment:** [Python venv](https://docs.python.org/3/library/venv.html) for dependency isolation

## 🏁 Getting Started

To get WIMSY running locally, follow these steps:

### Prerequisites

* Python 3.8+
* A Murf AI API key (sign up at [murf.ai](https://murf.ai))
* Modern web browser

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Pramit3129/WIMSY.git
   ```

2. **Set up environment variables**
   ```sh
   # Create a .env file in the backend directory
   echo "MURF_AI_API_KEY=your_api_key_here" > backend/.env
   ```

3. **Backend Setup**
   ```sh
   # Navigate to the backend directory
   cd backend

   # Create and activate a virtual environment
   python3 -m venv venv
   source venv/bin/activate

   # Install Python dependencies
   pip install fastapi uvicorn python-dotenv requests

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

* **Days 6-30:** Coming soon!

## 📝 Project Structure

```
WIMSY/
├── backend/
│   ├── main.py        # FastAPI application entry point
│   ├── models.py      # Pydantic data models
│   ├── routes.py      # API route definitions
│   ├── requirement.txt # Python dependencies
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
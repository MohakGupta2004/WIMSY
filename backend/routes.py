from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse, HTMLResponse
import os
import requests
import json
from models import TextToSpeechRequest, LLMQuery
import assemblyai as aai
import httpx
from google import genai
from google.genai import types


router = APIRouter()

@router.get("/health")
async def health_check():
    return HTMLResponse(content="<h1>Service is running fully fit 📈 </h1>", status_code=200)

@router.get("/")
async def serve_index():
    message = {"message": "Welcome to the FastAPI AI-Powered Voice Agent application!"}
    return JSONResponse(content=message, status_code=200)

@router.post('/server')
async def server(request: TextToSpeechRequest):
    MURF_API_KEY = os.getenv('MURF_AI_API_KEY')
    if not MURF_API_KEY:
        return JSONResponse(content={"error": "MURF_AI_API_KEY not found"}, status_code=500)
    endpoint = "https://api.murf.ai/v1/speech/generate"
    headers = {
        "api-key" : MURF_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    textToSay = "Hello, I am WIMSY, your AI-powered voice agent. How can I assist you today?"
    voice_id = "en-UK-ruby"
    style = "Conversational"

    if request.text:
        textToSay = request.text

    if request.voice_id:   
        voice_id = request.voice_id
    
    if request.style:
        style = request.style

    data = {
        "text": textToSay,
        "voice_id": voice_id,
        "style": style,
        "multiNativeLocale": "en-IN" if voice_id.startswith("en-IN") else "en-US"
    }
    
    try:
        response = requests.post(endpoint, headers=headers, data=json.dumps(data))
        print(f"Murf API response status: {response.status_code}")
        print(f"Murf API response: {response.text}")
        
        if response.status_code != 200:
            return JSONResponse(content={"error": f"Murf API error: {response.text}"}, status_code=500)
            
        response_data = response.json()
        print(f"Murf API response JSON: {response_data}")
        
        # Check for different possible keys in the response
        audio_url = None
        if 'audioFile' in response_data:
            audio_url = response_data['audioFile']
        elif 'audioUrl' in response_data:
            audio_url = response_data['audioUrl']
        elif 'audio_url' in response_data:
            audio_url = response_data['audio_url']
        elif 'url' in response_data:
            audio_url = response_data['url']
        else:
            return JSONResponse(content={"error": f"Audio URL not found in response. Available keys: {list(response_data.keys())}"}, status_code=500)
            
        return JSONResponse(content={"audioUrl": audio_url}, status_code=200)
    except requests.exceptions.RequestException as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    except json.JSONDecodeError:
        return JSONResponse(content={"error": "Failed to decode JSON response"}, status_code=500)
    except KeyError as e:
        return JSONResponse(content={"error": f"Key error: {str(e)}"}, status_code=500)



@router.post('/upload')
async def upload_audio(audio: UploadFile = File(...)):
    print(f"Received file: {audio.filename}")
    try:
        temp_file_path = f"public/{audio.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await audio.read())
        return JSONResponse(content={"message": "File uploaded successfully", "filename": audio.filename}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post('/transcribe')
async def transcribe_audio(audio: UploadFile = File(...)):
    print("HIT SERVER")
    ASSEMBLY_AI_API_KEY = os.getenv('ASSEMBLY_AI_API_KEY')
    if not ASSEMBLY_AI_API_KEY:
        return JSONResponse(content={"error": "ASSEMBLY_AI_API_KEY not found"}, status_code=500)  
    aai.settings.api_key = ASSEMBLY_AI_API_KEY
    audioFile = await audio.read()
    print("Transcribing audio file...")
    config = aai.TranscriptionConfig()
    transcript = aai.Transcriber().transcribe(audioFile, config=config)

    if(transcript.status == aai.TranscriptStatus.error):
        return JSONResponse(content={"error": "Transcription failed"}, status_code=500)

    return JSONResponse(content={"text": transcript.text}, status_code=200)  


@router.post('/tts/echo')
async def tts_echo(audio: UploadFile = File(...)):
    try:
        print(f"TTS/Echo endpoint hit - Received file: {audio.filename}")
        print(f"File content type: {audio.content_type}")
        print(f"File size: {audio.size}")
        
        transribeEndpoint = "http://localhost:5000/transcribe"
        ttsEndpoint = "http://localhost:5000/server"
        
        file_content = await audio.read()
        print(f"File content length: {len(file_content)}")
        
        files = {'audio': (audio.filename, file_content, audio.content_type)}
        
        print(f"Calling transcribe endpoint with files: {files.keys()}")
        
        async with httpx.AsyncClient() as client:
            transcribeResponse = await client.post(transribeEndpoint, files=files)
            print(f"Transcribe response status: {transcribeResponse.status_code}")
            print(f"Transcribe response: {transcribeResponse.text}")
            
            if transcribeResponse.status_code != 200:
                return JSONResponse(content={"error": f"Transcription failed: {transcribeResponse.text}"}, status_code=500)
            
            transcribe_data = transcribeResponse.json()
            text = transcribe_data.get("text", "")
            if not text:
                return JSONResponse(content={"error": "No text found in transcription"}, status_code=400)
            print(f"Transcribed text: {text}")
            if not text.strip():
                return JSONResponse(content={"error": "Transcribed text is empty"}, status_code=400)
            
            tts_data = {
                "text": text,
                "voice_id": "en-IN-arohi",
                "style": "Conversational"
            }
            print(f"Calling TTS endpoint with data: {tts_data}")
            
            ttsResponse = await client.post(ttsEndpoint, json=tts_data)
            print(f"TTS response status: {ttsResponse.status_code}")
            print(f"TTS response: {ttsResponse.text}")
            
            if ttsResponse.status_code != 200:
                return JSONResponse(content={"error": f"TTS generation failed: {ttsResponse.text}"}, status_code=500)
            
            tts_response_data = ttsResponse.json()
            audioUrl = tts_response_data.get("audioUrl", "")
            if not audioUrl:
                return JSONResponse(content={"error": "No audio URL found in TTS response"}, status_code=400)
                
            return JSONResponse(content={"audioUrl": audioUrl, "transcribedText": text}, status_code=200)
            
    except Exception as e:
        print(f"Exception in tts_echo: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(content={"error": f"Unexpected error: {str(e)}"}, status_code=500) 


    # {"voice_id":"en-UK-ruby","style":"Promo","multiNativeLocale":"en-US"}
    # {"voice_id":"en-IN-arohi","style":"Conversational"}


@router.post('/llm/query')
async def llm_query(request: LLMQuery):
    query = request.query
    print(f"LLM query received: {query}")
    if not query:
        return JSONResponse(content={"error": "Query cannot be empty"}, status_code=400)
    try:
        client = genai.Client(api_key=os.getenv('GOOGLE_GENAI_API_KEY'))
        chat = client.chats.create(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction="You are an helpful cat-themed AI Assistant and your name is wimsy."
            )
        )

        response = chat.send_message(query)
        print(f"LLM response: {response.text}")
        return JSONResponse(content={"response": response.text}, status_code=200)
    except Exception as e:
        print(f"Exception in llm_query: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(content={"error": f"Unexpected error: {str(e)}"}, status_code=500)  
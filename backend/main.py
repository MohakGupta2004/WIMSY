from fastapi import FastAPI
import uvicorn
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

@app.get("/health")
async def health_check():
    return HTMLResponse(content="<h1>Service is running fully fit 📈 </h1>", status_code=200)

@app.get("/")
async def serve_index():
    message = {"message": "Welcome to the FastAPI AI-Powered Voice Agent application!"}
    return JSONResponse(content=message, status_code=200)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)

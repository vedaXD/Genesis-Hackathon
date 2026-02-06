"""
FastAPI Server for AROGYA SATHI - AI Sustainability Storytelling API
Generates empathetic sustainability awareness videos
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
import json
import os
import hashlib
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import orchestrator
from orchestrator_agent.orchestrator_tool import OrchestratorTool

app = FastAPI(
    title="AROGYA SATHI API",
    description="AI-powered empathetic sustainability storytelling with location-aware narratives",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = OrchestratorTool()

# Data directories
VIDEOS_DIR = os.path.join(os.path.dirname(__file__), 'data', 'videos')
AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'data', 'audio')
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)


class StoryRequest(BaseModel):
    """Story generation request"""
    location: str
    theme: Optional[str] = None  # "Heat & Summer", "Water & Rain", "Air & Health", "Sustainability & Future", or "Auto-Detect"


class StoryResponse(BaseModel):
    """Story generation response"""
    success: bool
    video_path: Optional[str] = None
    script_text: Optional[str] = None
    audio_path: Optional[str] = None
    image_paths: Optional[list] = None
    theme: Optional[str] = None
    location: str
    error: Optional[str] = None


@app.get("/", response_class=HTMLResponse)
async def root():
    """API homepage"""
    return """
    <html>
        <head>
            <title>AROGYA SATHI API</title>
            <style>
                body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                h1 { font-size: 2.5em; }
                .subtitle { font-size: 1.2em; opacity: 0.9; margin-bottom: 30px; }
                .endpoint { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px; }
                code { background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 4px; }
                a { color: #ffd700; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>🌱 AROGYA SATHI API</h1>
            <p class="subtitle">AI-Powered Empathetic Sustainability Storytelling</p>
            <p>Transform environmental data into human-centered stories that people can feel.</p>
            
            <h2>Endpoints:</h2>
            <div class="endpoint">
                <code>POST /api/generate-story</code> - Generate sustainability story from location
            </div>
            <div class="endpoint">
                <code>GET /api/video/{video_id}</code> - Retrieve generated video
            </div>
            <div class="endpoint">
                <code>GET /health</code> - Health check
            </div>
            
            <p><a href="/docs">📚 API Documentation</a></p>
        </body>
    </html>
    """


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AROGYA SATHI",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/generate-story", response_model=StoryResponse)
async def generate_story(request: StoryRequest):
    """Generate empathetic sustainability story"""
    try:
        print(f"📍 Generating story for location: {request.location}")
        
        # Run orchestrator pipeline
        result = orchestrator.run(
            location=request.location,
            theme=request.theme
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Story generation failed")
            )
        
        return StoryResponse(
            success=True,
            video_path=result.get("final_video_path"),
            script_text=result.get("script_text"),
            audio_path=result.get("audio_path"),
            image_paths=result.get("image_paths", []),
            theme=result.get("stages", {}).get("sustainability_analysis", {}).get("theme"),
            location=request.location
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/video/{filename}")
async def get_video(filename: str):
    """Serve generated video file"""
    video_path = os.path.join(VIDEOS_DIR, filename)
    
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=filename
    )


@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    """Serve generated audio file"""
    audio_path = os.path.join(AUDIO_DIR, filename)
    
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=filename
    )


if __name__ == "__main__":
    print("🌱 Starting AROGYA SATHI API Server...")
    print("📍 Location-aware sustainability storytelling")
    print("🎬 AI-generated empathetic narratives")
    uvicorn.run(app, host="0.0.0.0", port=8000)


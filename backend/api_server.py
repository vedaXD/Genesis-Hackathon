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
import base64
import re
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

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
SUBTITLES_DIR = os.path.join(os.path.dirname(__file__), 'data', 'subtitles')
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(SUBTITLES_DIR, exist_ok=True)


def generate_subtitles(script_text: str, video_path: str) -> str:
    """
    Generate WebVTT subtitle file for video.
    
    Args:
        script_text: The script/narration text
        video_path: Path to the video file
        
    Returns:
        Path to generated subtitle file
    """
    try:
        # Extract video filename
        video_filename = os.path.basename(video_path)
        subtitle_filename = video_filename.replace('.mp4', '.vtt')
        subtitle_path = os.path.join(SUBTITLES_DIR, subtitle_filename)
        
        # Split script into chunks (approx 10-12 words per caption for readability)
        words = script_text.split()
        chunks = []
        chunk_size = 10
        
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        # Calculate timing (assuming ~3 words per second speech rate)
        words_per_second = 3
        
        # Generate WebVTT content
        vtt_content = "WEBVTT\\n\\n"
        
        current_time = 0.0
        for idx, chunk in enumerate(chunks):
            chunk_words = len(chunk.split())
            duration = chunk_words / words_per_second
            
            start_time = current_time
            end_time = current_time + duration
            
            # Format timestamps (HH:MM:SS.mmm)
            start_str = format_vtt_timestamp(start_time)
            end_str = format_vtt_timestamp(end_time)
            
            vtt_content += f"{idx + 1}\\n"
            vtt_content += f"{start_str} --> {end_str}\\n"
            vtt_content += f"{chunk}\\n\\n"
            
            current_time = end_time
        
        # Write subtitle file
        with open(subtitle_path, 'w', encoding='utf-8') as f:
            f.write(vtt_content)
        
        return subtitle_path
        
    except Exception as e:
        print(f"❌ Error generating subtitles: {e}")
        return None


def format_vtt_timestamp(seconds: float) -> str:
    """Format seconds as WebVTT timestamp (HH:MM:SS.mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"


class StoryRequest(BaseModel):
    """Story generation request"""
    location: str
    theme: Optional[str] = None  # Environmental: "Heat & Summer", "Water & Rain", "Air & Health", "Sustainability & Future" | Social: "Education & Learning", "Health & Wellness", "Community & Connection" | "Auto-Detect"


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


class ChallengeValidationRequest(BaseModel):
    """Challenge validation request"""
    image: str  # Base64 encoded image
    challengeType: str  # 'ticket' or 'plant_watering'


class ChallengeValidationResponse(BaseModel):
    """Challenge validation response"""
    valid: bool
    message: str
    confidence: Optional[float] = None


@app.get("/", response_class=HTMLResponse)
async def root():
    """API homepage"""
    return """
    <html>
        <head>
            <title>AROGYA SATHI API</title>
            <style>
                body { font-family: Arial; max-width: 900px; margin: 50px auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                h1 { font-size: 2.5em; }
                .subtitle { font-size: 1.2em; opacity: 0.9; margin-bottom: 30px; }
                .endpoint { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px; }
                .domains { background: rgba(255,255,255,0.15); padding: 20px; margin: 20px 0; border-radius: 8px; }
                .domain-category { margin: 15px 0; }
                code { background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 4px; font-size: 0.9em; }
                a { color: #ffd700; text-decoration: none; }
                .emoji { font-size: 1.2em; }
            </style>
        </head>
        <body>
            <h1>🌱 AROGYA SATHI API</h1>
            <p class="subtitle">AI-Powered Empathetic Storytelling - Transform social issues into human-centered visual stories</p>
            <p>Generate 15-second reels with AI images, voiceover, and location-aware narratives.</p>
            
            <div class="domains">
                <h3>🎯 Available Story Domains:</h3>
                <div class="domain-category">
                    <strong>🌡️ Environmental Impact:</strong>
                    <code>Heat & Summer</code>
                    <code>Water & Rain</code>
                    <code>Air & Health</code>
                    <code>Sustainability & Future</code>
                </div>
                <div class="domain-category">
                    <strong>🤝 Social Impact:</strong>
                    <code>Education & Learning</code>
                    <code>Health & Wellness</code>
                    <code>Community & Connection</code>
                </div>
                <div class="domain-category">
                    <strong>🔄 Smart Detection:</strong>
                    <code>Auto-Detect</code> (AI chooses based on location)
                </div>
            </div>
            
            <h2>Endpoints:</h2>
            <div class="endpoint">
                <code>POST /api/generate-story</code> - Generate empathetic story reel
                <br><small>Body: {"location": "Mumbai", "theme": "Education & Learning"}</small>
            </div>
            <div class="endpoint">
                <code>GET /api/video/{video_id}</code> - Retrieve generated video
            </div>
            <div class="endpoint">
                <code>GET /health</code> - Health check
            </div>
            
            <p><a href="/docs">📚 Interactive API Documentation</a></p>
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


@app.get("/api/videos")
async def list_videos():
    """List all generated videos with metadata"""
    try:
        videos = []
        video_files = [f for f in os.listdir(VIDEOS_DIR) if f.endswith('.mp4')]
        
        for filename in sorted(video_files, reverse=True):  # Newest first
            file_path = os.path.join(VIDEOS_DIR, filename)
            file_stat = os.stat(file_path)
            
            # Extract timestamp from filename (format: arogya_sathi_YYYYMMDD_HHMMSS.mp4)
            try:
                timestamp_str = filename.replace('arogya_sathi_', '').replace('.mp4', '')
                created_at = datetime.strptime(timestamp_str, '%Y%m%d_%H%M%S').isoformat()
            except:
                created_at = datetime.fromtimestamp(file_stat.st_ctime).isoformat()
            
            # Check if subtitle file exists
            subtitle_filename = filename.replace('.mp4', '.vtt')
            has_subtitles = os.path.exists(os.path.join(SUBTITLES_DIR, subtitle_filename))
            
            videos.append({
                "id": filename.replace('.mp4', ''),
                "filename": filename,
                "url": f"/api/video/{filename}",
                "subtitle_url": f"/api/subtitles/{subtitle_filename}" if has_subtitles else None,
                "size": file_stat.st_size,
                "created_at": created_at,
                "title": f"Sustainability Story",
                "type": "video"
            })
        
        return {
            "success": True,
            "count": len(videos),
            "videos": videos
        }
    except Exception as e:
        print(f"❌ Error listing videos: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
        
        # Generate subtitle file from script
        script_text = result.get("script_text")
        video_path = result.get("final_video_path")
        
        if script_text and video_path:
            subtitle_path = generate_subtitles(script_text, video_path)
            print(f"✅ Generated subtitles: {subtitle_path}")
        
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


@app.post("/api/validate-challenge", response_model=ChallengeValidationResponse)
async def validate_challenge(request: ChallengeValidationRequest):
    """Validate challenge submission using Gemini Vision"""
    try:
        if not GOOGLE_API_KEY:
            # If no API key, accept all challenges
            return ChallengeValidationResponse(
                valid=True,
                message="Challenge accepted! (Validation disabled - no API key)",
                confidence=1.0
            )
        
        # Extract base64 image data
        image_data = request.image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        
        # Create Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Create validation prompt based on challenge type
        if request.challengeType == 'ticket':
            prompt = """
            Analyze this image carefully. Is this a valid public transportation ticket (bus ticket, train ticket, metro ticket, or transit pass)?

            Look for:
            - Ticket numbers or barcodes
            - Transport company name or logo
            - Date/time stamps
            - Route or destination information
            - Fare amount
            - Any official transit markings

            Respond with ONLY 'VALID' if this is clearly a public transportation ticket, or 'INVALID' if it's not.
            After your verdict, add a brief reason (max 10 words).
            
            Format: VALID/INVALID: reason
            """
        elif request.challengeType == 'plant_watering':
            prompt = """
            Analyze this image carefully. Does this show someone watering a plant?

            Look for:
            - A plant (indoor or outdoor)
            - Water being poured or a watering can/bottle
            - Person's hand or body in frame
            - Clear evidence of watering action

            Respond with ONLY 'VALID' if this clearly shows plant watering, or 'INVALID' if it doesn't.
            After your verdict, add a brief reason (max 10 words).
            
            Format: VALID/INVALID: reason
            """
        else:
            return ChallengeValidationResponse(
                valid=True,
                message="General challenge accepted!",
                confidence=1.0
            )
        
        # Generate response with image
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])
        
        result_text = response.text.strip()
        print(f"🤖 Gemini validation result: {result_text}")
        
        # Parse response
        is_valid = result_text.upper().startswith('VALID')
        
        # Extract message
        if ':' in result_text:
            message = result_text.split(':', 1)[1].strip()
        else:
            message = "Validated by AI" if is_valid else "Could not verify submission"
        
        return ChallengeValidationResponse(
            valid=is_valid,
            message=message,
            confidence=0.9 if is_valid else 0.5
        )
        
    except Exception as e:
        print(f"❌ Validation error: {e}")
        # On error, accept the challenge but notify
        return ChallengeValidationResponse(
            valid=True,
            message="Challenge accepted (validation service unavailable)",
            confidence=0.5
        )


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


@app.get("/api/subtitles/{filename}")
async def get_subtitles(filename: str):
    """Serve subtitle file (WebVTT format)"""
    subtitle_path = os.path.join(SUBTITLES_DIR, filename)
    
    if not os.path.exists(subtitle_path):
        raise HTTPException(status_code=404, detail="Subtitles not found")
    
    return FileResponse(
        subtitle_path,
        media_type="text/vtt",
        filename=filename
    )


if __name__ == "__main__":
    print("🌱 Starting AROGYA SATHI API Server...")
    print("📍 Location-aware empathetic storytelling")
    print("🎬 AI-generated narratives for social & environmental impact")
    print("🎨 Domains: Environment, Education, Health, Community & more")
    
    # Use port 8001 if 8000 is busy
    import socket
    port = 8000
    try:
        # Test if port is available
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', port))
    except OSError:
        port = 8001
        print(f"⚠️  Port 8000 busy, using port {port} instead")
    
    print(f"🌐 Server will run on: http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)


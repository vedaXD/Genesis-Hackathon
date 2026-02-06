# AROGYA SATHI - AI Sustainability Storytelling Platform

🌍 **AI-powered empathetic reels about environmental and social impact**

Generate location-aware, emotionally engaging 15-second sustainability reels using:

- **Gemini 2.0 Flash** for empathetic script generation
- **Imagen 3.0** for AI-generated images
- **Google TTS** for natural voiceover
- **Real Weather API** for dynamic, location-specific content

## ✨ Features

- 🎬 **AI Video Generation**: Fully automated reel creation pipeline
- 🌤️ **Real Weather Data**: Location-specific stories based on actual conditions
- 🎨 **7 Impact Domains**: Heat, Water, Air, Sustainability, Education, Health, Community
- 🗣️ **Empathetic Narration**: Gemini creates emotionally stirring scripts (35-45 words)
- 🖼️ **Premium AI Images**: Imagen 3.0 generates 5 unique images per reel
- 📱 **Instagram Reels Style**: 9:16 vertical format, 15-second duration
- 🔄 **Frontend Integration**: Auto-plays generated videos in TikTok-style feed

## 🚀 Quick Start

### 1. Start Backend API

```bash
cd backend
python api_server.py
```

Server runs on: **http://localhost:8000**

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 3. Open in Browser

Navigate to **http://localhost:5173/** and see your AI-generated reels!

## 📁 Project Structure

```
Genesis-Hackathon/
├── frontend/               # React + Vite frontend
│   ├── client/src/
│   │   ├── components/
│   │   │   └── feed/
│   │   │       ├── video-card.jsx    # Video player component
│   │   │       ├── quiz-card.jsx     # Quiz component
│   │   │       └── challenge-card.jsx
│   │   ├── hooks/
│   │   │   └── use-content.js        # Fetches videos from backend
│   │   └── pages/
│   │       └── feed.jsx              # Main feed page
│   └── package.json
│
└── backend/                # FastAPI backend + AI agents
    ├── api_server.py                 # FastAPI server & video endpoints
    ├── orchestrator_agent/
    │   └── orchestrator_tool.py      # Main pipeline coordinator
    ├── sub_agents/
    │   ├── image_agent/              # Imagen 3.0 integration
    │   ├── script_agent/             # Gemini script generation
    │   ├── voice_agent/              # Google TTS
    │   ├── video_agent/              # MoviePy video assembly
    │   ├── location_data_agent/      # Weather API
    │   └── sustainability_agent/     # Theme analyzer
    ├── data/
    │   └── videos/                   # Generated MP4 files (10+ videos)
    ├── test_interactive.py           # Interactive reel generator
    ├── generate_batch.py             # Batch generation script
    └── requirements.txt
```

## 🛠️ Installation

### Backend Setup

1. **Install Python dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Google Cloud** (for Imagen, Gemini, TTS):
   - Place your `service-account-key.json` in `backend/`
   - Set environment variables in `.env`:
     ```env
     GOOGLE_CLOUD_PROJECT=your-project-id
     GOOGLE_CLOUD_LOCATION=us-central1
     GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
     USE_MOCK_WEATHER=false  # Set to 'false' for real weather data
     OPENWEATHER_API_KEY=your-api-key  # Get from openweathermap.org
     ```

3. **Start the server**:
   ```bash
   python api_server.py
   ```

### Frontend Setup

1. **Install Node.js dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open in browser**: http://localhost:5173/

## 🎥 Generate Videos

### Option 1: Interactive Test Script

```bash
cd backend
python test_interactive.py
```

**Prompts:**

- Select domain (Heat, Water, Air, Education, Health, Community, Sustainability)
- Enter location (Mumbai, Delhi, Bangalore, etc.)
- Generates 1 video (~2-3 minutes)

### Option 2: Batch Generation

```bash
cd backend
python generate_batch.py
```

Generate multiple videos for selected domains automatically.

### Option 3: Via API

```bash
curl -X POST http://localhost:8000/api/generate-story \
  -H "Content-Type: application/json" \
  -d '{"location": "Mumbai", "theme": "Heat & Summer"}'
```

**Response:**

```json
{
  "success": true,
  "video_path": "data/videos/arogya_sathi_20260207_010612.mp4",
  "script_text": "In Mumbai's humid 32°C heat...",
  "theme": "Heat & Summer"
}
```

## 🌐 API Endpoints

### Backend (http://localhost:8000)

| Endpoint                | Method | Description                   |
| ----------------------- | ------ | ----------------------------- |
| `/`                     | GET    | Homepage with API info        |
| `/docs`                 | GET    | Interactive API documentation |
| `/api/videos`           | GET    | List all generated videos     |
| `/api/video/{filename}` | GET    | Serve specific video file     |
| `/api/generate-story`   | POST   | Generate new reel             |
| `/health`               | GET    | Health check                  |

### Example: List Videos

```bash
curl http://localhost:8000/api/videos
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "videos": [
    {
      "id": "arogya_sathi_20260207_010612",
      "filename": "arogya_sathi_20260207_010612.mp4",
      "url": "/api/video/arogya_sathi_20260207_010612.mp4",
      "created_at": "2026-02-07T01:06:12"
    }
  ]
}
```

## 🎨 Available Themes

1. **🌡️ Heat & Summer** - Rising temperatures, heatwaves, climate impact
2. **💧 Water & Rain** - Water scarcity, rainfall patterns, conservation
3. **💨 Air & Health** - Air quality, pollution, breathing struggles
4. **🌱 Sustainability & Future** - Climate action, carbon footprint, green choices
5. **📚 Education & Learning** - Access to education, knowledge transformation
6. **🏥 Health & Wellness** - Healthcare access, preventive care, human dignity
7. **🤝 Community & Connection** - Social fabric, collective care, belonging

## 🔧 Configuration

### Enable Real Weather API

Edit `backend/.env`:

```env
USE_MOCK_WEATHER=false
OPENWEATHER_API_KEY=your-api-key-here
```

Get free API key: https://openweathermap.org/api (1000 calls/day free tier)

### Video Settings

Edit `backend/sub_agents/video_agent/video_assembler_tool.py`:

```python
TARGET_DURATION = 15.0      # Video duration in seconds
```

Edit `backend/sub_agents/image_agent/imagen_generator_tool.py`:

```python
num_images = 5              # Number of AI images per reel
```

## 🧪 Testing

### Test Weather API

```bash
cd backend
python test_weather_api.py
```

Shows real weather data for multiple cities.

### Test Video Generation

```bash
cd backend
python test_reel_generation.py
```

Generates a test reel with timeout handling.

## 📱 Frontend Features

### Video Feed (TikTok/Instagram Reels Style)

- Vertical scroll navigation
- Auto-play videos when scrolled into view
- Click video to pause/play
- Like, comment, save, share buttons
- Mix of AI videos and quiz cards

### Interactions

- ❤️ **Like**: Tap heart button
- 💬 **Comment**: Opens comment modal
- 🔖 **Save**: Bookmark for later
- 📤 **Share**: WhatsApp, Facebook, Twitter, LinkedIn, Telegram

### Quiz Cards

Interactive sustainability knowledge tests between videos.

## 🎯 Current Video Count

**10 AI-generated reels** available in `backend/data/videos/`:

- ✅ arogya_sathi_20260207_010612.mp4
- ✅ arogya_sathi_20260207_011247.mp4
- ✅ arogya_sathi_20260207_012737.mp4
- ✅ arogya_sathi_20260207_013325.mp4
- ✅ arogya_sathi_20260207_014108.mp4
- ✅ arogya_sathi_20260207_014442.mp4
- ✅ arogya_sathi_20260207_015714.mp4
- ✅ arogya_sathi_20260207_020151.mp4
- ✅ arogya_sathi_20260207_020806.mp4
- ✅ arogya_sathi_20260207_022124.mp4

These are automatically fetched and displayed by the frontend!

## 🐛 Troubleshooting

### Videos not showing in frontend?

1. Check backend is running: `curl http://localhost:8000/health`
2. Check videos endpoint: `curl http://localhost:8000/api/videos`
3. Check browser console for errors (F12)
4. Verify CORS settings in `api_server.py`

### Video generation fails?

1. Check GCP credentials: `GOOGLE_APPLICATION_CREDENTIALS` set correctly
2. Check Imagen API quota: 2 requests/minute limit
3. Check logs for rate limiting messages
4. Verify internet connection for API calls

### Frontend build errors?

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check Node.js version: v18+ required
3. Fix ES module issues in `tailwind.config.ts`

## 📚 Documentation

- **[Integration Guide](INTEGRATION_GUIDE.md)**: Detailed frontend-backend integration
- **[Enable Real Weather](backend/ENABLE_REAL_WEATHER.md)**: Configure weather API
- **[API Docs](http://localhost:8000/docs)**: Interactive Swagger documentation (when server running)

## 🏗️ Tech Stack

### AI & ML

- **Imagen 3.0** (Google Vertex AI) - Image generation
- **Gemini 2.0 Flash** (Google Vertex AI) - Script generation
- **Google Text-to-Speech** - Voiceover generation

### Backend

- **FastAPI** - REST API framework
- **MoviePy** - Video assembly
- **Requests** - HTTP client for weather API
- **Python 3.x** - Core language

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Infrastructure

- **Google Cloud Platform** - AI services
- **OpenWeatherMap API** - Real weather data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open Pull Request

## 📄 License

This project was created for the Genesis Hackathon.

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- OpenWeatherMap for weather data
- Genesis Hackathon organizers

---

**Made with ❤️ for sustainability awareness** 🌍🌱

## API Endpoints

- `GET /api/health/` - Health check endpoint

## Tech Stack

### Frontend

- React 18.3
- Vite 6.0
- Modern JavaScript/JSX

### Backend

- Django 5.0
- Django REST Framework
- CORS Headers for cross-origin requests
- SQLite database (development)

## Development

- Frontend runs on port 5173
- Backend runs on port 8000
- API requests from frontend are proxied to backend via Vite configuration

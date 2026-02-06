# Genesis Hackathon

A full-stack web application with React + Vite frontend and Django backend.

## Project Structure

```
Genesis-Hackathon/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── backend/           # Django backend
    ├── config/        # Django project settings
    ├── api/           # API app
    ├── manage.py
    └── requirements.txt
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

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

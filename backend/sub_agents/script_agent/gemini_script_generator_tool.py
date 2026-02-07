from google.adk.tools.base_tool import BaseTool
import os
import time
import hashlib
import json
from datetime import datetime

class GeminiScriptGeneratorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="generate_empathetic_script",
            description="Uses Gemini AI to generate empathetic, human-centered sustainability stories"
        )
        
        # Simple in-memory cache to avoid redundant API calls
        self.script_cache = {}
        self.cache_dir = os.path.join(os.path.dirname(__file__), '.cache')
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # Use Vertex AI for GCP credits
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
        if project_id:
            try:
                import vertexai
                from vertexai.generative_models import GenerativeModel
                
                vertexai.init(project=project_id, location="us-central1")
                # Use Gemini 2.0 Flash Experimental (available on Vertex AI)
                self.model = GenerativeModel('gemini-2.0-flash-exp')
                self.use_vertex = True
                print("[INFO] Using Vertex AI Gemini 2.0 Flash Exp for empathetic storytelling")
            except Exception as e:
                print(f"[WARNING] Could not initialize Vertex AI: {e}")
                self.model = None
                self.use_vertex = False
        else:
            self.model = None
            self.use_vertex = False
            print("[WARNING] GOOGLE_CLOUD_PROJECT not found")
    
    def run(self, location: str, location_data: dict, sustainability_analysis: dict) -> dict:
        """
        Generate an empathetic sustainability story with caching and error handling.
        
        Args:
            location: User's location
            location_data: Environmental data
            sustainability_analysis: Identified sustainability theme and context
            
        Returns:
            Dictionary with generated script
        """
        
        if not self.model:
            return self._get_fallback_script(location, sustainability_analysis.get('theme', 'sustainability'))
        
        try:
            theme = sustainability_analysis.get('theme', 'sustainability')
            context = sustainability_analysis.get('context', '')
            temp = location_data.get('temperature', {}).get('current', 0)
            weather = location_data.get('weather', {}).get('description', 'normal')
            humidity = location_data.get('humidity', 0)
            aqi = location_data.get('air_quality_index', None)
            wind_speed = location_data.get('wind_speed', 0)
            
            # Create cache key based on location and conditions
            cache_key = self._get_cache_key(location, theme, temp, weather, aqi)
            
            # Check cache first
            cached_script = self._get_cached_script(cache_key)
            if cached_script:
                print(f"  ✓ Using cached script for {location} ({theme})")
                return cached_script
            
            # Craft the empathetic storytelling prompt
            prompt = self._create_storytelling_prompt(location, theme, context, temp, weather, humidity, aqi, wind_speed)
            
            print(f"  → Generating empathetic story for theme: {theme}")
            print(f"  → Using REAL weather data: {location} - {weather}, {temp}°C, {humidity}% humidity")
            if aqi:
                aqi_labels = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
                print(f"  → Air Quality: {aqi_labels.get(aqi, 'Unknown')} (AQI: {aqi})")
            
            # Generate with retry logic and exponential backoff
            script = self._generate_with_retry(prompt, max_retries=3)
            
            if not script:
                return self._get_fallback_script(location, theme)
            
            # Validate script length (aim for 15 seconds MAXIMUM = ~35-45 words)
            word_count = len(script.split())
            
            # Only regenerate if SIGNIFICANTLY off (to save API calls)
            if word_count < 20 or word_count > 60:
                print(f"  ⚠️ Script length: {word_count} words (acceptable range: 20-60). Using as-is to preserve quota.")
                # Trim if too long instead of regenerating
                if word_count > 60:
                    words = script.split()
                    script = ' '.join(words[:55]) + "."
                    print(f"  → Trimmed to {len(script.split())} words")
            
            print(f"  ✓ Generated script ({len(script.split())} words ≈ {len(script.split())/3:.0f}s)")
            
            result = {
                "script": script,
                "word_count": len(script.split()),
                "theme": theme,
                "timestamp": datetime.now().isoformat()
            }
            
            # Cache the result
            self._cache_script(cache_key, result)
            
            return result
            
        except Exception as e:
            error_msg = str(e).lower()
            if 'quota' in error_msg or 'exhausted' in error_msg or '429' in error_msg:
                print(f"  ❌ QUOTA EXHAUSTED: {e}")
                print(f"  → Using fallback script to avoid blocking video generation")
            else:
                print(f"  ❌ Error generating script: {e}")
            
            return self._get_fallback_script(location, sustainability_analysis.get('theme', 'sustainability'))
    
    def _create_storytelling_prompt(self, location: str, theme: str, context: str, temp: float, weather: str, humidity: int = 0, aqi: int = None, wind_speed: float = 0) -> str:
        """Create the empathetic storytelling prompt for Gemini."""
        
        current_date = datetime.now().strftime("%B %Y")
        
        # Build weather description
        aqi_text = ""
        if aqi:
            aqi_labels = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
            aqi_text = f", Air Quality: {aqi_labels.get(aqi, 'Unknown')}"
        
        prompt = f"""You are an empathetic environmental storyteller creating SHORT sustainability awareness content for AROGYA SATHI.

**CRITICAL CONSTRAINTS:**
- Script MUST be **35-45 words MAXIMUM** (exactly 15 seconds when spoken - NOT LONGER)
- This is for a 15-second reel - BE CONCISE and IMPACTFUL
- Tone: DEEPLY EMPATHETIC, emotionally stirring, hopeful, urgent yet compassionate
- Style: Human-centered storytelling with REAL IMPACT - show lives affected
- Language: Vivid, emotional, personal, creates immediate connection
- Perspective: "We" and "Our" but also individual stories that represent the collective
- End with: CLEAR CALL TO ACTION or inspiring hope that motivates immediate engagement
- GOAL: Make viewers FEEL something, then inspire them to ACT (in 15 seconds)

**LOCATION & WEATHER CONTEXT (MUST USE THIS DATA):**
Location: {location}
Current Weather: {weather}
Temperature: {temp}°C
Humidity: {humidity}%{aqi_text}
Wind Speed: {wind_speed} m/s
Theme: {theme}
Environmental Context: {context}
Date: {current_date}

🚨 **IMPORTANT: Your script MUST reference the ACTUAL conditions in {location}.**
   - If it's hot ({temp}°C), mention the heat impact
   - If it's rainy, mention rainfall or water
   - If air quality is poor, mention breathing struggles
   - Make the story SPECIFIC to {location}'s current environmental reality
   - Each script should be UNIQUE based on these real conditions

**STORYTELLING RULES:**
1. ❌ NO abstract concepts - make it REAL and TANGIBLE
2. ❌ NO fear-mongering, but YES to emotional urgency
3. ❌ NO preaching - inspire through empathy and connection
4. ✅ START with a powerful human moment (a child, a parent, a dream, a struggle)
5. ✅ Show REAL CONSEQUENCES that people can visualize and feel
6. ✅ Use vivid, sensory language that creates immediate emotional response
7. ✅ Connect personal stories to universal truths
8. ✅ END with hopeful yet ACTIONABLE inspiration ("together we can", "every choice matters", "your voice counts")
9. ✅ Make viewers ask: "What can I do?" or "How can I help?"

**THEME-SPECIFIC GUIDANCE:**

{self._get_theme_guidance(theme)}

**OUTPUT FORMAT:**
Generate ONLY the voiceover script. No titles, no explanations, no stage directions.
The script should flow naturally as a single spoken narrative.

**WORD COUNT:** 35-45 words MAXIMUM. Be concise and impactful for 15-second reel.

Generate the script now:"""
        
        return prompt
    
    def _get_theme_guidance(self, theme: str) -> str:
        """Get theme-specific storytelling guidance."""
        
        guidance = {
            "heat": """FOR HEAT THEME (Emotional Impact Focus):
- Open with a mother watching her child sleep through hot nights, or elderly seeking relief
- Show the HUMAN COST: exhausted workers, vulnerable communities, dreams deferred by rising temperatures
- Paint the contrast: cool mornings we remember vs scorching afternoons we now endure
- End with HOPE + ACTION: "But every tree planted, every cool refuge shared, every voice raised for climate action writes a cooler chapter for tomorrow's children"
- Emotion to evoke: Protective instinct, empathy for vulnerable, hope through collective action
""",
            "water": """FOR WATER THEME (Life Connection Focus):
- Open with a child's first encounter with rain, or a grandmother remembering abundant water
- Show DEPENDENCY: Lives paused when taps run dry, communities transformed by water access
- Paint vivid imagery: Parched earth cracking like broken promises, or rain bringing renewed hope
- End with EMPOWERMENT: "Every drop conserved, every rainwater harvested, every hand protecting our rivers becomes the lifeline for tomorrow"
- Emotion to evoke: Deep gratitude for water, urgency to protect, hope through conservation
""",
            "air": """FOR AIR THEME (Invisible Threat Focus):
- Open with children unable to play outside, or parents checking air quality before opening windows
- Show INVISIBLE BURDEN: Mothers covering children's mouths, elderly struggling to breathe, lost outdoor memories
- Paint the contrast: Clear skies we dream of vs hazy realities we navigate
- End with COLLECTIVE POWER: "But every green space protected, every clean choice made, every breath taken in solidarity clears the path for fresher tomorrows"
- Emotion to evoke: Protective love, shared vulnerability, empowered action
""",
            "sustainability": """FOR SUSTAINABILITY THEME (Legacy Focus):
- Open with a parent imagining their child's world in 20 years, or youth inheriting today's choices
- Show INTERCONNECTION: How today's convenience becomes tomorrow's crisis, how small actions ripple
- Paint CHOICES: Plastic in oceans vs clean beaches, concrete jungles vs thriving ecosystems
- End with URGENT HOPE: "Every sustainable choice we make today is a love letter to the future. Our planet doesn't need perfect people—it needs people who care enough to try"
- Emotion to evoke: Responsibility to future generations, empowerment through action, love for planet
""",
            "education": """FOR EDUCATION THEME (Dreams Unlocked Focus):
- Open with a child's eyes lighting up with learning, or a parent's sacrifice for education
- Show TRANSFORMATION: Lives changed by knowledge, communities lifted by learning, dreams made possible
- Paint the BARRIER vs BREAKTHROUGH: Remote villages getting schools, girls finally attending class
- End with INSPIRING ACTION: "Every book shared, every scholarship funded, every teacher supported unlocks a future we can't yet imagine"
- Emotion to evoke: Hope for potential, belief in transformation, urgency to enable dreams
""",
            "health": """FOR HEALTH THEME (Human Dignity Focus):
- Open with a mother's relief at accessing care, or healthcare worker's dedication
- Show HUMAN IMPACT: Lives saved by access, dignity restored through treatment, hope renewed through healing
- Paint CONTRAST: Preventable suffering vs accessible care, despair vs hope
- End with COLLECTIVE CARE: "Every health check supported, every medicine accessible, every life valued creates a healthier tomorrow for all"
- Emotion to evoke: Compassion for suffering, urgency of care, hope through solidarity
""",
            "community": """FOR COMMUNITY THEME (Connection Power Focus):
- Open with a neighbor's helping hand, or loneliness transformed by connection
- Show SOCIAL FABRIC: Lives touched by kindness, strength found in unity, hope multiplied through caring
- Paint ISOLATION vs BELONGING: Struggles faced alone vs burdens shared together
- End with UNIFYING CALL: "Every hand extended, every story heard, every connection made weaves the safety net we all need"
- Emotion to evoke: Belonging, shared humanity, power of collective care
"""
        }
        
        return guidance.get(theme, guidance["sustainability"])
    
    def _generate_with_retry(self, prompt: str, max_retries: int = 3) -> str:
        """Generate content with exponential backoff retry logic."""
        for attempt in range(max_retries):
            try:
                if self.use_vertex:
                    response = self.model.generate_content(prompt)
                else:
                    response = self.model.generate_content(prompt)
                
                script = response.text.strip()
                return script
                
            except Exception as e:
                error_msg = str(e).lower()
                
                # Check if it's a quota/rate limit error
                if 'quota' in error_msg or 'exhausted' in error_msg or '429' in error_msg or 'resource' in error_msg:
                    wait_time = (2 ** attempt) * 2  # Exponential backoff: 2s, 4s, 8s
                    print(f"  ⚠️ Quota/Rate limit hit (attempt {attempt + 1}/{max_retries})")
                    
                    if attempt < max_retries - 1:
                        print(f"  → Waiting {wait_time}s before retry...")
                        time.sleep(wait_time)
                    else:
                        print(f"  ❌ Max retries reached, API quota exhausted")
                        raise Exception("API quota exhausted after retries")
                else:
                    # For other errors, don't retry
                    raise e
        
        return None
    
    def _get_cache_key(self, location: str, theme: str, temp: float, weather: str, aqi: int = None) -> str:
        """Generate cache key based on location and conditions."""
        # Round temp to nearest 5 degrees and combine key elements
        temp_bucket = round(temp / 5) * 5
        aqi_bucket = round(aqi / 50) * 50 if aqi else "none"
        key_string = f"{location}_{theme}_{temp_bucket}_{weather}_{aqi_bucket}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _get_cached_script(self, cache_key: str) -> dict:
        """Retrieve cached script if available and not expired."""
        # Check memory cache first
        if cache_key in self.script_cache:
            return self.script_cache[cache_key]
        
        # Check file cache
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.json")
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r') as f:
                    cached_data = json.load(f)
                    # Cache for 24 hours
                    cache_time = datetime.fromisoformat(cached_data.get('timestamp', ''))
                    age_hours = (datetime.now() - cache_time).total_seconds() / 3600
                    
                    if age_hours < 24:
                        self.script_cache[cache_key] = cached_data
                        return cached_data
            except Exception as e:
                print(f"  → Cache read error: {e}")
        
        return None
    
    def _cache_script(self, cache_key: str, result: dict):
        """Cache the generated script."""
        # Memory cache
        self.script_cache[cache_key] = result
        
        # File cache
        try:
            cache_file = os.path.join(self.cache_dir, f"{cache_key}.json")
            with open(cache_file, 'w') as f:
                json.dump(result, f)
        except Exception as e:
            print(f"  → Cache write error: {e}")
    
    def _get_fallback_script(self, location: str, theme: str) -> dict:
        """Get a context-aware fallback script when API fails."""
        
        fallback_scripts = {
            "heat": f"In {location}, rising temperatures challenge us every day. But together, through tree planting, cool roofs, and sustainable choices, we can protect our communities. Every action counts in building a cooler tomorrow.",
            "water": f"Water scarcity touches lives in {location}. Every drop saved, every rainwater harvested, every hand protecting our rivers becomes hope for tomorrow. Together, we can ensure water for all.",
            "air": f"Clean air in {location} starts with our choices. Every green space protected, every clean vehicle, every voice for change clears the path to fresher tomorrows. Breathe easy, act now.",
            "sustainability": f"In {location}, the future is being written by today's choices. Every sustainable action, every voice raised for change, every helping hand creates the world we want to leave behind. Together, we can make tomorrow better.",
            "education": f"Education transforms lives in {location}. Every book shared, every scholarship funded, every child empowered unlocks a future we can't yet imagine. Knowledge is the key to change.",
            "health": f"Healthcare access in {location} means dignity for all. Every life valued, every treatment accessible, every community cared for creates a healthier tomorrow. Together, we heal.",
            "community": f"In {location}, connection strengthens us. Every hand extended, every story heard, every neighbor helped weaves the safety net we all need. Community is our greatest resource."
        }
        
        script = fallback_scripts.get(theme, fallback_scripts["sustainability"])
        
        return {
            "script": script,
            "word_count": len(script.split()),
            "theme": theme,
            "timestamp": datetime.now().isoformat(),
            "fallback": True
        }

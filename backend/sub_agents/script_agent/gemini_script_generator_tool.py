from google.adk.tools.base_tool import BaseTool
import os
from datetime import datetime

class GeminiScriptGeneratorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="generate_empathetic_script",
            description="Uses Gemini AI to generate empathetic, human-centered sustainability stories"
        )
        
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
        Generate an empathetic sustainability story.
        
        Args:
            location: User's location
            location_data: Environmental data
            sustainability_analysis: Identified sustainability theme and context
            
        Returns:
            Dictionary with generated script
        """
        
        if not self.model:
            return {
                "error": "Gemini model not configured",
                "script": ""
            }
        
        try:
            theme = sustainability_analysis.get('theme', 'sustainability')
            context = sustainability_analysis.get('context', '')
            temp = location_data.get('temperature', {}).get('current', 0)
            weather = location_data.get('weather', {}).get('description', 'normal')
            humidity = location_data.get('humidity', 0)
            aqi = location_data.get('air_quality_index', None)
            wind_speed = location_data.get('wind_speed', 0)
            
            # Craft the empathetic storytelling prompt
            prompt = self._create_storytelling_prompt(location, theme, context, temp, weather, humidity, aqi, wind_speed)
            
            print(f"  → Generating empathetic story for theme: {theme}")
            print(f"  → Using REAL weather data: {location} - {weather}, {temp}°C, {humidity}% humidity")
            if aqi:
                aqi_labels = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
                print(f"  → Air Quality: {aqi_labels.get(aqi, 'Unknown')} (AQI: {aqi})")
            
            # Generate with Vertex AI Gemini
            if self.use_vertex:
                response = self.model.generate_content(prompt)
                script = response.text.strip()
            else:
                response = self.model.generate_content(prompt)
                script = response.text.strip()
            
            # Validate script length (aim for 15 seconds MAXIMUM = ~35-45 words)
            word_count = len(script.split())
            if word_count < 25 or word_count > 50:
                print(f"  ⚠️ Script length: {word_count} words (target: 35-45 for 15s). Regenerating...")
                # Regenerate with stricter length constraint
                script = self._regenerate_with_length_constraint(prompt, word_count)
                word_count = len(script.split())
                
                # Final check - force trim if still too long
                if word_count > 50:
                    print(f"  ⚠️ Still too long ({word_count} words), trimming to 50 words max")
                    words = script.split()
                    script = ' '.join(words[:50]) + "."
            
            print(f"  ✓ Generated script ({len(script.split())} words ≈ {len(script.split())/3:.0f}s)")
            
            return {
                "script": script,
                "word_count": len(script.split()),
                "theme": theme,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"  ❌ Error generating script: {e}")
            # Fallback script that includes actual location
            fallback = f"In {location}, the future is being written by today's choices. Every sustainable action, every voice raised for change, every helping hand creates the world we want to leave behind. Together, we can make tomorrow better."
            return {
                "error": str(e),
                "script": fallback
            }
    
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
    
    def _regenerate_with_length_constraint(self, original_prompt: str, previous_count: int) -> str:
        """Regenerate script with stricter length enforcement."""
        
        if previous_count > 50:
            length_note = f"\n\n**CRITICAL: Previous attempt was {previous_count} words - TOO LONG! Generate EXACTLY 35-45 words MAXIMUM for 15-second reel. Be CONCISE.**"
        else:
            length_note = f"\n\n**CRITICAL: Previous attempt was {previous_count} words. Generate EXACTLY 35-45 words for 15-second reel. Count carefully.**"
        
        adjusted_prompt = original_prompt + length_note
        
        try:
            response = self.model.generate_content(adjusted_prompt)
            return response.text.strip()
        except:
            # Fallback is exactly 42 words for 15 seconds
            return "A child watches rain through a window, wondering if tomorrow's world will be kinder. Every choice we make today—every voice raised, every hand extended—becomes the answer to that question. Our planet needs people who care enough to try."

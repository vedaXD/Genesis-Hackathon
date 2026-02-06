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
            
            # Craft the empathetic storytelling prompt
            prompt = self._create_storytelling_prompt(location, theme, context, temp, weather)
            
            print(f"  → Generating empathetic story for theme: {theme}")
            
            # Generate with Vertex AI Gemini
            if self.use_vertex:
                response = self.model.generate_content(prompt)
                script = response.text.strip()
            else:
                response = self.model.generate_content(prompt)
                script = response.text.strip()
            
            # Validate script length (aim for 15-20 seconds = ~40-55 words)
            word_count = len(script.split())
            if word_count < 30 or word_count > 70:
                print(f"  ⚠️ Script length: {word_count} words (target: 40-55). Regenerating...")
                # Regenerate with stricter length constraint
                script = self._regenerate_with_length_constraint(prompt, word_count)
            
            print(f"  ✓ Generated script ({len(script.split())} words)")
            
            return {
                "script": script,
                "word_count": len(script.split()),
                "theme": theme,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"  ❌ Error generating script: {e}")
            return {
                "error": str(e),
                "script": f"In {location}, our environment tells a story of change. Every small action towards sustainability creates ripples of hope for tomorrow."
            }
    
    def _create_storytelling_prompt(self, location: str, theme: str, context: str, temp: float, weather: str) -> str:
        """Create the empathetic storytelling prompt for Gemini."""
        
        current_date = datetime.now().strftime("%B %Y")
        
        prompt = f"""You are an empathetic environmental storyteller creating SHORT sustainability awareness content for AROGYA SATHI.

**CRITICAL CONSTRAINTS:**
- Script MUST be **40-55 words** (15-20 seconds when spoken)
- Tone: Warm, empathetic, hopeful, reflective
- Style: Community-focused storytelling, NOT personal blame
- Language: Simple, non-technical, emotionally resonant
- Perspective: "We" and "Our" (collective), NOT "You" (avoid blame)
- End with: Gentle hope or awareness, NOT fear

**LOCATION CONTEXT:**
Location: {location}
Current Conditions: {weather}, {temp}°C
Theme: {theme}
Environmental Context: {context}
Date: {current_date}

**STORYTELLING RULES:**
1. ❌ NO statistics, numbers, or data points
2. ❌ NO fear-based messaging or doom scenarios
3. ❌ NO personal targeting ("you need to...", "you should...")
4. ❌ NO technical jargon or scientific terms
5. ✅ Use sensory language (what people see, feel, experience)
6. ✅ Focus on SHARED experiences, not individual actions
7. ✅ End with gentle awareness or hope

**THEME-SPECIFIC GUIDANCE:**

{self._get_theme_guidance(theme)}

**OUTPUT FORMAT:**
Generate ONLY the voiceover script. No titles, no explanations, no stage directions.
The script should flow naturally as a single spoken narrative.

**WORD COUNT:** 40-55 words MAXIMUM. Be concise and impactful.

Generate the script now:"""
        
        return prompt
    
    def _get_theme_guidance(self, theme: str) -> str:
        """Get theme-specific storytelling guidance."""
        
        guidance = {
            "heat": """FOR HEAT THEME:
- Describe how heat feels in the community (warm evenings, seeking shade together)
- Mention shared adaptive behaviors (families gathering in cooler spots)
- Connect to changing seasons and resilience
- Example feeling: "As temperatures rise in [location], we find ourselves seeking shade together..."
""",
            "water": """FOR WATER THEME:
- Describe rain patterns or water presence in daily life
- Mention community water usage rituals or experiences
- Connect to the cycle of water and our dependency
- Example feeling: "Every drop of water in [location] carries the story of our shared future..."
""",
            "air": """FOR AIR THEME:
- Describe the quality of air people breathe together
- Mention morning commutes, children playing outside
- Connect to the invisible yet essential nature of clean air
- Example feeling: "In [location], the air we breathe connects us all, an invisible thread of shared life..."
""",
            "sustainability": """FOR SUSTAINABILITY THEME:
- Describe the relationship between people and their environment
- Mention daily routines and their environmental footprint
- Connect to future generations and collective responsibility
- Example feeling: "In [location], our daily choices weave the fabric of tomorrow's environment..."
"""
        }
        
        return guidance.get(theme, guidance["sustainability"])
    
    def _regenerate_with_length_constraint(self, original_prompt: str, previous_count: int) -> str:
        """Regenerate script with stricter length enforcement."""
        
        length_note = f"\n\n**CRITICAL: Previous attempt was {previous_count} words. Generate EXACTLY 40-55 words. Count carefully.**"
        adjusted_prompt = original_prompt + length_note
        
        try:
            response = self.model.generate_content(adjusted_prompt)
            return response.text.strip()
        except:
            return "Our environment speaks to us daily. In every sunrise and rainfall, we find reminders of our connection to this planet. Small mindful actions today create lasting change for tomorrow. Together, we shape a sustainable future."

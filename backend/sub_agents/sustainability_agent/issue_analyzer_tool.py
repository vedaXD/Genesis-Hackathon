from google.adk.tools.base_tool import BaseTool

class IssueAnalyzerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="analyze_sustainability",
            description="Analyzes environmental data to identify dominant sustainability concerns"
        )
    
    def run(self, location_data: dict, user_theme: str = None) -> dict:
        """
        Identify sustainability issues based on environmental data.
        
        Args:
            location_data: Environmental data from weather API
            user_theme: Optional user-selected theme
            
        Returns:
            Dictionary with identified sustainability theme and context
        """
        
        if user_theme and user_theme !="Auto-Detect":
            # User explicitly selected  a theme
            theme_map = {
                "Heat & Summer": "heat",
                "Water & Rain": "water",
                "Air & Health": "air",
                "Sustainability & Future": "sustainability",
                "Education & Learning": "education",
                "Health & Wellness": "health",
                "Community & Connection": "community"
            }
            identified_theme = theme_map.get(user_theme, "sustainability")
            reason = f"User-selected theme: {user_theme}"
        else:
            # Auto-detect based on environmental data
            identified_theme, reason = self._auto_detect_theme(location_data)
        
        result = {
            "theme": identified_theme,
            "reason": reason,
            "context": self._generate_context(identified_theme, location_data)
        }
        
        print(f"  ✓ Identified theme: {identified_theme} ({reason})")
        return result
    
    def _auto_detect_theme(self, location_data: dict) -> tuple:
        """Auto-detect sustainability theme based on environmental signals."""
        
        temp = location_data.get('temperature', {}).get('current', 25)
        humidity = location_data.get('humidity', 50)
        aqi = location_data.get('air_quality_index')
        weather_main = location_data.get('weather', {}).get('main', '').lower()
        
        # Rule-based heuristics
        if temp > 35:
            return ("heat", f"High temperature detected: {temp}°C")
        elif temp < 5:
            return ("heat", f"Low temperature detected: {temp}°C (Winter challenges)")
        elif aqi and aqi >= 4:
            return ("air", f"Poor air quality detected: AQI level {aqi}")
        elif 'rain' in weather_main or humidity > 85:
            return ("water", f"High rainfall/humidity detected: {humidity}% humidity")
        elif 'clear' in weather_main and temp > 28:
            return ("sustainability", f"Optimal conditions to discuss future sustainability")
        else:
            return ("sustainability", "General sustainability awareness")
    
    def _generate_context(self, theme: str, location_data: dict) -> str:
        """Generate contextual information for the theme."""
        
        temp = location_data.get('temperature', {}).get('current', 0)
        humidity = location_data.get('humidity', 0)
        weather_desc = location_data.get('weather', {}).get('description', 'normal')
        
        context_templates = {
            "heat": f"Current temperature is {temp}°C with {weather_desc} conditions. Heat stress and energy consumption are key concerns.",
            "water": f"Current humidity at {humidity}% with {weather_desc}. Water conservation and rainfall patterns affect the community.",
            "air": f"{weather_desc.capitalize()} conditions with air quality concerns. Breathing clean air is a fundamental right.",
            "sustainability": f"Current conditions: {weather_desc}, {temp}°C. A moment to reflect on our environmental footprint.",
            "education": f"Education transforms lives and communities. Quality learning opportunities create lasting change.",
            "health": f"Health is wealth. Access to healthcare and wellness resources strengthens communities.",
            "community": f"Together we are stronger. Community connections and mutual support build resilience."
        }
        
        return context_templates.get(theme, "Environmental awareness is crucial for our shared future.")

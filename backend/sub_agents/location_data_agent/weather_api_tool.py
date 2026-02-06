from google.adk.tools.base_tool import BaseTool
import requests
import os

class WeatherAPITool(BaseTool):
    def __init__(self):
        super().__init__(
            name="fetch_weather_data",
            description="Fetches environmental data (weather, air quality) for a given location using OpenWeatherMap API"
        )
        # Using OpenWeatherMap - Free tier allows 1000 calls/day
        self.api_key = os.getenv('OPENWEATHER_API_KEY', '81ffe95e962c3a6e9c0e93d8ec010e41')  # Default demo key
        self.base_url = "https://api.openweathermap.org/data/2.5"
    
    def run(self, location: str) -> dict:
        """
        Fetch environmental data for a location.
        
        Args:
            location: City name or coordinates
            
        Returns:
            Dictionary with weather, temperature, air quality data
        """
        try:
            # Get current weather data
            weather_url = f"{self.base_url}/weather"
            params = {
                'q': location,
                'appid': self.api_key,
                'units': 'metric'  # Use Celsius
            }
            
            weather_response = requests.get(weather_url, params=params, timeout=10)
            weather_response.raise_for_status()
            weather_data = weather_response.json()
            
            #  Get air pollution data (if available)
            lat = weather_data['coord']['lat']
            lon = weather_data['coord']['lon']
            
            air_url = f"{self.base_url}/air_pollution"
            air_params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key
            }
            
            try:
                air_response = requests.get(air_url, params=air_params, timeout=10)
                air_response.raise_for_status()
                air_data = air_response.json()
                aqi = air_data['list'][0]['main']['aqi'] if 'list' in air_data else None
            except:
                aqi = None
            
            # Extract relevant environmental indicators
            result = {
                "success": True,
                "location": location,
                "coordinates": {
                    "lat": lat,
                    "lon": lon
                },
                "weather": {
                    "description": weather_data['weather'][0]['description'],
                    "main": weather_data['weather'][0]['main'],
                    "icon": weather_data['weather'][0]['icon']
                },
                "temperature": {
                    "current": weather_data['main']['temp'],
                    "feels_like": weather_data['main']['feels_like'],
                    "min": weather_data['main']['temp_min'],
                    "max": weather_data['main']['temp_max']
                },
                "humidity": weather_data['main']['humidity'],
                "pressure": weather_data['main']['pressure'],
                "wind_speed": weather_data['wind']['speed'],
                "air_quality_index": aqi,  # 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
                "timestamp": weather_data['dt']
            }
            
            print(f"  ✓ Fetched data for {location}: {weather_data['weather'][0]['description']}, {weather_data['main']['temp']}°C")
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"  ❌ Error fetching weather data: {e}")
            return {
                "success": False,
                "error": str(e),
                "location": location
            }

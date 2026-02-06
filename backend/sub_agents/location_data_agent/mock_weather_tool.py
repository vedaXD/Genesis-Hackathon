from google.adk.tools.base_tool import BaseTool
import random

class MockWeatherAPITool(BaseTool):
    """
    Mock weather API for testing without OpenWeatherMap API key.
    Returns realistic fake data based on city name patterns.
    
    ⚠️ FOR TESTING ONLY - Use real WeatherAPITool in production!
    """
    
    def __init__(self):
        super().__init__(
            name="fetch_weather_data_mock",
            description="[MOCK] Fetches fake environmental data for testing"
        )
        
        # City coordinates (approximate)
        self.city_coords = {
            "mumbai": {"lat": 19.076, "lon": 72.8777},
            "delhi": {"lat": 28.7041, "lon": 77.1025},
            "bangalore": {"lat": 12.9716, "lon": 77.5946},
            "chennai": {"lat": 13.0827, "lon": 80.2707},
            "kolkata": {"lat": 22.5726, "lon": 88.3639},
            "hyderabad": {"lat": 17.3850, "lon": 78.4867},
            "pune": {"lat": 18.5204, "lon": 73.8567},
            "ahmedabad": {"lat": 23.0225, "lon": 72.5714},
            "jaipur": {"lat": 26.9124, "lon": 75.7873},
            "lucknow": {"lat": 26.8467, "lon": 80.9462},
        }
        
        # Weather scenarios for different cities
        self.city_scenarios = {
            "mumbai": {
                "weather": [
                    {"main": "Rain", "description": "moderate rain"},
                    {"main": "Clouds", "description": "scattered clouds"},
                    {"main": "Haze", "description": "haze"}
                ],
                "temp_range": (25, 35),
                "humidity_range": (70, 90),
                "aqi_range": (2, 4)
            },
            "delhi": {
                "weather": [
                    {"main": "Haze", "description": "haze"},
                    {"main": "Smoke", "description": "smoke"},
                    {"main": "Clear", "description": "clear sky"}
                ],
                "temp_range": (15, 40),
                "humidity_range": (40, 70),
                "aqi_range": (3, 5)
            },
            "bangalore": {
                "weather": [
                    {"main": "Clear", "description": "clear sky"},
                    {"main": "Clouds", "description": "few clouds"},
                    {"main": "Rain", "description": "light rain"}
                ],
                "temp_range": (18, 30),
                "humidity_range": (50, 75),
                "aqi_range": (1, 3)
            },
            "chennai": {
                "weather": [
                    {"main": "Clear", "description": "clear sky"},
                    {"main": "Clouds", "description": "scattered clouds"},
                    {"main": "Rain", "description": "light rain"}
                ],
                "temp_range": (26, 38),
                "humidity_range": (60, 85),
                "aqi_range": (2, 3)
            }
        }
    
    def run(self, location: str) -> dict:
        """
        Generate fake weather data for testing.
        
        Args:
            location: City name
            
        Returns:
            Dictionary with mock weather data
        """
        print(f"  🧪 [MOCK MODE] Generating fake data for {location}")
        
        location_lower = location.lower()
        
        # Get scenario (use default if city not in list)
        if location_lower in self.city_scenarios:
            scenario = self.city_scenarios[location_lower]
        else:
            # Generic scenario for unknown cities
            scenario = {
                "weather": [{"main": "Clear", "description": "clear sky"}],
                "temp_range": (20, 32),
                "humidity_range": (50, 80),
                "aqi_range": (2, 3)
            }
        
        # Get coordinates
        if location_lower in self.city_coords:
            coords = self.city_coords[location_lower]
        else:
            coords = {"lat": 28.0, "lon": 77.0}  # Default India location
        
        # Generate random values within range
        weather = random.choice(scenario["weather"])
        temp = round(random.uniform(*scenario["temp_range"]), 1)
        humidity = random.randint(*scenario["humidity_range"])
        aqi = random.randint(*scenario["aqi_range"])
        
        # Add some variation
        feels_like = round(temp + random.uniform(-2, 3), 1)
        temp_min = round(temp - random.uniform(2, 5), 1)
        temp_max = round(temp + random.uniform(2, 5), 1)
        
        result = {
            "success": True,
            "location": location,
            "coordinates": coords,
            "weather": {
                "description": weather["description"],
                "main": weather["main"],
                "icon": "01d"
            },
            "temperature": {
                "current": temp,
                "feels_like": feels_like,
                "min": temp_min,
                "max": temp_max
            },
            "humidity": humidity,
            "pressure": random.randint(1008, 1015),
            "wind_speed": round(random.uniform(2, 8), 1),
            "air_quality_index": aqi,
            "timestamp": 1738963200  # Fixed timestamp
        }
        
        print(f"  ✓ [MOCK] {location}: {weather['description']}, {temp}°C, AQI {aqi}")
        return result

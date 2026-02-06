"""
Test Real Weather API
=====================
This script tests if the OpenWeatherMap API is working correctly
and displays real weather data for different locations.
"""

import os
import sys
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_weather_api():
    """Test weather API with multiple locations."""
    
    print("=" * 60)
    print("TESTING REAL WEATHER API")
    print("=" * 60)
    print()
    
    # Get API key from environment
    api_key = os.getenv('OPENWEATHER_API_KEY', '81ffe95e962c3a6e9c0e93d8ec010e41')
    base_url = "https://api.openweathermap.org/data/2.5"
    
    # Test locations
    test_locations = [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Chennai",
        "Kolkata"
    ]
    
    for location in test_locations:
        print(f"\n📍 Testing: {location}")
        print("-" * 40)
        
        try:
            # Get current weather data
            weather_url = f"{base_url}/weather"
            params = {
                'q': location,
                'appid': api_key,
                'units': 'metric'
            }
            
            response = requests.get(weather_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            print(f"✅ SUCCESS!")
            print(f"   Weather: {data['weather'][0]['description']}")
            print(f"   Temperature: {data['main']['temp']}°C")
            print(f"   Feels Like: {data['main']['feels_like']}°C")
            print(f"   Humidity: {data['main']['humidity']}%")
            print(f"   Wind Speed: {data['wind']['speed']} m/s")
            print(f"   Coordinates: {data['coord']['lat']}, {data['coord']['lon']}")
            
            # Try to get air quality
            try:
                air_url = f"{base_url}/air_pollution"
                air_params = {
                    'lat': data['coord']['lat'],
                    'lon': data['coord']['lon'],
                    'appid': api_key
                }
                air_response = requests.get(air_url, params=air_params, timeout=10)
                air_response.raise_for_status()
                air_data = air_response.json()
                aqi = air_data['list'][0]['main']['aqi']
                aqi_labels = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
                print(f"   Air Quality: {aqi_labels.get(aqi, 'Unknown')} (AQI: {aqi})")
            except:
                print(f"   Air Quality: Not available")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: {e}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    
    # Environment check
    print("\n🔧 ENVIRONMENT CONFIGURATION:")
    print(f"   USE_MOCK_WEATHER: {os.getenv('USE_MOCK_WEATHER', 'not set')}")
    if api_key:
        print(f"   OPENWEATHER_API_KEY: {'***' + api_key[-4:]}")
    else:
        print(f"   OPENWEATHER_API_KEY: NOT SET")
    print()
    
    print("💡 TIP: To use real weather in reels, set USE_MOCK_WEATHER=false in .env file")
    print()

if __name__ == "__main__":
    test_weather_api()

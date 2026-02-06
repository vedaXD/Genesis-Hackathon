"""
Test different empathetic story domains
Run this to see all available story types
"""

# Available Domains and Examples

domains = {
    "🌡️ Environmental Themes": {
        "Heat & Summer": {
            "description": "Stories about heat waves, summer challenges, cooling solutions",
            "example": {"location": "Delhi", "theme": "Heat & Summer"}
        },
        "Water & Rain": {
            "description": "Stories about water conservation, rain, monsoons, water access",
            "example": {"location": "Chennai", "theme": "Water & Rain"}
        },
        "Air & Health": {
            "description": "Stories about air quality, pollution, breathing clean air",
            "example": {"location": "Beijing", "theme": "Air & Health"}
        },
        "Sustainability & Future": {
            "description": "Stories about eco-living, green practices, environmental future",
            "example": {"location": "Copenhagen", "theme": "Sustainability & Future"}
        }
    },
    
    "🤝 Social Impact Themes": {
        "Education & Learning": {
            "description": "Stories about access to education, learning opportunities, student success",
            "example": {"location": "Rural India", "theme": "Education & Learning"}
        },
        "Health & Wellness": {
            "description": "Stories about healthcare access, mental health, wellness practices",
            "example": {"location": "Mumbai", "theme": "Health & Wellness"}
        },
        "Community & Connection": {
            "description": "Stories about community support, helping neighbors, social bonds",
            "example": {"location": "New York", "theme": "Community & Connection"}
        }
    },
    
    "🔄 Auto-Detect": {
        "Auto-Detect": {
            "description": "Let AI choose theme based on location's environmental conditions",
            "example": {"location": "Mumbai", "theme": "Auto-Detect"}
        }
    }
}

# Print all available options
print("=" * 70)
print("🎬 AROGYA SATHI - Available Empathetic Story Domains")
print("=" * 70)

for category, themes in domains.items():
    print(f"\n{category}")
    print("-" * 70)
    for theme_name, info in themes.items():
        print(f"\n  📌 {theme_name}")
        print(f"     {info['description']}")
        print(f"     Example: {info['example']}")

print("\n" + "=" * 70)
print("🚀 How to Generate Reels:")
print("=" * 70)
print("""
METHOD 1: Generate ALL domains automatically (⚡ RECOMMENDED)
   python generate_all_domains.py
   → Generates 7 reels (~25-30 mins)
   → Saves results log
   → Full automation

METHOD 2: Interactive - Choose specific domains
   python generate_batch.py
   → Choose 1 or more domains
   → Faster for testing
   → Interactive menu

METHOD 3: Single domain (manual testing)
   python test_reel_generation.py
   → Edit theme in file first
   → Quick single test

""")
print("=" * 70)
print("🔧 Advanced Testing:")
print("=" * 70)
print("""
1. Start the API server:
   python api_server.py

2. Direct API calls (any domain):
   
   # Environmental example
   curl -X POST http://localhost:8000/api/generate-story \\
        -H "Content-Type: application/json" \\
        -d '{"location": "Delhi", "theme": "Heat & Summer"}'
   
   # Social impact example
   curl -X POST http://localhost:8000/api/generate-story \\
        -H "Content-Type: application/json" \\
        -d '{"location": "Mumbai", "theme": "Education & Learning"}'
   
   # Auto-detect
   curl -X POST http://localhost:8000/api/generate-story \\
        -H "Content-Type: application/json" \\
        -d '{"location": "Mumbai", "theme": "Auto-Detect"}'
""")

print("\n" + "=" * 70)
print("💡 Quick Test Script:")
print("=" * 70)
print("""
Create test_quick.py with:

    import requests
    
    response = requests.post(
        "http://localhost:8000/api/generate-story",
        json={"location": "Mumbai", "theme": "Education & Learning"},
        timeout=300
    )
    
    print(response.json())
""")

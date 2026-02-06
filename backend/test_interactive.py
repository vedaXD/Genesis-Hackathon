#!/usr/bin/env python3
"""
Quick interactive domain tester for AROGYA SATHI
Choose domain and location to generate empathetic reel
"""
import requests
import json

print("=" * 70)
print("🎬 AROGYA SATHI - Quick Domain Tester")
print("=" * 70)

# Available domains
domains = [
    ("🌡️ Heat & Summer", "Heat & Summer"),
    ("💧 Water & Rain", "Water & Rain"),
    ("🌬️ Air & Health", "Air & Health"),
    ("♻️ Sustainability & Future", "Sustainability & Future"),
    ("📚 Education & Learning", "Education & Learning"),
    ("🏥 Health & Wellness", "Health & Wellness"),
    ("🤝 Community & Connection", "Community & Connection"),
    ("🔄 Auto-Detect", "Auto-Detect")
]

print("\nAvailable Domains:")
for i, (display, value) in enumerate(domains, 1):
    print(f"  {i}. {display}")

print("\n" + "=" * 70)

# Get user choice
try:
    choice = int(input("\n👉 Choose domain (1-8): "))
    if 1 <= choice <= len(domains):
        selected_theme = domains[choice - 1][1]
        print(f"✅ Selected: {domains[choice - 1][0]}")
    else:
        print("❌ Invalid choice. Using Auto-Detect.")
        selected_theme = "Auto-Detect"
except:
    print("❌ Invalid input. Using Auto-Detect.")
    selected_theme = "Auto-Detect"

# Get location
location = input("\n👉 Enter location (e.g., Mumbai, Delhi, New York): ").strip()
if not location:
    location = "Mumbai"
    print(f"📍 Using default: {location}")

print("\n" + "=" * 70)
print(f"🚀 Generating story...")
print(f"   Location: {location}")
print(f"   Theme: {selected_theme}")
print("=" * 70)
print("\n⏱️  This will take ~3-4 minutes (generating 5 AI images)...")
print("Please wait...\n")

# Make API request
try:
    response = requests.post(
        "http://localhost:8000/api/generate-story",
        json={"location": location, "theme": selected_theme},
        timeout=360
    )
    
    if response.status_code == 200:
        result = response.json()
        
        print("\n" + "=" * 70)
        print("✅ SUCCESS! Story Generated!")
        print("=" * 70)
        
        if result.get('script_text'):
            print(f"\n📝 Script:\n   {result['script_text'][:200]}...")
        
        if result.get('video_path'):
            print(f"\n🎬 Video: {result['video_path']}")
        
        if result.get('image_paths'):
            print(f"\n🎨 Generated {len(result['image_paths'])} unique AI images")
        
        print("\n" + "=" * 70)
        print("Full Response:")
        print(json.dumps(result, indent=2))
        
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("\n❌ Error: Could not connect to API server")
    print("Make sure the server is running:")
    print("   python api_server.py")
except requests.exceptions.Timeout:
    print("\n❌ Error: Request timed out (took more than 5 minutes)")
    print("This might happen if quotas are exhausted. Wait and try again.")
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "=" * 70)

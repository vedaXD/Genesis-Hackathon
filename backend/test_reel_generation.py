import requests
import json
import time

# API endpoint
API_URL = "http://localhost:8000/api/generate-story"

# ========================================
# 🎯 CHOOSE YOUR DOMAIN HERE
# ========================================
# Environmental Themes: "Heat & Summer", "Water & Rain", "Air & Health", "Sustainability & Future"
# Social Impact Themes: "Education & Learning", "Health & Wellness", "Community & Connection"
# Auto-Detect: "Auto-Detect" (AI chooses based on location)

test_data = {
    "location": "Mumbai",
    "theme": "Education & Learning"  # 👈 Change this to test different domains!
}

# Quick test examples (uncomment to use):
# test_data = {"location": "Delhi", "theme": "Heat & Summer"}
# test_data = {"location": "Chennai", "theme": "Water & Rain"}
# test_data = {"location": "Beijing", "theme": "Air & Health"}
# test_data = {"location": "Copenhagen", "theme": "Sustainability & Future"}
# test_data = {"location": "Rural India", "theme": "Education & Learning"}
# test_data = {"location": "Mumbai", "theme": "Health & Wellness"}
# test_data = {"location": "New York", "theme": "Community & Connection"}
# test_data = {"location": "Mumbai", "theme": "Auto-Detect"}

print("🎬 Testing Sustainability Story Generation")
print("=" * 50)
print(f"Location: {test_data['location']}")
print(f"Theme: {test_data['theme']}")
print("=" * 50)

try:
    print("\n📤 Sending request to API...")
    print("⏱️  This will take ~3-4 minutes (5 AI images with rate limiting)")
    print("☕ Grab a coffee and wait...\n")
    response = requests.post(API_URL, json=test_data, timeout=360)
    
    print(f"\n✅ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n🎉 SUCCESS! Story generated!")
        print("=" * 50)
        
        if 'script_text' in result:
            print(f"\n📝 Script ({result.get('script_word_count', 0)} words):")
            print(f"   {result['script_text']}")
        
        if 'audio_path' in result:
            print(f"\n🎙️ Audio: {result['audio_path']}")
        
        if 'video_path' in result and result['video_path']:
            print(f"\n🎬 Video: {result['video_path']}")
            
            # Check if file exists
            video_file = result['video_path'].replace('\\\\', '\\')
            import os
            if os.path.exists(video_file):
                file_size = os.path.getsize(video_file) / 1024  # KB
                print(f"   File size: {file_size:.1f} KB")
                print("\n✅ Video is ready!")
            else:
                print("⚠️ Video file not found on disk")
        else:
            print("\n⚠️ Video not generated")
        
        if 'image_paths' in result and result['image_paths']:
            print(f"\n🎨 Generated {len(result['image_paths'])} AI images")
        
        print("\n" + "=" * 50)
        print("Full Response:")
        print(json.dumps(result, indent=2))
        
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("\n❌ Error: Could not connect to API server")
    print("Make sure the server is running: python api_server.py")
except requests.exceptions.Timeout:
    print("\n❌ Error: Request timed out (took more than 6 minutes)")
    print("This usually means:")
    print("  1. Rate limiting delays are longer than expected")
    print("  2. GCP quota issues causing retries")
    print("  3. Network connectivity problems")
    print("\nCheck the API server terminal for detailed logs.")
except Exception as e:
    print(f"\n❌ Error: {e}")

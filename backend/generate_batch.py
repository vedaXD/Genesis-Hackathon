#!/usr/bin/env python3
"""
Quick Batch Generator - Generate reels for selected domains only
Faster and more flexible than full batch generation
"""
import requests
import json
import time
from datetime import datetime

# Configuration
API_URL = "http://localhost:8000/api/generate-story"

# All available domains with suggested locations
ALL_DOMAINS = {
    "1": {"name": "Heat & Summer", "location": "Delhi", "emoji": "🌡️"},
    "2": {"name": "Water & Rain", "location": "Chennai", "emoji": "💧"},
    "3": {"name": "Air & Health", "location": "Beijing", "emoji": "🌬️"},
    "4": {"name": "Sustainability & Future", "location": "Copenhagen", "emoji": "♻️"},
    "5": {"name": "Education & Learning", "location": "Rural India", "emoji": "📚"},
    "6": {"name": "Health & Wellness", "location": "Mumbai", "emoji": "🏥"},
    "7": {"name": "Community & Connection", "location": "New York", "emoji": "🤝"}
}

def display_menu():
    """Display domain selection menu"""
    print("\n" + "=" * 70)
    print("🎬 Quick Batch Generator - Select Domains")
    print("=" * 70)
    
    print("\n📋 Available Domains:")
    for key, domain in ALL_DOMAINS.items():
        print(f"  {key}. {domain['emoji']} {domain['name']} ({domain['location']})")
    
    print("\n  8. ⚡ Generate ALL domains (7 reels)")
    print("  0. ❌ Exit")
    print("\n" + "=" * 70)

def generate_reel(theme_name, location, emoji):
    """Generate a single reel with progress tracking"""
    print(f"\n{emoji} Generating '{theme_name}' reel...")
    print(f"   📍 Location: {location}")
    print(f"   ⏱️  Time: ~3-4 minutes")
    
    start_time = time.time()
    
    try:
        response = requests.post(
            API_URL,
            json={"location": location, "theme": theme_name},
            timeout=360
        )
        
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ SUCCESS in {elapsed/60:.1f} minutes!")
            print(f"   📹 Video: {result.get('video_path', 'N/A')}")
            print(f"   🎨 Images: {len(result.get('image_paths', []))}")
            return True, result
        else:
            print(f"   ❌ FAILED: {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
        return False, None

def main():
    """Main interactive loop"""
    print("\n🎬 AROGYA SATHI - Quick Batch Reel Generator")
    
    # Check API health
    try:
        requests.get("http://localhost:8000/health", timeout=5)
        print("✅ API server is running")
    except:
        print("❌ Cannot connect to API server!")
        print("Start it first: python api_server.py")
        return
    
    successful = 0
    failed = 0
    
    while True:
        display_menu()
        
        choice = input("\n👉 Enter your choice(s) (e.g., '1,3,5' or '8' for all): ").strip()
        
        if choice == '0':
            print("\n👋 Goodbye!")
            break
        
        # Parse selection
        if choice == '8':
            selections = list(ALL_DOMAINS.keys())
            print(f"\n🚀 Generating ALL {len(selections)} reels...")
            print(f"⏱️  Estimated time: ~{len(selections) * 3.5:.0f} minutes")
        else:
            selections = [s.strip() for s in choice.split(',') if s.strip() in ALL_DOMAINS]
            
            if not selections:
                print("❌ Invalid selection. Try again.")
                continue
            
            print(f"\n🚀 Generating {len(selections)} reel(s)...")
        
        # Confirm
        confirm = input(f"This will take ~{len(selections) * 3.5:.0f} minutes. Continue? (y/n): ").strip().lower()
        if confirm != 'y':
            print("❌ Cancelled")
            continue
        
        # Generate selected reels
        for i, key in enumerate(selections, 1):
            domain = ALL_DOMAINS[key]
            
            print(f"\n{'='*70}")
            print(f"Reel {i}/{len(selections)}")
            print(f"{'='*70}")
            
            success, result = generate_reel(
                domain['name'],
                domain['location'],
                domain['emoji']
            )
            
            if success:
                successful += 1
            else:
                failed += 1
            
            # Small break between reels (except last one)
            if i < len(selections):
                print(f"\n⏸️  Waiting 10 seconds before next reel...")
                time.sleep(10)
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 Batch Summary")
        print("=" * 70)
        print(f"✅ Successful: {successful}")
        print(f"❌ Failed: {failed}")
        print(f"📁 Videos saved in: backend/data/videos/")
        print("=" * 70)
        
        # Ask if user wants to continue
        another = input("\nGenerate more reels? (y/n): ").strip().lower()
        if another != 'y':
            print("\n🎉 All done! Check 'data/videos' folder for your reels.")
            break

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user. Goodbye!")

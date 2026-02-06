#!/usr/bin/env python3
"""
Batch Reel Generator for All Domains
Generates empathetic reels for every available domain
"""
import requests
import json
import time
from datetime import datetime
import os

# API Configuration
API_URL = "http://localhost:8000/api/generate-story"
TIMEOUT = 360  # 6 minutes per reel (to handle rate limiting)

# All Available Domains
DOMAINS = [
    {
        "category": "🌡️ Environmental",
        "themes": [
            {"name": "Heat & Summer", "location": "Delhi", "emoji": "🌡️"},
            {"name": "Water & Rain", "location": "Chennai", "emoji": "💧"},
            {"name": "Air & Health", "location": "Beijing", "emoji": "🌬️"},
            {"name": "Sustainability & Future", "location": "Copenhagen", "emoji": "♻️"}
        ]
    },
    {
        "category": "🤝 Social Impact",
        "themes": [
            {"name": "Education & Learning", "location": "Rural India", "emoji": "📚"},
            {"name": "Health & Wellness", "location": "Mumbai", "emoji": "🏥"},
            {"name": "Community & Connection", "location": "New York", "emoji": "🤝"}
        ]
    }
]

# Results tracking
results = {
    "start_time": datetime.now().isoformat(),
    "total_domains": 0,
    "successful": 0,
    "failed": 0,
    "reels": []
}

def print_header():
    """Print script header"""
    print("\n" + "=" * 80)
    print("🎬 AROGYA SATHI - Batch Reel Generator")
    print("=" * 80)
    print("Generating empathetic reels for ALL domains")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80 + "\n")

def print_progress(current, total, domain_name):
    """Print progress bar"""
    percent = (current / total) * 100
    bar_length = 40
    filled = int(bar_length * current / total)
    bar = "█" * filled + "░" * (bar_length - filled)
    print(f"\n📊 Progress: [{bar}] {percent:.1f}% ({current}/{total})")
    print(f"🎯 Current: {domain_name}")

def generate_reel(theme_name, location, emoji):
    """Generate a single reel"""
    print(f"\n{emoji} Generating: {theme_name}")
    print(f"   Location: {location}")
    print(f"   ⏱️  Estimated time: 3-4 minutes...")
    
    reel_data = {
        "theme": theme_name,
        "location": location,
        "status": "pending",
        "start_time": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(
            API_URL,
            json={"location": location, "theme": theme_name},
            timeout=TIMEOUT
        )
        
        reel_data["end_time"] = datetime.now().isoformat()
        reel_data["status_code"] = response.status_code
        
        if response.status_code == 200:
            result = response.json()
            reel_data["status"] = "success"
            reel_data["video_path"] = result.get("video_path")
            reel_data["script_text"] = result.get("script_text", "")[:100] + "..."
            reel_data["image_count"] = len(result.get("image_paths", []))
            
            print(f"   ✅ SUCCESS!")
            print(f"   📹 Video: {result.get('video_path', 'N/A')}")
            print(f"   🎨 Images: {len(result.get('image_paths', []))}")
            
            # Check if video file exists
            if result.get('video_path'):
                video_path = result['video_path'].replace('\\\\', '\\')
                if os.path.exists(video_path):
                    size_kb = os.path.getsize(video_path) / 1024
                    print(f"   📦 Size: {size_kb:.1f} KB")
                    reel_data["file_size_kb"] = size_kb
            
            return True, reel_data
        else:
            reel_data["status"] = "failed"
            reel_data["error"] = f"HTTP {response.status_code}"
            print(f"   ❌ FAILED: {response.status_code}")
            print(f"   Error: {response.text[:200]}")
            return False, reel_data
            
    except requests.exceptions.Timeout:
        reel_data["status"] = "timeout"
        reel_data["error"] = "Request timed out after 5 minutes"
        print(f"   ⏱️  TIMEOUT: Took more than {TIMEOUT} seconds")
        return False, reel_data
    
    except requests.exceptions.ConnectionError:
        reel_data["status"] = "connection_error"
        reel_data["error"] = "Could not connect to API server"
        print(f"   ❌ CONNECTION ERROR: Is the API server running?")
        return False, reel_data
    
    except Exception as e:
        reel_data["status"] = "error"
        reel_data["error"] = str(e)
        print(f"   ❌ ERROR: {e}")
        return False, reel_data

def save_results():
    """Save results to JSON file"""
    results["end_time"] = datetime.now().isoformat()
    
    output_file = f"batch_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    output_path = os.path.join(os.path.dirname(__file__), output_file)
    
    with open(output_path, 'w') as f:
        json.dumps(results, f, indent=2)
    
    print(f"\n💾 Results saved to: {output_file}")

def print_summary():
    """Print final summary"""
    print("\n" + "=" * 80)
    print("📊 BATCH GENERATION SUMMARY")
    print("=" * 80)
    
    print(f"\n🎬 Total Domains: {results['total_domains']}")
    print(f"✅ Successful: {results['successful']} ({results['successful']/results['total_domains']*100:.1f}%)")
    print(f"❌ Failed: {results['failed']} ({results['failed']/results['total_domains']*100:.1f}%)")
    
    # Time calculation
    start = datetime.fromisoformat(results['start_time'])
    end = datetime.fromisoformat(results['end_time'])
    duration = end - start
    minutes = duration.total_seconds() / 60
    
    print(f"\n⏱️  Total Time: {minutes:.1f} minutes")
    print(f"⚡ Average per reel: {minutes/results['total_domains']:.1f} minutes")
    
    # Successful reels
    if results['successful'] > 0:
        print(f"\n✅ Successfully Generated Reels:")
        for reel in results['reels']:
            if reel['status'] == 'success':
                print(f"   {reel.get('emoji', '🎬')} {reel['theme']}")
                print(f"      📹 {reel.get('video_path', 'N/A')}")
    
    # Failed reels
    if results['failed'] > 0:
        print(f"\n❌ Failed Reels:")
        for reel in results['reels']:
            if reel['status'] != 'success':
                print(f"   {reel.get('emoji', '❌')} {reel['theme']}: {reel.get('error', 'Unknown error')}")
    
    print("\n" + "=" * 80)

def main():
    """Main execution function"""
    print_header()
    
    # Check if API server is running
    try:
        health_response = requests.get("http://localhost:8000/health", timeout=5)
        if health_response.status_code != 200:
            print("❌ API server is not responding properly!")
            print("Please start the server: python api_server.py")
            return
        print("✅ API server is running\n")
    except:
        print("❌ Cannot connect to API server!")
        print("Please start the server first: python api_server.py")
        return
    
    # Count total domains
    total_themes = sum(len(category['themes']) for category in DOMAINS)
    results['total_domains'] = total_themes
    current_count = 0
    
    print(f"🎯 Will generate {total_themes} reels across {len(DOMAINS)} categories")
    
    # Confirm before starting
    print("\n⚠️  This will take approximately {:.0f} minutes".format(total_themes * 3.5))
    confirm = input("Continue? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Cancelled by user")
        return
    
    # Generate reels for each domain
    for category_data in DOMAINS:
        print(f"\n{'='*80}")
        print(f"{category_data['category']} Category")
        print(f"{'='*80}")
        
        for theme_data in category_data['themes']:
            current_count += 1
            
            print_progress(current_count, total_themes, theme_data['name'])
            
            # Generate reel
            success, reel_result = generate_reel(
                theme_data['name'],
                theme_data['location'],
                theme_data['emoji']
            )
            
            # Add emoji to result
            reel_result['emoji'] = theme_data['emoji']
            reel_result['category'] = category_data['category']
            
            # Update counts
            if success:
                results['successful'] += 1
            else:
                results['failed'] += 1
            
            results['reels'].append(reel_result)
            
            # Small delay before next reel (to avoid overwhelming the system)
            if current_count < total_themes:
                print(f"\n⏸️  Waiting 10 seconds before next reel...")
                time.sleep(10)
    
    # Save and display results
    save_results()
    print_summary()
    
    print("\n🎉 Batch generation completed!")
    print("Check the 'data/videos' folder for all generated reels")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Generation interrupted by user")
        print(f"Completed: {results['successful']} successful, {results['failed']} failed")
        save_results()
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        save_results()

"""
Generate subtitle files for existing videos that don't have them
"""
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

VIDEOS_DIR = 'data/videos'
SUBTITLES_DIR = 'data/subtitles'

def format_vtt_timestamp(seconds: float) -> str:
    """Format seconds as WebVTT timestamp (HH:MM:SS.mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"


def generate_generic_subtitle(video_filename: str) -> str:
    """
    Generate a generic subtitle file for a video
    Returns the path to the created subtitle file
    """
    subtitle_filename = video_filename.replace('.mp4', '.vtt')
    subtitle_path = os.path.join(SUBTITLES_DIR, subtitle_filename)
    
    # Generic sustainability message for videos without script
    generic_text = """
    Every small action counts towards a sustainable future. 
    Climate change affects us all, but together we can make a difference. 
    Your daily choices matter. From the coffee you drink to the places you walk. 
    Join us in building a more sustainable world. 
    Learn, act, and inspire others to care for our planet.
    """.strip()
    
    # Split into chunks
    sentences = [s.strip() for s in generic_text.split('.') if s.strip()]
    
    # Generate WebVTT content
    vtt_content = "WEBVTT\n\n"
    
    current_time = 0.0
    duration_per_sentence = 5.0  # 5 seconds per sentence
    
    for idx, sentence in enumerate(sentences):
        if not sentence:
            continue
            
        start_time = current_time
        end_time = current_time + duration_per_sentence
        
        start_str = format_vtt_timestamp(start_time)
        end_str = format_vtt_timestamp(end_time)
        
        vtt_content += f"{idx + 1}\n"
        vtt_content += f"{start_str} --> {end_str}\n"
        vtt_content += f"{sentence}.\n\n"
        
        current_time = end_time
    
    # Write subtitle file
    with open(subtitle_path, 'w', encoding='utf-8') as f:
        f.write(vtt_content)
    
    return subtitle_path


def main():
    """Generate subtitles for all videos that don't have them"""
    print("🎬 Generating missing subtitle files...")
    
    # Ensure directories exist
    os.makedirs(VIDEOS_DIR, exist_ok=True)
    os.makedirs(SUBTITLES_DIR, exist_ok=True)
    
    # List all videos
    video_files = [f for f in os.listdir(VIDEOS_DIR) if f.endswith('.mp4')]
    
    if not video_files:
        print("❌ No videos found!")
        return
    
    generated_count = 0
    
    for video_file in video_files:
        subtitle_filename = video_file.replace('.mp4', '.vtt')
        subtitle_path = os.path.join(SUBTITLES_DIR, subtitle_filename)
        
        # Check if subtitle already exists
        if os.path.exists(subtitle_path):
            print(f"⏭️  Skipping {video_file} (subtitle exists)")
            continue
        
        # Generate generic subtitle
        print(f"✨ Generating subtitle for {video_file}...")
        created_path = generate_generic_subtitle(video_file)
        print(f"✅ Created: {created_path}")
        generated_count += 1
    
    print(f"\n🎉 Done! Generated {generated_count} subtitle files.")
    print(f"📊 Total videos: {len(video_files)}")
    print(f"📝 Total subtitles: {len([f for f in os.listdir(SUBTITLES_DIR) if f.endswith('.vtt')])}")


if __name__ == "__main__":
    main()

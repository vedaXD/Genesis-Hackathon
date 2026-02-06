from google.adk.tools.base_tool import BaseTool
import os
from datetime import datetime
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
from moviepy.video.fx.all import fadeout, fadein
import numpy as np
from PIL import Image

class VideoAssemblerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="assemble_video",
            description="Assembles final sustainability story video with AI-generated images and voiceover"
        )
        
        self.assets_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'video_assets')
        os.makedirs(self.assets_dir, exist_ok=True)
    
    def run(self, script: str, audio_path: str, theme: str, image_paths: list = None) -> dict:
        """
        Assemble final video with AI-generated images.
        
        Args:
            script: The story script
            audio_path: Path to AI voiceover audio file
            theme: Sustainability theme
            image_paths: List of paths to AI-generated images
            
        Returns:
            Dictionary with video file path
        """
        
        try:
            print("  → Assembling sustainability story video...")
            
            # Create video with generated images - no fallback
            if not image_paths or len(image_paths) == 0:
                raise Exception("No images provided for video assembly")
            
            video_path = self._create_image_slideshow_video(script, audio_path, image_paths)
            print(f"  ✓ Video assembled successfully")
            
            return {
                "video_path": video_path,
                "theme": theme,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"  ❌ Error assembling video: {e}")
            return {
                "error": str(e),
                "video_path": None
            }
    
    def _create_image_slideshow_video(self, script: str, audio_path: str, image_paths: list) -> str:
        """Create video with AI-generated images sliding through."""
        
        # Load audio to get duration
        audio = AudioFileClip(audio_path)
        
        # FIXED 15 SECOND REEL - trim audio if longer
        TARGET_DURATION = 15.0  # Always 15 seconds
        
        if audio.duration > TARGET_DURATION:
            print(f"    ⚠️  Audio is {audio.duration:.1f}s, trimming to {TARGET_DURATION}s")
            audio = audio.subclip(0, TARGET_DURATION)
        
        # Fixed 15 second reel: 5 images @ 3 seconds each
        num_images = len(image_paths)
        duration_per_image = TARGET_DURATION / num_images  # Divide evenly
        
        print(f"    Creating {num_images} image clips ({duration_per_image:.1f}s each = {TARGET_DURATION}s total)...")
        
        # Create image clips
        clips = []
        for i, img_path in enumerate(image_paths):
            try:
                # Load and resize image to 9:16 vertical format
                img = Image.open(img_path)
                img = img.resize((1080, 1920), Image.Resampling.LANCZOS)
                
                # Convert to numpy array
                img_array = np.array(img)
                
                # Create clip with calculated duration
                clip = ImageClip(img_array, duration=duration_per_image)
                
                # Add fade effects to first and last clips
                if i == 0:
                    # First clip: fade in
                    clip = clip.fx(fadein, 0.3)
                
                if i == num_images - 1:
                    # Last clip: fade out
                    clip = clip.fx(fadeout, 0.3)
                
                clips.append(clip)
                
            except Exception as e:
                print(f"    ⚠️  Error loading image {i+1}: {e}")
                continue
        
        if not clips:
            raise Exception("No valid image clips created")
        
        # Concatenate all clips (should be exactly 15 seconds)
        final_video = concatenate_videoclips(clips, method="compose")
        
        # Force exact 15 second duration
        if final_video.duration != TARGET_DURATION:
            final_video = final_video.subclip(0, TARGET_DURATION)
        
        # Add audio (already trimmed to 15s)
        final_video = final_video.set_audio(audio)
        
        # Export video
        output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'videos')
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_filename = f"arogya_sathi_{timestamp}.mp4"
        video_path = os.path.join(output_dir, video_filename)
        
        print(f"    Exporting video ({final_video.duration:.1f}s)...")
        
        final_video.write_videofile(
            video_path,
            fps=24,
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            logger=None,
            preset='ultrafast'  # Faster encoding
        )
        
        # Close clips
        final_video.close()
        audio.close()
        
        return video_path

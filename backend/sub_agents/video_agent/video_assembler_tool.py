from google.adk.tools.base_tool import BaseTool
import os
from datetime import datetime
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip, TextClip
from moviepy.video.fx.all import fadeout, fadein
import numpy as np

class VideoAssemblerTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="assemble_video",
            description="Assembles final sustainability story video with visuals and voiceover"
        )
        
        self.assets_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'video_assets')
        os.makedirs(self.assets_dir, exist_ok=True)
    
    def run(self, script: str, audio_path: str, theme: str) -> dict:
        """
        Assemble final video.
        
        Args:
            script: The story script
            audio_path: Path to AI voiceover audio file
            theme: Sustainability theme
            
        Returns:
            Dictionary with video file path
        """
        
        try:
            print("  → Assembling sustainability story video...")
            
            # Create simple video with background and text overlay
            # For MVP, we'll use colored backgrounds based on theme
            video_path = self._create_simple_video(script, audio_path, theme)
            
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
    
    def _create_simple_video(self, script: str, audio_path: str, theme: str) -> str:
        """Create a simple video with colored background and text."""
        
        # Theme-based color schemes (RGB)
        theme_colors = {
            "heat": (255, 140, 0),  # Orange
            "water": (70, 130, 180),  # Steel Blue
            "air": (135, 206, 235),  # Sky Blue
            "sustainability": (34, 139, 34)  # Forest Green
        }
        
        bg_color = theme_colors.get(theme, (34, 139, 34))
        
        # Load audio to get duration
        audio = AudioFileClip(audio_path)
        duration = audio.duration
        
        # Create colored background
        width, height = 1080, 1920  # 9:16 aspect ratio for mobile
        background = np.zeros((height, width, 3), dtype=np.uint8)
        background[:] = bg_color
        
        bg_clip = ImageClip(background, duration=duration)
        
        # Add subtle fade effects
        bg_clip = bg_clip.fx(fadein, 0.5).fx(fadeout, 0.5)
        
        # Create text overlay with script (split into lines for readability)
        words = script.split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            if len(' '.join(current_line)) > 30:  # Wrap at ~30 chars
                lines.append(' '.join(current_line))
                current_line = []
        if current_line:
            lines.append(' '.join(current_line))
        
        text_content = '\n'.join(lines)
        
        # Create text clip
        try:
            txt_clip = TextClip(
                text_content,
                fontsize=50,
                color='white',
                font='Arial',
                align='center',
                method='caption',
                size=(width - 100, None)
            ).set_position('center').set_duration(duration)
            
            # Composite video
            final_clip = CompositeVideoClip([bg_clip, txt_clip])
        except:
            # Fallback if TextClip fails
            final_clip = bg_clip
        
        # Add audio
        final_clip = final_clip.set_audio(audio)
        
        # Export video
        output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'videos')
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_filename = f"arogya_sathi_{timestamp}.mp4"
        video_path = os.path.join(output_dir, video_filename)
        
        final_clip.write_videofile(
            video_path,
            fps=24,
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            logger=None  # Suppress moviepy progress bars
        )
        
        # Close clips
        final_clip.close()
        audio.close()
        
        return video_path

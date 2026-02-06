from google.adk.tools.base_tool import BaseTool
from google.cloud import texttospeech
import os
from datetime import datetime

class TextToSpeechTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="generate_voice",
            description="Converts script to natural AI voiceover using Google Text-to-Speech"
        )
        
        # Initialize Google Cloud TTS client
        try:
            self.client = texttospeech.TextToSpeechClient()
            self.use_fallback = False
            print("[INFO] Google Text-to-Speech client initialized")
        except Exception as e:
            print(f"[WARNING] Could not initialize TTS client: {e}")
            print("[INFO] Will use fallback gTTS (free) for voice generation")
            self.client = None
            self.use_fallback = True
    
    def run(self, script: str) -> dict:
        """
        Convert script to AI voiceover.
        
        Args:
            script: The text script to convert
            
        Returns:
            Dictionary with audio file path
        """
        
        if self.use_fallback:
            return self._fallback_tts(script)
        
        try:
            # Set up the text input
            synthesis_input = texttospeech.SynthesisInput(text=script)
            
            # Select voice (US English, Neural2, Neutral tone)
            voice = texttospeech.VoiceSelectionParams(
                language_code="en-US",
                name="en-US-Neural2-F",  # Female voice, warm and empathetic
                ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
            )
            
            # Configure audio output
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=0.9,  # Slightly slower for empathy
                pitch=0.0,  # Neutral pitch
                effects_profile_id=["small-bluetooth-speaker-class-device"]  # Optimize for mobile
            )
            
            print("  → Synthesizing AI voiceover...")
            
            # Generate speech
            response = self.client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            # Save audio file
            output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'audio')
            os.makedirs(output_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            audio_filename = f"story_{timestamp}.mp3"
            audio_path = os.path.join(output_dir, audio_filename)
            
            with open(audio_path, 'wb') as out:
                out.write(response.audio_content)
            
            print(f"  ✓ Voiceover generated: {audio_filename}")
            
            return {
                "audio_path": audio_path,
                "filename": audio_filename,
                "duration_estimate": len(script.split()) / 2.5,  # Rough estimate: 2.5 words/second
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"  ❌ Error generating voiceover: {e}")
            print(f"  → Trying fallback TTS...")
            return self._fallback_tts(script)
    
    def _fallback_tts(self, script: str) -> dict:
        """Fallback TTS using gTTS (free, no credentials needed)."""
        try:
            from gtts import gTTS
            
            output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'audio')
            os.makedirs(output_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            audio_filename = f"story_{timestamp}.mp3"
            audio_path = os.path.join(output_dir, audio_filename)
            
            # Generate speech using gTTS
            tts = gTTS(text=script, lang='en', slow=False)
            tts.save(audio_path)
            
            print(f"  ✓ Voiceover generated (fallback): {audio_filename}")
            
            return {
                "audio_path": audio_path,
                "filename": audio_filename,
                "duration_estimate": len(script.split()) / 2.5,
                "timestamp": datetime.now().isoformat(),
                "method": "gtts_fallback"
            }
            
        except ImportError:
            print("  ❌ gTTS not installed. Installing...")
            import subprocess
            subprocess.check_call([
                os.path.join(os.path.dirname(__file__), '..', '..', '..', 'venv', 'Scripts', 'python.exe'),
                '-m', 'pip', 'install', 'gtts'
            ])
            # Retry after installation
            from gtts import gTTS
            return self._fallback_tts(script)
        except Exception as e:
            print(f"  ❌ Fallback TTS also failed: {e}")
            return {
                "error": str(e),
                "audio_path": None
            }

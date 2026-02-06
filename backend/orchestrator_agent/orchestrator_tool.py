from google.adk.tools.base_tool import BaseTool
import json
from datetime import datetime

class OrchestratorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="coordinate_storytelling",
            description="Coordinates the complete AI-powered sustainability storytelling pipeline through all sub-agents."
        )

    def run(self, location: str, theme: str = None) -> dict:
        """
        Orchestrates the complete sustainability storytelling pipeline.
        
        Args:
            location: User's city or region (required)
            theme: Optional theme selection (Heat & Summer, Water & Rain, Air & Health, Sustainability & Future, or Auto-Detect)
            
        Returns:
            Complete storytelling package with video, script, and metadata
        """
        
        pipeline_result = {
            "location": location,
            "theme": theme or "Auto-Detect",
            "stages": {
                "location_data": None,
                "sustainability_analysis": None,
                "script_generation": None,
                "voice_generation": None,
                "video_assembly": None
            },
            "final_video_path": None,
            "script_text": None,
            "audio_path": None,
            "success": False
        }
        
        try:
            # Stage 1: Location & Environmental Data Collection
            print(f"🌍 Stage 1: Fetching environmental data for {location}...")
            location_data = self._fetch_location_data(location)
            pipeline_result["stages"]["location_data"] = location_data
            
            if not location_data.get("success"):
                pipeline_result["error"] = "Failed to fetch location data"
                return pipeline_result
            
            # Stage 2: Sustainability Issue Identification
            print("🌱 Stage 2: Analyzing sustainability patterns...")
            sustainability_analysis = self._analyze_sustainability(location_data, theme)
            pipeline_result["stages"]["sustainability_analysis"] = sustainability_analysis
            
            # Stage 3: AI Script Generation (Empathetic Storytelling)
            print("✍️ Stage 3: Generating empathetic sustainability story...")
            script_result = self._generate_script(location, location_data, sustainability_analysis)
            pipeline_result["stages"]["script_generation"] = script_result
            pipeline_result["script_text"] = script_result.get("script")
            
            # Stage 4: AI Voice Generation
            print("🎙️ Stage 4: Converting script to AI voiceover...")
            voice_result = self._generate_voice(script_result.get("script"))
            pipeline_result["stages"]["voice_generation"] = voice_result
            pipeline_result["audio_path"] = voice_result.get("audio_path")
            
            # Stage 5: Video Assembly
            print("🎬 Stage 5: Assembling final sustainability story video...")
            
            # Check if audio was generated successfully
            audio_path = voice_result.get("audio_path")
            if not audio_path:
                print("  ⚠️ No audio generated, skipping video assembly")
                video_result = {
                    "error": "Audio generation failed, video not created",
                    "video_path": None
                }
            else:
                video_result = self._assemble_video(
                    script_result.get("script"),
                    audio_path,
                    sustainability_analysis.get("theme")
                )
            
            pipeline_result["stages"]["video_assembly"] = video_result
            pipeline_result["final_video_path"] = video_result.get("video_path")
            
            pipeline_result["success"] = True
            print("✅ Sustainability story generation complete!")
            
        except Exception as e:
            pipeline_result["error"] = str(e)
            print(f"❌ Error in pipeline: {e}")
        
        return pipeline_result
    
    def _fetch_location_data(self, location: str) -> dict:
        """Stage 1: Fetch environmental data for the location."""
        import os
        
        # Check if we should use mock data (for testing without API key)
        use_mock = os.getenv('USE_MOCK_WEATHER', 'false').lower() == 'true'
        
        if use_mock:
            from sub_agents.location_data_agent.mock_weather_tool import MockWeatherAPITool
            print(f"  🧪 [MOCK MODE] Generating fake weather data for {location}...")
            weather_tool = MockWeatherAPITool()
        else:
            from sub_agents.location_data_agent.weather_api_tool import WeatherAPITool
            print(f"  → Fetching environmental data for {location}...")
            weather_tool = WeatherAPITool()
        
        location_data = weather_tool.run(location=location)
        
        return location_data
    
    def _analyze_sustainability(self, location_data: dict, user_theme: str = None) -> dict:
        """Stage 2: Identify sustainability issues based on environmental data."""
        from sub_agents.sustainability_agent.issue_analyzer_tool import IssueAnalyzerTool
        
        print("  → Analyzing sustainability patterns...")
        analyzer = IssueAnalyzerTool()
        analysis = analyzer.run(location_data=location_data, user_theme=user_theme)
        
        return analysis
    
    def _generate_script(self, location: str, location_data: dict, sustainability_analysis: dict) -> dict:
        """Stage 3: Generate empathetic AI script using Gemini."""
        from sub_agents.script_agent.gemini_script_generator_tool import GeminiScriptGeneratorTool
        
        print("  → Crafting empathetic sustainability story...")
        generator = GeminiScriptGeneratorTool()
        script_result = generator.run(
            location=location,
            location_data=location_data,
            sustainability_analysis=sustainability_analysis
        )
        
        return script_result
    
    def _generate_voice(self, script: str) -> dict:
        """Stage 4: Convert script to AI voiceover using Google Text-to-Speech."""
        from sub_agents.voice_agent.tts_tool import TextToSpeechTool
        
        print("  → Generating natural AI voiceover...")
        tts_tool = TextToSpeechTool()
        voice_result = tts_tool.run(script=script)
        
        return voice_result
    
    def _assemble_video(self, script: str, audio_path: str, theme: str) -> dict:
        """Stage 5: Assemble final video with visuals and voiceover."""
        from sub_agents.video_agent.video_assembler_tool import VideoAssemblerTool
        
        print("  → Assembling final sustainability story video...")
        assembler = VideoAssemblerTool()
        video_result = assembler.run(
            script=script,
            audio_path=audio_path,
            theme=theme
        )
        
        return video_result


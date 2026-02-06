from google.adk.tools.base_tool import BaseTool
import os
from datetime import datetime
import requests
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
from PIL import Image
import io
import time

class ImagenGeneratorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="generate_images",
            description="Generates AI images for sustainability stories using Google Imagen"
        )
        
        # Initialize Vertex AI
        project_id = os.getenv('GCP_PROJECT_ID', 'praxis-granite-479510-s0')
        location = os.getenv('GCP_LOCATION', 'us-central1')
        
        try:
            vertexai.init(project=project_id, location=location)
            # Using Imagen 3.0 - highest quality model
            self.model_name = "imagen-3.0-generate-001"
            self.model = ImageGenerationModel.from_pretrained(self.model_name)
            print(f"  ✓ Imagen 3.0 (Premium) model initialized: {self.model_name}")
        except Exception as e:
            print(f"  ⚠️  Imagen initialization warning: {e}")
            self.model = None
            self.model_name = None
    
    def run(self, script: str, theme: str, num_images: int = 5) -> dict:
        """
        Generate AI images based on script and theme.
        
        Args:
            script: The story script to base images on
            theme: Sustainability theme (heat, water, air, sustainability)
            num_images: Number of images to generate (default: 5)
            
        Returns:
            Dictionary with list of image paths
        """
        
        try:
            print(f"  → Generating {num_images} AI images for {theme} theme...")
            
            # Create image prompts based on script segments
            prompts = self._create_image_prompts(script, theme, num_images)
            
            image_paths = []
            output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'video_assets')
            os.makedirs(output_dir, exist_ok=True)
            
            for i, prompt in enumerate(prompts):
                if not self.model:
                    raise Exception("Imagen model not initialized. Check GCP credentials and Vertex AI setup.")
                
                # Add delay after 2nd image (first 2 are quick, then rate limited)
                if i >= 2:
                    print(f"    ⏱️  Waiting 60s to respect API rate limits...")
                    time.sleep(60)
                
                # Generate with Imagen - premium quality with GCP credits
                print(f"    Generating image {i+1}/{num_images}...")
                print(f"    Prompt: {prompt[:80]}...")
                image_path = self._generate_with_imagen(prompt, output_dir, i)
                image_paths.append(image_path)
                print(f"    ✓ Image {i+1}/{num_images} generated")
            
            print(f"  ✓ Generated {len(image_paths)} images successfully")
            
            return {
                "image_paths": image_paths,
                "theme": theme,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"  ❌ Error in image generation: {e}")
            raise Exception(f"Image generation failed: {e}")
    
    def _create_image_prompts(self, script: str, theme: str, num_images: int) -> list:
        """Create image prompts based on script and theme."""
        
        # Base visual styles for each theme
        theme_styles = {
            "heat": "warm sunlight, golden hour, orange and red tones, summer heat effects",
            "water": "flowing water, rain droplets, blue and aqua tones, water conservation",
            "air": "clear sky, fresh air, light blue tones, environmental harmony",
            "sustainability": "lush greenery, nature thriving, earthy tones, eco-friendly"
        }
        
        base_style = theme_styles.get(theme, "nature, environmental awareness, hopeful atmosphere")
        
        # Create diverse prompts for 5 different scenes (3 seconds each = 15 second reel)
        prompts = [
            f"A beautiful cinematic scene showing {base_style}, community connection, hope for future, photorealistic, 9:16 vertical format, high quality",
            f"Environmental awareness visual with {base_style}, people caring for nature, peaceful atmosphere, photorealistic, 9:16 vertical format, high quality",
            f"Inspiring sustainability scene with {base_style}, positive environmental action, bright natural lighting, photorealistic, 9:16 vertical format, high quality",
            f"Close-up nature detail with {base_style}, environmental beauty, natural textures, photorealistic, 9:16 vertical format, high quality",
            f"Hopeful future vision with {base_style}, sustainable living, harmony between humans and nature, photorealistic, 9:16 vertical format, high quality"
        ]
        
        return prompts[:num_images]
    
    def _generate_with_imagen(self, prompt: str, output_dir: str, index: int) -> str:
        """Generate image using Google Imagen 3.0 - Premium Quality."""
        
        print(f"      Calling Imagen API (Premium Quality)...")
        
        # Generate image with best quality settings
        response = self.model.generate_images(
            prompt=prompt,
            number_of_images=1,
            aspect_ratio="9:16",
            safety_filter_level="block_some",
            person_generation="allow_adult"
        )
        
        print(f"      Imagen response received")
        print(f"      Response type: {type(response)}")
        print(f"      Has images attr: {hasattr(response, 'images')}")
        
        # Check if response has images
        if not hasattr(response, 'images') or not response.images:
            print(f"      ERROR: No images in response!")
            print(f"      Response: {response}")
            raise Exception("Imagen returned empty response - no images generated")
        
        print(f"      Number of images: {len(response.images)}")
        
        # Save image - response.images is a list
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"imagen_hq_{timestamp}_{index}.png"
        filepath = os.path.join(output_dir, filename)
        
        print(f"      Saving image to: {filepath}")
        response.images[0].save(filepath)
        print(f"      ✓ Saved successfully")
        
        return filepath
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
                
                # Wait after every 2 images (rate limit allows 2 per minute)
                # Image 0,1 -> quick | Wait 60s | Image 2,3 -> quick | Wait 60s | Image 4 -> quick
                if i > 0 and i % 2 == 0:
                    print(f"    ⏱️  Waiting 60s (rate limit: 2 images/minute)...")
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
        """Create diverse, realistic image prompts based on script and theme."""
        
        # Emotionally engaging, human-centered prompts that tell stories and inspire action
        theme_prompts = {
            "heat": [
                "Empty playground on a hot summer day with strong shadows, climate impact on childhood, 9:16 format",
                "Community members gathering under large tree for shade, people helping each other stay cool, 9:16 format",
                "Rooftop with solar panels at golden hour symbolizing hope, sustainable future, 9:16 format",
                "Contrast of withered plants and green irrigated garden, hope through action, 9:16 format",
                "Elderly person being offered water by neighbor, community care during heat wave, 9:16 format"
            ],
            "water": [
                "Hands cupped catching falling raindrops, precious water conservation moment, hope and gratitude, 9:16 format",
                "Community water tap with people cooperating, sharing vital resource, unity, 9:16 format",
                "Volunteers cleaning a river together, diverse group taking action for clean water, 9:16 format",
                "Empty water vessel beside full one, contrast showing water scarcity and abundance, 9:16 format",
                "Rainwater harvesting system with children learning, education for sustainable future, 9:16 format"
            ],
            "air": [
                "Contrast of hazy city skyline and clear blue sky, hope for cleaner air, 9:16 format",
                "Urban garden with lush green plants filtering air, nature healing the city, 9:16 format",
                "Person cycling instead of driving, individual action for clean air, 9:16 format",
                "Wind turbines against blue sky, renewable energy as solution, hopeful future, 9:16 format",
                "Indoor plants by window with sunlight, natural air purification at home, 9:16 format"
            ],
            "sustainability": [
                "Reusable shopping bags with fresh vegetables, individual sustainable choice, 9:16 format",
                "Hands planting a small tree sapling in soil, hope growing, future investment, 9:16 format",
                "Community members at compost bin, collective action for waste reduction, 9:16 format",
                "Crowded public transport showing people choosing sustainable travel, 9:16 format",
                "Building covered in green plants, harmony between nature and urban life, 9:16 format"
            ],
            "education": [
                "Young student reading book with focused expression, hope for future through learning, 9:16 format",
                "Diverse group of students collaborating on project, inclusive education, empowerment, 9:16 format",
                "Teacher helping student one-on-one, dedication to education, personal attention, 9:16 format",
                "Graduation cap thrown in air celebrating achievement, dreams realized through education, 9:16 format",
                "Rural school with enthusiastic students, access to education transforming lives, 9:16 format"
            ],
            "health": [
                "Healthcare worker showing compassion to patient, human connection in healing, 9:16 format",
                "Person practicing meditation in peaceful outdoor setting, mental wellness matters, 9:16 format",
                "Fresh fruits and vegetables being prepared, nutrition as preventive care, 9:16 format",
                "Mobile health clinic in underserved area, bringing care to communities, 9:16 format",
                "Support group circle with people connecting, mental health support, nobody alone, 9:16 format"
            ],
            "community": [
                "Neighbors helping carry groceries, acts of kindness strengthening community, 9:16 format",
                "Community garden with people of different ages working together, unity in diversity, 9:16 format",
                "Volunteers serving meals with care, community support in action, 9:16 format",
                "Cultural festival with diverse community celebrating together, belonging and connection, 9:16 format",
                "Playground with inclusive equipment, safe space for all children, community investment, 9:16 format"
            ]
        }
        
        # Get theme-specific prompts or use sustainability as default
        prompts = theme_prompts.get(theme, theme_prompts["sustainability"])
        
        return prompts[:num_images]
    
    def _generate_with_imagen(self, prompt: str, output_dir: str, index: int) -> str:
        """Generate image using Google Imagen 3.0 - Premium Quality."""
        
        print(f"      Calling Imagen API (Premium Quality)...")
        print(f"      DEBUG: Prompt length: {len(prompt)} chars")
        
        try:
            # Generate image with more permissive settings
            response = self.model.generate_images(
                prompt=prompt,
                number_of_images=1,
                aspect_ratio="9:16",
                safety_filter_level="block_few",  # More permissive
                person_generation="allow_all"      # Allow all person types
            )
            
            print(f"      Imagen response received")
            print(f"      Response type: {type(response)}")
            print(f"      Has images attr: {hasattr(response, 'images')}")
            
            # Check response details
            if hasattr(response, '__dict__'):
                print(f"      Response attributes: {list(response.__dict__.keys())}")
            
            # Check if response has images
            if not hasattr(response, 'images') or not response.images:
                print(f"      ⚠️  WARNING: No images in response!")
                print(f"      Response object: {response}")
                
                # Check if blocked by safety filters
                if hasattr(response, 'safety_attributes'):
                    print(f"      Safety attributes: {response.safety_attributes}")
                
                # Try with simpler prompt
                print(f"      🔄 Retrying with simplified prompt...")
                simple_prompt = "A beautiful natural landscape scene in 9:16 vertical format, photorealistic, high quality"
                response = self.model.generate_images(
                    prompt=simple_prompt,
                    number_of_images=1,
                    aspect_ratio="9:16",
                    safety_filter_level="block_few"
                )
                
                if not hasattr(response, 'images') or not response.images:
                    raise Exception("Imagen returned empty response - no images generated even with simplified prompt")
            
            print(f"      Number of images: {len(response.images)}")
            
            # Save image - response.images is a list
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"imagen_hq_{timestamp}_{index}.png"
            filepath = os.path.join(output_dir, filename)
            
            print(f"      Saving image to: {filepath}")
            response.images[0].save(filepath)
            print(f"      ✓ Saved successfully")
            
            return filepath
            
        except Exception as api_error:
            print(f"      ❌ API Error: {api_error}")
            print(f"      Error type: {type(api_error).__name__}")
            
            # If it's a safety filter or prompt issue, try generic fallback
            if "safety" in str(api_error).lower() or "empty response" in str(api_error).lower():
                print(f"      🔄 Attempting generic nature scene as fallback...")
                try:
                    fallback_prompt = "Beautiful natural landscape with clear sky, photorealistic image, 9:16 vertical format"
                    response = self.model.generate_images(
                        prompt=fallback_prompt,
                        number_of_images=1,
                        aspect_ratio="9:16"
                    )
                    
                    if response.images:
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        filename = f"imagen_fallback_{timestamp}_{index}.png"
                        filepath = os.path.join(output_dir, filename)
                        response.images[0].save(filepath)
                        print(f"      ✓ Fallback image saved")
                        return filepath
                except Exception as fallback_error:
                    print(f"      ❌ Fallback also failed: {fallback_error}")
            
            raise Exception(f"Image generation failed: {api_error}")
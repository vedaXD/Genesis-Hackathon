from google.adk.agents import Agent
from .imagen_generator_tool import ImagenGeneratorTool

class ImageGenerationAgent(Agent):
    def __init__(self):
        super().__init__(
            name="image_generation_agent",
            description="Generates AI images for sustainability stories using Imagen",
            tools=[ImagenGeneratorTool()]
        )

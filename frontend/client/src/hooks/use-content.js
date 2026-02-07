import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const BACKEND_API = "http://localhost:8000";

// Build a detailed personalized prompt for video generation
function buildPersonalizedPrompt(location, interests) {
  const { drink, walkingPlace, otherHabit } = interests;
  
  // Construct a rich, contextual prompt that helps the backend generate
  // a compelling sustainability story based on the user's daily habits
  let prompt = `Location: ${location}\n\n`;
  prompt += `Create a personalized sustainability awareness story for someone who:\n`;
  
  // Add drink-based context
  if (drink) {
    const drinkLower = drink.toLowerCase();
    if (drinkLower.includes('coffee')) {
      prompt += `- Drinks ${drink} daily - Show how climate change affects coffee production, the farmers who grow it, and what they can do to support sustainable coffee\n`;
    } else if (drinkLower.includes('tea')) {
      prompt += `- Drinks ${drink} daily - Explain how changing rainfall patterns impact tea cultivation and what sustainable choices they can make\n`;
    } else if (drinkLower.includes('water')) {
      prompt += `- Drinks ${drink} - Highlight water conservation importance, local water scarcity issues, and how every drop counts\n`;
    } else {
      prompt += `- Regularly consumes ${drink} - Connect this habit to sustainable production and environmental impact\n`;
    }
  }
  
  // Add walking place context
  if (walkingPlace) {
    const placeLower = walkingPlace.toLowerCase();
    if (placeLower.includes('park') || placeLower.includes('garden')) {
      prompt += `- Walks in ${walkingPlace} - Show how urban green spaces are affected by climate change, importance of tree cover, and biodiversity\n`;
    } else if (placeLower.includes('beach') || placeLower.includes('coast')) {
      prompt += `- Walks at ${walkingPlace} - Illustrate rising sea levels, coastal erosion, plastic pollution in oceans, and marine life impact\n`;
    } else if (placeLower.includes('street') || placeLower.includes('city') || placeLower.includes('road')) {
      prompt += `- Walks on ${walkingPlace} - Address urban heat islands, air quality, vehicle emissions, and benefits of walkable cities\n`;
    } else {
      prompt += `- Walks at ${walkingPlace} - Connect their walking routine to environmental awareness and sustainable transportation choices\n`;
    }
  }
  
  // Add other habit context
  if (otherHabit) {
    const habitLower = otherHabit.toLowerCase();
    if (habitLower.includes('cycl')) {
      prompt += `- Enjoys ${otherHabit} - Celebrate this eco-friendly choice and show broader impact of sustainable transportation\n`;
    } else if (habitLower.includes('garden')) {
      prompt += `- Practices ${otherHabit} - Highlight urban farming, local food production, and reducing carbon footprint\n`;
    } else if (habitLower.includes('recycl')) {
      prompt += `- Engaged in ${otherHabit} - Show the journey of recycled materials and importance of waste management\n`;
    } else {
      prompt += `- Has a habit of ${otherHabit} - Relate this to sustainable living and environmental consciousness\n`;
    }
  }
  
  prompt += `\nTone: Empathetic, personal, and action-oriented. Make it feel like this story was created specifically for them.`;
  prompt += `\nGoal: Help them understand how climate change and sustainability directly connects to THEIR daily life and habits. Inspire small actions they can take.`;
  
  return prompt;
}

// Fetch real videos from backend
const fetchVideosFromBackend = async () => {
  try {
    const response = await fetch(`${BACKEND_API}/api/videos`);
    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

const CONTENT_TYPES = ["video", "quiz"];

const generateMockContent = () => {
  const contents = [];

  // Pattern: 2 reels, then alternate between quiz and challenge
  const videoTopics = [
    {
      title: "Your Neighborhood in 2045",
      desc: "See how rising temperatures will change your daily walk",
      location: "Local Park",
    },
    {
      title: "Coffee Crisis Coming",
      desc: "Climate change threatens your morning coffee",
      location: "Coffee Belt",
    },
    {
      title: "Coastal Cities Rising Seas",
      desc: "Watch how sea levels impact coastal communities",
      location: "Mumbai Coast",
    },
    {
      title: "Vanishing Winters",
      desc: "How warmer winters affect your favorite season",
      location: "Delhi",
    },
    {
      title: "Heatwave Tomorrow",
      desc: "Experience the future of extreme heat days",
      location: "Your City",
    },
    {
      title: "Monsoon Disrupted",
      desc: "See how rainfall patterns are shifting",
      location: "Kerala",
    },
    {
      title: "Wildlife Migration",
      desc: "Birds and animals moving due to climate",
      location: "Local Forest",
    },
    {
      title: "Urban Heat Islands",
      desc: "Why cities are getting unbearably hot",
      location: "City Center",
    },
  ];

  const quizzes = [
    {
      title: "What is the greenhouse effect?",
      desc: "Test your sustainability knowledge",
      icon: "🌍",
      options: [
        { id: "a", text: "Trapping heat in atmosphere", emoji: "🔥" },
        { id: "b", text: "Growing plants indoors", emoji: "🌱" },
        { id: "c", text: "Solar panel energy", emoji: "☀️" },
        { id: "d", text: "Weather patterns", emoji: "🌧️" },
      ],
    },
    {
      title: "Which is renewable energy?",
      desc: "Choose the sustainable option",
      icon: "⚡",
      options: [
        { id: "a", text: "Coal Power", emoji: "⛏️" },
        { id: "b", text: "Wind Energy", emoji: "💨" },
        { id: "c", text: "Natural Gas", emoji: "🔥" },
        { id: "d", text: "Nuclear Energy", emoji: "⚛️" },
      ],
    },
    {
      title: "What does carbon footprint mean?",
      desc: "Understanding environmental impact",
      icon: "👣",
      options: [
        { id: "a", text: "Shoe size measurement", emoji: "👟" },
        { id: "b", text: "CO2 emissions produced", emoji: "💨" },
        { id: "c", text: "Forest area size", emoji: "🌳" },
        { id: "d", text: "Energy consumption", emoji: "⚡" },
      ],
    },
    {
      title: "Most effective way to reduce waste?",
      desc: "Pick the best sustainable practice",
      icon: "♻️",
      options: [
        { id: "a", text: "Reduce & Reuse", emoji: "🔄" },
        { id: "b", text: "Just Recycle", emoji: "♻️" },
        { id: "c", text: "Burn Trash", emoji: "🔥" },
        { id: "d", text: "Landfill Only", emoji: "🗑️" },
      ],
    },
    {
      title: "Which pollutes water most?",
      desc: "Identify the major threat",
      icon: "💧",
      options: [
        { id: "a", text: "Plastic Waste", emoji: "🥤" },
        { id: "b", text: "Fish Swimming", emoji: "🐟" },
        { id: "c", text: "Rainfall", emoji: "🌧️" },
        { id: "d", text: "Boat Traffic", emoji: "⛵" },
      ],
    },
    {
      title: "What is biodiversity?",
      desc: "Learn about ecosystem health",
      icon: "🦋",
      options: [
        { id: "a", text: "Variety of life forms", emoji: "🌺" },
        { id: "b", text: "Type of fuel", emoji: "⛽" },
        { id: "c", text: "Weather pattern", emoji: "🌤️" },
        { id: "d", text: "Soil quality", emoji: "🌱" },
      ],
    },
  ];

  const challenges = [
    {
      title: "Public Transport Champion",
      desc: "Upload your bus or train ticket to prove sustainable travel",
      icon: "🚆",
      points: 50,
      validationType: "ticket", // For Gemini validation
      instruction: "Take a clear photo of your bus/train ticket"
    },
    {
      title: "Water a Plant Challenge",
      desc: "Record a video of you watering a plant to support green life",
      icon: "🌱",
      points: 40,
      validationType: "plant_watering", // For Gemini validation
      instruction: "Show yourself watering a plant"
    },
    {
      title: "Zero Waste Day",
      desc: "Go one full day without generating any plastic waste",
      icon: "♻️",
      points: 50,
      validationType: "general"
    },
    {
      title: "Plant a Tree Challenge",
      desc: "Plant one tree and share your contribution to a greener planet",
      icon: "🌳",
      points: 100,
      validationType: "general"
    },
    {
      title: "Clean Local Park",
      desc: "Pick up litter from your neighborhood park for 1 hour",
      icon: "🧹",
      points: 75,
      validationType: "general"
    },
    {
      title: "Composting Starter",
      desc: "Start your own compost bin at home",
      icon: "🌱",
      points: 60,
      validationType: "general"
    },
  ];

  let interactiveCounter = 0;
  
  // Generate 18 items total (12 videos + 6 interactive)
  for (let videoIndex = 0; videoIndex < 12; videoIndex++) {
    const topic = videoTopics[videoIndex % videoTopics.length];

    // Add video
    contents.push({
      id: `video-${videoIndex}`,
      type: "video",
      title: topic.title,
      description: topic.desc,
      thumbnail: `https://picsum.photos/seed/climate${videoIndex}/1920/1080`,
      creator: "Arogya Setu",
      likes: Math.floor(Math.random() * 10000) + 1000,
      comments: Math.floor(Math.random() * 500) + 50,
      location: {
        name: topic.location,
        state: "Your Region",
      },
      category: ["climate-impact", "personal-story", "future-vision"][videoIndex % 3],
      year: 2025 + videoIndex * 5,
    });

    // Add quiz or challenge after every 2 videos
    if ((videoIndex + 1) % 2 === 0) {
      if (interactiveCounter % 2 === 0) {
        // Add quiz
        const quiz = quizzes[interactiveCounter % quizzes.length];
        contents.push({
          id: `quiz-${interactiveCounter}`,
          type: "quiz",
          ...quiz,
        });
      } else {
        // Add challenge
        const challenge = challenges[interactiveCounter % challenges.length];
        contents.push({
          id: `challenge-${interactiveCounter}`,
          type: "challenge",
          ...challenge,
        });
      }
      interactiveCounter++;
    }
  }


  return contents;
};

// Mix real videos with quiz and challenge content
const generateFeedContent = async () => {
  // Fetch real videos from backend
  const backendVideos = await fetchVideosFromBackend();

  // Quiz data for mixing
  const quizzes = [
    {
      title: "What is the greenhouse effect?",
      desc: "Test your sustainability knowledge",
      icon: "🌍",
      options: [
        { id: "a", text: "Trapping heat in atmosphere", emoji: "🔥" },
        { id: "b", text: "Growing plants indoors", emoji: "🌱" },
        { id: "c", text: "Solar panel energy", emoji: "☀️" },
        { id: "d", text: "Weather patterns", emoji: "🌧️" },
      ],
    },
    {
      title: "Which is renewable energy?",
      desc: "Choose the sustainable option",
      icon: "⚡",
      options: [
        { id: "a", text: "Coal Power", emoji: "⛏️" },
        { id: "b", text: "Wind Energy", emoji: "💨" },
        { id: "c", text: "Natural Gas", emoji: "🔥" },
        { id: "d", text: "Nuclear Energy", emoji: "⚛️" },
      ],
    },
    {
      title: "What does carbon footprint mean?",
      desc: "Understanding environmental impact",
      icon: "👣",
      options: [
        { id: "a", text: "Shoe size measurement", emoji: "👟" },
        { id: "b", text: "CO2 emissions produced", emoji: "💨" },
        { id: "c", text: "Forest area size", emoji: "🌳" },
        { id: "d", text: "Energy consumption", emoji: "⚡" },
      ],
    },
    {
      title: "Most effective way to reduce waste?",
      desc: "Pick the best sustainable practice",
      icon: "♻️",
      options: [
        { id: "a", text: "Reduce & Reuse", emoji: "🔄" },
        { id: "b", text: "Just Recycle", emoji: "♻️" },
        { id: "c", text: "Burn Trash", emoji: "🔥" },
        { id: "d", text: "Landfill Only", emoji: "🗑️" },
      ],
    },
  ];

  const challenges = [
    {
      title: "Public Transport Champion",
      desc: "Upload your bus or train ticket to prove sustainable travel",
      icon: "🚆",
      points: 50,
      validationType: "ticket",
      instruction: "Take a clear photo of your bus/train ticket"
    },
    {
      title: "Water a Plant Challenge",
      desc: "Record a video of you watering a plant to support green life",
      icon: "🌱",
      points: 40,
      validationType: "plant_watering",
      instruction: "Show yourself watering a plant"
    },
    {
      title: "Zero Waste Day",
      desc: "Go one full day without generating any plastic waste",
      icon: "♻️",
      points: 50,
      validationType: "general"
    },
    {
      title: "Plant a Tree Challenge",
      desc: "Plant one tree and share your contribution to a greener planet",
      icon: "🌳",
      points: 100,
      validationType: "general"
    },
    {
      title: "Clean Local Park",
      desc: "Pick up litter from your neighborhood park for 1 hour",
      icon: "🧹",
      points: 75,
      validationType: "general"
    },
    {
      title: "Energy Free Hour",
      desc: "Switch off all electronics for one hour during peak time",
      icon: "💡",
      points: 40,
      validationType: "general"
    },
  ];

  const contents = [];

  // If we have backend videos, use them; otherwise fall back to mock
  if (backendVideos.length > 0) {
    // Pattern: 2 videos, 1 quiz, 2 videos, 1 challenge (repeats)
    const pattern = ["video", "video", "quiz", "video", "video", "challenge"];
    let videoIndex = 0;
    let quizIndex = 0;
    let challengeIndex = 0;

    // Generate feed following the pattern
    for (let i = 0; i < Math.min(backendVideos.length * 2, 30); i++) {
      const itemType = pattern[i % pattern.length];

      if (itemType === "video" && videoIndex < backendVideos.length) {
        const video = backendVideos[videoIndex];
        contents.push({
          id: video.id,
          type: "video",
          title: video.title || "AI Generated Sustainability Story",
          description: "Empathetic story about environmental and social impact",
          videoUrl: `${BACKEND_API}${video.url}`,
          subtitleUrl: video.subtitle_url ? `${BACKEND_API}${video.subtitle_url}` : null,
          thumbnail: `https://picsum.photos/seed/${video.id}/1920/1080`,
          creator: "Arogya Sathi AI",
          likes: Math.floor(Math.random() * 5000) + 500,
          comments: Math.floor(Math.random() * 200) + 20,
          location: {
            name: "India",
            state: "Generated with Real Weather Data",
          },
          category: "ai-generated",
          year: new Date(video.created_at).getFullYear(),
        });
        videoIndex++;
      } else if (itemType === "quiz") {
        const quiz = quizzes[quizIndex % quizzes.length];
        contents.push({
          id: `quiz-${quizIndex}`,
          type: "quiz",
          ...quiz,
        });
        quizIndex++;
      } else if (itemType === "challenge") {
        const challenge = challenges[challengeIndex % challenges.length];
        contents.push({
          id: `challenge-${challengeIndex}`,
          type: "challenge",
          ...challenge,
        });
        challengeIndex++;
      }
    }
  } else {
    // Fallback to mock content if no backend videos
    console.log("No backend videos found, using mock content");
    return generateMockContent();
  }

  return contents;
};

export function useContent() {
  return useQuery({
    queryKey: ["content"],
    queryFn: generateFeedContent,
  });
}

export function useCreateContent() {
  return useMutation({
    mutationFn: async (newContent) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return newContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: async ({ contentId, answer }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, contentId, answer };
    },
  });
}

export function useSubmitChallenge() {
  return useMutation({
    mutationFn: async ({ contentId, image, points, validationType }) => {
      // If it's a special validation type, validate with Gemini
      if (validationType === 'ticket' || validationType === 'plant_watering') {
        try {
          const response = await fetch(`${BACKEND_API}/api/validate-challenge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: image,
              challengeType: validationType
            }),
          });

          if (!response.ok) {
            throw new Error('Validation failed');
          }

          const validation = await response.json();
          
          if (!validation.valid) {
            throw new Error(validation.message || 'Challenge validation failed. Please upload a valid image.');
          }
          
          return { 
            success: true, 
            contentId, 
            image, 
            points,
            validated: true,
            message: validation.message 
          };
        } catch (error) {
          throw new Error(error.message || 'Failed to validate challenge');
        }
      }
      
      // For general challenges, just accept
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, contentId, image, points, validated: false };
    },
  });
}

export function useRequestLocation() {
  return useMutation({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Get place name from OpenStreetMap
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                {
                  headers: {
                    'User-Agent': 'ArogyaSathi/1.0'
                  }
                }
              );
              
              if (response.ok) {
                const data = await response.json();
                const address = data.address || {};
                
                // Extract meaningful location name
                const placeName = address.city || 
                                address.town || 
                                address.village || 
                                address.county || 
                                address.state || 
                                'Unknown Location';
                
                const state = address.state || '';
                const country = address.country || '';
                
                resolve({
                  latitude: lat,
                  longitude: lng,
                  accuracy: position.coords.accuracy,
                  placeName: placeName,
                  state: state,
                  country: country,
                  fullAddress: data.display_name
                });
              } else {
                // Fallback if geocoding fails
                resolve({
                  latitude: lat,
                  longitude: lng,
                  accuracy: position.coords.accuracy,
                  placeName: `Location at ${lat.toFixed(2)}, ${lng.toFixed(2)}`
                });
              }
            } catch (error) {
              console.error('Geocoding error:', error);
              // Fallback to coordinates
              resolve({
                latitude: lat,
                longitude: lng,
                accuracy: position.coords.accuracy,
                placeName: `Location at ${lat.toFixed(2)}, ${lng.toFixed(2)}`
              });
            }
          },
          (error) => {
            reject(error);
          },
        );
      });
    },
  });
}

// Generate personalized video with user interests
export function useGeneratePersonalizedVideo() {
  return useMutation({
    mutationFn: async ({ location, interests }) => {
      try {
        // Use place name instead of coordinates
        const locationString = location.placeName || location;
        
        // Create detailed custom prompt from user interests and location
        // This prompt will be used by the backend to generate a personalized sustainability story
        const customPrompt = buildPersonalizedPrompt(locationString, interests);
        
        console.log('🎬 Generating personalized video with prompt:', customPrompt);
        console.log('📍 Location:', locationString);
        
        const response = await fetch(`${BACKEND_API}/api/generate-story`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: customPrompt,
            theme: 'Auto-Detect'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate personalized video');
        }

        const data = await response.json();
        
        // Store the video info in localStorage
        localStorage.setItem('personalizedVideo', JSON.stringify({
          generated: true,
          videoPath: data.video_path,
          timestamp: new Date().toISOString(),
          interests: interests,
          location: locationString
        }));
        
        return data;
      } catch (error) {
        console.error('Error generating personalized video:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate content query to refresh feed
      queryClient.invalidateQueries({ queryKey: ["content"] });
    }
  });
}

// Check if personalized video is ready
export function usePersonalizedVideo() {
  return useQuery({
    queryKey: ["personalizedVideo"],
    queryFn: async () => {
      const stored = localStorage.getItem('personalizedVideo');
      if (!stored) {
        return { ready: false, generating: false };
      }
      
      const videoData = JSON.parse(stored);
      
      // Check if video file exists on backend
      try {
        const videos = await fetchVideosFromBackend();
        const personalizedVideo = videos.find(v => 
          v.url === videoData.videoPath || 
          videoData.videoPath?.includes(v.filename)
        );
        
        if (personalizedVideo) {
          return {
            ready: true,
            generating: false,
            video: {
              id: 'personalized-video',
              type: 'video',
              title: '✨ Your Personalized Story',
              description: 'A sustainability story created just for you based on your daily habits',
              videoUrl: `${BACKEND_API}${personalizedVideo.url}`,
              subtitleUrl: personalizedVideo.subtitle_url ? `${BACKEND_API}${personalizedVideo.subtitle_url}` : null,
              thumbnail: `https://picsum.photos/seed/personalized/1920/1080`,
              creator: 'AI Personalized',
              likes: 0,
              comments: 0,
              location: {
                name: 'Your Location',
                state: 'Personalized',
              },
              category: 'personalized',
              year: new Date().getFullYear(),
              isPersonalized: true
            }
          };
        }
        
        // Video not ready yet, still generating
        return { ready: false, generating: true };
      } catch (error) {
        console.error('Error checking personalized video:', error);
        return { ready: false, generating: false };
      }
    },
    refetchInterval: (data) => {
      // Poll every 5 seconds if video is generating
      return data?.generating ? 5000 : false;
    },
  });
}

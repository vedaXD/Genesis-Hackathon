import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const BACKEND_API = "http://localhost:8000";

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
      title: "Plant a Tree Challenge",
      desc: "Plant one tree and share your contribution to a greener planet",
      icon: "🌳",
      points: 100,
    },
    {
      title: "Zero Waste Day",
      desc: "Go one full day without generating any plastic waste",
      icon: "♻️",
      points: 50,
    },
    {
      title: "Carpool to Work",
      desc: "Share a ride with colleagues and reduce carbon emissions",
      icon: "🚗",
      points: 30,
    },
    {
      title: "Clean Local Park",
      desc: "Pick up litter from your neighborhood park for 1 hour",
      icon: "🧹",
      points: 75,
    },
    {
      title: "Composting Starter",
      desc: "Start your own compost bin at home",
      icon: "🌱",
      points: 60,
    },
    {
      title: "Public Transport Champion",
      desc: "Use public transportation for a week straight",
      icon: "🚆",
      points: 40,
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
  ];

  // Challenge data for mixing
  const challenges = [
    {
      title: "Plant a Tree Challenge",
      desc: "Plant one tree and share your contribution to a greener planet",
      icon: "🌳",
      points: 100,
    },
    {
      title: "Zero Waste Day",
      desc: "Go one full day without generating any plastic waste",
      icon: "♻️",
      points: 50,
    },
    {
      title: "Carpool to Work",
      desc: "Share a ride with colleagues and reduce carbon emissions",
      icon: "🚗",
      points: 30,
    },
    {
      title: "Clean Local Park",
      desc: "Pick up litter from your neighborhood park for 1 hour",
      icon: "🧹",
      points: 75,
    },
    {
      title: "Composting Starter",
      desc: "Start your own compost bin at home",
      icon: "🌱",
      points: 60,
    },
    {
      title: "Public Transport Champion",
      desc: "Use public transportation for a week straight",
      icon: "🚆",
      points: 40,
    },
  ];

  const contents = [];

  // If we have backend videos, use them; otherwise fall back to mock
  if (backendVideos.length > 0) {
    let interactiveCounter = 0; // Counter for alternating quiz/challenge
    
    // Convert backend videos to feed format
    backendVideos.forEach((video, index) => {
      contents.push({
        id: video.id,
        type: "video",
        title: video.title || "AI Generated Sustainability Story",
        description: "Empathetic story about environmental and social impact",
        videoUrl: `${BACKEND_API}${video.url}`,
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

      // Add quiz OR challenge after every 2 videos (alternating)
      if ((index + 1) % 2 === 0 && index < backendVideos.length - 1) {
        if (interactiveCounter % 2 === 0) {
          // Add quiz
          const quiz = quizzes[interactiveCounter % quizzes.length];
          contents.push({
            id: `quiz-${index}`,
            type: "quiz",
            ...quiz,
          });
        } else {
          // Add challenge
          const challenge = challenges[interactiveCounter % challenges.length];
          contents.push({
            id: `challenge-${index}`,
            type: "challenge",
            ...challenge,
          });
        }
        interactiveCounter++;
      }
    });
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
    mutationFn: async ({ contentId, image, points }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, contentId, image, points };
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
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            reject(error);
          },
        );
      });
    },
  });
}

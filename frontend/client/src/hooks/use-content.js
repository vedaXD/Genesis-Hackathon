import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const CONTENT_TYPES = ['video', 'quiz'];

const generateMockContent = () => {
  const contents = [];
  
  // Pattern: 2 reels, 1 quiz, 2 reels, 1 challenge (repeats)
  const pattern = ['video', 'video', 'quiz', 'video', 'video', 'challenge'];
  
  for (let i = 0; i < 18; i++) {
    const type = pattern[i % pattern.length];
    
    if (type === 'video') {
      const topics = [
        { title: 'Your Neighborhood in 2045', desc: 'See how rising temperatures will change your daily walk', location: 'Local Park' },
        { title: 'Coffee Crisis Coming', desc: 'Climate change threatens your morning coffee', location: 'Coffee Belt' },
        { title: 'Coastal Cities Rising Seas', desc: 'Watch how sea levels impact coastal communities', location: 'Mumbai Coast' },
        { title: 'Vanishing Winters', desc: 'How warmer winters affect your favorite season', location: 'Delhi' },
        { title: 'Heatwave Tomorrow', desc: 'Experience the future of extreme heat days', location: 'Your City' },
        { title: 'Monsoon Disrupted', desc: 'See how rainfall patterns are shifting', location: 'Kerala' },
        { title: 'Wildlife Migration', desc: 'Birds and animals moving due to climate', location: 'Local Forest' },
        { title: 'Urban Heat Islands', desc: 'Why cities are getting unbearably hot', location: 'City Center' },
      ];
      const topic = topics[i % topics.length];
      
      contents.push({
        id: `video-${i}`,
        type: 'video',
        title: topic.title,
        description: topic.desc,
        thumbnail: `https://picsum.photos/seed/climate${i}/1920/1080`,
        creator: 'Arogya Setu',
        likes: Math.floor(Math.random() * 10000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        location: {
          name: topic.location,
          state: 'Your Region'
        },
        category: ['climate-impact', 'personal-story', 'future-vision'][i % 3],
        year: 2025 + (i * 5)
      });
    } else if (type === 'quiz') {
      const quizzes = [
        {
          title: 'What is the greenhouse effect?',
          desc: 'Test your sustainability knowledge',
          icon: '🌍',
          options: [
            { id: 'a', text: 'Trapping heat in atmosphere', emoji: '🔥' },
            { id: 'b', text: 'Growing plants indoors', emoji: '🌱' },
            { id: 'c', text: 'Solar panel energy', emoji: '☀️' },
            { id: 'd', text: 'Weather patterns', emoji: '🌧️' }
          ]
        },
        {
          title: 'Which is renewable energy?',
          desc: 'Choose the sustainable option',
          icon: '⚡',
          options: [
            { id: 'a', text: 'Coal Power', emoji: '⛏️' },
            { id: 'b', text: 'Wind Energy', emoji: '💨' },
            { id: 'c', text: 'Natural Gas', emoji: '🔥' },
            { id: 'd', text: 'Nuclear Energy', emoji: '⚛️' }
          ]
        },
        {
          title: 'What does carbon footprint mean?',
          desc: 'Understanding environmental impact',
          icon: '👣',
          options: [
            { id: 'a', text: 'Shoe size measurement', emoji: '👟' },
            { id: 'b', text: 'CO2 emissions produced', emoji: '💨' },
            { id: 'c', text: 'Forest area size', emoji: '🌳' },
            { id: 'd', text: 'Energy consumption', emoji: '⚡' }
          ]
        },
        {
          title: 'Most effective way to reduce waste?',
          desc: 'Pick the best sustainable practice',
          icon: '♻️',
          options: [
            { id: 'a', text: 'Reduce & Reuse', emoji: '🔄' },
            { id: 'b', text: 'Just Recycle', emoji: '♻️' },
            { id: 'c', text: 'Burn Trash', emoji: '🔥' },
            { id: 'd', text: 'Landfill Only', emoji: '🗑️' }
          ]
        },
        {
          title: 'Which pollutes water most?',
          desc: 'Identify the major threat',
          icon: '💧',
          options: [
            { id: 'a', text: 'Plastic Waste', emoji: '🥤' },
            { id: 'b', text: 'Fish Swimming', emoji: '🐟' },
            { id: 'c', text: 'Rainfall', emoji: '🌧️' },
            { id: 'd', text: 'Boat Traffic', emoji: '⛵' }
          ]
        },
        {
          title: 'What is biodiversity?',
          desc: 'Learn about ecosystem health',
          icon: '🦋',
          options: [
            { id: 'a', text: 'Variety of life forms', emoji: '🌺' },
            { id: 'b', text: 'Type of fuel', emoji: '⛽' },
            { id: 'c', text: 'Weather pattern', emoji: '🌤️' },
            { id: 'd', text: 'Soil quality', emoji: '🌱' }
          ]
        },
        {
          title: 'Why are forests important?',
          desc: 'Understanding ecosystem services',
          icon: '🌳',
          options: [
            { id: 'a', text: 'Absorb CO2 & produce O2', emoji: '💚' },
            { id: 'b', text: 'Just for wood', emoji: '🪵' },
            { id: 'c', text: 'Animal shelter only', emoji: '🦌' },
            { id: 'd', text: 'Decoration', emoji: '🎄' }
          ]
        },
        {
          title: 'What is composting?',
          desc: 'Sustainable waste management',
          icon: '🌱',
          options: [
            { id: 'a', text: 'Burning waste', emoji: '🔥' },
            { id: 'b', text: 'Organic waste to fertilizer', emoji: '🌿' },
            { id: 'c', text: 'Plastic recycling', emoji: '♻️' },
            { id: 'd', text: 'Water treatment', emoji: '💧' }
          ]
        }
      ];
      
      const quiz = quizzes[i % quizzes.length];
      contents.push({
        id: `quiz-${i}`,
        type: 'quiz',
        ...quiz
      });
    } else if (type === 'challenge') {
      const challenges = [
        {
          title: 'Plant a Tree Challenge',
          desc: 'Plant one tree and share your contribution to a greener planet',
          icon: '🌳',
          points: 100
        },
        {
          title: 'Zero Waste Day',
          desc: 'Go one full day without generating any plastic waste',
          icon: '♻️',
          points: 50
        },
        {
          title: 'Carpool to Work',
          desc: 'Share a ride with colleagues and reduce carbon emissions',
          icon: '🚗',
          points: 30
        },
        {
          title: 'Clean Local Park',
          desc: 'Pick up litter from your neighborhood park for 1 hour',
          icon: '🧹',
          points: 75
        },
        {
          title: 'Composting Starter',
          desc: 'Start your own compost bin at home',
          icon: '🌱',
          points: 60
        },
        {
          title: 'Energy Free Hour',
          desc: 'Switch off all electronics for one hour during peak time',
          icon: '💡',
          points: 40
        }
      ];
      
      const challenge = challenges[i % challenges.length];
      contents.push({
        id: `challenge-${i}`,
        type: 'challenge',
        ...challenge
      });
    }
  }
  
  return contents;
};

export function useContent() {
  return useQuery({
    queryKey: ["content"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockContent();
    },
  });
}

export function useCreateContent() {
  return useMutation({
    mutationFn: async (newContent) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, contentId, answer };
    },
  });
}

export function useSubmitChallenge() {
  return useMutation({
    mutationFn: async ({ contentId, image, points }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, contentId, image, points };
    },
  });
}

export function useRequestLocation() {
  return useMutation({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  });
}

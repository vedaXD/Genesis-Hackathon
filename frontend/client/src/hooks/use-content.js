import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const CONTENT_TYPES = ['video', 'quiz'];

const generateMockContent = () => {
  const contents = [];
  
  for (let i = 1; i <= 15; i++) {
    const type = CONTENT_TYPES[i % 2]; // Alternate between video and quiz
    
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
        creator: 'ClimateStories',
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
          title: 'How do you commute daily?',
          desc: 'Help us personalize your climate story',
          icon: '🚶',
          options: [
            { id: 'a', text: 'Walk or Bicycle', emoji: '🚴' },
            { id: 'b', text: 'Public Transport', emoji: '🚌' },
            { id: 'c', text: 'Personal Car', emoji: '🚗' },
            { id: 'd', text: 'Two-Wheeler', emoji: '🏍️' }
          ]
        },
        {
          title: 'What matters most to you?',
          desc: 'Tell us your climate concerns',
          icon: '❤️',
          options: [
            { id: 'a', text: 'Clean Air', emoji: '🌬️' },
            { id: 'b', text: 'Green Spaces', emoji: '🌳' },
            { id: 'c', text: 'Water Quality', emoji: '💧' },
            { id: 'd', text: 'Wildlife', emoji: '🦋' }
          ]
        },
        {
          title: 'Your home energy source?',
          desc: 'Understanding your carbon footprint',
          icon: '⚡',
          options: [
            { id: 'a', text: 'Solar Power', emoji: '☀️' },
            { id: 'b', text: 'Grid Electricity', emoji: '🔌' },
            { id: 'c', text: 'Mixed Sources', emoji: '⚡' },
            { id: 'd', text: 'Not Sure', emoji: '❓' }
          ]
        },
        {
          title: 'Favorite outdoor activity?',
          desc: 'What climate changes affect you most',
          icon: '🎯',
          options: [
            { id: 'a', text: 'Morning Walks', emoji: '🌅' },
            { id: 'b', text: 'Gardening', emoji: '🌱' },
            { id: 'c', text: 'Sports', emoji: '⚽' },
            { id: 'd', text: 'Photography', emoji: '📸' }
          ]
        },
        {
          title: 'Your climate concern level?',
          desc: 'Help us match your engagement',
          icon: '🌡️',
          options: [
            { id: 'a', text: 'Very Concerned', emoji: '😰' },
            { id: 'b', text: 'Moderately Worried', emoji: '😟' },
            { id: 'c', text: 'Curious', emoji: '🤔' },
            { id: 'd', text: 'Learning', emoji: '📚' }
          ]
        }
      ];
      
      const quiz = quizzes[i % quizzes.length];
      contents.push({
        id: `quiz-${i}`,
        type: 'quiz',
        ...quiz
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

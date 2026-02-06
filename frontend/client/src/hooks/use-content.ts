import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export interface ReelContent {
  id: number;
  interests: string[];
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  style: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  title: string;
  description: string;
  createdAt: string;
}

export function useReels() {
  return useQuery<ReelContent[]>({
    queryKey: ["reels"],
    queryFn: async () => {
      // Mock data for now
      return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        interests: ["heritage", "nature", "fitness"],
        location: { lat: 20.5937, lng: 78.9629, name: "India" },
        style: "cinematic",
        duration: "30",
        thumbnail: `https://picsum.photos/seed/${i}/600/800`,
        videoUrl: `https://picsum.photos/seed/${i}/600/800`,
        title: `Incredible India Reel ${i + 1}`,
        description: "Explore the beautiful landscapes of India",
        createdAt: new Date().toISOString(),
      }));
    },
  });
}

export function useCreateReel() {
  return useMutation({
    mutationFn: async (data: Partial<ReelContent>) => {
      // Mock API call
      return { ...data, id: Date.now() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    },
  });
}

export function useGenerateFirstReel() {
  return useMutation({
    mutationFn: async ({ location, interest }: { location: string; interest: string }) => {
      try {
        // Call the backend API to generate a real reel
        const response = await fetch("http://localhost:8000/api/generate-story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: location,
            theme: `Health & Wellness - ${interest}`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate reel");
        }

        const data = await response.json();

        // Transform the API response to ReelContent format
        const videoFilename = data.video_path ? data.video_path.split('/').pop() : null;
        
        return {
          id: Date.now(),
          interests: [interest, "health", "wellness"],
          location: { lat: 0, lng: 0, name: location },
          style: "cinematic",
          duration: "15",
          thumbnail: data.image_paths?.[0] || `https://picsum.photos/seed/${Date.now()}/600/800`,
          videoUrl: videoFilename ? `http://localhost:8000/api/video/${videoFilename}` : `https://picsum.photos/seed/${Date.now()}/600/800`,
          title: `Your ${interest} Journey in ${location}`,
          description: data.script_text?.substring(0, 100) || "Personalized wellness content for you",
          createdAt: new Date().toISOString(),
        } as ReelContent;
      } catch (error) {
        console.error("Error generating reel:", error);
        // Return a mock reel if API fails
        return {
          id: Date.now(),
          interests: [interest, "health"],
          location: { lat: 0, lng: 0, name: location },
          style: "cinematic",
          duration: "30",
          thumbnail: `https://picsum.photos/seed/${Date.now()}/600/800`,
          videoUrl: `https://picsum.photos/seed/${Date.now()}/600/800`,
          title: `${interest} in ${location}`,
          description: "Your personalized wellness journey starts here!",
          createdAt: new Date().toISOString(),
        } as ReelContent;
      }
    },
  });
}

export interface SubmitAnswerParams {
  contentId: string;
  answer: number | string;
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: async (params: SubmitAnswerParams) => {
      // Mock API call for submitting quiz/challenge answers
      console.log("Submitting answer:", params);
      return { success: true };
    },
  });
}

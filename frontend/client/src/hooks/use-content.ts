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
        interests: ["heritage", "nature"],
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

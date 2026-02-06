import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKey: ['reels'],
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

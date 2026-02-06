import { useState } from "react";
import { useReels } from "@/hooks/use-content";
import { ReelCard } from "@/components/feed/reel-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Loader2 } from "lucide-react";

function ReelItem({ item, isActive }: { item: any; isActive: boolean }) {
  return (
    <div className="h-screen w-full snap-start snap-always relative">
      <ReelCard reel={item} isActive={isActive} />
    </div>
  );
}

export default function FeedPage() {
  const { data: reels, isLoading } = useReels();
  const [activeId, setActiveId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold uppercase">Loading Reels...</h2>
        </div>
      </div>
    );
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-8">
        <h2 className="font-display text-4xl font-black mb-4 uppercase">No Reels Yet</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Create your first reel to get started!
        </p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {reels.map((item) => (
          <ReelItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
          />
        ))}
        <div className="h-16 w-full snap-start" />
      </div>
      <BottomNav />
    </div>
  );
}

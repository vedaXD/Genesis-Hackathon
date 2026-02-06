import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, Film, Heart } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 pb-20">
      <div className="container max-w-2xl mx-auto p-6">
        <div className="text-center pt-8 pb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-1">Reel Creator</h1>
          <p className="text-muted-foreground">@reel_creator</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Film className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Reels</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">1.2K</div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Places</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">About</h2>
            <p className="text-muted-foreground">
              Creating stunning reels showcasing the incredible diversity and beauty of India. 
              From heritage sites to natural wonders, capturing every moment.
            </p>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h2 className="font-bold text-xl mb-4">My Reels</h2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${i}/300/500`}
                  alt={`Reel ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

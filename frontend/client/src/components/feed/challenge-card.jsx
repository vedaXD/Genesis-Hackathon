import { useState, useRef, Fragment } from "react";
import { Upload, Camera, CheckCircle2, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ChallengeCard({ content, isActive, onComplete }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "FILE TOO LARGE",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        
        // Add points to user profile
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        const newPoints = currentPoints + content.points;
        localStorage.setItem('userPoints', newPoints.toString());
        
        if (onComplete) {
          onComplete(content.points);
        }
        
        toast({
          title: "CHALLENGE COMPLETED! 🎉",
          description: `You earned ${content.points} Points! (₹${content.points} discount value)`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`I completed the ${content.title} challenge and earned ${content.points} Points! Join me in making a difference 🌱`);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center overflow-hidden pt-20 pb-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl rotate-12">🌱</div>
        <div className="absolute bottom-32 right-20 text-5xl -rotate-12">🌍</div>
        <div className="absolute top-1/2 right-32 text-4xl rotate-45">💚</div>
        <div className="absolute bottom-1/3 left-28 text-5xl -rotate-6">🎯</div>
      </div>

      <div className="w-full max-w-md px-4 space-y-6 animate-slide-up relative z-10">
        {/* Challenge Icon */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-green-300 to-emerald-400 border-6 border-black p-8 shadow-brutal-xl transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="text-7xl">{content.icon}</div>
          </div>
        </div>

        {/* Challenge Title */}
        <div className="bg-white border-6 border-black p-6 shadow-brutal-xl transform rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Camera className="w-7 h-7" strokeWidth={3} />
            <h2 className="text-3xl font-black uppercase font-comic text-center">{content.title}</h2>
          </div>
          <p className="text-lg font-bold text-center text-gray-700 mb-2">{content.desc}</p>
          <div className="bg-yellow-200 border-4 border-black p-3 mt-4">
            <p className="text-base font-black text-center">🎯 {content.points} Points (₹{content.points} discount)</p>
          </div>
        </div>

        {/* Upload Area */}
        {!uploadedImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-6 border-dashed border-black bg-white p-12 text-center cursor-pointer hover:bg-gray-50 transition-all shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm"
          >
            <Upload className="w-16 h-16 mx-auto mb-4" strokeWidth={3} />
            <h3 className="text-xl font-black uppercase mb-2">Upload Your Proof</h3>
            <p className="text-sm font-bold text-gray-600">Click to upload image (max 5MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Uploaded Image */}
            <div className="relative border-6 border-black shadow-brutal-xl overflow-hidden">
              <img 
                src={uploadedImage} 
                alt="Challenge completed" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-400 border-4 border-black px-4 py-2 shadow-brutal flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                <span className="font-black">+{content.points} POINTS!</span>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-gradient-to-br from-green-300 to-emerald-300 border-6 border-black p-6 shadow-brutal-xl text-center">
              <h3 className="text-2xl font-black uppercase mb-4">Share Your Achievement!</h3>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full py-4 bg-white border-4 border-black font-black text-lg uppercase transition-all shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm flex items-center justify-center gap-2"
                >
                  <Share2 className="w-6 h-6" strokeWidth={3} />
                  Share on Social Media
                </button>

                {showShareMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-4 border-black shadow-brutal-xl p-3 flex flex-col gap-2 z-30">
                    <button 
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center gap-3 p-3 hover:bg-green-100 border-3 border-black font-bold"
                    >
                      <img src="https://static.vecteezy.com/system/resources/previews/016/716/480/non_2x/whatsapp-icon-free-png.png" alt="WhatsApp" className="w-6 h-6" />
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-3 p-3 hover:bg-blue-100 border-3 border-black font-bold"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/500px-Facebook_logo_%28square%29.png" alt="Facebook" className="w-6 h-6" />
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleShare("twitter")}
                      className="flex items-center gap-3 p-3 hover:bg-sky-100 border-3 border-black font-bold"
                    >
                      <img src="https://static.vecteezy.com/system/resources/thumbnails/018/930/695/small/twitter-logo-twitter-icon-transparent-free-free-png.png" alt="Twitter" className="w-6 h-6" />
                      Twitter
                    </button>
                    <button 
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-3 p-3 hover:bg-blue-100 border-3 border-black font-bold"
                    >
                      <img src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png" alt="LinkedIn" className="w-6 h-6" />
                      LinkedIn
                    </button>
                    <button 
                      onClick={() => handleShare('telegram')}
                      className="flex items-center gap-3 p-3 hover:bg-cyan-100 border-3 border-black font-bold"
                    >
                      <img src="https://static.vecteezy.com/system/resources/previews/023/986/562/non_2x/telegram-logo-telegram-logo-transparent-telegram-icon-transparent-free-free-png.png" alt="Telegram" className="w-6 h-6" />
                      Telegram
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Retake Photo */}
            <button
              onClick={() => {
                setUploadedImage(null);
                setShowShareMenu(false);
              }}
              className="w-full py-3 border-4 border-black bg-gray-200 font-bold uppercase hover:bg-gray-300 transition-colors"
            >
              Retake Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

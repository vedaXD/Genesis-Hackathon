import { Loader2, Sparkles } from "lucide-react";

export function LoadingCard() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">✨</div>
        <div className="absolute bottom-32 right-20 text-5xl animate-bounce" style={{animationDelay: '0.3s'}}>🎬</div>
        <div className="absolute top-1/2 right-32 text-4xl animate-bounce" style={{animationDelay: '0.6s'}}>🌟</div>
        <div className="absolute bottom-1/4 left-28 text-5xl animate-bounce" style={{animationDelay: '0.9s'}}>🎨</div>
      </div>

      <div className="w-full max-w-md px-4 space-y-8 text-center relative z-10">
        {/* Main loader */}
        <div className="bg-white border-8 border-black p-12 shadow-brutal-xl">
          <div className="relative">
            <Loader2 className="w-24 h-24 mx-auto animate-spin text-purple-600" strokeWidth={3} />
            <Sparkles className="w-8 h-8 absolute top-0 right-1/4 text-yellow-500 animate-pulse" />
            <Sparkles className="w-6 h-6 absolute bottom-0 left-1/4 text-pink-500 animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
        </div>

        {/* Message */}
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 border-6 border-black p-8 shadow-brutal-xl transform -rotate-1">
          <h2 className="text-4xl font-black uppercase font-comic mb-4">
            ✨ Creating Magic ✨
          </h2>
          <p className="text-xl font-bold text-gray-800 mb-6">
            Your personalized sustainability story is being crafted...
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-6 h-6 bg-green-500 border-3 border-black flex items-center justify-center">✓</div>
              <span>Analyzing your habits</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-6 h-6 bg-green-500 border-3 border-black flex items-center justify-center">✓</div>
              <span>Writing your story</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <div className="w-6 h-6 bg-yellow-300 border-3 border-black flex items-center justify-center animate-pulse">⏳</div>
              <span>Generating visuals & voice...</span>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3">
          <div className="w-4 h-4 bg-purple-500 border-3 border-black rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-pink-500 border-3 border-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-4 h-4 bg-yellow-500 border-3 border-black rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>

        <p className="text-sm font-bold text-gray-600 bg-white/80 border-4 border-black px-6 py-3 inline-block">
          This usually takes 30-60 seconds...
        </p>
      </div>
    </div>
  );
}

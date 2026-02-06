import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useSubmitAnswer } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";

export function QuizCard({ content, isActive }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const submitAnswer = useSubmitAnswer();
  const { toast } = useToast();

  const handleOptionSelect = (optionId) => {
    if (submitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      toast({
        title: "SELECT AN OPTION",
        description: "Please choose an answer first!",
        variant: "destructive",
      });
      return;
    }

    submitAnswer.mutate({
      contentId: content.id,
      answer: selectedOption,
    });

    setSubmitted(true);
    toast({
      title: "ANSWER SAVED! 🎉",
      description: "Building your climate profile...",
    });
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center p-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl rotate-12">✏️</div>
        <div className="absolute bottom-32 right-20 text-5xl -rotate-12">📊</div>
        <div className="absolute top-1/2 right-32 text-4xl rotate-45">🌱</div>
        <div className="absolute bottom-1/3 left-28 text-5xl -rotate-6">💭</div>
      </div>

      <div className="w-full max-w-3xl space-y-8 animate-slide-up relative z-10">
        {/* Quiz Icon */}
        <div className="text-center">
          <div className="inline-block bg-white border-8 border-black p-10 shadow-brutal-xl transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="text-9xl">{content.icon}</div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border-6 border-black p-8 shadow-brutal-xl transform rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" strokeWidth={3} />
            <h2 className="text-4xl font-black uppercase font-comic text-center">{content.title}</h2>
            <Sparkles className="w-8 h-8" strokeWidth={3} />
          </div>
          <p className="text-xl font-bold text-center text-gray-600">{content.desc}</p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6">
          {content.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={submitted}
              className={`relative p-8 border-6 border-black transition-all shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm active:translate-x-3 active:translate-y-3 active:shadow-none animate-bounce-in font-comic ${
                selectedOption === option.id
                  ? 'bg-gradient-to-br from-green-300 to-cyan-300 scale-105'
                  : 'bg-white hover:bg-gray-50'
              } ${submitted ? 'opacity-75 cursor-not-allowed' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transform: `rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`
              }}
            >
              <div className="text-6xl mb-4">{option.emoji}</div>
              <div className="text-lg font-black uppercase leading-tight">{option.text}</div>
              {selectedOption === option.id && !submitted && (
                <div className="absolute top-3 right-3 bg-green-400 border-4 border-black w-10 h-10 flex items-center justify-center shadow-brutal-sm">
                  <CheckCircle2 className="w-6 h-6" strokeWidth={4} />
                </div>
              )}
              {submitted && selectedOption === option.id && (
                <div className="absolute inset-0 bg-green-400/50 border-6 border-black flex items-center justify-center">
                  <div className="bg-white border-4 border-black px-4 py-2 shadow-brutal">
                    <CheckCircle2 className="w-12 h-12" strokeWidth={4} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`w-full py-8 border-8 border-black font-black text-3xl uppercase transition-all shadow-brutal-xl font-comic ${
              selectedOption
                ? 'bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 hover:translate-x-3 hover:translate-y-3 hover:shadow-brutal active:translate-x-4 active:translate-y-4 active:shadow-none'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {submitAnswer.isPending ? "Saving..." : "Submit Answer 🚀"}
          </button>
        )}

        {submitted && (
          <div className="bg-gradient-to-br from-green-300 to-cyan-300 border-8 border-black p-10 shadow-brutal-xl text-center animate-bounce-in transform -rotate-1">
            <div className="text-7xl mb-4">✅</div>
            <div className="text-3xl font-black uppercase font-comic mb-2">Answer Saved!</div>
            <div className="text-lg font-bold text-gray-800">
              Swipe up for your next personalized story
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

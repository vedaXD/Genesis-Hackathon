export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-accent">
      <div className="bg-white border-8 border-black p-12 shadow-brutal-xl text-center animate-bounce-in">
        <h1 className="text-8xl font-black mb-4 uppercase">404</h1>
        <div className="h-3 w-32 bg-black mx-auto mb-6"></div>
        <p className="text-2xl font-black uppercase mb-8">Page Not Found</p>
        <a 
          href="/" 
          className="inline-block px-8 py-4 bg-primary border-4 border-black font-black uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

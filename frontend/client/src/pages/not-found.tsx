export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
        Go Home
      </a>
    </div>
  );
}

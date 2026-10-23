
import { Link } from "react-router";

export default function FavoritosVazio() {
  return (
    <section 
      className="flex flex-col items-center justify-center text-center p-8 my-12 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100"
      role="status"
      aria-live="polite"
    >
      <div 
        className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4" 
        aria-hidden="true"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-8 h-8" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Você ainda não tem locais favoritos
      </h2>

      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        Ao encontrar um local acessível que você gosta, toque no coração para salvá-lo aqui e acessá-lo rapidamente depois.
      </p>

      <Link
        to="/locais"
        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
      >
        Explorar locais acessíveis
      </Link>
    </section>
  );
}
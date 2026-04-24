import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Leer query params
  const queryParams = new URLSearchParams(location.search);
  const client = queryParams.get("client");

  const isEdenred = client === "edenred";

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200">
      <nav className="flex justify-between items-center px-6 md:px-16 h-20">
        
        {/* Logo / Nombre */}
        <span className="text-xl md:text-3xl font-black tracking-tight font-display">
          <a href="/">Carlos 'Cha' Montoya</a>
        </span>

        {/* Logo dinámico */}
        <div className="flex items-center">
          {isEdenred && (
            <img
              src="/edenred-logo.svg"
              alt="Edenred"
              className="h-8 md:h-14 object-contain animate-fade"
            />
          )}
        </div>

      </nav>
    </header>
  );
}
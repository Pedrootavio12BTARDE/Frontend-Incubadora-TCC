import { Wifi, Moon, Sun } from "lucide-react";
import logoImg from "../../imports/logo_cerebro.png";

interface HeaderProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Header({ darkMode = false, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="px-4 pt-6 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <img src={logoImg} alt="Logo EcoIncubadora" className="w-14 h-14 object-contain drop-shadow-[0_0_25px_rgba(152,255,217,0.7)]" />
        <h1 className={`text-xl transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
          EcoIncubadora
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Toggle Dark Mode */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
              darkMode
                ? 'bg-[#98FFD9]/20 border-[#98FFD9]/40 hover:bg-[#98FFD9]/30'
                : 'bg-white/40 border-white/60 hover:bg-white/60'
            }`}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
            ) : (
              <Moon className="w-4 h-4 text-[#001F3F]" strokeWidth={2.5} />
            )}
          </button>
        )}

        {/* WiFi Status */}
        <div className={`flex items-center gap-1 backdrop-blur-md px-2.5 py-1.5 rounded-full border shadow-lg transition-all duration-300 ${
          darkMode
            ? 'bg-[#98FFD9]/10 border-[#98FFD9]/30'
            : 'bg-white/40 border-white/60'
        }`}>
          <Wifi className="w-4 h-4 text-[#98FFD9]" strokeWidth={2} />
          <div className="w-1.5 h-1.5 bg-[#98FFD9] rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
}
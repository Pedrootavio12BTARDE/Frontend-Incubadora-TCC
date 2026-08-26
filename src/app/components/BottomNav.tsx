import { Home, Leaf, BarChart3, ShoppingCart, Users, BookOpen, Gamepad2, LogIn } from "lucide-react";

interface BottomNavProps {
  currentScreen: "dashboard" | "fertilizer" | "reports" | "product" | "about" | "references" | "game" | "login";
  onNavigate: (screen: "dashboard" | "fertilizer" | "reports" | "product" | "about" | "references" | "game" | "login") => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_32px_rgba(0,31,63,0.1)]">
      <div className="flex items-center justify-around px-2 py-3">
        {/* Dashboard Button */}
        <button
          onClick={() => onNavigate("dashboard")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "dashboard" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "dashboard"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <Home
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "dashboard" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "dashboard" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Home
          </span>
        </button>

        {/* Login Button */}
        <button
          onClick={() => onNavigate("login")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "login" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "login"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <LogIn
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "login" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "login" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Login
          </span>
        </button>

        {/* Game Button */}
        <button
          onClick={() => onNavigate("game")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "game" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "game"
                ? "bg-gradient-to-br from-[#FFB499] to-[#FF8E53] shadow-[0_4px_16px_rgba(255,180,153,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <Gamepad2
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "game" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "game" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Jogo
          </span>
        </button>

        {/* Product Button */}
        <button
          onClick={() => onNavigate("product")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "product" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "product"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <ShoppingCart
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "product" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "product" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Produto
          </span>
        </button>

        {/* Reports Button */}
        <button
          onClick={() => onNavigate("reports")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "reports" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "reports"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <BarChart3
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "reports" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "reports" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Dados
          </span>
        </button>

        {/* About Button */}
        <button
          onClick={() => onNavigate("about")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "about" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "about"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <Users
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "about" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "about" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Equipe
          </span>
        </button>

        {/* References Button */}
        <button
          onClick={() => onNavigate("references")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "references" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "references"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <BookOpen
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "references" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "references" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Artigos
          </span>
        </button>

        {/* Fertilizer Button */}
        <button
          onClick={() => onNavigate("fertilizer")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentScreen === "fertilizer" ? "scale-110" : "opacity-60 hover:opacity-100"
          }`}
        >
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              currentScreen === "fertilizer"
                ? "bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_4px_16px_rgba(152,255,217,0.4)]"
                : "bg-gray-200"
            }`}
          >
            <Leaf
              className={`w-5 h-5 transition-all duration-300 ${
                currentScreen === "fertilizer" ? "text-white" : "text-gray-500"
              }`}
              strokeWidth={2.5}
            />
          </div>
          <span
            className={`text-[9px] transition-all duration-300 ${
              currentScreen === "fertilizer" ? "text-[#001F3F]" : "text-gray-500"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 600 }}
          >
            Adubo
          </span>
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { ProductionCard } from "./ProductionCard";
import { IncubationCard } from "./IncubationCard";
import { SustainabilityCard } from "./SustainabilityCard";
import { ActionButtons } from "./ActionButtons";
import { FertilizerScreen } from "./FertilizerScreen";
import { ReportsScreen } from "./ReportsScreen";
import { LandingScreen } from "./LandingScreen";
import { InstructionsScreen } from "./InstructionsScreen";
import { ProductScreen } from "./ProductScreen";
import { AboutScreen } from "./AboutScreen";
import { ReferencesScreen } from "./ReferencesScreen";
import { GameLandingScreen } from "./GameLandingScreen";
import { LoginScreen } from "./LoginScreen";
import {
  Home, Gamepad2, Package, BarChart3, Users, BookOpen, Leaf,
  Wifi, LogIn, Moon, Sun, Menu, X, ChevronRight,
} from "lucide-react";
import logoImg from "../../imports/logo_cerebro.png";

type Screen =
  | "landing" | "game" | "login" | "instructions" | "dashboard"
  | "fertilizer" | "reports" | "product" | "about" | "references";

const navItems: { id: Screen; label: string; Icon: typeof Home }[] = [
  { id: "dashboard",    label: "Dashboard",   Icon: Home },
  { id: "instructions", label: "Manual",       Icon: BookOpen },
  { id: "product",      label: "Produtos",     Icon: Package },
  { id: "about",        label: "Equipe",       Icon: Users },
  { id: "references",   label: "Referências",  Icon: BookOpen },
  { id: "reports",      label: "Relatórios",   Icon: BarChart3 },
  { id: "fertilizer",   label: "Adubo",        Icon: Leaf },
  { id: "game",         label: "Jogo",         Icon: Gamepad2 },
  { id: "login",        label: "Login",        Icon: LogIn },
];

export function DesktopApp() {
  const [eggCount, setEggCount]     = useState(245);
  const [lampOn, setLampOn]         = useState(false);
  const [darkMode, setDarkMode]     = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  // close drawer on navigation
  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setSidebarOpen(false);
  };

  // Keep body scroll locked when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const isLanding = currentScreen === "landing" || currentScreen === "login";
  const dm = darkMode;

  const bg = dm
    ? "bg-[#060e1c]"
    : "bg-gradient-to-br from-[#E8F9F5] via-[#F0F8FF] to-[#E0EFF5]";

  const sidebarBg = dm
    ? "bg-[#0a1628]/95 border-[#98FFD9]/10"
    : "bg-white/80 border-black/10";

  return (
    <div className={`w-full h-full flex flex-col transition-colors duration-500 ${bg}`}>

      {/* ── MOBILE TOP BAR (hidden on lg+) ── */}
      {!isLanding && (
        <header
          className={`lg:hidden z-50 flex items-center justify-between px-4 py-3 border-b shrink-0 ${
            dm ? "bg-[#0a1628]/90 border-[#98FFD9]/10 backdrop-blur-xl" : "bg-white/80 border-black/10 backdrop-blur-xl"
          }`}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className={`p-2 rounded-xl z-50 cursor-pointer ${dm ? "text-white hover:bg-white/10" : "text-[#001F3F] hover:bg-black/10"}`}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain" />
            <span
              className={`text-base font-black ${dm ? "text-white" : "text-[#001F3F]"}`}
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              EcoIncubadora
            </span>
          </div>

          <button
            onClick={() => setDarkMode(d => !d)}
            className={`p-2 rounded-xl ${dm ? "text-[#98FFD9] hover:bg-white/10" : "text-[#001F3F] hover:bg-black/10"}`}
          >
            {dm ? <Sun className="w-5 h-5" strokeWidth={2.5} /> : <Moon className="w-5 h-5" strokeWidth={2.5} />}
          </button>
        </header>
      )}

      {/* ── MAIN ROW ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR (desktop always visible, mobile drawer) ── */}
        {!isLanding && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar panel */}
            <aside
              className={`
                fixed lg:relative inset-y-0 left-0 z-40
                w-72 flex-shrink-0 flex flex-col
                border-r transition-all duration-300
                ${sidebarBg}
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              `}
            >
              <div className="flex flex-col h-full p-6 overflow-y-auto scrollbar-hide">

                {/* Close button (mobile only) */}
                <div className="flex items-center justify-between mb-8 lg:hidden">
                  <span className={`text-sm font-bold ${dm ? "text-white/60" : "text-[#001F3F]/60"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                    Menu
                  </span>
                  <button type="button" onClick={() => setSidebarOpen(false)} className={`p-2 rounded-xl ${dm ? "text-white hover:bg-white/10" : "text-[#001F3F] hover:bg-black/10"}`} aria-label="Fechar menu">
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Logo */}
                <div className="hidden lg:flex items-center gap-3 mb-10">
                  <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(152,255,217,0.5)]" />
                  <div>
                    <h1 className={`text-xl font-black leading-tight ${dm ? "text-white" : "text-[#001F3F]"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                      EcoIncubadora
                    </h1>
                    <p className={`text-xs font-semibold ${dm ? "text-[#98FFD9]" : "text-[#001F3F]/60"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                      Sistema IoT
                    </p>
                  </div>
                </div>

                {/* Nav items */}
                <nav className="flex-1 space-y-1">
                  {navItems.map(({ id, label, Icon }) => {
                    const active = currentScreen === id;
                    return (
                      <button
                        key={id}
                        onClick={() => navigate(id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-2xl
                          transition-all duration-300 group text-left
                          ${active
                            ? "bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] shadow-[0_6px_20px_rgba(152,255,217,0.4)] scale-[1.01]"
                            : dm
                            ? "text-white/60 hover:bg-white/8 hover:text-white"
                            : "text-[#001F3F]/60 hover:bg-[#98FFD9]/15 hover:text-[#001F3F]"
                          }
                        `}
                      >
                        <div className={`p-2 rounded-xl shrink-0 transition-colors ${active ? "bg-white/25" : dm ? "bg-white/5" : "bg-[#001F3F]/5"}`}>
                          <Icon className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold flex-1" style={{ fontFamily: "Quicksand, sans-serif" }}>
                          {label}
                        </span>
                        {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </nav>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setDarkMode(d => !d)}
                  className={`mt-6 w-full p-3.5 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 ${
                    dm
                      ? "border-[#98FFD9]/20 bg-[#98FFD9]/5 hover:bg-[#98FFD9]/10"
                      : "border-[#001F3F]/15 bg-[#001F3F]/5 hover:bg-[#001F3F]/10"
                  }`}
                >
                  {dm
                    ? <><Sun className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} /><span className="text-white text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Modo Claro</span></>
                    : <><Moon className="w-4 h-4 text-[#001F3F]" strokeWidth={2.5} /><span className="text-[#001F3F] text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Modo Escuro</span></>
                  }
                </button>

                {/* WiFi status */}
                <div className={`mt-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  dm ? "bg-[#98FFD9]/8 border-[#98FFD9]/25" : "bg-[#98FFD9]/15 border-[#98FFD9]/40"
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="relative">
                      <Wifi className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#98FFD9] animate-pulse" />
                    </div>
                    <p className={`text-sm font-extrabold ${dm ? "text-white" : "text-[#001F3F]"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                      ESP32 Conectado
                    </p>
                  </div>
                  <p className={`text-xs ${dm ? "text-white/50" : "text-[#001F3F]/60"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                    Wi-Fi · Sinal Excelente 92%
                  </p>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {currentScreen === "landing" ? (
            <LandingScreen
              onGetStarted={() => navigate("instructions")}
              onGameAccess={() => navigate("game")}
              darkMode={dm}
              onToggleDarkMode={() => setDarkMode(d => !d)}
            />

          ) : currentScreen === "login" ? (
            <LoginScreen
              darkMode={dm}
              isDesktop={true}
              onBack={() => navigate("dashboard")}
              onToggleDarkMode={() => setDarkMode(d => !d)}
            />

          ) : currentScreen === "instructions" ? (
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
              <InstructionsScreen onSupport={() => navigate("dashboard")} onBack={() => navigate("landing")} />
            </div>

          ) : currentScreen === "game" ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <GameLandingScreen darkMode={dm} isDesktop={true} />
            </div>

          ) : currentScreen === "product" ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <ProductScreen darkMode={dm} isDesktop={true} />
            </div>

          ) : currentScreen === "about" ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <AboutScreen darkMode={dm} isDesktop={true} />
            </div>

          ) : currentScreen === "references" ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <ReferencesScreen darkMode={dm} isDesktop={true} />
            </div>

          ) : currentScreen === "fertilizer" ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <div className="mb-6">
                <h2 className={`text-3xl font-black mb-1 ${dm ? "text-white" : "text-[#001F3F]"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Gestão de Adubo Orgânico
                </h2>
                <p className={`text-sm ${dm ? "text-white/50" : "text-[#001F3F]/50"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Monitoramento do coletor de resíduos
                </p>
              </div>
              <FertilizerScreen darkMode={dm} isDesktop={true} />
            </div>

          ) : currentScreen === "reports" ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <div className="mb-6">
                <h2 className={`text-3xl font-black mb-1 ${dm ? "text-white" : "text-[#001F3F]"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Análise de Dados IoT
                </h2>
                <p className={`text-sm ${dm ? "text-white/50" : "text-[#001F3F]/50"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Relatórios e estatísticas da EcoIncubadora
                </p>
              </div>
              <ReportsScreen darkMode={dm} isDesktop={true} instanceId="main" />
            </div>

          ) : (
            /* Dashboard */
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <div className="mb-8">
                <h2 className={`text-3xl font-black mb-1 ${dm ? "text-white" : "text-[#001F3F]"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Painel de Controle
                </h2>
                <p className={`text-sm ${dm ? "text-white/50" : "text-[#001F3F]/50"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Monitoramento em tempo real dos systems
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                <ProductionCard
                  eggCount={eggCount}
                  lastColor="Marrom"
                  onIncrement={() => setEggCount(n => n + 1)}
                  darkMode={dm}
                />
                <IncubationCard
                  temperature={37.8}
                  humidity={60}
                  lampOn={lampOn}
                  onToggleLamp={() => setLampOn(l => !l)}
                  darkMode={dm}
                />
                <div className="md:col-span-2 xl:col-span-1">
                  <SustainabilityCard level={75} darkMode={dm} />
                </div>
              </div>

              <ActionButtons
                onNavigateToReports={() => navigate("reports")}
                darkMode={dm}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
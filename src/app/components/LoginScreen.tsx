import { useState } from "react";
import { Mail, Lock, Wifi, Activity, Thermometer, Droplets, Home, Moon, Sun } from "lucide-react";
import logoImg from "../../imports/logo_cerebro.png";

interface LoginScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
  onBack?: () => void;
  onToggleDarkMode?: () => void;
}

export function LoginScreen({ darkMode = false, isDesktop = false, onBack, onToggleDarkMode }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignUp ? "Sign Up" : "Login", { email, password });
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden overflow-y-auto relative">
      {/* LEFT COLUMN - Login Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#000C1A] to-[#001F3F] flex flex-col px-6 pt-6 pb-10 lg:p-16 lg:justify-center">
        {/* Top bar: Home + Dark mode icons */}
        <div className="flex items-center justify-between mb-8">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 transition-all duration-300"
            >
              <Home className="w-5 h-5 text-[#98FFD9]" strokeWidth={2.5} />
            </button>
          ) : <div />}

          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 transition-all duration-300"
            >
              {darkMode
                ? <Sun className="w-5 h-5 text-[#98FFD9]" strokeWidth={2.5} />
                : <Moon className="w-5 h-5 text-[#98FFD9]" strokeWidth={2.5} />}
            </button>
          )}
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Logo Section */}
          <div className="mb-8 flex items-center gap-4">
            <img
              src={logoImg}
              alt="EcoIncubadora Logo"
              className="w-20 h-20 object-contain drop-shadow-[0_0_25px_rgba(152,255,217,0.6)]"
            />
            <div>
              <h1
                className="text-3xl leading-tight text-white"
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: 900,
                }}
              >
                EcoIncubadora
              </h1>
              <p
                className="text-[#98FFD9] text-sm"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                Sistema IoT Inteligente
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] shadow-[0_4px_20px_rgba(152,255,217,0.4)]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
            >
              LOGIN
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                isSignUp
                  ? 'bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] shadow-[0_4px_20px_rgba(152,255,217,0.4)]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
            >
              SIGN UP
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className="block text-white/80 text-sm mb-2"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98FFD9]">
                  <Mail className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-white/10 border-2 border-white/20 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#98FFD9] focus:bg-white/15 transition-all duration-300"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-white/80 text-sm mb-2"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98FFD9]">
                  <Lock className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border-2 border-white/20 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#98FFD9] focus:bg-white/15 transition-all duration-300"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label
                  className="block text-white/80 text-sm mb-2"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98FFD9]">
                    <Lock className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/10 border-2 border-white/20 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#98FFD9] focus:bg-white/15 transition-all duration-300"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg text-[#001F3F] text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 mt-8 bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] hover:from-[#6EDDC4] hover:to-[#98FFD9] shadow-[0_8px_24px_rgba(152,255,217,0.4)]"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
            >
              {isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
            </button>
          </form>

          {/* Footer Text */}
          {!isSignUp && (
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-[#98FFD9] text-sm hover:text-[#6EDDC4] transition-colors"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                Esqueceu sua senha?
              </a>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN - IoT Dashboard Preview */}
      <div className={`hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden p-16 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-[#0a0e1a] to-[#000C1A]'
          : 'bg-gradient-to-br from-[#E8F9F5] via-[#F0F8FF] to-[#E0EFF5]'
      }`}>
        {/* Grid Pattern Background */}
        <div className={`absolute inset-0 ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} style={{
          backgroundImage: darkMode
            ? `linear-gradient(#98FFD9 1px, transparent 1px), linear-gradient(90deg, #98FFD9 1px, transparent 1px)`
            : `linear-gradient(#001F3F 1px, transparent 1px), linear-gradient(90deg, #001F3F 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />

        {/* Floating Accent Circles */}
        <div className={`absolute top-20 right-20 w-32 h-32 rounded-full blur-3xl ${
          darkMode ? 'bg-[#98FFD9]/10' : 'bg-[#98FFD9]/20'
        }`} />
        <div className={`absolute bottom-20 left-20 w-40 h-40 rounded-full blur-3xl ${
          darkMode ? 'bg-[#6EDDC4]/10' : 'bg-[#6EDDC4]/20'
        }`} />

        {/* IoT Dashboard Preview Cards */}
        <div className="relative z-10 space-y-6 w-full max-w-md">
          {/* Welcome Card */}
          <div className={`backdrop-blur-xl rounded-2xl border-2 p-8 transition-colors duration-300 ${
            darkMode
              ? 'bg-white/5 border-[#98FFD9]/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
              : 'bg-white/80 border-[#98FFD9]/30 shadow-[0_20px_60px_rgba(0,31,63,0.15)]'
          }`}>
            <h2
              className={`text-3xl mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
            >
              Bem-vindo de volta!
            </h2>
            <p
              className={`text-base transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F]/70'}`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              Acesse seu painel de monitoramento IoT
            </p>
          </div>

          {/* Stats Preview Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature Card */}
            <div className={`backdrop-blur-xl rounded-xl border p-5 shadow-lg transition-colors duration-300 ${
              darkMode
                ? 'bg-white/5 border-[#98FFD9]/10'
                : 'bg-white/60 border-[#98FFD9]/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-[#98FFD9]/10' : 'bg-[#98FFD9]/20'
                }`}>
                  <Thermometer className={`w-4 h-4 ${darkMode ? 'text-[#98FFD9]' : 'text-[#001F3F]'}`} strokeWidth={2.5} />
                </div>
                <p className={`text-xs uppercase tracking-wider transition-colors duration-300 ${
                  darkMode ? 'text-white/70' : 'text-[#001F3F]/70'
                }`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                  Temp
                </p>
              </div>
              <p className={`text-2xl font-mono font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-[#001F3F]'
              }`}>37.5°C</p>
            </div>

            {/* Humidity Card */}
            <div className={`backdrop-blur-xl rounded-xl border p-5 shadow-lg transition-colors duration-300 ${
              darkMode
                ? 'bg-white/5 border-[#98FFD9]/10'
                : 'bg-white/60 border-[#98FFD9]/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-[#98FFD9]/10' : 'bg-[#98FFD9]/20'
                }`}>
                  <Droplets className={`w-4 h-4 ${darkMode ? 'text-[#98FFD9]' : 'text-[#001F3F]'}`} strokeWidth={2.5} />
                </div>
                <p className={`text-xs uppercase tracking-wider transition-colors duration-300 ${
                  darkMode ? 'text-white/70' : 'text-[#001F3F]/70'
                }`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                  Umidade
                </p>
              </div>
              <p className={`text-2xl font-mono font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-[#001F3F]'
              }`}>65%</p>
            </div>
          </div>

          {/* WiFi Status Card */}
          <div className={`backdrop-blur-xl rounded-xl border-2 p-5 shadow-lg transition-colors duration-300 ${
            darkMode
              ? 'bg-gradient-to-r from-[#98FFD9]/10 to-[#6EDDC4]/10 border-[#98FFD9]/30'
              : 'bg-gradient-to-r from-[#98FFD9]/20 to-[#6EDDC4]/20 border-[#98FFD9]/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Wifi className={`w-6 h-6 ${darkMode ? 'text-[#98FFD9]' : 'text-[#001F3F]'}`} strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#98FFD9] animate-pulse shadow-[0_0_10px_rgba(152,255,217,0.8)]" />
              </div>
              <div>
                <p className={`text-base transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-[#001F3F]'
                }`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}>
                  ESP32 Conectado
                </p>
                <p className={`text-xs transition-colors duration-300 ${
                  darkMode ? 'text-white/70' : 'text-[#001F3F]/70'
                }`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                  Sistema Online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <p
            className={`text-sm text-center transition-colors duration-300 ${
              darkMode ? 'text-white/60' : 'text-[#001F3F]/60'
            }`}
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
          >
            Monitoramento em Tempo Real • Controle Total
          </p>
        </div>
      </div>
    </div>
  );
}

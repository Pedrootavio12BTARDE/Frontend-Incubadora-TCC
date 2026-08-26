import { Mail, Lock, ArrowRight, Home } from "lucide-react";
import { useState } from "react";
import logoImg from "../../imports/logo_cerebro.png";

interface MobileLoginScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
  onBack?: () => void;
}

export function MobileLoginScreen({ darkMode = false, isDesktop = false, onBack }: MobileLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000C1A] to-[#001F3F] p-6 ${isDesktop ? 'py-20' : ''} relative`}>
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 transition-all duration-300 group"
        >
          <Home className="w-5 h-5 text-[#98FFD9] group-hover:text-white transition-colors" strokeWidth={2.5} />
        </button>
      )}

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(#98FFD9 1px, transparent 1px), linear-gradient(90deg, #98FFD9 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Login Card Container */}
      <div className={`relative w-full ${isDesktop ? 'max-w-md' : 'max-w-sm'}`}>
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#98FFD9] via-[#6EDDC4] to-[#98FFD9] rounded-3xl blur-2xl opacity-20" />

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-[#000C1A]/95 to-[#001F3F]/95 backdrop-blur-xl rounded-3xl border-2 border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#98FFD9] via-[#6EDDC4] to-[#98FFD9]" />

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Logo and Title Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img
                  src={logoImg}
                  alt="EcoIncubadora Logo"
                  className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(152,255,217,0.6)]"
                />
              </div>
              <div>
                <h1
                  className="text-2xl leading-tight text-white"
                  style={{
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: 900,
                  }}
                >
                  EcoIncubadora
                </h1>
                <p
                  className="text-[#98FFD9] text-sm mt-1"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Manage your IoT device
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  className="block text-white/70 text-xs uppercase tracking-wider"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
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
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#98FFD9] focus:bg-white/10 transition-all duration-300"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  className="block text-white/70 text-xs uppercase tracking-wider"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
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
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#98FFD9] focus:bg-white/10 transition-all duration-300"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-[#98FFD9] text-xs hover:text-[#6EDDC4] transition-colors"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] hover:from-[#6EDDC4] hover:to-[#98FFD9] text-[#001F3F] py-4 rounded-lg shadow-[0_8px_24px_rgba(152,255,217,0.4)] hover:shadow-[0_12px_32px_rgba(152,255,217,0.5)] transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span
                  className="text-base uppercase tracking-wider"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
                >
                  ENTER
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </button>
            </form>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-white/50 text-sm" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
                Don't have an account?{' '}
                <a
                  href="#"
                  className="text-[#98FFD9] hover:text-[#6EDDC4] font-bold transition-colors"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="px-8 pb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#98FFD9] shadow-[0_0_10px_rgba(152,255,217,0.8)] animate-pulse" />
              <p
                className="text-[#98FFD9] text-xs uppercase tracking-wider"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
              >
                IoT System Online
              </p>
            </div>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-8 text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#98FFD9]/20 to-[#6EDDC4]/20 blur-lg rounded-full" />
            <p
              className="relative text-[#98FFD9] text-xs backdrop-blur-sm bg-white/5 px-5 py-2 rounded-full border border-white/10"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              Powered by IoT Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

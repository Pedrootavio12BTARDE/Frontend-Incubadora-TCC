import { Play, Info, Key } from "lucide-react";
import finnImg from "../../imports/image-3.png";
import logoImg from "../../imports/image-4.png";

interface MarketingLandingScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function MarketingLandingScreen({ darkMode = false, isDesktop = false }: MarketingLandingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#0f0520] relative overflow-hidden">
      {/* Pixel Art Stars Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* Purple Moon - Top Right */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-24 right-24 w-32 h-32 bg-purple-300 rounded-full shadow-[0_0_100px_rgba(192,132,252,0.6)]" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Left - Logo & Links */}
            <div className="flex items-center gap-12">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="Logo"
                  className="h-10 object-contain drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]"
                />
                <span
                  className="text-white text-lg hidden sm:block"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
                >
                  EcoIncubadora
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#"
                  className="text-white text-base hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  Início
                </a>
                <a
                  href="#"
                  className="text-white/70 text-base hover:text-white transition-colors"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  Gráficos
                </a>
                <a
                  href="#"
                  className="text-white/70 text-base hover:text-white transition-colors"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  Histórico
                </a>
              </div>
            </div>

            {/* Right - CTA Button */}
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-[0_4px_20px_rgba(168,85,247,0.4)] transition-all duration-300 flex items-center gap-2">
              <Key className="w-5 h-5" strokeWidth={2.5} />
              <span
                className="text-base"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
              >
                Cadastrar Chave
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT COLUMN - Content */}
          <div className="space-y-8">
            {/* Title */}
            <h1
              className="text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              HORA DE AVENTURA:
              <br />
              A INCUBADORA AUTOMÁTICA
            </h1>

            {/* Description */}
            <p
              className="text-purple-200 text-xl leading-relaxed max-w-xl"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              Sistema IoT inteligente para monitoramento e controle automatizado de incubadoras.
              Controle temperatura, umidade e rolagem de ovos em tempo real com tecnologia ESP32.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              {/* Primary Orange Button */}
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl shadow-[0_8px_24px_rgba(251,146,60,0.4)] hover:shadow-[0_12px_32px_rgba(251,146,60,0.5)] transition-all duration-300 flex items-center gap-3 group">
                <Play className="w-6 h-6 fill-white" strokeWidth={0} />
                <span
                  className="text-lg"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
                >
                  Começar Agora
                </span>
              </button>

              {/* Secondary Outlined Purple Button */}
              <button className="bg-transparent border-2 border-purple-400 hover:bg-purple-400/10 text-purple-300 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3">
                <Info className="w-6 h-6" strokeWidth={2.5} />
                <span
                  className="text-lg"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
                >
                  Saiba Mais
                </span>
              </button>
            </div>

            {/* Stats/Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <p
                  className="text-4xl text-orange-400 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}
                >
                  24/7
                </p>
                <p
                  className="text-purple-300 text-sm"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Monitoramento
                </p>
              </div>
              <div className="text-center">
                <p
                  className="text-4xl text-purple-400 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}
                >
                  IoT
                </p>
                <p
                  className="text-purple-300 text-sm"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Tecnologia
                </p>
              </div>
              <div className="text-center">
                <p
                  className="text-4xl text-pink-400 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}
                >
                  100%
                </p>
                <p
                  className="text-purple-300 text-sm"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Automático
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Finn Character & Scene */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-12 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-60 animate-pulse" />

              {/* Character Container */}
              <div className="relative bg-gradient-to-br from-purple-900/60 to-purple-950/60 backdrop-blur-sm rounded-3xl border-4 border-purple-400/40 p-16 shadow-[0_20px_80px_rgba(168,85,247,0.6)]">
                <img
                  src={finnImg}
                  alt="Finn - Mascot"
                  className="w-80 h-80 object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.9)] hover:scale-105 transition-transform"
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Badge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-bold border-3 border-white shadow-xl flex items-center gap-2">
                  <span>⚔️</span>
                  <span style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}>HERÓI DA TECNOLOGIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-12">
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-purple-400 text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                ESP32 WiFi
              </p>
              <p className="text-white text-base" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                Conectividade
              </p>
            </div>
            <div>
              <p className="text-purple-400 text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                Sensores DHT22
              </p>
              <p className="text-white text-base" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                Alta Precisão
              </p>
            </div>
            <div>
              <p className="text-purple-400 text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                Dashboard Web
              </p>
              <p className="text-white text-base" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                Interface Moderna
              </p>
            </div>
            <div>
              <p className="text-purple-400 text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                Código Aberto
              </p>
              <p className="text-white text-base" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                Open Source
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

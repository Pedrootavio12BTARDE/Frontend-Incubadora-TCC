import { Play, Thermometer, Droplets, Zap, Shield, Sword, Info } from "lucide-react";
import finnImg from "../../imports/image-3.png";
import logoImg from "../../imports/image-4.png";
import bubblegumImg from "../../imports/image-5.png";
import enemyImg from "../../imports/image-6.png";

interface GameLandingScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function GameLandingScreen({ darkMode = false, isDesktop = false }: GameLandingScreenProps) {
  return (
    <div className="min-h-full overflow-y-auto scrollbar-hide bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#0f0520] relative">
      {/* Pixel Art Stars Background - Seamless */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />


      {/* Main Container - 2 Column Grid */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-8">

        {/* Logo at Top */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/30 to-purple-500/30 blur-xl rounded-2xl" />
          </div>
        </div>

        {/* 2-Column Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT COLUMN - Text & Controls */}
          <div className="space-y-6">
            {/* Main Title - Centralized */}
            <div className="mb-6 text-center">
              <h1
                className="text-2xl sm:text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 mb-3"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}
              >
                HORA DE AVENTURA:
                <br />
                <span className="text-xl sm:text-3xl">A INCUBADORA AUTOMÁTICA</span>
              </h1>
              <p
                className="text-purple-300 text-base mt-4"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                Sistema IoT de Monitoramento em Tempo Real
              </p>
            </div>

            {/* Glassmorphism Control Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30" />

              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl border-2 border-white/20 shadow-[0_15px_60px_rgba(168,85,247,0.3)] overflow-hidden">
                {/* Top Accent Bar */}
                <div className="h-1.5 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500" />

                {/* Card Content */}
                <div className="p-6">
                  {/* Stats Grid - Temperature & Humidity */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {/* Temperature */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-40" />
                      <div className="relative bg-gradient-to-br from-orange-950/80 to-red-950/80 backdrop-blur-xl rounded-xl border border-orange-500/40 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-7 h-7 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/50 shrink-0">
                            <Thermometer className="w-3.5 h-3.5 text-orange-400" strokeWidth={2.5} />
                          </div>
                          <p className="text-orange-300 text-[9px] uppercase tracking-wider" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                            Temperatura
                          </p>
                        </div>
                        <div className="text-2xl text-orange-400 font-mono font-bold tracking-tight drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">
                          37.8°C
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                          <p className="text-orange-300/70 text-[10px]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                            Estável
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-40" />
                      <div className="relative bg-gradient-to-br from-blue-950/80 to-cyan-950/80 backdrop-blur-xl rounded-xl border border-blue-500/40 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 shrink-0">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" strokeWidth={2.5} />
                          </div>
                          <p className="text-blue-300 text-[9px] uppercase tracking-wider" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                            Umidade
                          </p>
                        </div>
                        <div className="text-2xl text-blue-400 font-mono font-bold tracking-tight drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]">
                          62%
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                          <p className="text-blue-300/70 text-[10px]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                            Ideal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pixel Art Buttons - Side by Side Horizontal */}
                  <div className="flex items-center gap-3">
                    {/* Orange Play Button */}
                    <button className="flex-1 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-200" />
                      <div className="relative px-6 py-3 flex items-center justify-center gap-2">
                        <Play className="w-5 h-5 text-white fill-white" strokeWidth={0} />
                        <span className="text-white text-sm uppercase tracking-wide" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}>
                          Jogar
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-700" />
                    </button>

                    {/* Purple Info Button */}
                    <button className="flex-1 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-200" />
                      <div className="relative px-6 py-3 flex items-center justify-center gap-2">
                        <Info className="w-5 h-5 text-white" strokeWidth={2.5} />
                        <span className="text-white text-sm uppercase tracking-wide" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}>
                          Info
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-700" />
                    </button>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" strokeWidth={2.5} />
                    <p className="text-purple-300 text-xs uppercase tracking-wider" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                      Sistema Online
                    </p>
                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div className="relative mt-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl rounded-xl" />
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-xl border border-white/10 p-5">
                <h2
                  className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 900 }}
                >
                  📖 A Missão
                </h2>
                <p
                  className="text-purple-200 text-sm leading-relaxed"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  No Reino Doce, a tecnologia de incubação automática da Princesa Jujuba está sob ataque!
                  Finn precisa da sua ajuda para derrotar predadores mutantes e proteger o sistema IoT! ⚡🐔
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Finn Character */}
          <div className="flex flex-col items-center justify-start space-y-6">
            {/* Finn Hero */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-900/90 to-purple-950/90 rounded-2xl border-2 border-purple-400/50 p-5 sm:p-8 backdrop-blur-sm shadow-[0_15px_40px_rgba(168,85,247,0.4)]">
                <img
                  src={finnImg}
                  alt="Finn - O Herói"
                  className="w-32 h-32 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] hover:scale-105 transition-transform"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-1.5 rounded-full text-xs font-bold border-2 border-white shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  ⚔️ HERÓI FINN
                </div>
              </div>
            </div>

            {/* Supporting Characters */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Princess Bubblegum */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-lg rounded-full" />
                <div className="relative bg-gradient-to-br from-pink-950/60 to-purple-950/60 backdrop-blur-xl rounded-xl border-2 border-pink-500/40 p-3">
                  <img
                    src={bubblegumImg}
                    alt="Princess Bubblegum"
                    className="h-16 object-contain opacity-90 hover:opacity-100 transition-opacity"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/50 shadow-lg whitespace-nowrap">
                    PB LABS
                  </div>
                </div>
              </div>

              {/* Enemy */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-lg rounded-full" />
                <div className="relative bg-gradient-to-br from-red-950/60 to-orange-950/60 backdrop-blur-xl rounded-xl border-2 border-red-500/40 p-3">
                  <img
                    src={enemyImg}
                    alt="Inimigo Mutante"
                    className="h-16 object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/50 shadow-lg whitespace-nowrap">
                    INIMIGO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg rounded-full" />
            <p
              className="relative text-purple-400 text-xs backdrop-blur-sm bg-white/5 px-5 py-2 rounded-full border border-white/10"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
            >
              🎮 Desenvolvido com GDevelop • Powered by IoT Technology 🔧
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

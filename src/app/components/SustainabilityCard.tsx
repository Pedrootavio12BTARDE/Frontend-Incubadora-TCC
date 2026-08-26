import { Leaf } from "lucide-react";

interface SustainabilityCardProps {
  level: number; // 0-100
  darkMode?: boolean;
}

export function SustainabilityCard({ level, darkMode = false }: SustainabilityCardProps) {
  return (
    <div>
      <h2 className={`text-base mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
        Sustentabilidade
      </h2>
      <div className={`relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-4 overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
          : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
      }`}>
        {/* Efeito de brilho */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/20 to-transparent rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-2.5 rounded-xl shadow-lg">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#001F3F]" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
              Nível do Coletor de Adubo
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Barra de progresso com gradiente orgânico */}
          <div className="relative w-full h-6 bg-gradient-to-r from-gray-100/80 to-gray-50/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/40 shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#98FFD9] via-[#6EDDC4] to-[#44A6A0] transition-all duration-500 rounded-full shadow-[0_0_20px_rgba(152,255,217,0.5)]"
              style={{ width: `${level}%` }}
            >
              {/* Efeito de brilho na barra */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/30 to-transparent" />
            </div>
          </div>

          {/* Porcentagem com efeito glow */}
          <div className="mt-2 flex items-center justify-between">
            <div className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-60'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Capacidade
            </div>
            <div
              className="text-xl bg-gradient-to-br from-[#98FFD9] to-[#44A6A0] bg-clip-text text-transparent"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 800,
                filter: 'drop-shadow(0 0 8px rgba(152,255,217,0.3))'
              }}
            >
              {level}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
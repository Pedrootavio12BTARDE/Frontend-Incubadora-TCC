import { Leaf, Zap, Award, ArrowUpRight } from "lucide-react";

interface SustainabilityCardProps {
  level?: number; // 0-100 (nível do coletor de adubo)
  energySavings?: number; // % economia (ex: 70)
  hatchRate?: number; // % eclosão (ex: 91)
  darkMode?: boolean;
  onNavigate?: () => void;
}

export function SustainabilityCard({
  level = 75,
  energySavings = 70,
  hatchRate = 91,
  darkMode = false,
  onNavigate,
}: SustainabilityCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2
          className={`text-base transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
        >
          Sustentabilidade
        </h2>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="text-[11px] font-bold text-[#98FFD9] hover:underline flex items-center gap-0.5 transition-all cursor-pointer"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Ver mais <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div
        onClick={onNavigate}
        className={`relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-4 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
          onNavigate ? "cursor-pointer hover:scale-[1.01]" : ""
        } ${
          darkMode
            ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
            : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
        }`}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* 2 Métricas em Destaque: Economia ESP32 e Eco-Eclosão */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {/* Economia de Energia pelo Relé ESP32 */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
          }`}>
            <div className="p-2 rounded-lg bg-amber-400/20 text-amber-400 shrink-0">
              <Zap className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <div
                className="text-base font-black text-amber-400 leading-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                -{energySavings}%
              </div>
              <div className={`text-[10px] font-bold ${darkMode ? 'text-white/70' : 'text-[#001F3F]/70'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Energia ESP32
              </div>
            </div>
          </div>

          {/* Taxa de Eco-Eclosão */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
          }`}>
            <div className="p-2 rounded-lg bg-[#98FFD9]/20 text-[#98FFD9] shrink-0">
              <Award className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <div
                className="text-base font-black text-[#98FFD9] leading-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {hatchRate}%
              </div>
              <div className={`text-[10px] font-bold ${darkMode ? 'text-white/70' : 'text-[#001F3F]/70'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Eco-Eclosão
              </div>
            </div>
          </div>
        </div>

        {/* Coletor de Adubo com Barra de Progresso */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Coletor de Adubo
              </span>
            </div>
            <span
              className="text-sm font-black text-[#98FFD9]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {level}%
            </span>
          </div>

          <div className="relative w-full h-2.5 bg-gradient-to-r from-gray-100/80 to-gray-50/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/40 shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#98FFD9] via-[#6EDDC4] to-[#44A6A0] transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(152,255,217,0.5)]"
              style={{ width: `${level}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

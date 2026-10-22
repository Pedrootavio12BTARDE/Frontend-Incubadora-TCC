import { Leaf, ArrowRight, Sparkles } from "lucide-react";

interface SustainabilityCardProps {
  level?: number;
  darkMode?: boolean;
  onNavigate?: () => void;
}

export function SustainabilityCard({
  darkMode = false,
  onNavigate,
}: SustainabilityCardProps) {
  return (
    <div>
      <h2
        className={`text-base mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
        style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
      >
        Sustentabilidade
      </h2>

      <div
        onClick={onNavigate}
        className={`relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-4 sm:p-5 overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:scale-[1.01] border ${
          darkMode
            ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border-[#98FFD9]/20 hover:border-[#98FFD9]/45'
            : 'bg-gradient-to-br from-white/70 to-white/40 border-white/70 hover:border-[#98FFD9]/60 shadow-sm'
        }`}
      >
        {/* Glow decorativo de fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#98FFD9]/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#44A6A0]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Topo do Card: Ícone e Título */}
        <div className="relative flex items-center gap-3.5 mb-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#98FFD9] to-[#44A6A0] text-[#001F3F] shadow-lg shadow-[#98FFD9]/20 group-hover:rotate-6 transition-transform duration-300 shrink-0">
            <Leaf className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#98FFD9] mb-0.5" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Eco-Eficiência IoT</span>
            </div>
            <h3
              className={`text-base sm:text-lg font-black leading-tight truncate ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Gestão Ecológica
            </h3>
          </div>
        </div>

        {/* Destaques Rápidos em Pílulas: Energia, Adubo e Eclosão */}
        <div className="relative grid grid-cols-3 gap-2 mb-3.5">
          <div className={`p-2 rounded-xl text-center border transition-all ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
          }`}>
            <span className={`block text-[10px] font-bold ${darkMode ? 'text-white/60' : 'text-[#001F3F]/60'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Energia
            </span>
            <span className="text-xs font-black text-amber-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              -70%
            </span>
          </div>

          <div className={`p-2 rounded-xl text-center border transition-all ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
          }`}>
            <span className={`block text-[10px] font-bold ${darkMode ? 'text-white/60' : 'text-[#001F3F]/60'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Adubo
            </span>
            <span className="text-xs font-black text-[#98FFD9]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Orgânico
            </span>
          </div>

          <div className={`p-2 rounded-xl text-center border transition-all ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
          }`}>
            <span className={`block text-[10px] font-bold ${darkMode ? 'text-white/60' : 'text-[#001F3F]/60'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Eclosão
            </span>
            <span className="text-xs font-black text-emerald-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              91%
            </span>
          </div>
        </div>

        {/* Botão de Ação: Veja Mais */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.();
          }}
          className="relative w-full bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] py-2.5 px-4 rounded-xl font-bold text-xs shadow-[0_4px_16px_rgba(152,255,217,0.3)] hover:shadow-[0_6px_20px_rgba(152,255,217,0.5)] transition-all flex items-center justify-center gap-1.5 group-hover:scale-[1.02] cursor-pointer"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          <span>Veja mais</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

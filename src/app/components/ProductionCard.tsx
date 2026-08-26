import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EggIcon } from "./EggIcon";
import chickenImg from "../../imports/94cb2e17-3d83-4613-8389-8fa6d9ca8e98-removebg-preview-5.png";

interface ProductionCardProps {
  eggCount: number;
  lastColor: string;
  onIncrement: () => void;
  darkMode?: boolean;
}

export function ProductionCard({ eggCount, lastColor, onIncrement, darkMode = false }: ProductionCardProps) {
  return (
    <div>
      <h2 className={`text-base mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
        Produção
      </h2>
      <div className={`relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-4 overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
          : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
      }`}>
        {/* Efeito de brilho sutil */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#001F3F]/5 to-transparent rounded-full blur-2xl" />

        <div className="relative flex items-center justify-between gap-3">
          {/* Ilustração da galinha */}
          <div className="flex-shrink-0">
            <ImageWithFallback src={chickenImg} alt="Galinha" className="w-[100px] h-[100px] object-contain" />
          </div>

          {/* Contador de ovos */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
              <button
                onClick={onIncrement}
                className="p-2 bg-gradient-to-br from-[#98FFD9]/30 to-[#98FFD9]/20 rounded-xl hover:from-[#98FFD9]/40 hover:to-[#98FFD9]/30 transition-all duration-300 hover:scale-110 active:scale-95 border border-[#98FFD9]/40"
                title="Clicar para adicionar ovo"
              >
                <EggIcon size={24} variant="brown" />
              </button>
              <div
                className="text-5xl bg-gradient-to-br from-[#001F3F] to-[#003366] bg-clip-text text-transparent transition-all duration-500"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 900,
                  filter: 'drop-shadow(0 0 12px rgba(152,255,217,0.3))'
                }}
              >
                {eggCount}
              </div>
            </div>
            <div className={`text-xs mb-2 transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-60'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
              ovos coletados
            </div>
            <div className="bg-gradient-to-r from-[#98FFD9]/30 to-[#98FFD9]/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#98FFD9]/40">
              <span className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                🟤 Última: <span style={{ fontWeight: 600 }}>{lastColor}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
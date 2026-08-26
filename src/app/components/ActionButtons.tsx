import { RotateCw, FileText } from "lucide-react";

interface ActionButtonsProps {
  onNavigateToReports: () => void;
  darkMode?: boolean;
}

export function ActionButtons({ onNavigateToReports, darkMode = false }: ActionButtonsProps) {
  return (
    <div className="pt-2 space-y-2.5">
      <button className="relative w-full bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] py-3.5 rounded-[1.25rem] shadow-[0_8px_24px_rgba(152,255,217,0.4)] hover:shadow-[0_12px_32px_rgba(152,255,217,0.5)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group border border-white/40">
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/0 to-white/20 group-hover:via-white/20 transition-all duration-300" />
        <div className="absolute -right-8 top-0 w-16 h-full bg-white/30 rotate-12 group-hover:right-full transition-all duration-700" />

        <RotateCw className="relative w-4 h-4" strokeWidth={2.5} />
        <span className="relative text-sm" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
          Ativar Rolagem
        </span>
      </button>

      <button
        onClick={onNavigateToReports}
        className={`relative w-full backdrop-blur-xl border-2 border-[#98FFD9]/60 py-3.5 rounded-[1.25rem] hover:bg-gradient-to-r hover:from-[#98FFD9]/20 hover:to-[#6EDDC4]/20 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group shadow-[0_4px_16px_rgba(152,255,217,0.15)] ${
          darkMode ? 'bg-[#1a1f35]/60 text-white' : 'bg-white/60 text-[#001F3F]'
        }`}
      >
        {/* Efeito de brilho no hover */}
        <div className="absolute -right-8 top-0 w-16 h-full bg-gradient-to-r from-transparent to-[#98FFD9]/20 rotate-12 group-hover:right-full transition-all duration-700" />

        <FileText className="relative w-4 h-4" strokeWidth={2.5} />
        <span className="relative text-sm" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
          Ver Relatórios
        </span>
      </button>
    </div>
  );
}
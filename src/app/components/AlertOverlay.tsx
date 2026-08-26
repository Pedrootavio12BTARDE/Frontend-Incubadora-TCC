import { AlertTriangle, X } from "lucide-react";

interface AlertOverlayProps {
  show: boolean;
  onClose: () => void;
}

export function AlertOverlay({ show, onClose }: AlertOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Alert Card */}
      <div className="relative bg-gradient-to-br from-red-500/95 to-red-600/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(239,68,68,0.6)] border border-red-400/60 p-6 max-w-sm w-full animate-in zoom-in-95 duration-500">
        {/* Efeito de brilho */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
        >
          <X className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        <div className="relative flex flex-col items-center text-center">
          {/* Icon */}
          <div className="bg-white/20 p-4 rounded-2xl mb-4 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h3
            className="text-white text-xl mb-2"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
          >
            ALERTA
          </h3>

          {/* Message */}
          <p
            className="text-white/90 text-base mb-4"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
          >
            Temperatura Elevada (39.2°C)
          </p>

          {/* Action */}
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/40">
            <span
              className="text-white text-sm"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              🔄 Ativando Resfriamento
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Zap, Wifi, Scan, Thermometer, RotateCw, HelpCircle, ArrowLeft, Video } from "lucide-react";

interface InstructionsScreenProps {
  onSupport?: () => void;
  onBack?: () => void;
  darkMode?: boolean;
}

export function InstructionsScreen({ onSupport, onBack, darkMode = false }: InstructionsScreenProps) {
  // Add the published video URL here when the demonstration is available.
  const tutorialVideoSrc: string | null = null;
  const steps = [
    {
      number: 1,
      icon: Zap,
      title: "Alimentação e conexão",
      description: "Ligue a alimentação do ESP32 e dos atuadores conforme a montagem do protótipo. O painel ficará verde quando receber o heartbeat da placa; sem comunicação, indicará que nenhum ESP32 está conectado.",
      color: "#FFB499",
    },
    {
      number: 2,
      icon: Wifi,
      title: "Posicionamento dos sensores",
      description: "Posicione o DHT11 e o sensor de umidade do solo corretamente no leito. A leitura do sensor de solo depende da calibração para as condições seco e úmido configuradas no firmware.",
      color: "#98FFD9",
    },
    {
      number: 3,
      icon: Scan,
      title: "Monitoramento em tempo real",
      description: "Acompanhe temperatura e umidade na dashboard. As leituras são enviadas periodicamente pelo ESP32 e atualizadas na aplicação.",
      color: "#6EDDC4",
    },
    {
      number: 4,
      icon: Thermometer,
      title: "Controle da lâmpada",
      description: "Use o controle da lâmpada na dashboard para ligar ou desligar o relé de aquecimento. A temperatura é monitorada, mas a lâmpada não é acionada automaticamente por uma meta de temperatura nesta versão.",
      color: "#FF6B6B",
    },
    {
      number: 5,
      icon: RotateCw,
      title: "Movimentação da esteira",
      description: "Ative o modo automático na dashboard para programar uma rolagem a cada 4 horas. O botão manual continua disponível; cada rotação dura 1,5 s por padrão e alterna o sentido. Após um acionamento manual, a próxima rolagem automática ocorre 4 horas depois.",
      color: "#98FFD9",
    },
    {
      number: 6,
      icon: HelpCircle,
      title: "Acompanhamento e suporte",
      description: "Consulte os gráficos da dashboard para acompanhar as leituras. Para dúvidas, sugestões ou reclamações, acesse Fale Conosco na página Equipe.",
      color: "#6EDDC4",
    },
  ];

  return (
    <div className="px-4 space-y-5 pb-6">
      <div className="pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl border transition-all duration-300 group w-fit ${
              darkMode
                ? "bg-white/10 border-[#98FFD9]/30 text-white hover:bg-white/20"
                : "bg-gradient-to-r from-[#001F3F]/10 to-[#98FFD9]/10 border-[#98FFD9]/40 hover:from-[#98FFD9]/20 text-[#001F3F]"
            }`}
            style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700 }}
          >
            <div className="p-2 rounded-xl bg-[#98FFD9]/15 group-hover:bg-[#98FFD9]/30 transition-colors">
              <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-0.5 transition-transform ${darkMode ? "text-[#98FFD9]" : "text-[#001F3F]"}`} strokeWidth={2.5} />
            </div>
            <span className="text-base">Voltar ao início</span>
          </button>
        )}
        <div className="text-center">
          <h1
            className={`text-2xl mb-2 font-extrabold ${darkMode ? "text-white" : "bg-gradient-to-br from-[#000C1A] to-[#001F3F] bg-clip-text text-transparent"}`}
            style={{ fontFamily: "Quicksand, sans-serif" }}
          >
            Manual de Operação
          </h1>
          <p className={`text-sm ${darkMode ? "text-slate-300" : "text-[#001F3F] opacity-70"}`} style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 500 }}>
            Orientações para operar e acompanhar o protótipo
          </p>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-[#000C1A]/90 to-[#001F3F]/85 backdrop-blur-2xl rounded-[2rem] overflow-hidden border-2 border-[#98FFD9]/40 shadow-[0_0_30px_rgba(152,255,217,0.3)]" style={{ aspectRatio: "16/9" }}>
        {tutorialVideoSrc ? (
          <video className="absolute inset-0 w-full h-full object-cover" controls playsInline preload="metadata" aria-label="Vídeo demonstrativo da EcoIncubadora">
            <source src={tutorialVideoSrc} />
            Seu navegador não oferece suporte à reprodução de vídeo.
          </video>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#98FFD9]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#6EDDC4]/15 rounded-full blur-2xl" />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "linear-gradient(#98FFD9 1px, transparent 1px), linear-gradient(90deg, #98FFD9 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative h-full flex flex-col items-center justify-center gap-4 px-4 text-center">
              <div className="rounded-full border border-[#98FFD9]/50 bg-[#98FFD9]/10 p-5">
                <Video className="w-8 h-8 text-[#98FFD9]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-[#98FFD9] mb-1" style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, letterSpacing: "0.05em" }}>
                  VÍDEO DEMONSTRATIVO
                </p>
                <p className="text-lg text-white" style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 800 }}>
                  EM BREVE
                </p>
                <p className="text-xs text-white/60 mt-2" style={{ fontFamily: "Quicksand, sans-serif" }}>
                  O espaço está preparado para receber o vídeo da demonstração.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4 pt-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          return (
            <div key={step.number} className="relative flex gap-4">
              {!isLast && <div className="absolute left-[22px] top-[52px] w-0.5 h-[calc(100%+16px)] bg-gradient-to-b from-[#98FFD9]/60 to-[#98FFD9]/20" />}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 relative z-10" style={{ background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`, borderColor: step.color, boxShadow: `0 0 20px ${step.color}60` }}>
                  <span className="text-xl" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, color: step.color, textShadow: `0 0 15px ${step.color}` }}>{step.number}</span>
                </div>
                <div className="absolute -right-2 -bottom-1 p-1.5 rounded-lg border z-20" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, borderColor: "rgba(255,255,255,0.6)", boxShadow: `0 0 15px ${step.color}80` }}>
                  <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1 pb-4">
                <div className={`relative backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300 ${darkMode ? "bg-[#0a1628]/80 border-[#98FFD9]/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)]" : "bg-gradient-to-br from-white/60 to-white/30 border-white/60 shadow-[0_8px_24px_rgba(0,31,63,0.1)]"}`}>
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ background: `radial-gradient(circle, ${step.color}, transparent)` }} />
                  <div className="relative">
                    <h3 className={`text-base mb-2 font-bold ${darkMode ? "text-white" : "text-[#001F3F]"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>{step.title}</h3>
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-[#001F3F]/70"}`} style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 500 }}>{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 pb-20">
        <button
          onClick={onSupport}
          className={`relative w-full py-4 rounded-[1.5rem] border-2 shadow-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group ${darkMode ? "bg-[#0a1628] text-white border-[#98FFD9]/50 hover:bg-[#98FFD9]/10" : "bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-xl text-[#001F3F] border-[#98FFD9]/60"}`}
        >
          <div className="absolute -right-8 top-0 w-16 h-full bg-gradient-to-r from-transparent to-[#98FFD9]/20 rotate-12 group-hover:right-full transition-all duration-700" />
          <HelpCircle className="relative w-5 h-5 text-[#98FFD9]" strokeWidth={2.5} />
          <span className="relative text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Acessar o dashboard</span>
        </button>
        <p className={`text-center text-[9px] mt-3 ${darkMode ? "text-slate-400" : "text-[#001F3F]/40"}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
          Veja as leituras, o status do ESP32 e os controles do protótipo
        </p>
      </div>
    </div>
  );
}

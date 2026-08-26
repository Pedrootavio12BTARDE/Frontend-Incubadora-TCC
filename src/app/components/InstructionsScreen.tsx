import { Zap, Wifi, Scan, Thermometer, RotateCw, Play, HelpCircle, ArrowLeft } from "lucide-react";

interface InstructionsScreenProps {
  onSupport?: () => void;
  onBack?: () => void;
}

export function InstructionsScreen({ onSupport, onBack }: InstructionsScreenProps) {
  const steps = [
    {
      number: 1,
      icon: Zap,
      title: "Inicialização",
      description: "Conecte a fonte 12V e verifique se o LED do ESP32 está aceso.",
      color: "#FFB499",
    },
    {
      number: 2,
      icon: Wifi,
      title: "Sincronização",
      description: "Aguarde o App conectar ao sistema. O ícone de status ficará Verde Menta.",
      color: "#98FFD9",
    },
    {
      number: 3,
      icon: Scan,
      title: "Triagem Automática",
      description: "Coloque os ovos no duto de PVC. Os sensores de cor e contagem farão a triagem para a dashboard.",
      color: "#6EDDC4",
    },
    {
      number: 4,
      icon: Thermometer,
      title: "Monitoramento",
      description: "Acompanhe a temperatura (37.5°C) e umidade. O sistema ajustará o clima automaticamente.",
      color: "#FF6B6B",
    },
    {
      number: 5,
      icon: RotateCw,
      title: "Rolagem e Eclosão",
      description: "A rolagem ocorre a cada 4 horas. Você receberá uma notificação no dia do nascimento.",
      color: "#98FFD9",
    },
  ];

  return (
    <div className="px-4 space-y-5 pb-6">
      {/* Cabeçalho */}
      <div className="pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#001F3F]/10 to-[#98FFD9]/10 border border-[#98FFD9]/40 hover:from-[#98FFD9]/20 hover:to-[#6EDDC4]/15 hover:border-[#98FFD9]/60 hover:shadow-[0_4px_20px_rgba(152,255,217,0.25)] transition-all duration-300 group w-fit"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
          >
            <div className="p-2 rounded-xl bg-[#98FFD9]/15 group-hover:bg-[#98FFD9]/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#001F3F] group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </div>
            <span className="text-base text-[#001F3F]">Voltar ao início</span>
          </button>
        )}
        <div className="text-center">
          <h1
            className="text-2xl bg-gradient-to-br from-[#000C1A] to-[#001F3F] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
          >
            Guia de Operação
          </h1>
          <p
            className="text-sm text-[#001F3F] opacity-70"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
          >
            Siga os passos para uma incubação perfeita
          </p>
        </div>
      </div>

      {/* Card de Vídeo Placeholder */}
      <div className="relative bg-gradient-to-br from-[#000C1A]/90 to-[#001F3F]/85 backdrop-blur-2xl rounded-[2rem] overflow-hidden border-2 border-[#98FFD9]/40 shadow-[0_0_30px_rgba(152,255,217,0.3)]" style={{ aspectRatio: '16/9' }}>
        {/* Efeitos de luz */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#98FFD9]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#6EDDC4]/15 rounded-full blur-2xl" />

        {/* Grid de fundo */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(#98FFD9 1px, transparent 1px),
              linear-gradient(90deg, #98FFD9 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative h-full flex flex-col items-center justify-center gap-4">
          {/* Botão Play */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#98FFD9] rounded-full blur-xl opacity-60 animate-pulse" />
            <button className="relative bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-5 rounded-full shadow-[0_0_30px_rgba(152,255,217,0.8)] hover:scale-110 transition-all duration-300 border-2 border-white/60">
              <Play className="w-8 h-8 text-white fill-white" strokeWidth={0} />
            </button>
          </div>

          {/* Texto */}
          <div className="text-center px-4">
            <p
              className="text-sm text-[#98FFD9] mb-1"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
            >
              VÍDEO DEMONSTRATIVO:
            </p>
            <p
              className="text-lg text-white"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
            >
              PROTÓTIPO EM AÇÃO
            </p>
            <p className="text-xs text-white/60 mt-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Assista ao sistema funcionando em tempo real
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Vertical */}
      <div className="space-y-4 pt-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="relative flex gap-4">
              {/* Linha conectora vertical */}
              {!isLast && (
                <div className="absolute left-[22px] top-[52px] w-0.5 h-[calc(100%+16px)] bg-gradient-to-b from-[#98FFD9]/60 to-[#98FFD9]/20" />
              )}

              {/* Número e Ícone */}
              <div className="relative flex-shrink-0">
                {/* Número com efeito neon */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center border-2 relative z-10"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                    borderColor: step.color,
                    boxShadow: `0 0 20px ${step.color}60`,
                  }}
                >
                  <span
                    className="text-xl"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 900,
                      color: step.color,
                      textShadow: `0 0 15px ${step.color}`,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Ícone flutuante */}
                <div
                  className="absolute -right-2 -bottom-1 p-1.5 rounded-lg border z-20"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`,
                    borderColor: 'rgba(255,255,255,0.6)',
                    boxShadow: `0 0 15px ${step.color}80`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-4">
                <div className="relative bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-[0_8px_24px_rgba(0,31,63,0.1)] hover:shadow-[0_12px_32px_rgba(152,255,217,0.2)] transition-all duration-300">
                  {/* Efeito de brilho sutil */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30"
                    style={{ background: `radial-gradient(circle, ${step.color}, transparent)` }}
                  />

                  <div className="relative">
                    <h3
                      className="text-base text-[#001F3F] mb-2"
                      style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-xs text-[#001F3F] opacity-70 leading-relaxed"
                      style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Botão de Suporte */}
      <div className="pt-2 pb-20">
        <button
          onClick={onSupport}
          className="relative w-full bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-xl text-[#001F3F] py-4 rounded-[1.5rem] border-2 border-[#98FFD9]/60 shadow-[0_8px_24px_rgba(152,255,217,0.2)] hover:shadow-[0_12px_32px_rgba(152,255,217,0.3)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
        >
          {/* Efeito de brilho no hover */}
          <div className="absolute -right-8 top-0 w-16 h-full bg-gradient-to-r from-transparent to-[#98FFD9]/20 rotate-12 group-hover:right-full transition-all duration-700" />

          <HelpCircle className="relative w-5 h-5 text-[#98FFD9]" strokeWidth={2.5} />
          <span
            className="relative text-sm"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
          >
            Começar a Usar Agora
          </span>
        </button>

        <p className="text-center text-[9px] text-[#001F3F] opacity-40 mt-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
          Pronto para explorar o dashboard completo
        </p>
      </div>
    </div>
  );
}

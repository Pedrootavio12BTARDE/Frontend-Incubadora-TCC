import { Leaf, TrendingUp, Calendar } from "lucide-react";

interface FertilizerScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function FertilizerScreen({ darkMode = false, isDesktop = false }: FertilizerScreenProps = {}) {
  const weekData = [
    { day: "Seg", level: 45 },
    { day: "Ter", level: 52 },
    { day: "Qua", level: 60 },
    { day: "Qui", level: 68 },
    { day: "Sex", level: 75 },
    { day: "Sáb", level: 75 },
    { day: "Dom", level: 75 },
  ];

  const maxLevel = 100;

  return (
    <div className={`space-y-6 ${isDesktop ? '' : 'px-4'}`}>

      {/* Main Grid */}
      <div className={isDesktop ? "grid grid-cols-2 gap-6" : "space-y-4"}>
      {/* Status Atual */}
      <div className="relative bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] border border-white/60 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#001F3F]" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
            Nível Atual
          </span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
            <span className="text-xs text-[#98FFD9]" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
              +30% esta semana
            </span>
          </div>
        </div>

        <div
          className="text-4xl bg-gradient-to-br from-[#98FFD9] to-[#44A6A0] bg-clip-text text-transparent mb-2"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            filter: 'drop-shadow(0 0 12px rgba(152,255,217,0.3))'
          }}
        >
          75%
        </div>

        <div className="relative w-full h-2 bg-gradient-to-r from-gray-100/80 to-gray-50/60 rounded-full overflow-hidden backdrop-blur-sm border border-white/40">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#98FFD9] via-[#6EDDC4] to-[#44A6A0] rounded-full shadow-[0_0_12px_rgba(152,255,217,0.5)]"
            style={{ width: '75%' }}
          />
        </div>
      </div>

      {/* Gráfico Semanal */}
      <div className="relative bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] border border-white/60 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#001F3F]" strokeWidth={2} />
          <h3 className="text-sm text-[#001F3F]" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
            Evolução Semanal
          </h3>
        </div>

        <div className="flex items-end justify-between gap-2 h-40">
          {weekData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Barra */}
              <div className="w-full bg-gradient-to-r from-gray-100/80 to-gray-50/60 rounded-t-lg overflow-hidden relative" style={{ height: '100%' }}>
                <div
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#98FFD9] via-[#6EDDC4] to-[#44A6A0] rounded-t-lg transition-all duration-500 shadow-[0_0_12px_rgba(152,255,217,0.4)]"
                  style={{ height: `${(data.level / maxLevel) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/30" />
                </div>
              </div>

              {/* Label */}
              <span className="text-[10px] text-[#001F3F] opacity-60" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Ações - Full Width */}
      <div className="relative bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] border border-white/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-[#001F3F] mb-2 ${isDesktop ? 'text-lg' : 'text-sm'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
              Próxima Ação Necessária
            </h3>
            <div className="bg-gradient-to-r from-[#FFE5CC]/60 to-[#FFB499]/40 backdrop-blur-sm px-5 py-3 rounded-xl border border-orange-200/60 inline-block">
              <p className={`text-[#001F3F] ${isDesktop ? 'text-sm' : 'text-xs'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                ⚠️ Esvaziar coletor em <span style={{ fontWeight: 800 }}>~3 dias</span> (estimativa com taxa atual)
              </p>
            </div>
          </div>
          {isDesktop && (
            <button className="bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
              <span style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
                📋 Programar Manutenção
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

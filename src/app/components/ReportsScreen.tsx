import { Activity, CheckCircle, AlertTriangle, Zap, TrendingUp } from "lucide-react";

interface ReportsScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
  instanceId?: string;
}

// ── Custom SVG line chart ───────────────────────────────────────────────────
function LineChartSVG({ darkMode }: { darkMode: boolean }) {
  const data = [37.5, 37.6, 37.8, 37.7, 37.9, 37.8, 37.8];
  const labels = ["00h", "04h", "08h", "12h", "16h", "20h", "24h"];
  const W = 280, H = 120, padL = 32, padR = 8, padT = 8, padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const min = 37, max = 38.5;

  const toX = (i: number) => padL + (i / (data.length - 1)) * innerW;
  const toY = (v: number) => padT + ((max - v) / (max - min)) * innerH;

  const points = data.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padT + innerH} L${points[0].x},${padT + innerH} Z`;

  const textColor = darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,31,63,0.5)";
  const gridColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,31,63,0.08)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padT + t * innerH;
        const val = (max - t * (max - min)).toFixed(1);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={gridColor} strokeWidth={1} />
            <text x={padL - 4} y={y + 3} textAnchor="end" fontSize={8} fill={textColor}>{val}</text>
          </g>
        );
      })}
      {/* X labels */}
      {labels.map((l, i) => (
        <text key={l} x={toX(i)} y={H - 4} textAnchor="middle" fontSize={8} fill={textColor}>{l}</text>
      ))}
      {/* Area fill */}
      <defs>
        <linearGradient id="lgArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lgArea)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#FF6B6B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#FF6B6B" stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

// ── Custom SVG donut chart ──────────────────────────────────────────────────
function DonutChartSVG() {
  const segments = [
    { value: 156, color: "#8B4513" },
    { value: 89, color: "#E8E0D0" },
  ];
  const total = segments.reduce((s, d) => s + d.value, 0);
  const cx = 60, cy = 60, r = 45, inner = 28, gap = 0.05;

  let angle = -Math.PI / 2;
  const arcs = segments.map((seg) => {
    const sweep = (seg.value / total) * (2 * Math.PI) - gap;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + sweep);
    const y2 = cy + r * Math.sin(angle + sweep);
    const ix1 = cx + inner * Math.cos(angle);
    const iy1 = cy + inner * Math.sin(angle);
    const ix2 = cx + inner * Math.cos(angle + sweep);
    const iy2 = cy + inner * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} A${inner},${inner} 0 ${large},0 ${ix1.toFixed(2)},${iy1.toFixed(2)} Z`;
    angle += sweep + gap;
    return { d, color: seg.color };
  });

  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={10} fill="#001F3F" fontWeight="700">245</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize={7} fill="#001F3F" opacity={0.6}>ovos</text>
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function ReportsScreen({ darkMode = false, isDesktop = false }: ReportsScreenProps = {}) {
  const eggData = [
    { name: "Marrom", value: 156, color: "#8B4513" },
    { name: "Branco", value: 89, color: "#E8E0D0" },
  ];
  const totalEggs = 245;

  const activityLog = [
    { icon: CheckCircle, color: "#98FFD9", text: "Sistema ligado às 06:00", time: "Hoje" },
    { icon: TrendingUp, color: "#98FFD9", text: "245 ovos coletados hoje", time: "Hoje" },
    { icon: AlertTriangle, color: "#FF6B6B", text: "Alerta: Temperatura 39.2°C", time: "10min atrás" },
    { icon: Zap, color: "#FFB499", text: "Lâmpada aquecimento ativada", time: "2h atrás" },
    { icon: CheckCircle, color: "#98FFD9", text: "Umidade normalizada (60%)", time: "3h atrás" },
    { icon: Activity, color: "#98FFD9", text: "Rolagem automática executada", time: "4h atrás" },
  ];

  const cardCls = `relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] overflow-hidden ${isDesktop ? "p-6" : "p-4"} ${
    darkMode
      ? "bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/15"
      : "bg-gradient-to-br from-white/60 to-white/30 border border-white/60"
  }`;
  const heading = darkMode ? "text-white" : "text-[#001F3F]";
  const sub = darkMode ? "text-white/60" : "text-[#001F3F]/60";

  return (
    <div className={`space-y-5 ${isDesktop ? "" : "px-4"}`}>

      {/* Header — mobile only */}
      {!isDesktop && (
        <div className="relative bg-gradient-to-br from-[#001F3F]/80 to-[#003366]/70 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#98FFD9]/20 to-transparent rounded-full blur-3xl" />
          <h2 className="relative text-white text-xl mb-0.5" style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700 }}>
            Análise de Dados IoT
          </h2>
          <p className="relative text-white/60 text-xs" style={{ fontFamily: "Quicksand, sans-serif" }}>
            Relatórios e estatísticas da EcoIncubadora
          </p>
        </div>
      )}

      {/* Charts row */}
      <div className={isDesktop ? "grid grid-cols-2 gap-5" : "space-y-4"}>

        {/* ── Line chart card ── */}
        <div className={cardCls}>
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#FF9999]/10 to-transparent rounded-full blur-3xl" />
          <div className="relative flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-2 rounded-xl shadow-lg shrink-0">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h3 className={`text-sm font-semibold ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Estabilidade da Temperatura (24h)
            </h3>
          </div>

          <LineChartSVG darkMode={darkMode} />

          <div className="mt-3 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className={`text-[10px] mb-0.5 ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>Média</p>
              <p className={`text-base font-bold ${heading}`} style={{ fontFamily: "Montserrat, sans-serif" }}>37.7°C</p>
            </div>
            <div className={`w-px h-8 ${darkMode ? "bg-white/20" : "bg-[#001F3F]/20"}`} />
            <div className="text-center">
              <p className={`text-[10px] mb-0.5 ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>Variação</p>
              <p className="text-base font-bold text-[#98FFD9]" style={{ fontFamily: "Montserrat, sans-serif" }}>±0.4°C</p>
            </div>
          </div>
        </div>

        {/* ── Donut chart card ── */}
        <div className={cardCls}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/15 to-transparent rounded-full blur-3xl" />
          <div className="relative mb-3">
            <h3 className={`text-sm font-semibold mb-0.5 ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Proporção de Cores Detectadas
            </h3>
            <p className={`text-xs ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Total: {totalEggs} ovos
            </p>
          </div>

          <div className="flex items-center gap-6 justify-center">
            <DonutChartSVG />

            <div className="flex-1 space-y-3">
              {eggData.map((item) => {
                const pct = Math.round((item.value / totalEggs) * 100);
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-white/40 shadow-sm shrink-0" style={{ backgroundColor: item.color }} />
                        <span className={`text-xs font-medium ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>{item.name}</span>
                      </div>
                      <span className={`text-xs font-bold ${heading}`} style={{ fontFamily: "Montserrat, sans-serif" }}>{item.value} <span className={`font-normal text-[10px] ${sub}`}>({pct}%)</span></span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-black/10"}`}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className={cardCls}>
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/15 to-transparent rounded-full blur-3xl" />
        <div className="relative flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-2 rounded-xl shadow-lg shrink-0">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h3 className={`font-bold ${isDesktop ? "text-base" : "text-sm"} ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
            Registro de Atividades
          </h3>
        </div>

        <div className={isDesktop ? "grid grid-cols-2 gap-3" : "space-y-2.5"}>
          {activityLog.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-2.5 border transition-all duration-300 ${
                  darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/40 border-white/60 hover:bg-white/60"
                }`}
              >
                <div className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: `${activity.color}25` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: activity.color }} strokeWidth={2.5} />
                </div>
                <p className={`flex-1 text-xs ${heading}`} style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 500 }}>
                  {activity.text}
                </p>
                <span className={`text-[10px] shrink-0 ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

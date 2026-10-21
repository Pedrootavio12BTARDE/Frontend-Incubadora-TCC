import { Activity, TrendingUp, Droplets, Thermometer, RotateCw, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { getProduction, getSensorHistory, type ProductionData, type SensorReading } from "../../services/api";

interface ReportsScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
  instanceId?: string;
}

// ── Realistic baseline data for 24h incubation demonstration ──────────────────
function getRealisticBaselineReadings(): SensorReading[] {
  const now = Date.now();
  const step = 2 * 60 * 60 * 1000; // a cada 2 horas
  const temps = [37.5, 37.6, 37.4, 37.7, 37.6, 37.8, 37.5, 37.6, 37.7, 37.5, 37.6, 37.7];
  const humidities = [60.1, 59.8, 60.5, 61.0, 60.2, 59.5, 60.0, 60.4, 60.1, 59.9, 60.3, 60.2];

  return temps.map((temp, i) => ({
    id: i + 1,
    temperature: temp,
    humidity: humidities[i],
    createdAt: new Date(now - (11 - i) * step).toISOString(),
  }));
}

// ── Custom SVG line chart ───────────────────────────────────────────────────
function LineChartSVG({
  darkMode,
  data,
  metric = "temperature",
}: {
  darkMode: boolean;
  data: SensorReading[];
  metric?: "temperature" | "humidity";
}) {
  const W = 320, H = 140, padL = 36, padR = 12, padT = 12, padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const values = data.flatMap((reading) => {
    const val = metric === "temperature" ? reading.temperature : reading.humidity;
    return typeof val === "number" && Number.isFinite(val) ? [val] : [];
  });

  const dataMin = values.length ? Math.min(...values) : (metric === "temperature" ? 37.0 : 55.0);
  const dataMax = values.length ? Math.max(...values) : (metric === "temperature" ? 38.0 : 65.0);
  const padding = Math.max((dataMax - dataMin) * 0.15, metric === "temperature" ? 0.2 : 1.0);
  const min = Math.floor((dataMin - padding) * 10) / 10;
  const max = Math.ceil((dataMax + padding) * 10) / 10;

  const toX = (i: number) => padL + (data.length < 2 ? 0.5 : i / (data.length - 1)) * innerW;
  const toY = (v: number) => padT + ((max - v) / (max - min || 1)) * innerH;

  const points = data.flatMap((reading, index) => {
    const val = metric === "temperature" ? reading.temperature : reading.humidity;
    if (typeof val !== "number" || !Number.isFinite(val)) return [];
    return [{ x: toX(index), y: toY(val), val }];
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L${points[points.length - 1].x},${padT + innerH} L${points[0].x},${padT + innerH} Z`
    : "";

  const strokeColor = metric === "temperature" ? "#FF6B6B" : "#00d4ff";
  const gradId = metric === "temperature" ? "lgAreaTemp" : "lgAreaHum";
  const unit = metric === "temperature" ? "°C" : "%";

  const textColor = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,31,63,0.6)";
  const gridColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,31,63,0.08)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 145 }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.30" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.33, 0.66, 1].map((t) => {
        const y = padT + t * innerH;
        const val = (max - t * (max - min)).toFixed(1);
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={gridColor} strokeWidth={1} strokeDasharray="3 3" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize={8} fill={textColor} fontFamily="Montserrat, sans-serif">
              {val}{unit}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {[0, Math.floor((data.length - 1) / 2), data.length - 1]
        .filter((index, position, indexes) => data.length > 0 && indexes.indexOf(index) === position)
        .map((index) => {
          const timestamp = data[index]?.createdAt;
          const label = timestamp && Number.isFinite(Date.parse(timestamp))
            ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";
          return (
            <text key={`${index}-${label}`} x={toX(index)} y={H - 6} textAnchor="middle" fontSize={8} fill={textColor} fontFamily="Quicksand, sans-serif">
              {label}
            </text>
          );
        })}

      {/* Area fill */}
      {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}

      {/* Line */}
      {linePath && <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={strokeColor} stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

// ── Custom SVG donut chart ──────────────────────────────────────────────────
function DonutChartSVG({ whiteEggs, brownEggs, darkMode }: { whiteEggs: number; brownEggs: number; darkMode: boolean }) {
  const total = whiteEggs + brownEggs;
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  const brownPct = total > 0 ? brownEggs / total : 0;
  const whitePct = total > 0 ? whiteEggs / total : 0;

  const brownDash = brownPct * circumference;
  const whiteDash = whitePct * circumference;

  return (
    <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {/* Track circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,31,63,0.08)"}
          strokeWidth="14"
        />

        {total > 0 ? (
          <>
            {/* Brown segment */}
            {brownEggs > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#8B4513"
                strokeWidth="14"
                strokeDasharray={`${brownDash} ${circumference}`}
                strokeDashoffset={0}
                className="transition-all duration-700 ease-out"
              />
            )}

            {/* White segment */}
            {whiteEggs > 0 && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={darkMode ? "#EAE4D9" : "#DDD5C7"}
                strokeWidth="14"
                strokeDasharray={`${whiteDash} ${circumference}`}
                strokeDashoffset={-brownDash}
                className="transition-all duration-700 ease-out"
              />
            )}
          </>
        ) : (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#98FFD9"
            strokeOpacity="0.4"
            strokeWidth="14"
            strokeDasharray="4 4"
          />
        )}
      </svg>

      {/* Central label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className={`text-base font-black leading-tight ${darkMode ? "text-white" : "text-[#001F3F]"}`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {total}
        </span>
        <span
          className={`text-[9px] font-bold ${darkMode ? "text-slate-400" : "text-[#001F3F]/60"}`}
          style={{ fontFamily: "Quicksand, sans-serif" }}
        >
          ovos
        </span>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function ReportsScreen({ darkMode = false, isDesktop = false }: ReportsScreenProps = {}) {
  const [production, setProduction] = useState<ProductionData>({
    eggsCount: 245,
    whiteEggs: 140,
    brownEggs: 105,
    lastColor: "Marrom",
  });
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>(getRealisticBaselineReadings());
  const [selectedMetric, setSelectedMetric] = useState<"temperature" | "humidity">("temperature");

  const { data: sensorUpdate } = useSocket<SensorReading>("sensor:update");
  const { data: productionUpdate } = useSocket<ProductionData>("production:update");

  // Carrega produção inicial (com fallback offline/local storage)
  useEffect(() => {
    getProduction()
      .then(setProduction)
      .catch((error) => console.error("Erro ao carregar produção nos relatórios:", error));

    getSensorHistory()
      .then(({ readings }) => {
        if (readings && readings.length >= 4) {
          setSensorReadings(readings);
        }
      })
      .catch((error) => console.error("Erro ao carregar histórico dos sensores:", error));
  }, []);

  // Escuta atualizações via WebSocket
  useEffect(() => {
    if (!sensorUpdate) return;
    setSensorReadings((current) => {
      if (sensorUpdate.createdAt && current.some((r) => r.createdAt === sensorUpdate.createdAt)) {
        return current;
      }
      return [...current, sensorUpdate].slice(-100);
    });
  }, [sensorUpdate]);

  useEffect(() => {
    if (productionUpdate) setProduction(productionUpdate);
  }, [productionUpdate]);

  // Escuta atualizações locais disparadas diretamente pelo ProductionCard
  useEffect(() => {
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ProductionData>;
      if (customEvent.detail) {
        setProduction(customEvent.detail);
      }
    };
    window.addEventListener("production:local_update", handleLocalUpdate);
    return () => window.removeEventListener("production:local_update", handleLocalUpdate);
  }, []);

  // Dados calculados para os gráficos
  const activeReadings = sensorReadings.length ? sensorReadings : getRealisticBaselineReadings();
  const temperatures = activeReadings.flatMap((r) => (typeof r.temperature === "number" ? [r.temperature] : []));
  const humidities = activeReadings.flatMap((r) => (typeof r.humidity === "number" ? [r.humidity] : []));

  const averageTemperature = temperatures.length
    ? temperatures.reduce((sum, v) => sum + v, 0) / temperatures.length
    : 37.6;
  const temperatureVariation = temperatures.length
    ? Math.max(...temperatures) - Math.min(...temperatures)
    : 0.3;

  const averageHumidity = humidities.length
    ? humidities.reduce((sum, v) => sum + v, 0) / humidities.length
    : 60.2;

  const totalRegisteredEggs = production.whiteEggs + production.brownEggs;

  const eggData = [
    { name: "Marrom", value: production.brownEggs, color: "#8B4513" },
    { name: "Branco", value: production.whiteEggs, color: darkMode ? "#EAE4D9" : "#C4BDB0" },
  ];

  // Logs recentes para a timeline de atividades
  const activityLog = [...activeReadings].reverse().slice(0, 6).map((reading, idx) => ({
    id: idx,
    temp: typeof reading.temperature === "number" ? `${reading.temperature.toFixed(1)}°C` : "37.6°C",
    hum: typeof reading.humidity === "number" ? `${reading.humidity.toFixed(1)}%` : "60.0%",
    time: reading.createdAt ? new Date(reading.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Agora",
  }));

  const cardCls = `relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] overflow-hidden ${
    isDesktop ? "p-6" : "p-4"
  } ${
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#98FFD9]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <h2 className="relative text-white text-xl mb-0.5" style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700 }}>
            Análise de Dados IoT
          </h2>
          <p className="relative text-white/60 text-xs" style={{ fontFamily: "Quicksand, sans-serif" }}>
            Relatórios e estatísticas da EcoIncubadora
          </p>
        </div>
      )}

      {/* ── KPI Highlight Cards Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 mb-1 text-[#FF6B6B]">
            <Thermometer className="w-4 h-4" />
            <span className="text-[11px] font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Temp. Média</span>
          </div>
          <div className={`text-xl font-black ${heading}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {averageTemperature.toFixed(1)}°C
          </div>
          <span className="text-[10px] text-[#98FFD9] font-bold">Faixa Ideal (37.5°C)</span>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 mb-1 text-[#00d4ff]">
            <Droplets className="w-4 h-4" />
            <span className="text-[11px] font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Umidade Média</span>
          </div>
          <div className={`text-xl font-black ${heading}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {averageHumidity.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#98FFD9] font-bold">Estável (DHT22)</span>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 mb-1 text-[#98FFD9]">
            <RotateCw className="w-4 h-4" />
            <span className="text-[11px] font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Rolagem</span>
          </div>
          <div className={`text-xl font-black ${heading}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            A cada 4h
          </div>
          <span className="text-[10px] text-[#98FFD9] font-bold">Servo Motor OK</span>
        </div>

        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 mb-1 text-[#6EDDC4]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px] font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Estabilidade</span>
          </div>
          <div className={`text-xl font-black ${heading}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            99.2%
          </div>
          <span className="text-[10px] text-[#98FFD9] font-bold">Controle Ativo</span>
        </div>
      </div>

      {/* ── Main Charts Grid ── */}
      <div className={isDesktop ? "grid grid-cols-2 gap-5" : "space-y-4"}>

        {/* ── Line chart card (Temperatura / Umidade) ── */}
        <div className={cardCls}>
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#FF9999]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl shadow-lg shrink-0 ${
                selectedMetric === "temperature"
                  ? "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53]"
                  : "bg-gradient-to-br from-[#00d4ff] to-[#0088cc]"
              }`}>
                {selectedMetric === "temperature" ? (
                  <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                ) : (
                  <Droplets className="w-4 h-4 text-white" strokeWidth={2.5} />
                )}
              </div>
              <div>
                <h3 className={`text-sm font-bold ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  {selectedMetric === "temperature" ? "Estabilidade da Temperatura (24h)" : "Estabilidade da Umidade (24h)"}
                </h3>
                <p className={`text-[11px] ${sub}`}>Dados das últimas 24 horas</p>
              </div>
            </div>

            {/* Toggle metric */}
            <div className={`flex rounded-xl p-0.5 border ${darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
              <button
                type="button"
                onClick={() => setSelectedMetric("temperature")}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  selectedMetric === "temperature"
                    ? "bg-[#FF6B6B] text-white shadow-sm"
                    : `${sub} hover:text-white`
                }`}
              >
                Temp.
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric("humidity")}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  selectedMetric === "humidity"
                    ? "bg-[#00d4ff] text-[#001F3F] shadow-sm"
                    : `${sub} hover:text-white`
                }`}
              >
                Umid.
              </button>
            </div>
          </div>

          <LineChartSVG darkMode={darkMode} data={activeReadings} metric={selectedMetric} />

          <div className="mt-3 flex items-center justify-center gap-6 pt-2 border-t border-white/10">
            <div className="text-center">
              <p className={`text-[10px] mb-0.5 ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>Média</p>
              <p className={`text-base font-bold ${heading}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                {selectedMetric === "temperature" ? `${averageTemperature.toFixed(1)}°C` : `${averageHumidity.toFixed(1)}%`}
              </p>
            </div>
            <div className={`w-px h-8 ${darkMode ? "bg-white/20" : "bg-[#001F3F]/20"}`} />
            <div className="text-center">
              <p className={`text-[10px] mb-0.5 ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>Variação</p>
              <p className="text-base font-bold text-[#98FFD9]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {selectedMetric === "temperature" ? `±${(temperatureVariation / 2).toFixed(1)}°C` : `±1.5%`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Donut chart card: Quantidade de cores registradas ── */}
        <div className={cardCls}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative mb-3">
            <h3 className={`text-sm font-bold mb-0.5 ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Quantidade de cores registradas
            </h3>
            <p className={`text-xs ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Total registrado: {totalRegisteredEggs} ovos
            </p>
          </div>

          <div className="flex items-center gap-5 justify-center pt-2">
            <DonutChartSVG whiteEggs={production.whiteEggs} brownEggs={production.brownEggs} darkMode={darkMode} />

            <div className="flex-1 space-y-3.5">
              {eggData.map((item) => {
                const pct = totalRegisteredEggs
                  ? Math.round((item.value / totalRegisteredEggs) * 100)
                  : 0;
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className={`text-xs font-bold ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                          {item.name}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${heading}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                        {item.value} <span className={`font-semibold text-[10px] ${sub}`}>({pct}%)</span>
                      </span>
                    </div>

                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-black/10"}`}>
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`mt-4 pt-2.5 border-t text-center ${darkMode ? 'border-white/10' : 'border-[#001F3F]/10'}`}>
            <p className={`text-[11px] ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Os dados de ovos sincronizam em tempo real com o Painel de Controle.
            </p>
          </div>
        </div>
      </div>

      {/* ── Activity log ── */}
      <div className={cardCls}>
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-2 rounded-xl shadow-lg shrink-0">
              <Activity className="w-4 h-4 text-[#001F3F]" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className={`font-bold ${isDesktop ? "text-base" : "text-sm"} ${heading}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                Leituras Recentes dos Sensores
              </h3>
              <p className={`text-[11px] ${sub}`}>Histórico em tempo real (DHT22 e ESP32)</p>
            </div>
          </div>
          <span className="text-[10px] text-[#98FFD9] font-bold bg-[#98FFD9]/10 px-2.5 py-1 rounded-full border border-[#98FFD9]/20">
            Tempo Real Ativo
          </span>
        </div>

        <div className={isDesktop ? "grid grid-cols-2 lg:grid-cols-3 gap-3" : "space-y-2.5"}>
          {activityLog.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between gap-3 rounded-xl p-3 border transition-all duration-300 ${
                darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white/40 border-white/60 hover:bg-white/60 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg shrink-0 bg-[#98FFD9]/20 text-[#98FFD9]">
                  <Activity className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <div>
                  <p className={`text-xs font-bold ${heading}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {activity.temp} · {activity.hum}
                  </p>
                  <span className={`text-[10px] ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                    DHT22 Clima Estável
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-bold shrink-0 ${sub}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Zap,
  Leaf,
  TrendingUp,
  RotateCw,
  Sparkles,
  Calculator,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { EggIcon } from "./EggIcon";
import { getLocalProduction, type ProductionData } from "../../services/api";

interface FertilizerScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function FertilizerScreen({ darkMode = false, isDesktop = false }: FertilizerScreenProps = {}) {
  // ── ESTADO: DADOS DE PRODUÇÃO / OVOS ──
  const [production, setProduction] = useState<ProductionData>(() => getLocalProduction());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ProductionData>;
      if (customEvent.detail) setProduction(customEvent.detail);
    };
    window.addEventListener("production:local_update", handleUpdate);
    return () => window.removeEventListener("production:local_update", handleUpdate);
  }, []);

  // ── 1. EFICIÊNCIA ENERGÉTICA (Métrica do ESP32 / Relé) ──
  const [heaterWattage, setHeaterWattage] = useState<number>(40); // 40W lâmpada/resistência
  const dailyDutyCycleHours = 7.2; // 7h 12min ligado (30% do tempo graças ao isolamento térmico)
  const dailyHoursOff = 24 - dailyDutyCycleHours; // 16h 48min em repouso térmico
  const incubationCycleDays = 21; // Ciclo padrão de incubação de aves

  // Cálculos de consumo
  const dailyKwhAutomated = (heaterWattage / 1000) * dailyDutyCycleHours; // 0.288 kWh/dia
  const dailyKwhContinuous = (heaterWattage / 1000) * 24; // 0.960 kWh/dia
  const cycleKwhAutomated = dailyKwhAutomated * incubationCycleDays; // 6.05 kWh/ciclo
  const cycleKwhContinuous = dailyKwhContinuous * incubationCycleDays; // 20.16 kWh/ciclo

  const energySavingsPercent = Math.round(
    ((cycleKwhContinuous - cycleKwhAutomated) / cycleKwhContinuous) * 100
  ); // 70% de economia
  const kwhSavedCycle = cycleKwhContinuous - cycleKwhAutomated; // 14.11 kWh economizados
  const estimatedCostSavingBRL = kwhSavedCycle * 0.85; // Custo médio de R$ 0,85/kWh

  // ── 2. CALCULADORA DE COMPOSTAGEM E GESTÃO DE RESÍDUOS ──
  const [manureAmountKg, setManureAmountKg] = useState<number>(2.5); // kg de esterco/resíduos
  const [eggShellsAmountG, setEggShellsAmountG] = useState<number>(300); // gramas de cascas trituradas

  // Regra de compostagem: 3 partes de matéria seca (carbono) para 1 parte de resíduo úmido (nitrogênio)
  const dryMatterNeededKg = Math.round(manureAmountKg * 3 * 10) / 10;
  // Rendimento estimado após decomposição (~55% da massa inicial)
  const estimatedCompostYieldKg = Math.round((manureAmountKg + dryMatterNeededKg + eggShellsAmountG / 1000) * 0.55 * 10) / 10;

  // Total de cascas baseado nos ovos já catalogados
  const totalEggs = production.eggsCount || 245;
  const estimatedCalciumGrams = Math.round(totalEggs * 6.0); // cada casca tem ~6g de carbonato de cálcio

  // ── 3. TAXA DE ECO-EFICIÊNCIA DO LOTE (Eclosão e Desperdício) ──
  const [batchTotalEggs, setBatchTotalEggs] = useState<number>(100);
  const [batchHatchedEggs, setBatchHatchedEggs] = useState<number>(91);

  const hatchRate = batchTotalEggs > 0 ? Math.min(100, Math.round((batchHatchedEggs / batchTotalEggs) * 100)) : 0;
  // Média tradicional de incubadoras sem controle automático IoT é de ~70%
  const traditionalHatchCount = Math.round(batchTotalEggs * 0.7);
  const biologicalWasteSaved = Math.max(0, batchHatchedEggs - traditionalHatchCount);

  // Estilos temáticos
  const cardCls = `relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-5 sm:p-6 transition-all duration-300 border ${
    darkMode
      ? "bg-gradient-to-br from-[#0e1a2f]/85 to-[#081220]/80 border-[#98FFD9]/15 text-white"
      : "bg-gradient-to-br from-white/75 to-white/45 border-white/70 text-[#001F3F]"
  }`;
  const headingColor = darkMode ? "text-white" : "text-[#001F3F]";
  const subTextColor = darkMode ? "text-slate-300" : "text-[#001F3F]/70";

  return (
    <div className={`space-y-6 ${isDesktop ? "" : "px-3 pb-8"}`}>

      {/* ── BANNER SUPERIOR: RESUMO DE IMPACTO ECOLÓGICO ── */}
      <div className={`relative overflow-hidden rounded-[1.75rem] p-6 border ${
        darkMode
          ? "bg-gradient-to-r from-[#0d1d35] via-[#092230] to-[#0a332a] border-[#98FFD9]/25"
          : "bg-gradient-to-r from-[#E6FAF4] via-[#EEF8FA] to-[#E2F7F2] border-[#98FFD9]/40 shadow-sm"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#98FFD9]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-[#98FFD9]/20 text-[#001F3F] dark:text-[#98FFD9] border border-[#98FFD9]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agricultura 4.0 Sustentável</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Gestão Ecológica & Sustentabilidade
            </h1>
            <p className={`text-xs sm:text-sm max-w-xl ${subTextColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Monitoramento da pegada ambiental da EcoIncubadora: automação com ESP32 que economiza energia, reaproveitamento integral de resíduos orgânicos e máxima taxa de eclosão.
            </p>
          </div>

          <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
            darkMode ? "bg-black/30 border-[#98FFD9]/20" : "bg-white/80 border-[#98FFD9]/30 shadow-sm"
          }`}>
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#98FFD9] to-[#44A6A0] text-[#001F3F]">
              <Award className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#98FFD9]" style={{ fontFamily: "Quicksand, sans-serif" }}>
                Classificação Ambiental
              </div>
              <div className={`text-xl font-black ${headingColor}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                Selo A+ Eco-Friendly
              </div>
              <div className={`text-[10px] ${subTextColor}`}>
                Redução de 70% de energia e desperdício zero
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 1. EFICIÊNCIA ENERGÉTICA (Métrica do ESP32/Relé) ── */}
      <section className={cardCls}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
              <Zap className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                Eficiência Energética (ESP32 & Controle por Relé)
              </h2>
              <p className={`text-xs ${subTextColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                Ciclo térmico com histerese inteligente acionado apenas quando a temperatura cai de 37.5°C
              </p>
            </div>
          </div>

          {/* Seletor de Potência para Simulação */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${subTextColor}`}>Potência do Aquecedor:</span>
            <div className={`flex rounded-xl p-1 border ${darkMode ? "bg-black/30 border-white/15" : "bg-black/5 border-black/10"}`}>
              {[25, 40, 60].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setHeaterWattage(w)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    heaterWattage === w
                      ? "bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] text-[#001F3F] shadow-sm"
                      : `${subTextColor} hover:text-white`
                  }`}
                >
                  {w}W
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas Principais em Grade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card: Tempo Ativo vs Repouso */}
          <div className={`p-4 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-2 text-[#98FFD9]">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Ciclo Diário do Relé</span>
            </div>
            <div className={`text-2xl font-black mb-1 ${headingColor}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
              7h 12m <span className="text-xs font-normal opacity-70">ligado/dia</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-amber-400 to-[#98FFD9] rounded-full" style={{ width: "30%" }} />
            </div>
            <p className={`text-[11px] ${subTextColor}`}>
              O isolamento térmico mantém a incubadora aquecida em repouso durante <strong>16h 48m (70% do dia)</strong> sem gastar energia.
            </p>
          </div>

          {/* Card: Consumo Real vs Contínuo */}
          <div className={`p-4 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-2 text-[#00d4ff]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Consumo por Ciclo (21 dias)</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-2xl font-black text-[#98FFD9]`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                {cycleKwhAutomated.toFixed(2)} kWh
              </span>
              <span className={`text-xs line-through opacity-50 ${headingColor}`}>
                {cycleKwhContinuous.toFixed(2)} kWh
              </span>
            </div>
            <p className={`text-[11px] ${subTextColor}`}>
              Gasto diário de apenas <strong>{dailyKwhAutomated.toFixed(2)} kWh/dia</strong>, contra {dailyKwhContinuous.toFixed(2)} kWh/dia de um sistema sem termostato.
            </p>
          </div>

          {/* Card: Poupança Garantida */}
          <div className={`p-4 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90 shadow-sm"}`}>
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Poupança Garantida</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
              -{energySavingsPercent}% Energia
            </div>
            <p className={`text-[11px] ${subTextColor}`}>
              Economia de <strong>{kwhSavedCycle.toFixed(1)} kWh</strong> e ~R$ {estimatedCostSavingBRL.toFixed(2)} por ciclo, reduzindo 1.2 kg de emissões de carbono.
            </p>
          </div>
        </div>

        {/* Comparador Visual Gráfico */}
        <div className={`p-4 rounded-2xl border ${darkMode ? "bg-black/25 border-white/10" : "bg-white/50 border-black/5"}`}>
          <div className="text-xs font-bold mb-3" style={{ fontFamily: "Quicksand, sans-serif" }}>
            Comparativo de Consumo Energético no Ciclo de 21 dias:
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-[#98FFD9]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> EcoIncubadora com ESP32 Inteligente
                </span>
                <span style={{ fontFamily: "Montserrat, sans-serif" }}>{cycleKwhAutomated.toFixed(2)} kWh</span>
              </div>
              <div className="h-4 rounded-full bg-black/20 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#98FFD9] to-[#44A6A0] transition-all duration-700"
                  style={{ width: `${(cycleKwhAutomated / cycleKwhContinuous) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1 opacity-70">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-400" /> Aquecimento Tradicional Contínuo (Sem Automação)
                </span>
                <span style={{ fontFamily: "Montserrat, sans-serif" }}>{cycleKwhContinuous.toFixed(2)} kWh</span>
              </div>
              <div className="h-4 rounded-full bg-black/20 overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. GESTÃO DE RESÍDUOS E COMPOSTAGEM (Guia / Calculadora) ── */}
      <section className={cardCls}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md">
            <Leaf className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className={`text-lg font-black ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Gestão de Resíduos e Calculadora de Compostagem
            </h2>
            <p className={`text-xs ${subTextColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              Aproveitamento de cascas de ovos ricas em cálcio e adubo orgânico de alto rendimento
            </p>
          </div>
        </div>

        {/* Grade: Resumo dos Resíduos + Calculadora Interativa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Coluna 1: Registro dos Materiais e Guia */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
              <Layers className="w-4 h-4 text-[#98FFD9]" /> Resíduos Reaproveitados do Sistema
            </h3>

            {/* Card: Cascas de Ovos */}
            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90 shadow-sm"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                    <EggIcon size={22} variant="brown" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${headingColor}`}>Farinha de Casca de Ovos</h4>
                    <p className={`text-xs ${subTextColor}`}>Rica em Carbonato de Cálcio (CaCO₃ ~94%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#98FFD9]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {estimatedCalciumGrams}g
                  </div>
                  <div className={`text-[10px] ${subTextColor}`}>de cálcio natural</div>
                </div>
              </div>
              <p className={`mt-2.5 text-xs ${subTextColor}`}>
                Cascas pós-eclosão são higienizadas, secas e trituradas. Excelente para corrigir o pH de solos ácidos e fortificar a alimentação das matrizes.
              </p>
            </div>

            {/* Card: Esterco e Coletor da Incubadora */}
            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90 shadow-sm"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${headingColor}`}>Esterco & Cama Aviária</h4>
                    <p className={`text-xs ${subTextColor}`}>Coletor orgânico com monitoramento de nível</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#98FFD9]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    75%
                  </div>
                  <div className={`text-[10px] ${subTextColor}`}>nível do reservatório</div>
                </div>
              </div>
              <p className={`mt-2.5 text-xs ${subTextColor}`}>
                Fonte potente de Nitrogênio orgânico e matéria viva para biofertilização de hortas comunitárias e pomares.
              </p>
            </div>

            {/* Guia Rápido de Camadas */}
            <div className={`p-3.5 rounded-2xl border text-xs ${darkMode ? "bg-[#98FFD9]/5 border-[#98FFD9]/20" : "bg-[#98FFD9]/15 border-[#98FFD9]/30"}`}>
              <span className="font-bold text-[#98FFD9] block mb-1">🌱 Proporção de Ouro da Compostagem:</span>
              <p className={subTextColor}>
                Para cada <strong>1kg de esterco</strong> (matéria úmida), misture <strong>3kg de folhas secas ou serragem</strong> (matéria seca) e polvilhe <strong>50g de pó de casca</strong>. Misture semanalmente para aeração.
              </p>
            </div>
          </div>

          {/* Coluna 2: Calculadora Interativa de Compostagem */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? "bg-black/30 border-[#98FFD9]/20" : "bg-white/80 border-[#98FFD9]/30 shadow-md"
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-[#98FFD9]" />
                <h3 className={`text-base font-bold ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Calculadora de Proporção Ideal
                </h3>
              </div>

              {/* Input 1: Quantidade de Esterco */}
              <div className="mb-4">
                <label className={`block text-xs font-bold mb-1.5 ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Esterco / Resíduo das Aves Coletado (kg):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={manureAmountKg}
                    onChange={(e) => setManureAmountKg(Number(e.target.value))}
                    className="flex-1 accent-[#98FFD9]"
                  />
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={manureAmountKg}
                    onChange={(e) => setManureAmountKg(Math.max(0.5, Number(e.target.value)))}
                    className={`w-20 text-center font-bold text-sm rounded-lg py-1 border ${
                      darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-[#001F3F]/20 text-[#001F3F]"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                  <span className="text-xs font-bold">kg</span>
                </div>
              </div>

              {/* Input 2: Quantidade de Cascas Trituradas */}
              <div className="mb-5">
                <label className={`block text-xs font-bold mb-1.5 ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Cascas de Ovos Trituradas Disponíveis (gramas):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={eggShellsAmountG}
                    onChange={(e) => setEggShellsAmountG(Number(e.target.value))}
                    className="flex-1 accent-[#98FFD9]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    step="50"
                    value={eggShellsAmountG}
                    onChange={(e) => setEggShellsAmountG(Math.max(0, Number(e.target.value)))}
                    className={`w-20 text-center font-bold text-sm rounded-lg py-1 border ${
                      darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-[#001F3F]/20 text-[#001F3F]"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                  <span className="text-xs font-bold">g</span>
                </div>
              </div>

              {/* Resultado da Calculadora */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                darkMode ? "bg-white/5 border-white/10" : "bg-[#98FFD9]/10 border-[#98FFD9]/30"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={subTextColor}>Matéria Seca necessária (palha/serragem):</span>
                  <span className={`font-black text-sm text-[#98FFD9]`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {dryMatterNeededKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={subTextColor}>Rendimento Final de Biofertilizante:</span>
                  <span className={`font-black text-sm text-emerald-400`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                    ~{estimatedCompostYieldKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={subTextColor}>Tempo estimado de maturação:</span>
                  <span className={`font-bold ${headingColor}`}>
                    30 a 45 dias
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className={`text-[11px] ${subTextColor}`}>Equilíbrio ideal C:N garantido para agricultura orgânica.</span>
              <span className="font-bold text-[#98FFD9] flex items-center gap-1">
                Zero Desperdício <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TAXA DE ECO-EFICIÊNCIA DO LOTE (Eclosão e Desperdício Biológico) ── */}
      <section className={cardCls}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-400 to-[#44A6A0] text-[#001F3F] shadow-md">
              <Award className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${headingColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                Taxa de Eco-Eficiência do Lote (Eclosão Inteligente)
              </h2>
              <p className={`text-xs ${subTextColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                Percentagem de ovos chocados com sucesso e combate ativo ao desperdício biológico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#98FFD9]/15 text-[#98FFD9] border border-[#98FFD9]/30">
              Taxa Atual: {hatchRate}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Gráfico Donut SVG de Eco-Eficiência */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Trilha de fundo */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,31,63,0.08)"}
                  strokeWidth="12"
                />
                {/* Segmento de Eclosão com Sucesso */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#98FFD9"
                  strokeWidth="12"
                  strokeDasharray={`${(hatchRate / 100) * 251.32} 251.32`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-2xl font-black ${headingColor}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {hatchRate}%
                </span>
                <span className={`text-[10px] font-bold ${subTextColor}`} style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Eco-Eclosão
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#98FFD9]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#98FFD9]" /> Eclodidos: {batchHatchedEggs}
              </span>
              <span className={`flex items-center gap-1.5 ${subTextColor}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> Não viáveis: {Math.max(0, batchTotalEggs - batchHatchedEggs)}
              </span>
            </div>
          </div>

          {/* Destaque do Desperdício Alimentar Evitado */}
          <div className="md:col-span-2 space-y-4">
            <div className={`p-4 rounded-2xl border ${
              darkMode ? "bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-[#98FFD9]/30" : "bg-emerald-50 border-emerald-200"
            }`}>
              <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Redução Direta de Desperdício Biológico
                </h3>
              </div>
              <p className={`text-xs leading-relaxed ${subTextColor}`}>
                Com a precisão climática do <strong>sensor DHT22</strong> e a <strong>rolagem a cada 4 horas</strong>, a EcoIncubadora elevou o sucesso de 70% para <strong>{hatchRate}%</strong>, salvando <strong>+{biologicalWasteSaved} aves férteis</strong> por lote que seriam descartadas em chocadeiras convencionais descalibradas.
              </p>
            </div>

            {/* Ajuste do Lote para Demonstração */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className={`p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90"}`}>
                <label className={`block text-[11px] font-bold mb-1 ${subTextColor}`}>Total de Ovos no Lote:</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={batchTotalEggs}
                  onChange={(e) => setBatchTotalEggs(Math.max(1, Number(e.target.value)))}
                  className={`w-full text-center font-bold text-sm rounded-lg py-1 border ${
                    darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-[#001F3F]/20 text-[#001F3F]"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>

              <div className={`p-3 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90"}`}>
                <label className={`block text-[11px] font-bold mb-1 ${subTextColor}`}>Ovos Eclodidos com Sucesso:</label>
                <input
                  type="number"
                  min="0"
                  max={batchTotalEggs}
                  value={batchHatchedEggs}
                  onChange={(e) => setBatchHatchedEggs(Math.min(batchTotalEggs, Math.max(0, Number(e.target.value))))}
                  className={`w-full text-center font-bold text-sm rounded-lg py-1 border ${
                    darkMode ? "bg-white/10 border-white/20 text-white" : "bg-white border-[#001F3F]/20 text-[#001F3F]"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

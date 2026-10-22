import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EggIcon } from "./EggIcon";
import chickenImg from "../../imports/94cb2e17-3d83-4613-8389-8fa6d9ca8e98-removebg-preview-5.png";
import { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { getProduction, setProduction, type ProductionData } from "../../services/api";
import { Check, Plus, Minus } from "lucide-react";

interface ProductionCardProps {
  darkMode?: boolean;
  canControl?: boolean;
  onRequireAuth?: () => void;
}

export function ProductionCard({
  darkMode = false,
}: ProductionCardProps) {
  const [whiteInput, setWhiteInput] = useState<string>("140");
  const [brownInput, setBrownInput] = useState<string>("105");
  const [lastColor, setLastColor] = useState<string | null>("Marrom");
  const [showAnimation, setShowAnimation] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  // Socket.io hook - escuta atualizações vindas do backend
  const { data: productionUpdate } = useSocket<ProductionData>('production:update');

  const syncStateFromData = (data: ProductionData) => {
    setWhiteInput(String(data.whiteEggs ?? 0));
    setBrownInput(String(data.brownEggs ?? 0));
    if (data.lastColor) setLastColor(data.lastColor);
  };

  // Carrega contagem inicial (persistida localmente ou do servidor)
  useEffect(() => {
    getProduction()
      .then(syncStateFromData)
      .catch((error) => console.error('Erro ao carregar dados de produção:', error));
  }, []);

  // Atualiza via WebSocket em tempo real
  useEffect(() => {
    if (productionUpdate) {
      syncStateFromData(productionUpdate);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
    }
  }, [productionUpdate]);

  // Sincroniza se houver atualização em outra aba/tela
  useEffect(() => {
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ProductionData>;
      if (customEvent.detail) {
        syncStateFromData(customEvent.detail);
      }
    };
    window.addEventListener('production:local_update', handleLocalUpdate);
    return () => window.removeEventListener('production:local_update', handleLocalUpdate);
  }, []);

  // Cálculo imediato do total com base no que o usuário digita
  const whiteNum = Math.max(0, parseInt(whiteInput, 10) || 0);
  const brownNum = Math.max(0, parseInt(brownInput, 10) || 0);
  const totalEggs = whiteNum + brownNum;

  const persistData = async (newWhite: number, newBrown: number, color?: 'Branco' | 'Marrom') => {
    const finalColor = color ?? (newWhite > whiteNum ? 'Branco' : newBrown > brownNum ? 'Marrom' : lastColor ?? 'Marrom');
    try {
      const updated = await setProduction({
        whiteEggs: newWhite,
        brownEggs: newBrown,
        lastColor: finalColor,
      });
      setLastColor(updated.lastColor);
      setShowAnimation(true);
      setSaveStatus("Atualizado ✓");
      setTimeout(() => setShowAnimation(false), 400);
      setTimeout(() => setSaveStatus(""), 1800);
    } catch (err) {
      console.error("Erro ao sincronizar produção:", err);
    }
  };

  const handleWhiteChange = (val: string) => {
    setWhiteInput(val);
    const parsed = Math.max(0, parseInt(val, 10) || 0);
    persistData(parsed, brownNum, 'Branco');
  };

  const handleBrownChange = (val: string) => {
    setBrownInput(val);
    const parsed = Math.max(0, parseInt(val, 10) || 0);
    persistData(whiteNum, parsed, 'Marrom');
  };

  const adjustCount = (type: 'white' | 'brown', delta: number) => {
    if (type === 'white') {
      const updated = Math.max(0, whiteNum + delta);
      setWhiteInput(String(updated));
      persistData(updated, brownNum, 'Branco');
    } else {
      const updated = Math.max(0, brownNum + delta);
      setBrownInput(String(updated));
      persistData(whiteNum, updated, 'Marrom');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2
          className={`text-base transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
        >
          Produção
        </h2>
        {saveStatus && (
          <span
            className="text-[11px] font-bold text-[#98FFD9] bg-[#98FFD9]/15 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in duration-300"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            <Check className="w-3 h-3" strokeWidth={3} /> {saveStatus}
          </span>
        )}
      </div>

      <div className={`relative backdrop-blur-xl rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-4 overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
          : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
      }`}>
        {/* Efeito de brilho sutil */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#98FFD9]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#001F3F]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col gap-3">
          {/* Top Row: Ilustração + Total em Destaque */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0">
              <ImageWithFallback src={chickenImg} alt="Galinha" className="w-[85px] h-[85px] sm:w-[95px] sm:h-[95px] object-contain drop-shadow-md" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div
                className={`text-5xl font-black transition-all duration-300 ${
                  showAnimation ? 'scale-110' : 'scale-100'
                } ${
                  darkMode
                    ? 'bg-gradient-to-br from-white via-[#98FFD9] to-[#6EDDC4] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(152,255,217,0.4)]'
                    : 'bg-gradient-to-br from-[#001F3F] to-[#004080] bg-clip-text text-transparent'
                }`}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 900,
                }}
              >
                {totalEggs}
              </div>
              <div className={`text-xs mt-0.5 font-bold transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F]/70'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                ovos coletados
              </div>

              {lastColor && (
                <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  darkMode ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#001F3F]/5 border-[#001F3F]/10 text-[#001F3F]'
                }`}>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lastColor === 'Branco' ? '#F4F0EA' : '#8B4513' }}
                  />
                  <span>Última triagem: {lastColor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Espaços para escrever as quantidades */}
          <div className={`w-full pt-2 border-t ${darkMode ? 'border-white/10' : 'border-[#001F3F]/10'}`}>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Ovos Brancos */}
              <div className={`p-2 rounded-xl border transition-all ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
              }`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <EggIcon size={18} variant="white" />
                  <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    Brancos
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustCount('white', -1)}
                    className={`w-6 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-[#001F3F]'
                    }`}
                    title="Diminuir 1"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <input
                    type="number"
                    min="0"
                    max="99999"
                    value={whiteInput}
                    onChange={(e) => handleWhiteChange(e.target.value)}
                    placeholder="0"
                    aria-label="Quantidade de ovos brancos"
                    className={`flex-1 min-w-0 text-center font-bold text-sm rounded-lg py-1 border transition-all ${
                      darkMode
                        ? 'bg-black/30 border-[#98FFD9]/30 text-white focus:border-[#98FFD9] focus:ring-1 focus:ring-[#98FFD9]'
                        : 'bg-white border-[#001F3F]/20 text-[#001F3F] focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  />

                  <button
                    type="button"
                    onClick={() => adjustCount('white', 1)}
                    className={`w-6 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-[#001F3F]'
                    }`}
                    title="Adicionar 1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Ovos Marrons */}
              <div className={`p-2 rounded-xl border transition-all ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/90 shadow-sm'
              }`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <EggIcon size={18} variant="brown" />
                  <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    Marrons
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustCount('brown', -1)}
                    className={`w-6 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-[#001F3F]'
                    }`}
                    title="Diminuir 1"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <input
                    type="number"
                    min="0"
                    max="99999"
                    value={brownInput}
                    onChange={(e) => handleBrownChange(e.target.value)}
                    placeholder="0"
                    aria-label="Quantidade de ovos marrons"
                    className={`flex-1 min-w-0 text-center font-bold text-sm rounded-lg py-1 border transition-all ${
                      darkMode
                        ? 'bg-black/30 border-[#98FFD9]/30 text-white focus:border-[#98FFD9] focus:ring-1 focus:ring-[#98FFD9]'
                        : 'bg-white border-[#001F3F]/20 text-[#001F3F] focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  />

                  <button
                    type="button"
                    onClick={() => adjustCount('brown', 1)}
                    className={`w-6 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-[#001F3F]'
                    }`}
                    title="Adicionar 1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
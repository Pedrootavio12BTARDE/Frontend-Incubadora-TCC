import { FileText, RotateCw, RotateCcw, Repeat2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getMotorMode, getMotorState, rotateMotor, setMotorAutoMode } from "../../services/api";
import { socketService } from "../../services/socketio";

interface ActionButtonsProps {
  onNavigateToReports: () => void;
  darkMode?: boolean;
  canControl?: boolean;
  onRequireAuth?: () => void;
}

export function ActionButtons({
  onNavigateToReports,
  darkMode = false,
  canControl = false,
  onRequireAuth,
}: ActionButtonsProps) {
  const [isRotatingRequest, setIsRotatingRequest] = useState(false);
  const [rotationMessage, setRotationMessage] = useState("");
  const [motorState, setMotorState] = useState<"MOVING" | "STOPPED">("STOPPED");
  const [direction, setDirection] = useState<"Horário" | "Anti-horário">("Horário");
  const [autoRoll, setAutoRoll] = useState(false);
  const [isLoadingMode, setIsLoadingMode] = useState(true);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [modeMessage, setModeMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadMode = async () => {
      try {
        const mode = await getMotorMode();
        if (mounted) setAutoRoll(mode.autoRoll);
      } catch (error) {
        console.error("Não foi possível carregar o modo automático da esteira:", error);
        if (mounted) setModeMessage("Não foi possível carregar o estado automático.");
      } finally {
        if (mounted) setIsLoadingMode(false);
      }
    };
    const handleActuatorUpdate = (data: any) => {
      if (data?.actuator === "motor_mode" && typeof data.autoRoll === "boolean") {
        setAutoRoll(data.autoRoll);
      }
      if (data?.actuator === "motor" && (data.state === "MOVING" || data.state === "STOPPED")) {
        setMotorState(data.state);
      }
    };

    void loadMode();
    void getMotorState().then((state) => {
      if (mounted) setMotorState(state.state);
    }).catch((error) => console.error("Não foi possível carregar o status da esteira:", error));
    socketService.on("actuator:update", handleActuatorUpdate);
    return () => {
      mounted = false;
      socketService.off("actuator:update", handleActuatorUpdate);
    };
  }, []);

  const handleToggleAutoMode = async () => {
    if (!canControl) {
      onRequireAuth?.();
      return;
    }
    if (isSavingMode || isLoadingMode) return;

    setIsSavingMode(true);
    setModeMessage("");
    try {
      const updatedMode = await setMotorAutoMode(!autoRoll);
      setAutoRoll(updatedMode.autoRoll);
      setModeMessage(updatedMode.autoRoll ? "Rolagem automática ativada." : "Rolagem automática desativada.");
    } catch (error) {
      console.error("Erro ao alterar modo automático da esteira:", error);
      setModeMessage("Não foi possível alterar o modo automático.");
    } finally {
      setIsSavingMode(false);
    }
  };

  const handleRotate = async () => {
    if (!canControl) {
      onRequireAuth?.();
      return;
    }
    if (isRotatingRequest) return;

    setIsRotatingRequest(true);
    setRotationMessage("");

    // Inverte o sentido automaticamente assim que o usuário clica para girar
    const activeDirection = direction;
    const nextDirection = direction === "Horário" ? "Anti-horário" : "Horário";

    try {
      await rotateMotor(1500);
      setRotationMessage(`Rolando no sentido ${activeDirection}. Próximo giro: ${nextDirection}.`);
      setDirection(nextDirection);
    } catch (error) {
      console.error("Erro ao solicitar rolagem:", error);
      setRotationMessage("Não foi possível enviar o comando.");
    } finally {
      setIsRotatingRequest(false);
    }
  };

  const secondaryButton = darkMode
    ? "bg-[#1a1f35]/60 text-white hover:border-[#98FFD9]/50"
    : "bg-white/60 text-[#001F3F] hover:border-[#001F3F]/30";

  return (
    <div className="pt-2 space-y-2.5">
      {/* ── Modo Automático (Liga/Desliga Rolagem a cada 4h) ── */}
      <button
        type="button"
        onClick={handleToggleAutoMode}
        disabled={isLoadingMode || isSavingMode}
        aria-pressed={autoRoll}
        className={`w-full rounded-[1.25rem] border-2 px-4 py-3.5 text-left transition-all duration-300 disabled:opacity-60 ${
          autoRoll
            ? "border-[#6EDDC4] bg-[#98FFD9]/20 text-[#001F3F] shadow-[0_8px_24px_rgba(110,221,196,0.25)]"
            : darkMode
              ? "border-white/20 bg-[#1a1f35]/60 text-white hover:border-[#98FFD9]/50"
              : "border-[#001F3F]/15 bg-white/60 text-[#001F3F] hover:border-[#98FFD9]"
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Repeat2 className="h-4 w-4 text-[#98FFD9]" />
            <span className="text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>
              {isLoadingMode ? "Carregando modo automático…" : "Modo automático"}
            </span>
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${autoRoll ? "bg-[#16835e] text-white" : "bg-slate-500/20"}`}>
            {isSavingMode ? "Salvando…" : autoRoll ? "Ativado" : "Desativado"}
          </span>
        </span>
        {autoRoll && !isLoadingMode && (
          <span className="mt-2 block text-xs font-medium opacity-80">Automático ligado — rolagem programada a cada 4 horas.</span>
        )}
      </button>
      {modeMessage && <p role="status" className={`text-center text-xs ${darkMode ? "text-white/70" : "text-[#001F3F]/70"}`}>{modeMessage}</p>}

      {/* ── Status do Motor e Sentido Atual (Sem controle manual de velocidade) ── */}
      <div
        className={`rounded-2xl border p-4 transition-all duration-300 ${
          darkMode
            ? "border-white/10 bg-[#1a1f35]/60 text-white"
            : "border-[#001F3F]/15 bg-white/70 text-[#001F3F] shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Status Ligado / Desligado */}
          <div className="flex items-center gap-2.5">
            <span
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                motorState === "MOVING"
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse"
                  : "bg-slate-400/50"
              }`}
            />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60">Status da Esteira</span>
              <span className="text-sm font-extrabold" style={{ fontFamily: "Quicksand, sans-serif" }}>
                {motorState === "MOVING" ? "Ligado (Em movimento)" : "Desligado"}
              </span>
            </div>
          </div>

          {/* Sentido Atual (Alterna automaticamente a cada giro) */}
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60">Sentido Atual</span>
            <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-[#98FFD9]">
              {direction === "Horário" ? (
                <RotateCw className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              )}
              <span className={darkMode ? "text-white" : "text-[#001F3F]"}>{direction}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Botão Principal: Ativar Rolagem (Inverte o sentido automaticamente a cada acionamento) ── */}
      <button
        type="button"
        onClick={handleRotate}
        disabled={isRotatingRequest}
        className={`relative w-full overflow-hidden rounded-[1.25rem] border border-white/40 bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] py-3.5 px-4 text-[#001F3F] shadow-[0_8px_24px_rgba(152,255,217,0.4)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(152,255,217,0.5)] ${
          isRotatingRequest ? "cursor-wait opacity-60" : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/0 to-white/20 transition-all duration-300 group-hover:via-white/20" />
        <span className="relative flex items-center justify-center gap-2">
          <RotateCw className={`h-4 w-4 ${isRotatingRequest ? "animate-spin" : ""}`} strokeWidth={2.5} />
          <span className="text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>
            {isRotatingRequest ? "Rolando esteira…" : "Ativar Rolagem"}
          </span>
        </span>
      </button>

      {rotationMessage && <p role="status" className={`text-center text-xs ${darkMode ? "text-white/70" : "text-[#001F3F]/70"}`}>{rotationMessage}</p>}

      {/* ── Ver Relatórios ── */}
      <button
        type="button"
        onClick={onNavigateToReports}
        className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[1.25rem] border-2 border-[#98FFD9]/60 py-3.5 shadow-[0_4px_16px_rgba(152,255,217,0.15)] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#98FFD9]/20 hover:to-[#6EDDC4]/20 ${secondaryButton}`}
      >
        <FileText className="h-4 w-4" strokeWidth={2.5} />
        <span className="text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>Ver Relatórios</span>
      </button>
    </div>
  );
}

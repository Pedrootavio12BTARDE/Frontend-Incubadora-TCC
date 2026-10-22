import { FileText, RotateCw, Repeat2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getMotorMode, rotateMotor, setMotorAutoMode } from "../../services/api";
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
    };

    void loadMode();
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
    try {
      await rotateMotor(1500);
      setRotationMessage("Comando enviado: rolagem em andamento.");
    } catch (error) {
      console.error("Erro ao solicitar rolagem:", error);
      setRotationMessage("Não foi possível enviar o comando.");
    } finally {
      setIsRotatingRequest(false);
    }
  };

  const secondaryButton = darkMode
    ? "bg-[#1a1f35]/60 text-white"
    : "bg-white/60 text-[#001F3F]";

  return (
    <div className="pt-2 space-y-2.5">
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
            <Repeat2 className="h-4 w-4" />
            <span className="text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>
              {isLoadingMode ? "Carregando modo automático…" : "Modo automático"}
            </span>
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${autoRoll ? "bg-[#16835e] text-white" : "bg-slate-500/20"}`}>
            {isSavingMode ? "Salvando…" : autoRoll ? "Ativado" : "Desativado"}
          </span>
        </span>
        {autoRoll && !isLoadingMode && (
          <span className="mt-2 block text-xs font-medium">Automático ligado — rolagem programada a cada 4 horas.</span>
        )}
      </button>
      {modeMessage && <p role="status" className={`text-center text-xs ${darkMode ? "text-white/70" : "text-[#001F3F]/70"}`}>{modeMessage}</p>}

      <button
        type="button"
        onClick={handleRotate}
        disabled={isRotatingRequest}
        className={`relative w-full overflow-hidden rounded-[1.25rem] border border-white/40 bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] py-3.5 text-[#001F3F] shadow-[0_8px_24px_rgba(152,255,217,0.4)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(152,255,217,0.5)] ${isRotatingRequest ? "cursor-wait opacity-60" : ""}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/0 to-white/20 transition-all duration-300 group-hover:via-white/20" />
        <span className="relative flex items-center justify-center gap-2">
          <RotateCw className="h-4 w-4" strokeWidth={2.5} />
          <span className="text-sm font-bold" style={{ fontFamily: "Quicksand, sans-serif" }}>
            {isRotatingRequest ? "Enviando…" : "Ativar Rolagem Manual"}
          </span>
        </span>
      </button>
      {rotationMessage && <p role="status" className={`text-center text-xs ${darkMode ? "text-white/70" : "text-[#001F3F]/70"}`}>{rotationMessage}</p>}

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

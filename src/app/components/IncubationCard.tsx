import { Thermometer, Droplet, Lightbulb, Wifi, WifiOff, AlertTriangle, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { setLamp, getActuatorStatus, getLatestSensorReading, getThermalSafetyStatus, type SensorReading } from "../../services/api";
import { socketService } from "../../services/socketio";

const OVERHEAT_THRESHOLD_C = 39.5;

interface IncubationCardProps {
  lampOn?: boolean;
  onToggleLamp?: () => void;
  darkMode?: boolean;
  canControl?: boolean;
  onRequireAuth?: () => void;
}

export function IncubationCard({ 
  lampOn: defaultLampOn = false, 
  onToggleLamp,
  darkMode = false,
  canControl = false,
  onRequireAuth,
}: IncubationCardProps) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [lampOn, setLampOn] = useState(defaultLampOn);
  const [coolerOn, setCoolerOn] = useState(false);
  const [coolerKnown, setCoolerKnown] = useState(false);
  const [coolerRequestedOn, setCoolerRequestedOn] = useState(false);
  const [coolerPending, setCoolerPending] = useState(false);
  const [coolerError, setCoolerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thermalProtectionActive, setThermalProtectionActive] = useState(false);
  const isOverheating = temperature !== null && temperature >= OVERHEAT_THRESHOLD_C;

  // Socket.io hook - listens to sensor:update events
  const { data: sensorUpdate, isConnected } = useSocket<SensorReading>('sensor:update');
  const { data: criticalOverheat } = useSocket<{ temperature?: number }>('CRITICAL_OVERHEAT');
  const { data: protectionCleared } = useSocket<{ temperature?: number }>('THERMAL_PROTECTION_CLEARED');
  const { data: actuatorUpdate } = useSocket<{ actuator?: string; action?: string; protected?: boolean }>('actuator:update');

  // Load the latest persisted values when the dashboard opens.
  useEffect(() => {
    let active = true;
    getLatestSensorReading()
      .then((reading) => {
        if (!active || !reading) return;
        if (reading.temperature !== undefined && reading.temperature !== null) {
          setTemperature(reading.temperature);
        }
        if (reading.humidity !== undefined && reading.humidity !== null) {
          setHumidity(reading.humidity);
        }
      })
      .catch((error) => console.error('Erro ao carregar leituras dos sensores:', error));

    return () => {
      active = false;
    };
  }, []);

  // Merge each sensor event without replacing values the sensor did not send.
  useEffect(() => {
    if (!sensorUpdate) return;
    if (sensorUpdate.temperature !== undefined && sensorUpdate.temperature !== null) {
      setTemperature(sensorUpdate.temperature);
    }
    if (sensorUpdate.humidity !== undefined && sensorUpdate.humidity !== null) {
      setHumidity(sensorUpdate.humidity);
    }
  }, [sensorUpdate]);

  useEffect(() => {
    if (!criticalOverheat) return;
    if (typeof criticalOverheat.temperature === "number") setTemperature(criticalOverheat.temperature);
    setThermalProtectionActive(true);
    setLampOn(false);
  }, [criticalOverheat]);

  useEffect(() => {
    if (!protectionCleared) return;
    if (typeof protectionCleared.temperature === "number") setTemperature(protectionCleared.temperature);
    setThermalProtectionActive(false);
    setLampOn(false);
  }, [protectionCleared]);

  useEffect(() => {
    if (actuatorUpdate?.actuator === "cooler" && (actuatorUpdate.action === "on" || actuatorUpdate.action === "off")) {
      const actualState = actuatorUpdate.action === "on";
      setCoolerOn(actualState);
      setCoolerKnown(true);
      setCoolerRequestedOn(actualState);
      setCoolerPending(false);
      setCoolerError("");
      return;
    }
    if (actuatorUpdate?.actuator !== "lamp") return;
    if (actuatorUpdate.action === "off" || actuatorUpdate.action === "on") {
      setLampOn(actuatorUpdate.action === "on");
    }
    if (actuatorUpdate.protected === true) {
      setThermalProtectionActive(true);
      setLampOn(false);
    } else if (actuatorUpdate.protected === false) {
      setThermalProtectionActive(false);
    }
  }, [actuatorUpdate]);

  useEffect(() => {
    if (!coolerPending) return;
    const timeout = window.setTimeout(() => {
      setCoolerPending(false);
      setCoolerRequestedOn(coolerOn);
      setCoolerError("ESP32 sem confirmação do novo estado.");
    }, 15000);
    return () => window.clearTimeout(timeout);
  }, [coolerPending, coolerOn]);

  const handleToggleCooler = async () => {
    if (!canControl) {
      onRequireAuth?.();
      return;
    }
    if (coolerPending) return;

    const on = !coolerOn;
    setCoolerRequestedOn(on);
    setCoolerPending(true);
    setCoolerError("");
    try {
      const response = await socketService.emitWithAck<{ ok: boolean; error?: string }>("toggle_cooler", { on });
      if (!response.ok) throw new Error(response.error || "Não foi possível enviar o comando.");
    } catch (error) {
      setCoolerPending(false);
      setCoolerRequestedOn(coolerOn);
      setCoolerError(error instanceof Error ? error.message : "Não foi possível controlar o cooler.");
    }
  };
  // Handle lamp toggle - calls backend API
  const handleToggleLamp = async () => {
    if (!canControl) {
      onRequireAuth?.();
      return;
    }
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (thermalProtectionActive) return;
      const newState = !lampOn;
      await setLamp(newState);
      setLampOn(newState);
      onToggleLamp?.();
    } catch (error) {
      console.error('Erro ao controlar lâmpada:', error);
      // Rollback on error
      setLampOn(lampOn);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore the persisted thermal lock when the dashboard is opened.
  useEffect(() => {
    getThermalSafetyStatus()
      .then((status) => {
        setThermalProtectionActive(status.protected);
        if (typeof status.temperature === "number") setTemperature(status.temperature);
        if (status.protected) setLampOn(false);
      })
      .catch((error) => console.error("Erro ao carregar estado de proteção térmica:", error));
  }, []);

  // Load initial actuator status
  useEffect(() => {
    getActuatorStatus()
      .then((status) => {
        if (status.cooler === "on" || status.cooler === "off") {
          setCoolerOn(status.cooler === "on");
          setCoolerKnown(true);
          setCoolerRequestedOn(status.cooler === "on");
        }
        if (status.lamp !== undefined) {
            if (typeof status.lamp === 'boolean') {
              setLampOn(status.lamp);
            } else if (status.lamp === 'on' || status.lamp === 'off') {
              setLampOn(status.lamp === 'on');
            }
        }
      })
      .catch((error) => console.error('Erro ao carregar status do atuador:', error));
  }, []);

  return (
    <div>
      {(thermalProtectionActive || isOverheating) && (
        <div role="alert" className="mb-3 flex items-start gap-3 rounded-2xl border border-red-300 bg-gradient-to-r from-red-600 to-orange-500 p-4 text-white shadow-lg shadow-red-500/25">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-extrabold">⚠️ ALERTA DE SEGURANÇA: Lâmpada desligada automaticamente devido a superaquecimento. Risco térmico aos ovos detectado.</p>
            {temperature !== null && <p className="mt-1 text-xs text-white/90">Temperatura: {temperature.toFixed(1)}°C</p>}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-base transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
          Incubação
        </h2>
        
        {/* Connection status indicator */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] text-green-600" style={{ fontFamily: 'Quicksand, sans-serif' }}>Servidor Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-500" style={{ fontFamily: 'Quicksand, sans-serif' }}>Servidor Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Lâmpada de Aquecimento */}
      <div className={`mb-3 relative backdrop-blur-xl rounded-[1.25rem] shadow-[0_8px_32px_rgba(0,31,63,0.12)] p-3 overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
          : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl transition-all duration-500 ${lampOn ? 'bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] shadow-[0_0_20px_rgba(152,255,217,0.6)]' : 'bg-gray-300'}`}>
              <Lightbulb className={`w-4 h-4 transition-all duration-500 ${lampOn ? 'text-white' : 'text-gray-500'}`} strokeWidth={2} fill={lampOn ? 'white' : 'none'} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>Lâmpada de Aquecimento</span>
              <span className={`text-[10px] font-bold ${thermalProtectionActive ? "text-red-500" : darkMode ? "text-white/60" : "text-[#001F3F]/60"}`}>{thermalProtectionActive ? "Desligado (Proteção Ativa)" : lampOn ? "Ligada" : "Desligada"}</span>
            </div>
          </div>

          {/* Switch Toggle */}
          <button
            onClick={handleToggleLamp}
            disabled={isLoading || thermalProtectionActive}
            aria-label={thermalProtectionActive ? "Lâmpada desligada por proteção térmica" : canControl ? "Alternar lâmpada de aquecimento" : "Entre para controlar a lâmpada"}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              lampOn ? 'bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4]' : 'bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${lampOn ? 'left-[26px]' : 'left-0.5'}`} />
          </button>
        </div>
        {!canControl && (
          <button
            type="button"
            onClick={onRequireAuth}
            className={`mt-2 text-[10px] underline ${darkMode ? 'text-[#98FFD9]' : 'text-[#001F3F]'}`}
          >
            Faça login para controlar a lâmpada
          </button>
        )}
      </div>

      <div className={`mb-3 rounded-[1.25rem] border p-3 transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-[#102b35]/90 to-[#0d1425]/80 border-cyan-300/20" : "bg-white/70 border-cyan-700/15"
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className={`rounded-xl p-2 ${coolerOn ? "bg-cyan-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.4)]" : "bg-gray-300 text-gray-600"}`}>
              <Wind className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className={`truncate text-xs font-semibold ${darkMode ? "text-white" : "text-[#001F3F]"}`}>Cooler de Ventilação</p>
              <p className={`text-[10px] font-bold ${coolerPending ? "text-amber-500" : coolerOn ? "text-cyan-500" : darkMode ? "text-white/60" : "text-[#001F3F]/60"}`}>
                {coolerPending || !coolerKnown ? "Aguardando ESP32" : coolerOn ? "LIGADO" : "DESLIGADO"}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={coolerRequestedOn}
            aria-label={canControl ? "Alternar cooler de ventilação" : "Entre para controlar o cooler"}
            onClick={handleToggleCooler}
            disabled={coolerPending}
            className={`relative h-6 w-12 shrink-0 rounded-full transition-all duration-300 ${coolerRequestedOn ? "bg-cyan-500" : "bg-gray-300"} ${coolerPending ? "cursor-wait opacity-60" : "cursor-pointer"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${coolerRequestedOn ? "left-[26px]" : "left-0.5"}`} />
          </button>
        </div>
        {coolerError && <p role="alert" className="mt-2 text-[10px] font-semibold text-red-500">{coolerError}</p>}
        {!canControl && <button type="button" onClick={onRequireAuth} className={`mt-2 text-[10px] underline ${darkMode ? "text-cyan-300" : "text-cyan-800"}`}>Faça login para controlar o cooler</button>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Temperatura */}
        <div className={`relative bg-gradient-to-br from-[#FFE5CC]/40 via-white/50 to-[#FFB499]/30 backdrop-blur-xl rounded-[1.25rem] shadow-[0_8px_32px_rgba(255,100,100,0.15)] border p-4 overflow-hidden ${
          (thermalProtectionActive || isOverheating) ? 'border-red-500 ring-2 ring-red-500/40' : 'border-white/60'
        }`}>
          {/* Efeito de brilho */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FF9999]/20 to-transparent rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-2.5 rounded-xl shadow-lg mb-3">
              <Thermometer className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div
              className="text-3xl bg-gradient-to-br from-[#001F3F] to-[#003366] bg-clip-text text-transparent mb-0.5 transition-all duration-300"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 800,
                filter: 'drop-shadow(0 0 8px rgba(255,107,107,0.2))'
              }}
            >
              {temperature === null ? "--.-" : temperature.toFixed(1)}°C
            </div>
            <div className={`text-[10px] transition-colors duration-300 ${
              isOverheating ? 'text-red-600' : darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-60'
            }`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>
              {isOverheating ? 'ALERTA: acima de 38°C' : 'Temperatura'}
            </div>
          </div>
        </div>

        {/* Umidade */}
        <div className="relative bg-gradient-to-br from-[#D4F1F4]/40 via-white/50 to-[#98FFD9]/30 backdrop-blur-xl rounded-[1.25rem] shadow-[0_8px_32px_rgba(152,255,217,0.15)] border border-white/60 p-4 overflow-hidden">
          {/* Efeito de brilho */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#98FFD9]/30 to-transparent rounded-full blur-2xl" />

          <div className="relative flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44A6A0] p-2.5 rounded-xl shadow-lg mb-3">
              <Droplet className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div
              className="text-3xl bg-gradient-to-br from-[#001F3F] to-[#003366] bg-clip-text text-transparent mb-0.5 transition-all duration-300"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 800,
                filter: 'drop-shadow(0 0 8px rgba(152,255,217,0.2))'
              }}
            >
              {humidity === null ? "--.-" : humidity.toFixed(1)}%
            </div>
            <div className={`text-[10px] transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-60'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
              Umidade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
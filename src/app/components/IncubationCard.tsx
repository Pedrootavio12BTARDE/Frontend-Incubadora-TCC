import { Thermometer, Droplet, Lightbulb, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { setLamp, getActuatorStatus, getLatestSensorReading, type SensorReading } from "../../services/api";
import { AlertOverlay } from "./AlertOverlay";

const OVERHEAT_THRESHOLD_C = 38;

interface IncubationCardProps {
  lampOn?: boolean;
  onToggleLamp?: () => void;
  darkMode?: boolean;
}

export function IncubationCard({ 
  lampOn: defaultLampOn = false, 
  onToggleLamp,
  darkMode = false 
}: IncubationCardProps) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [lampOn, setLampOn] = useState(defaultLampOn);
  const [isLoading, setIsLoading] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const isOverheating = temperature !== null && temperature > OVERHEAT_THRESHOLD_C;

  // Socket.io hook - listens to sensor:update events
  const { data: sensorUpdate, isConnected } = useSocket<SensorReading>('sensor:update');

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
    if (!isOverheating) setAlertDismissed(false);
  }, [isOverheating]);

  // Handle lamp toggle - calls backend API
  const handleToggleLamp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
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

  // Load initial actuator status
  useEffect(() => {
    getActuatorStatus()
      .then((status) => {
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
      <AlertOverlay
        show={isOverheating && !alertDismissed}
        temperature={temperature ?? 0}
        onClose={() => setAlertDismissed(true)}
      />
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-base transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
          Incubação
        </h2>
        
        {/* Connection status indicator */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] text-green-600" style={{ fontFamily: 'Quicksand, sans-serif' }}>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-500" style={{ fontFamily: 'Quicksand, sans-serif' }}>Offline</span>
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
            <span className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
              Lâmpada de Aquecimento
            </span>
          </div>

          {/* Switch Toggle */}
          <button
            onClick={handleToggleLamp}
            disabled={isLoading}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              lampOn ? 'bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4]' : 'bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${lampOn ? 'left-[26px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Temperatura */}
        <div className={`relative bg-gradient-to-br from-[#FFE5CC]/40 via-white/50 to-[#FFB499]/30 backdrop-blur-xl rounded-[1.25rem] shadow-[0_8px_32px_rgba(255,100,100,0.15)] border p-4 overflow-hidden ${
          isOverheating ? 'border-red-500 ring-2 ring-red-500/40' : 'border-white/60'
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
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { getDeviceStatus, type DeviceStatus } from "../../services/api";
import { useSocket } from "../../hooks/useSocket";

interface DeviceStatusCardProps {
  darkMode?: boolean;
}

export function DeviceStatusCard({ darkMode = false }: DeviceStatusCardProps) {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [serverAvailable, setServerAvailable] = useState(true);
  const { data: liveStatus } = useSocket<DeviceStatus>("device:update");

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const nextStatus = await getDeviceStatus();
        if (!active) return;
        setStatus(nextStatus);
        setServerAvailable(true);
      } catch {
        if (active) setServerAvailable(false);
      }
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!liveStatus) return;
    setStatus(liveStatus);
    setServerAvailable(true);
  }, [liveStatus]);

  const online = serverAvailable && status?.online === true;
  const title = !serverAvailable
    ? "Servidor indisponivel"
    : online
      ? "ESP32 Conectado"
      : "Nenhum ESP32 Conectado";
  const tone = !serverAvailable
    ? "bg-slate-400"
    : online
      ? "bg-emerald-400"
      : "bg-slate-500";
  const textTone = !serverAvailable
    ? "text-slate-400"
    : online
      ? "text-emerald-400"
      : darkMode ? "text-slate-300" : "text-[#001F3F]/70";
  const secondary = darkMode ? "text-slate-300" : "text-[#001F3F]/65";
  const lastSeen = status?.lastSeenAt
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(status.lastSeenAt))
    : null;

  return (
    <div className={"mt-3 rounded-2xl border-2 p-4 " + (darkMode ? "bg-white/[0.03] border-white/10" : "bg-white/50 border-black/10")}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {online && <span className={"absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 " + tone} />}
          <span className={"relative inline-flex h-2.5 w-2.5 rounded-full " + tone} />
        </span>
        {online ? <Wifi className="h-4 w-4 text-emerald-400" /> : <WifiOff className={"h-4 w-4 " + textTone} />}
        <p className={"text-sm font-extrabold " + textTone} style={{ fontFamily: "Quicksand, sans-serif" }}>{title}</p>
      </div>

      {status?.deviceId && (
        <div className={"mt-2 space-y-1 break-all text-[11px] " + secondary} style={{ fontFamily: "Quicksand, sans-serif" }}>
          <p>ID: {status.deviceId}</p>
          {lastSeen && <p>Ultimo pulso: {lastSeen}</p>}
        </div>
      )}
      {!serverAvailable && (
        <p className={"mt-2 text-[11px] " + secondary} style={{ fontFamily: "Quicksand, sans-serif" }}>
          Nao foi possivel consultar o backend.
        </p>
      )}
    </div>
  );
}
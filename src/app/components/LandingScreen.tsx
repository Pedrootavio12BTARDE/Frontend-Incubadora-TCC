import { ArrowRight, Thermometer, Droplets, Wifi, Activity, Cog, ScanLine, Leaf, Sun, Moon } from "lucide-react";

interface LandingScreenProps {
  onGetStarted: () => void;
  onGameAccess?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const FONT = "'Plus Jakarta Sans', 'Inter', sans-serif";

export function LandingScreen({ onGetStarted, darkMode = true, onToggleDarkMode }: LandingScreenProps) {
  const dm = darkMode;

  // Token shortcuts
  const pageBg   = dm ? "bg-[#0a1628]"                                    : "bg-gradient-to-br from-[#f0faff] via-white to-[#e8f9f5]";
  const navBg    = dm ? "bg-[#0a1628]/90 border-white/10"                 : "bg-white/90 border-black/10";
  const brand    = dm ? "text-white"                                       : "text-[#001F3F]";
  const navLink  = dm ? "text-white/50 hover:text-[#00d4ff]"              : "text-[#001F3F]/50 hover:text-[#0080a0]";
  const heading  = dm ? "text-white"                                       : "text-[#001F3F]";
  const sub      = dm ? "text-gray-400"                                    : "text-[#001F3F]/60";
  const statSub  = dm ? "text-gray-500"                                    : "text-[#001F3F]/40";
  const divider  = dm ? "border-white/10"                                  : "border-[#001F3F]/10";
  const mockup   = dm ? "bg-[#0d1d35]/90 border-[#00d4ff]/25"             : "bg-white/90 border-[#00d4ff]/30 shadow-xl";
  const cardInner= dm ? "bg-[#0a1628]/60 border-[#00d4ff]/10"             : "bg-[#f0faff] border-[#00d4ff]/20";
  const cardText = dm ? "text-white"                                       : "text-[#001F3F]";
  const cardSub  = dm ? "text-gray-600"                                    : "text-[#001F3F]/50";
  const stepBg   = dm ? "bg-[#112540]"                                     : "bg-[#e8f5ff]";
  const stepConn = dm ? "from-white/10"                                    : "from-[#001F3F]/15";
  const footerBg = dm ? "bg-[#0d1d35]/70 border-[#00d4ff]/10"             : "bg-white/70 border-[#00d4ff]/20 shadow-sm";
  const footerSub= dm ? "text-gray-600"                                    : "text-[#001F3F]/40";
  const toggleBg = dm ? "border-white/15 bg-white/5 hover:bg-white/10"    : "border-[#001F3F]/15 bg-[#001F3F]/5 hover:bg-[#001F3F]/10";
  const toggleTxt= dm ? "text-white/70"                                    : "text-[#001F3F]/70";
  const featCard = (bg: string) => dm ? bg : bg.replace("/10", "/20").replace("/20", "/25");

  return (
    <div className={`w-full min-h-full ${pageBg} relative overflow-y-auto scrollbar-hide flex flex-col transition-colors duration-300`}>

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${dm ? "rgba(0,212,255,0.08)" : "rgba(0,180,220,0.06)"} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${dm ? "bg-[#00d4ff] opacity-[0.04]" : "bg-[#00d4ff] opacity-[0.06]"}`} />
      <div className={`absolute bottom-1/3 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${dm ? "bg-[#98FFD9] opacity-[0.04]" : "bg-[#98FFD9] opacity-[0.08]"}`} />

      {/* ─── NAVBAR ─── */}
      <nav className={`relative z-20 border-b ${navBg} backdrop-blur-2xl shrink-0 sticky top-0 transition-colors duration-300`}>
        <div className="w-full px-5 py-3.5 flex items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]" />
            <span className={`text-sm font-bold tracking-tight ${brand}`} style={{ fontFamily: FONT }}>
              EcoIncubadora <span className="text-[#00d4ff]">IoT</span>
            </span>
          </div>

          {/* Center nav */}
          <div className={`hidden sm:flex items-center gap-5 text-[11px] font-semibold ${navLink.split(" ")[0]}`} style={{ fontFamily: FONT }}>
            <a href="#features" className={navLink + " transition-colors"}>Funcionalidades</a>
            <a href="#how"      className={navLink + " transition-colors"}>Como Funciona</a>
            <a href="#sustain"  className={navLink + " transition-colors"}>Sustentabilidade</a>
          </div>

          {/* Right: toggle + CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-300 ${toggleBg}`}
              >
                {dm
                  ? <Sun  className="w-3.5 h-3.5 text-[#00d4ff]" strokeWidth={2.5} />
                  : <Moon className="w-3.5 h-3.5 text-[#0080a0]" strokeWidth={2.5} />}
                <span className={`text-[10px] font-semibold hidden sm:inline ${toggleTxt}`} style={{ fontFamily: FONT }}>
                  {dm ? "Claro" : "Escuro"}
                </span>
              </button>
            )}
            <button
              onClick={onGetStarted}
              className="bg-[#00d4ff] hover:bg-[#00bfeb] text-[#0a1628] px-3.5 py-1.5 rounded-lg font-bold text-[11px] tracking-widest uppercase shadow-[0_0_18px_rgba(0,212,255,0.35)] transition-all duration-300"
              style={{ fontFamily: FONT }}
            >
              Acessar Painel
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative z-10 flex-shrink-0 px-5 pt-8 pb-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">

          {/* LEFT — Text */}
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#00d4ff]/10 border border-[#00d4ff]/30 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_8px_#00d4ff]" />
              <span className="text-[#00d4ff] text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: FONT }}>
                Agricultura 4.0 Acessível
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight ${heading}`} style={{ fontFamily: FONT }}>
              Automação Inteligente que{" "}
              <span className="text-[#00d4ff]">Transforma</span> a Avicultura Familiar.
            </h1>

            <p className={`text-sm leading-relaxed max-w-sm ${sub}`} style={{ fontFamily: FONT }}>
              Uma incubadora artificial de baixo custo com monitoramento em tempo real, triagem
              automatizada e controle climático rigoroso para garantir a máxima taxa de eclosão.
            </p>

            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-[#00d4ff] hover:bg-[#00bfeb] text-[#0a1628] px-5 py-2.5 rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 group w-fit"
              style={{ fontFamily: FONT }}
            >
              Entrar no Sistema
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </button>

            <div className={`flex gap-6 pt-3 border-t ${divider}`}>
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "24/7",  label: "Monitoramento" },
                { value: "Real-time", label: "Dados IoT" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[#00d4ff] text-base font-extrabold" style={{ fontFamily: FONT }}>{s.value}</p>
                  <p className={`text-[10px] font-medium ${statSub}`} style={{ fontFamily: FONT }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard mockup */}
          <div className="relative w-full lg:w-72 xl:w-80 shrink-0">
            <div className="absolute -inset-3 bg-[#00d4ff]/8 rounded-2xl blur-2xl pointer-events-none" />
            <div className={`relative ${mockup} backdrop-blur-md rounded-2xl border p-4 transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-xs font-semibold ${cardText}`} style={{ fontFamily: FONT }}>Dashboard Preview</p>
                  <p className={`text-[10px] ${cardSub}`} style={{ fontFamily: FONT }}>Tempo Real</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#00d4ff]" />
                  <span className="text-[#00d4ff] text-[10px] font-bold" style={{ fontFamily: FONT }}>Online</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { icon: <Thermometer className="w-3.5 h-3.5 text-orange-400" />, label: "Temp", value: "37.8°C", hint: "Temperatura ideal" },
                  { icon: <Droplets    className="w-3.5 h-3.5 text-[#00d4ff]"  />, label: "Umid", value: "60%",    hint: "Umidade estável"  },
                ].map((c) => (
                  <div key={c.label} className={`${cardInner} rounded-xl p-3 border transition-colors duration-300`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {c.icon}
                      <span className={`text-[9px] font-semibold tracking-widest uppercase ${cardSub}`}>{c.label}</span>
                    </div>
                    <p className={`text-xl font-mono font-bold ${cardText}`}>{c.value}</p>
                    <p className={`text-[9px] mt-0.5 ${cardSub}`} style={{ fontFamily: FONT }}>{c.hint}</p>
                  </div>
                ))}
              </div>

              <div className={`${cardInner} rounded-xl p-3 border transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[10px] font-semibold ${cardText}`} style={{ fontFamily: FONT }}>Histórico Recente</p>
                  <Activity className="w-3 h-3 text-[#00d4ff]" />
                </div>
                <div className="h-10 flex items-end justify-between gap-0.5">
                  {[55, 68, 62, 72, 75, 70, 78, 74, 71, 80, 76, 82].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 11 ? "#00d4ff" : `rgba(0,212,255,${0.15 + (i / 11) * 0.35})` }} />
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 py-2 bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse shadow-[0_0_8px_#00d4ff]" />
                <span className="text-[#00d4ff] text-[10px] font-medium" style={{ fontFamily: FONT }}>ESP32 Conectado via Wi-Fi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE CARDS ─── */}
      <section id="features" className="relative z-10 px-5 py-6 shrink-0">
        <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${statSub}`} style={{ fontFamily: FONT }}>Recursos Técnicos</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Thermometer className="w-5 h-5 text-orange-400" />, bg: "bg-orange-400/10 border-orange-400/20", accent: "text-orange-400", title: "Controle Climático Autônomo", desc: "Sensor DHT22 com acionamento automático de aquecimento via relé para temperatura estável." },
            { icon: <Cog         className="w-5 h-5 text-purple-400" />, bg: "bg-purple-400/10 border-purple-400/20", accent: "text-purple-400", title: "Rolagem Periódica",            desc: "Servo motor que vira os ovos a cada 4 horas de forma 100% automatizada." },
            { icon: <ScanLine    className="w-5 h-5 text-[#00d4ff]"  />, bg: "bg-[#00d4ff]/10 border-[#00d4ff]/20",  accent: "text-[#00d4ff]",  title: "Triagem Inteligente",           desc: "Sensor infravermelho e TCS230 para contagem e classificação colorimétrica automática." },
            { icon: <Leaf        className="w-5 h-5 text-[#98FFD9]"  />, bg: "bg-[#98FFD9]/10 border-[#98FFD9]/20",  accent: "text-[#98FFD9]",  title: "Impacto Sustentável",           desc: "Monitoramento do coletor de adubo orgânico e hardware livre de baixo custo." },
          ].map((card) => (
            <div key={card.title} className={`relative rounded-2xl border p-4 flex flex-col gap-2.5 ${featCard(card.bg)} transition-colors duration-300`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5">{card.icon}</div>
              <p className={`text-[11px] font-bold leading-tight ${card.accent}`} style={{ fontFamily: FONT }}>{card.title}</p>
              <p className={`text-[10px] leading-relaxed ${statSub}`} style={{ fontFamily: FONT }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="relative z-10 px-5 py-6 shrink-0">
        <p className={`text-[10px] font-bold tracking-widest uppercase mb-5 ${statSub}`} style={{ fontFamily: FONT }}>Como Funciona</p>
        <div className="flex flex-col">
          {[
            { num: "01", title: "Leitura Local",    desc: "Os sensores capturam o clima interno da incubadora a cada milissegundo.",                           color: "text-[#00d4ff]",  border: "border-[#00d4ff]/30",  glow: "shadow-[0_0_12px_rgba(0,212,255,0.2)]" },
            { num: "02", title: "Sincronização",     desc: "O microcontrolador ESP32 envia os dados via Wi-Fi de forma segura para a nuvem.",                  color: "text-purple-400", border: "border-purple-400/30", glow: "shadow-[0_0_12px_rgba(167,139,250,0.2)]" },
            { num: "03", title: "Controle Remoto",   desc: "O produtor monitora gráficos, relatórios e alertas de qualquer lugar pelo celular.",               color: "text-[#98FFD9]",  border: "border-[#98FFD9]/30",  glow: "shadow-[0_0_12px_rgba(152,255,217,0.2)]" },
          ].map((step, i) => (
            <div key={step.num} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${stepBg} border ${step.border} ${step.glow} flex items-center justify-center shrink-0 transition-colors duration-300`}>
                  <span className={`text-[10px] font-black ${step.color}`} style={{ fontFamily: FONT }}>{step.num}</span>
                </div>
                {i < 2 && <div className={`w-px flex-1 bg-gradient-to-b ${stepConn} to-transparent my-1`} style={{ minHeight: 28 }} />}
              </div>
              <div className={`pb-6 flex-1 ${i === 2 ? "pb-0" : ""}`}>
                <p className={`text-sm font-bold mb-1 ${step.color}`} style={{ fontFamily: FONT }}>{step.title}</p>
                <p className={`text-[11px] leading-relaxed ${statSub}`} style={{ fontFamily: FONT }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH FOOTER BAR ─── */}
      <section id="sustain" className="relative z-10 px-5 py-5 mt-auto shrink-0">
        <div className={`${footerBg} backdrop-blur-md rounded-2xl border p-4 transition-colors duration-300`}>
          <div className="grid grid-cols-2 gap-3 text-center text-[11px]">
            {[
              { label: "ESP32 WiFi", sub: "Conectividade IoT" },
              { label: "DHT22",      sub: "Alta Precisão" },
              { label: "TCS230",     sub: "Triagem de Cor" },
              { label: "Open Source",sub: "Hardware Livre" },
            ].map((item, i) => (
              <div key={item.label} className={`py-1.5 ${i % 2 === 0 ? `border-r ${divider}` : ""}`}>
                <p className="text-[#00d4ff] font-bold" style={{ fontFamily: FONT }}>{item.label}</p>
                <p className={`text-[9px] ${footerSub}`} style={{ fontFamily: FONT }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

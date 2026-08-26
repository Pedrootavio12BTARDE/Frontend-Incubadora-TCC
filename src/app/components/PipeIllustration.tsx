export function PipeIllustration() {
  return (
    <svg
      width="280"
      height="180"
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <defs>
        {/* Gradientes */}
        <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#98FFD9" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#6EDDC4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#98FFD9" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="eggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE5CC" />
          <stop offset="100%" stopColor="#FFB499" />
        </linearGradient>
        <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001F3F" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Duto PVC Transparente - Parte Superior */}
      <path
        d="M 40 80 Q 80 40, 140 60 T 240 80"
        stroke="url(#pipeGradient)"
        strokeWidth="32"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#glow)"
      />

      {/* Borda interna do duto */}
      <path
        d="M 40 80 Q 80 40, 140 60 T 240 80"
        stroke="#98FFD9"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Duto PVC Transparente - Parte Inferior */}
      <path
        d="M 40 100 Q 80 140, 140 120 T 240 100"
        stroke="url(#pipeGradient)"
        strokeWidth="32"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#glow)"
      />

      {/* Borda interna do duto inferior */}
      <path
        d="M 40 100 Q 80 140, 140 120 T 240 100"
        stroke="#98FFD9"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Ovo deslizando dentro do duto */}
      <ellipse
        cx="140"
        cy="90"
        rx="18"
        ry="24"
        fill="url(#eggGradient)"
        filter="url(#glow)"
      >
        <animate
          attributeName="cx"
          values="60;220;60"
          dur="4s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Sombra do ovo */}
      <ellipse
        cx="140"
        cy="90"
        rx="18"
        ry="24"
        fill="#001F3F"
        opacity="0.2"
        transform="translate(4, 4)"
      >
        <animate
          attributeName="cx"
          values="60;220;60"
          dur="4s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Chip ESP32 - Esquerda */}
      <g transform="translate(30, 30)">
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          rx="4"
          fill="url(#chipGradient)"
          filter="url(#glow)"
        />
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="3"
          fill="none"
          stroke="#98FFD9"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Pinos do chip */}
        <line x1="8" y1="6" x2="24" y2="6" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />
        <line x1="8" y1="12" x2="24" y2="12" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />
        <line x1="8" y1="18" x2="24" y2="18" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />
        <line x1="8" y1="24" x2="24" y2="24" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />

        {/* Texto ESP32 */}
        <text x="16" y="16" fontSize="6" fill="#98FFD9" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
          ESP32
        </text>
      </g>

      {/* Chip ESP32 - Direita */}
      <g transform="translate(218, 50)">
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          rx="4"
          fill="url(#chipGradient)"
          filter="url(#glow)"
        />
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="3"
          fill="none"
          stroke="#98FFD9"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Pinos do chip */}
        <line x1="8" y1="6" x2="24" y2="6" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />
        <line x1="8" y1="12" x2="24" y2="12" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />
        <line x1="8" y1="18" x2="24" y2="18" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />
        <line x1="8" y1="24" x2="24" y2="24" stroke="#98FFD9" strokeWidth="2" opacity="0.8" />

        {/* Texto ESP32 */}
        <text x="16" y="16" fontSize="6" fill="#98FFD9" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
          ESP32
        </text>
      </g>

      {/* Circuitos conectando - Esquerda */}
      <path
        d="M 62 46 L 70 60"
        stroke="#98FFD9"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.6"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;8"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Circuitos conectando - Direita */}
      <path
        d="M 234 82 L 226 90"
        stroke="#98FFD9"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.6"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;8"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Partículas de dados flutuantes */}
      <circle cx="100" cy="50" r="3" fill="#98FFD9" opacity="0.6" filter="url(#glowStrong)">
        <animate
          attributeName="cy"
          values="50;80;50"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="180" cy="120" r="2" fill="#6EDDC4" opacity="0.6" filter="url(#glowStrong)">
        <animate
          attributeName="cy"
          values="120;90;120"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="200" cy="60" r="2.5" fill="#98FFD9" opacity="0.6" filter="url(#glowStrong)">
        <animate
          attributeName="cy"
          values="60;90;60"
          dur="2.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

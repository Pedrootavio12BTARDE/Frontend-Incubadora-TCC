export function ChickenIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Corpo da galinha */}
      <ellipse cx="60" cy="70" rx="28" ry="32" fill="url(#chicken-body)" />
      
      {/* Cabeça */}
      <circle cx="60" cy="42" r="18" fill="url(#chicken-head)" />
      
      {/* Crista */}
      <path d="M52 30 Q54 22 56 28 Q58 20 60 28 Q62 22 64 28 Q66 24 68 32" 
            fill="#FF6B9D" opacity="0.9"/>
      
      {/* Bico */}
      <path d="M60 45 L68 48 L60 51 Z" fill="#FFB347" />
      
      {/* Olho */}
      <circle cx="65" cy="40" r="3" fill="#001F3F" />
      <circle cx="66" cy="39" r="1" fill="white" />
      
      {/* Asa */}
      <ellipse cx="72" cy="65" rx="12" ry="18" fill="url(#chicken-wing)" opacity="0.8" />
      
      {/* Pernas */}
      <rect x="52" y="95" width="3" height="15" rx="1.5" fill="#FFB347" />
      <rect x="65" y="95" width="3" height="15" rx="1.5" fill="#FFB347" />
      
      {/* Pés */}
      <path d="M48 110 L56 110" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
      <path d="M61 110 L69 110" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="chicken-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE5B4" />
          <stop offset="100%" stopColor="#FFD4A3" />
        </linearGradient>
        <linearGradient id="chicken-head" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF0D9" />
          <stop offset="100%" stopColor="#FFE5B4" />
        </linearGradient>
        <linearGradient id="chicken-wing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD4A3" />
          <stop offset="100%" stopColor="#FFC480" />
        </linearGradient>
      </defs>
    </svg>
  );
}

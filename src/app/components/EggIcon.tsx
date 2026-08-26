interface EggIconProps {
  size?: number;
  variant?: 'brown' | 'white';
}

export function EggIcon({ size = 24, variant = 'brown' }: EggIconProps) {
  const colors = {
    brown: {
      gradient1: '#D4A574',
      gradient2: '#C4956A'
    },
    white: {
      gradient1: '#FFFFFF',
      gradient2: '#F5F5F5'
    }
  };
  
  const color = colors[variant];
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="13" rx="7" ry="9" fill={`url(#egg-gradient-${variant})`} />
      <ellipse cx="9" cy="10" rx="2" ry="3" fill="white" opacity="0.3" />
      
      <defs>
        <linearGradient id={`egg-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.gradient1} />
          <stop offset="100%" stopColor={color.gradient2} />
        </linearGradient>
      </defs>
    </svg>
  );
}

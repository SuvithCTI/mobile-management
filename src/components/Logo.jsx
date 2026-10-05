import React, { useId } from 'react';

export const LogoIcon = ({ className = "w-8 h-8", animated = true }) => {
  const uid = useId().replace(/:/g, '');
  const bgGradId = `mobipulse-bg-${uid}`;
  const glassGradId = `mobipulse-glass-${uid}`;
  const pulseGradId = `mobipulse-line-${uid}`;
  const glowFilterId = `mobipulse-glow-${uid}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      <defs>
        {/* Real-time live ECG pulse & beacon animation */}
        <style>{`
          @keyframes ecgPulse_${uid} {
            0% {
              stroke-dashoffset: 70;
              opacity: 0.5;
            }
            50% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            100% {
              stroke-dashoffset: -70;
              opacity: 0.5;
            }
          }
          @keyframes beacon_${uid} {
            0%, 100% {
              transform: scale(1);
              opacity: 0.95;
            }
            50% {
              transform: scale(1.35);
              opacity: 0.4;
            }
          }
          .animate-pulse-line-${uid} {
            stroke-dasharray: 70;
            animation: ecgPulse_${uid} 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .animate-beacon-${uid} {
            transform-origin: 32.5px 24px;
            animation: beacon_${uid} 1.6s ease-in-out infinite;
          }
        `}</style>

        {/* Premium modern brand gradient */}
        <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        <linearGradient id={glassGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        <linearGradient id={pulseGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.95" />
        </linearGradient>

        <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0284c7" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Smooth squircle container */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="12"
        fill={`url(#${bgGradId})`}
        filter={`url(#${glowFilterId})`}
      />

      {/* Top glass lighting reflection */}
      <path
        d="M 3 15 C 3 9.477 7.477 5 13 5 L 35 5 C 40.523 5 45 9.477 45 15 L 45 22 C 32 20 16 23 3 27 Z"
        fill={`url(#${glassGradId})`}
      />

      {/* Sleek smartphone hardware bezel */}
      <rect
        x="12"
        y="7"
        width="24"
        height="34"
        rx="5"
        stroke="white"
        strokeWidth="1.8"
        strokeOpacity="0.95"
        fill="rgba(0, 0, 0, 0.15)"
      />

      {/* Dynamic island notch */}
      <rect
        x="20.5"
        y="9.5"
        width="7"
        height="2.2"
        rx="1.1"
        fill="white"
        fillOpacity="0.9"
      />

      {/* Subtle pulse background guide track */}
      <path
        d="M 15 24 L 19 24 L 21.5 18 L 24.5 30 L 27.5 21 L 29.5 24 L 33 24"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Real-time animated ECG pulse wave */}
      <path
        d="M 15 24 L 19 24 L 21.5 18 L 24.5 30 L 27.5 21 L 29.5 24 L 33 24"
        stroke={`url(#${pulseGradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className={animated ? `animate-pulse-line-${uid}` : ''}
      />

      {/* Real-time live status indicator beacon */}
      <circle
        cx="32.5"
        cy="24"
        r="1.6"
        fill="#34d399"
        className={animated ? `animate-beacon-${uid}` : ''}
      />
    </svg>
  );
};

export const Logo = ({ size = 'md', showTagline = false, dark = false, className = '' }) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' }
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon className={config.icon} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'} ${config.text}`}>
            MobiPulse
          </span>
        </div>
        {showTagline && (
          <span className={`font-bold mt-1 tracking-tight ${dark ? 'text-pink-200/90' : 'text-slate-500'} ${config.sub}`}>
            Mobile &amp; Smart Accessories
          </span>
        )}
      </div>
    </div>
  );
};

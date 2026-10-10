import React from "react";

interface LogoProps {
  size?: number;
  variant?: "cream" | "dark" | "gradient";
  className?: string;
  showText?: boolean;
}

export function Logo({
  size = 28,
  variant = "cream",
  className = "",
  showText = false,
}: LogoProps) {
  const isCream = variant === "cream";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient
            id={`shield-${variant}`}
            x1="20"
            y1="10"
            x2="80"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            {isCream ? (
              <>
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#1C1917" />
              </>
            ) : variant === "gradient" ? (
              <>
                <stop offset="0%" stopColor="#301860" />
                <stop offset="100%" stopColor="#4830A8" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#27272A" />
                <stop offset="100%" stopColor="#09090B" />
              </>
            )}
          </linearGradient>

          <linearGradient
            id={`pulse-${variant}`}
            x1="30"
            y1="30"
            x2="70"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            {isCream ? (
              <>
                <stop offset="0%" stopColor="#FF6900" />
                <stop offset="100%" stopColor="#EFABFB" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#EF4444" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Shield Outer Silhouette */}
        <path
          d="M50 12 L82 23 C82 56 68 76 50 88 C32 76 18 56 18 23 Z"
          fill={`url(#shield-${variant})`}
          stroke={isCream ? "#44403C" : "#3F3F46"}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Outer Hexagon Matrix */}
        <polygon
          points="50,33 63,40 63,56 50,63 37,56 37,40"
          fill="none"
          stroke={isCream ? "#78716C" : "#52525B"}
          strokeWidth="1.6"
          strokeDasharray="3 2"
        />

        {/* Inner Circuit Hexagon */}
        <polygon
          points="50,38 58,43 58,53 50,58 42,53 42,43"
          fill="none"
          stroke={`url(#pulse-${variant})`}
          strokeWidth="2"
        />

        {/* Circuit Bus Lines */}
        <line
          x1="50"
          y1="19"
          x2="50"
          y2="33"
          stroke={isCream ? "#A8A29E" : "#71717A"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="63"
          x2="50"
          y2="81"
          stroke={isCream ? "#A8A29E" : "#71717A"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="48"
          x2="37"
          y2="48"
          stroke={isCream ? "#A8A29E" : "#71717A"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="63"
          y1="48"
          x2="75"
          y2="48"
          stroke={isCream ? "#A8A29E" : "#71717A"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outer Tripwire Node Sensors */}
        <circle cx="50" cy="19" r="2.2" fill={isCream ? "#FF6900" : "#10B981"} />
        <circle cx="25" cy="48" r="1.8" fill={isCream ? "#A8A29E" : "#71717A"} />
        <circle cx="75" cy="48" r="1.8" fill={isCream ? "#A8A29E" : "#71717A"} />
        <circle cx="50" cy="81" r="1.8" fill={isCream ? "#A8A29E" : "#71717A"} />

        {/* Central Core Honeypot Trap Node */}
        <circle cx="50" cy="48" r="3.8" fill={isCream ? "#FF6900" : "#EF4444"} />
        <circle cx="50" cy="48" r="1.5" fill="#FFFFFF" />
      </svg>

      {showText && (
        <span
          className={`font-bold tracking-tight text-[15px] ${
            isCream ? "text-ink" : "text-white"
          }`}
        >
          SyntheticTrap
        </span>
      )}
    </div>
  );
}

"use client"

interface CoffeeCupProps {
  percentage: number
}

export function CoffeeCup({ percentage }: CoffeeCupProps) {
  const clampedPct = Math.max(0, Math.min(100, percentage))

  // Mug body dimensions (Ember-style rounded mug)
  const mugWidth = 160
  const mugHeight = 200
  const mugX = 40
  const mugTopY = 30
  const cornerRadius = 50
  const wallThickness = 8

  // Handle (chubby & cute)
  const handleWidth = 44
  const handleHeight = 90
  const handleX = mugX + mugWidth
  const handleTopY = mugTopY + 44
  const handleCorner = 22

  // Inner mug area for coffee fill
  const innerX = mugX + wallThickness
  const innerTopY = mugTopY + wallThickness + 4
  const innerWidth = mugWidth - wallThickness * 2
  const innerHeight = mugHeight - wallThickness * 2 - 4
  const innerCorner = cornerRadius - wallThickness

  // Coffee fill from bottom - scale down to 85% so it doesn't look overfilled
  const scaledPct = clampedPct * 0.85
  const coffeeHeight = (scaledPct / 100) * innerHeight
  const coffeeTopY = innerTopY + innerHeight - coffeeHeight

  // Wave parameters
  const waveAmplitude = clampedPct > 5 ? 3 : 0
  const waveWidth = innerWidth

  // SVG canvas
  const svgWidth = 280
  const svgHeight = 270

  // Steam particles (only when coffee is warm / > 20%)
  const showSteam = clampedPct > 20

  return (
    <div className="flex items-center justify-center" role="img" aria-label={`Coffee mug ${Math.round(clampedPct)}% full`}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="drop-shadow-xl"
      >
        <defs>
          <linearGradient id="mugBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="35%" stopColor="#3A3A3A" />
            <stop offset="65%" stopColor="#333333" />
            <stop offset="100%" stopColor="#252525" />
          </linearGradient>

          <linearGradient id="mugInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#222222" />
          </linearGradient>

          <linearGradient id="coffeeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A0714D" />
            <stop offset="15%" stopColor="#7A5230" />
            <stop offset="85%" stopColor="#5C3820" />
            <stop offset="100%" stopColor="#4A2D18" />
          </linearGradient>

          <linearGradient id="cremaGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C49A6C" />
            <stop offset="40%" stopColor="#B8895C" />
            <stop offset="100%" stopColor="#A07040" />
          </linearGradient>

          <linearGradient id="handleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2E2E2E" />
            <stop offset="50%" stopColor="#3D3D3D" />
            <stop offset="100%" stopColor="#2A2A2A" />
          </linearGradient>

          <linearGradient id="leftHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Shadow gradient - soft falloff for natural look */}
          <radialGradient id="mugShadow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Clip path: flat top, rounded bottom */}
          <clipPath id="mugInterior">
            <path
              d={`
                M ${innerX},${innerTopY}
                L ${innerX + innerWidth},${innerTopY}
                L ${innerX + innerWidth},${innerTopY + innerHeight - innerCorner}
                Q ${innerX + innerWidth},${innerTopY + innerHeight} ${innerX + innerWidth - innerCorner},${innerTopY + innerHeight}
                L ${innerX + innerCorner},${innerTopY + innerHeight}
                Q ${innerX},${innerTopY + innerHeight} ${innerX},${innerTopY + innerHeight - innerCorner}
                Z
              `}
            />
          </clipPath>
        </defs>

        {/* Shadow beneath mug - matches rounded bottom footprint */}
        <ellipse
          cx={mugX + mugWidth / 2}
          cy={mugTopY + mugHeight + 6}
          rx={mugWidth / 2 + 6}
          ry={12}
          fill="url(#mugShadow)"
        />

        {/* Handle - chubby style */}
        <rect
          x={handleX - 6}
          y={handleTopY}
          width={handleWidth}
          height={handleHeight}
          rx={handleCorner}
          fill="none"
          stroke="url(#handleGrad)"
          strokeWidth={16}
        />
        <rect
          x={handleX - 6}
          y={handleTopY}
          width={handleWidth}
          height={handleHeight}
          rx={handleCorner}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={2.5}
        />

        {/* Mug body */}
        <rect x={mugX} y={mugTopY} width={mugWidth} height={mugHeight} rx={cornerRadius} fill="url(#mugBody)" />
        <rect x={mugX} y={mugTopY} width={mugWidth} height={mugHeight / 2} fill="url(#mugBody)" />

        {/* Inner + Rim */}
        <ellipse cx={mugX + mugWidth / 2} cy={mugTopY + 2} rx={mugWidth / 2 - 2} ry={10} fill="url(#mugInner)" />
        <ellipse cx={mugX + mugWidth / 2} cy={mugTopY + 2} rx={mugWidth / 2 - 1} ry={10} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />

        {/* Coffee fill with wave animation */}
        <g clipPath="url(#mugInterior)">
          {clampedPct > 0 && (
            <path fill="url(#coffeeGrad)" className="transition-all duration-1000 linear">
              <animate
                attributeName="d"
                dur="2.5s"
                repeatCount="indefinite"
                values={`
                  M ${innerX},${coffeeTopY + waveAmplitude}
                  C ${innerX + waveWidth * 0.25},${coffeeTopY - waveAmplitude} ${innerX + waveWidth * 0.5},${coffeeTopY + waveAmplitude * 1.5} ${innerX + waveWidth * 0.75},${coffeeTopY - waveAmplitude * 0.5}
                  S ${innerX + waveWidth},${coffeeTopY + waveAmplitude} ${innerX + waveWidth},${coffeeTopY}
                  L ${innerX + waveWidth},${innerTopY + innerHeight + 20}
                  L ${innerX},${innerTopY + innerHeight + 20} Z;
                  M ${innerX},${coffeeTopY - waveAmplitude * 0.5}
                  C ${innerX + waveWidth * 0.25},${coffeeTopY + waveAmplitude * 1.2} ${innerX + waveWidth * 0.5},${coffeeTopY - waveAmplitude} ${innerX + waveWidth * 0.75},${coffeeTopY + waveAmplitude}
                  S ${innerX + waveWidth},${coffeeTopY - waveAmplitude * 0.5} ${innerX + waveWidth},${coffeeTopY}
                  L ${innerX + waveWidth},${innerTopY + innerHeight + 20}
                  L ${innerX},${innerTopY + innerHeight + 20} Z;
                  M ${innerX},${coffeeTopY + waveAmplitude}
                  C ${innerX + waveWidth * 0.25},${coffeeTopY - waveAmplitude} ${innerX + waveWidth * 0.5},${coffeeTopY + waveAmplitude * 1.5} ${innerX + waveWidth * 0.75},${coffeeTopY - waveAmplitude * 0.5}
                  S ${innerX + waveWidth},${coffeeTopY + waveAmplitude} ${innerX + waveWidth},${coffeeTopY}
                  L ${innerX + waveWidth},${innerTopY + innerHeight + 20}
                  L ${innerX},${innerTopY + innerHeight + 20} Z
                `}
              />
            </path>
          )}

          {clampedPct > 5 && (
            <path fill="url(#cremaGrad)" opacity={0.7}>
              <animate
                attributeName="d"
                dur="2.5s"
                repeatCount="indefinite"
                values={`
                  M ${innerX + 2},${coffeeTopY + waveAmplitude}
                  C ${innerX + waveWidth * 0.25},${coffeeTopY - waveAmplitude} ${innerX + waveWidth * 0.5},${coffeeTopY + waveAmplitude * 1.5} ${innerX + waveWidth * 0.75},${coffeeTopY - waveAmplitude * 0.5}
                  S ${innerX + waveWidth - 2},${coffeeTopY + waveAmplitude} ${innerX + waveWidth - 2},${coffeeTopY}
                  L ${innerX + waveWidth - 2},${coffeeTopY + 4}
                  L ${innerX + 2},${coffeeTopY + 4} Z;
                  M ${innerX + 2},${coffeeTopY - waveAmplitude * 0.5}
                  C ${innerX + waveWidth * 0.25},${coffeeTopY + waveAmplitude * 1.2} ${innerX + waveWidth * 0.5},${coffeeTopY - waveAmplitude} ${innerX + waveWidth * 0.75},${coffeeTopY + waveAmplitude}
                  S ${innerX + waveWidth - 2},${coffeeTopY - waveAmplitude * 0.5} ${innerX + waveWidth - 2},${coffeeTopY}
                  L ${innerX + waveWidth - 2},${coffeeTopY + 4}
                  L ${innerX + 2},${coffeeTopY + 4} Z;
                  M ${innerX + 2},${coffeeTopY + waveAmplitude}
                  C ${innerX + waveWidth * 0.25},${coffeeTopY - waveAmplitude} ${innerX + waveWidth * 0.5},${coffeeTopY + waveAmplitude * 1.5} ${innerX + waveWidth * 0.75},${coffeeTopY - waveAmplitude * 0.5}
                  S ${innerX + waveWidth - 2},${coffeeTopY + waveAmplitude} ${innerX + waveWidth - 2},${coffeeTopY}
                  L ${innerX + waveWidth - 2},${coffeeTopY + 4}
                  L ${innerX + 2},${coffeeTopY + 4} Z
                `}
              />
            </path>
          )}
        </g>

        {/* Highlights */}
        <rect x={mugX + 4} y={mugTopY + 10} width={22} height={mugHeight - 50} rx={11} fill="url(#leftHighlight)" />
        <rect x={mugX + 12} y={mugTopY + 30} width={10} height={14} rx={5} fill="rgba(255,255,255,0.08)" />

        {/* LED indicator */}
        <rect
          x={mugX + mugWidth / 2 - 8}
          y={mugTopY + mugHeight - 28}
          width={16} height={3} rx={1.5}
          fill={clampedPct > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"}
          className="transition-all duration-500"
        />

        {/* Steam wisps */}
        {showSteam && (
          <g opacity={Math.min(1, clampedPct / 60)}>
            <path d={`M${mugX + mugWidth / 2 - 20},${mugTopY - 8} Q${mugX + mugWidth / 2 - 25},${mugTopY - 28} ${mugX + mugWidth / 2 - 16},${mugTopY - 42}`} fill="none" stroke="rgba(180,160,140,0.25)" strokeWidth={2.5} strokeLinecap="round">
              <animate attributeName="d" dur="3s" repeatCount="indefinite" values={`M${mugX + mugWidth / 2 - 20},${mugTopY - 8} Q${mugX + mugWidth / 2 - 25},${mugTopY - 28} ${mugX + mugWidth / 2 - 16},${mugTopY - 42};M${mugX + mugWidth / 2 - 20},${mugTopY - 8} Q${mugX + mugWidth / 2 - 30},${mugTopY - 24} ${mugX + mugWidth / 2 - 22},${mugTopY - 46};M${mugX + mugWidth / 2 - 20},${mugTopY - 8} Q${mugX + mugWidth / 2 - 25},${mugTopY - 28} ${mugX + mugWidth / 2 - 16},${mugTopY - 42}`} />
              <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.25;0.15;0.25" />
            </path>
            <path d={`M${mugX + mugWidth / 2},${mugTopY - 10} Q${mugX + mugWidth / 2 + 4},${mugTopY - 32} ${mugX + mugWidth / 2 - 2},${mugTopY - 50}`} fill="none" stroke="rgba(180,160,140,0.2)" strokeWidth={2} strokeLinecap="round">
              <animate attributeName="d" dur="4s" repeatCount="indefinite" values={`M${mugX + mugWidth / 2},${mugTopY - 10} Q${mugX + mugWidth / 2 + 4},${mugTopY - 32} ${mugX + mugWidth / 2 - 2},${mugTopY - 50};M${mugX + mugWidth / 2},${mugTopY - 10} Q${mugX + mugWidth / 2 - 6},${mugTopY - 28} ${mugX + mugWidth / 2 + 5},${mugTopY - 54};M${mugX + mugWidth / 2},${mugTopY - 10} Q${mugX + mugWidth / 2 + 4},${mugTopY - 32} ${mugX + mugWidth / 2 - 2},${mugTopY - 50}`} />
              <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.2;0.1;0.2" />
            </path>
            <path d={`M${mugX + mugWidth / 2 + 18},${mugTopY - 6} Q${mugX + mugWidth / 2 + 22},${mugTopY - 24} ${mugX + mugWidth / 2 + 14},${mugTopY - 38}`} fill="none" stroke="rgba(180,160,140,0.2)" strokeWidth={2} strokeLinecap="round">
              <animate attributeName="d" dur="3.5s" repeatCount="indefinite" values={`M${mugX + mugWidth / 2 + 18},${mugTopY - 6} Q${mugX + mugWidth / 2 + 22},${mugTopY - 24} ${mugX + mugWidth / 2 + 14},${mugTopY - 38};M${mugX + mugWidth / 2 + 18},${mugTopY - 6} Q${mugX + mugWidth / 2 + 28},${mugTopY - 20} ${mugX + mugWidth / 2 + 20},${mugTopY - 42};M${mugX + mugWidth / 2 + 18},${mugTopY - 6} Q${mugX + mugWidth / 2 + 22},${mugTopY - 24} ${mugX + mugWidth / 2 + 14},${mugTopY - 38}`} />
              <animate attributeName="opacity" dur="3.5s" repeatCount="indefinite" values="0.2;0.12;0.2" />
            </path>
          </g>
        )}
      </svg>
    </div>
  )
}
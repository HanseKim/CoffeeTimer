"use client"

interface CoffeeCupProps {
  percentage: number
}

export function CoffeeCup({ percentage }: CoffeeCupProps) {
  const clampedPct = Math.max(0, Math.min(100, percentage))

  // Cup dimensions
  const cupTopWidth = 180
  const cupBottomWidth = 140
  const cupHeight = 220
  const rimHeight = 12
  const glassThickness = 6

  // Inner dimensions for coffee
  const innerTopWidth = cupTopWidth - glassThickness * 2
  const innerBottomWidth = cupBottomWidth - glassThickness * 2
  const innerHeight = cupHeight - rimHeight - glassThickness

  // Coffee fill height
  const coffeeHeight = (clampedPct / 100) * innerHeight

  // Calculate the coffee shape (trapezoid clipped from bottom)
  const coffeeTopY = cupHeight - glassThickness - coffeeHeight
  const coffeeBottomY = cupHeight - glassThickness

  // Interpolate widths at coffeeTop and coffeeBottom
  const widthAtY = (y: number) => {
    const t = (y - rimHeight) / (cupHeight - rimHeight - glassThickness)
    return innerTopWidth + (innerBottomWidth - innerTopWidth) * t
  }

  const coffeeTopW = widthAtY(coffeeTopY)
  const coffeeBottomW = widthAtY(coffeeBottomY)

  const svgWidth = 220
  const svgHeight = 260
  const centerX = svgWidth / 2

  return (
    <div className="flex items-center justify-center" role="img" aria-label={`Coffee cup ${Math.round(clampedPct)}% full`}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="drop-shadow-lg"
      >
        <defs>
          {/* Glass gradient for transparency effect */}
          <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(200, 210, 235, 0.5)" />
            <stop offset="20%" stopColor="rgba(220, 225, 245, 0.3)" />
            <stop offset="50%" stopColor="rgba(240, 242, 255, 0.15)" />
            <stop offset="80%" stopColor="rgba(220, 225, 245, 0.3)" />
            <stop offset="100%" stopColor="rgba(200, 210, 235, 0.5)" />
          </linearGradient>

          {/* Glass highlight */}
          <linearGradient id="glassHighlight" x1="0" y1="0" x2="0.3" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Coffee gradient */}
          <linearGradient id="coffeeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5E3C" />
            <stop offset="30%" stopColor="#6F4427" />
            <stop offset="70%" stopColor="#5C3820" />
            <stop offset="100%" stopColor="#8B5E3C" />
          </linearGradient>

          {/* Coffee surface highlight */}
          <linearGradient id="coffeeSurface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A0714D" />
            <stop offset="100%" stopColor="#6F4427" />
          </linearGradient>

          {/* Clip path for coffee inside glass */}
          <clipPath id="glassInterior">
            <polygon
              points={`
                ${centerX - innerTopWidth / 2},${rimHeight + 2}
                ${centerX + innerTopWidth / 2},${rimHeight + 2}
                ${centerX + innerBottomWidth / 2},${coffeeBottomY}
                ${centerX - innerBottomWidth / 2},${coffeeBottomY}
              `}
            />
          </clipPath>
        </defs>

        {/* Shadow beneath cup */}
        <ellipse
          cx={centerX}
          cy={cupHeight + 10}
          rx={cupBottomWidth / 2 + 10}
          ry={8}
          fill="rgba(0,0,0,0.06)"
        />

        {/* Glass body (outer shape) */}
        <polygon
          points={`
            ${centerX - cupTopWidth / 2},${rimHeight}
            ${centerX + cupTopWidth / 2},${rimHeight}
            ${centerX + cupBottomWidth / 2},${cupHeight}
            ${centerX - cupBottomWidth / 2},${cupHeight}
          `}
          fill="url(#glassGradient)"
          stroke="rgba(180, 190, 215, 0.6)"
          strokeWidth="1.5"
        />

        {/* Coffee liquid with smooth transition */}
        <g clipPath="url(#glassInterior)">
          <polygon
            points={`
              ${centerX - coffeeTopW / 2},${coffeeTopY}
              ${centerX + coffeeTopW / 2},${coffeeTopY}
              ${centerX + coffeeBottomW / 2},${coffeeBottomY}
              ${centerX - coffeeBottomW / 2},${coffeeBottomY}
            `}
            fill="url(#coffeeGradient)"
            className="transition-all duration-1000 linear"
          />

          {/* Coffee surface highlight */}
          {clampedPct > 2 && (
            <rect
              x={centerX - coffeeTopW / 2}
              y={coffeeTopY}
              width={coffeeTopW}
              height={4}
              fill="url(#coffeeSurface)"
              opacity={0.7}
              rx={2}
              className="transition-all duration-1000 linear"
            />
          )}

          {/* Coffee vertical shading stripes */}
          {clampedPct > 5 && (
            <>
              <rect
                x={centerX - coffeeTopW * 0.25}
                y={coffeeTopY}
                width={coffeeTopW * 0.12}
                height={coffeeHeight}
                fill="rgba(90, 55, 30, 0.3)"
                className="transition-all duration-1000 linear"
              />
              <rect
                x={centerX + coffeeTopW * 0.15}
                y={coffeeTopY}
                width={coffeeTopW * 0.08}
                height={coffeeHeight}
                fill="rgba(90, 55, 30, 0.2)"
                className="transition-all duration-1000 linear"
              />
            </>
          )}
        </g>

        {/* Glass highlight reflection */}
        <polygon
          points={`
            ${centerX - cupTopWidth / 2 + 8},${rimHeight + 4}
            ${centerX - cupTopWidth / 2 + 28},${rimHeight + 4}
            ${centerX - cupBottomWidth / 2 + 24},${cupHeight - 4}
            ${centerX - cupBottomWidth / 2 + 8},${cupHeight - 4}
          `}
          fill="url(#glassHighlight)"
        />

        {/* Small square highlight near top-left */}
        <rect
          x={centerX - cupTopWidth / 2 + 14}
          y={rimHeight + 20}
          width={16}
          height={18}
          rx={3}
          fill="rgba(255, 255, 255, 0.35)"
        />

        {/* Rim */}
        <rect
          x={centerX - cupTopWidth / 2 - 2}
          y={rimHeight - 4}
          width={cupTopWidth + 4}
          height={8}
          rx={4}
          fill="rgba(200, 210, 235, 0.4)"
          stroke="rgba(180, 190, 215, 0.5)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

function CampusMap({ locations, route }) {
  const routeIds = route.map(r => r.id)
  const toSvgPoint = (loc) => ({
    ...loc,
    svgX: loc.x <= 100 ? loc.x * 6 : loc.x,
    svgY: loc.y <= 100 ? loc.y * 4.5 : loc.y
  })
  const renderedLocations = locations.map(toSvgPoint)
  const renderedRoute = route.map(toSvgPoint)
  
  return (
    <div className="campus-map">
      <svg viewBox="0 0 600 450" className="map-svg">
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78716c" />
            <stop offset="50%" stopColor="#a8a29e" />
            <stop offset="100%" stopColor="#78716c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="treeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        <rect x="0" y="0" width="600" height="450" fill="url(#skyGradient)" />
        
        <ellipse cx="500" cy="60" rx="40" ry="25" fill="white" opacity="0.8" />
        <ellipse cx="530" cy="50" rx="30" ry="20" fill="white" opacity="0.6" />
        <ellipse cx="480" cy="70" rx="25" ry="15" fill="white" opacity="0.7" />
        
        <ellipse cx="80" cy="80" rx="50" ry="30" fill="white" opacity="0.6" />
        <ellipse cx="100" cy="70" rx="35" ry="20" fill="white" opacity="0.5" />
        
        <path d="M 0 200 L 600 200" stroke="#22c55e" strokeWidth="3" fill="none" />
        
        <rect x="0" y="200" width="600" height="250" fill="url(#grassGradient)" />
        
        <path
          d="M 30 280 Q 150 260 300 280 T 570 280"
          stroke="url(#roadGradient)"
          strokeWidth="25"
          fill="none"
          strokeLinecap="round"
        />
        
        <path
          d="M 300 280 L 300 350"
          stroke="url(#roadGradient)"
          strokeWidth="18"
          fill="none"
        />
        
        <path
          d="M 450 280 L 450 400"
          stroke="url(#roadGradient)"
          strokeWidth="15"
          fill="none"
        />
        
        <g transform="translate(60, 350)" filter="url(#treeShadow)">
          <ellipse cx="0" cy="-25" rx="20" ry="30" fill="#166534" />
          <ellipse cx="-15" cy="-20" rx="15" ry="22" fill="#15803d" />
          <ellipse cx="15" cy="-20" rx="15" ry="22" fill="#15803d" />
          <rect x="-4" y="-5" width="8" height="15" fill="#78350f" />
        </g>
        
        <g transform="translate(120, 320)" filter="url(#treeShadow)">
          <ellipse cx="0" cy="-20" rx="15" ry="25" fill="#166534" />
          <ellipse cx="-10" cy="-15" rx="12" ry="18" fill="#15803d" />
          <ellipse cx="10" cy="-15" rx="12" ry="18" fill="#15803d" />
          <rect x="-3" y="-3" width="6" height="12" fill="#78350f" />
        </g>
        
        <g transform="translate(540, 340)" filter="url(#treeShadow)">
          <ellipse cx="0" cy="-22" rx="18" ry="28" fill="#166534" />
          <ellipse cx="-12" cy="-18" rx="14" ry="20" fill="#15803d" />
          <ellipse cx="12" cy="-18" rx="14" ry="20" fill="#15803d" />
          <rect x="-3" y="-4" width="6" height="14" fill="#78350f" />
        </g>
        
        <g transform="translate(480, 380)" filter="url(#treeShadow)">
          <ellipse cx="0" cy="-18" rx="14" ry="22" fill="#166534" />
          <rect x="-3" y="-2" width="6" height="10" fill="#78350f" />
        </g>
        
        <circle cx="80" cy="260" r="8" fill="#fbbf24" />
        <circle cx="95" cy="255" r="6" fill="#f59e0b" />
        <circle cx="70" cy="268" r="5" fill="#fcd34d" />
        
        <circle cx="520" cy="240" r="6" fill="#fbbf24" />
        <circle cx="530" cy="235" r="5" fill="#f59e0b" />
        
        {renderedLocations.map((loc) => {
          const isVisited = routeIds.includes(loc.id)
          return (
            <g key={loc.id} transform={`translate(${loc.svgX}, ${loc.svgY})`}>
              <circle
                r={isVisited ? 32 : 28}
                fill={isVisited ? '#fef3c7' : '#ffffff'}
                stroke={isVisited ? '#f59e0b' : '#cbd5e1'}
                strokeWidth="3"
                filter={isVisited ? "url(#glow)" : ""}
              />
              {isVisited && (
                <circle
                  r="40"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity="0.6"
                />
              )}
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
              >
                {loc.icon}
              </text>
              <text
                y="38"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#334155"
              >
                {loc.name}
              </text>
            </g>
          )
        })}
        
        {renderedRoute.length > 1 && (
          <>
            <polyline
              points={renderedRoute.map(r => `${r.svgX},${r.svgY}`).join(' ')}
              stroke="#f59e0b"
              strokeWidth="5"
              fill="none"
              strokeDasharray="10,5"
              opacity="0.8"
            />
            <polyline
              points={renderedRoute.map(r => `${r.svgX},${r.svgY}`).join(' ')}
              stroke="#fbbf24"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
            />
            {renderedRoute.slice(1).map((r, i) => (
              <circle
                key={i}
                cx={r.svgX}
                cy={r.svgY}
                r="6"
                fill="#f59e0b"
                filter="url(#glow)"
              />
            ))}
          </>
        )}
        
        {renderedRoute.length > 0 && (
          <g transform={`translate(${renderedRoute[0].svgX}, ${renderedRoute[0].svgY})`}>
            <circle r="12" fill="#22c55e" opacity="0.8" />
            <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="white" fontWeight="bold">
              Start
            </text>
          </g>
        )}
        
        {renderedRoute.length > 1 && (
          <g transform={`translate(${renderedRoute[renderedRoute.length - 1].svgX}, ${renderedRoute[renderedRoute.length - 1].svgY})`}>
            <circle r="12" fill="#ef4444" opacity="0.8" />
            <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="white" fontWeight="bold">
              End
            </text>
          </g>
        )}
        
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>
      
      {route.length > 0 && (
        <div className="route-timeline">
          <div className="timeline-header">
            <span className="timeline-icon">🚶</span>
            <span className="timeline-title">今日行程</span>
            <span className="timeline-count">{route.length} 个地点</span>
          </div>
          <div className="timeline-items">
            {route.map((loc, index) => (
              <div key={index} className="timeline-item">
                <span className="timeline-number">{index + 1}</span>
                <span className="timeline-icon-small">{loc.icon}</span>
                <span className="timeline-name">{loc.name}</span>
                {index < route.length - 1 && (
                  <span className="timeline-arrow">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CampusMap

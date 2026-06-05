import { useState } from 'react'
import paths from '../data/paths.json'
import { buildPathForLocationRoute, normalizeRouteLocationIds } from '../utils/route.js'

const MAP_WIDTH = paths.meta?.mapWidth || 1000
const MAP_HEIGHT = paths.meta?.mapHeight || 1500
const BACKGROUND_IMAGE = paths.meta?.backgroundImage || '/campus-map.png'

const TYPE_STYLES = {
  life: { fill: '#fef3c7', stroke: '#d97706' },
  study: { fill: '#dbeafe', stroke: '#2563eb' },
  practice: { fill: '#dcfce7', stroke: '#16a34a' },
  sport: { fill: '#f0fdf4', stroke: '#15803d' },
  social: { fill: '#fae8ff', stroke: '#a21caf' },
  medical: { fill: '#fee2e2', stroke: '#dc2626' }
}

const BUILDINGS = [
  { id: 'C2', x: 14, y: 7, w: 12, h: 8 },
  { id: 'R02', x: 27, y: 19, w: 11, h: 6 },
  { id: '20', x: 60, y: 2, w: 16, h: 10 },
  { id: '18', x: 65, y: 15, w: 14, h: 5 },
  { id: '16', x: 49, y: 15, w: 10, h: 8 },
  { id: '14', x: 72, y: 27, w: 10, h: 9 },
  { id: '11', x: 57, y: 30, w: 10, h: 6 },
  { id: 'R08', x: 76, y: 39, w: 16, h: 8 },
  { id: 'C1', x: 88, y: 43, w: 10, h: 8 },
  { id: '32', x: 36, y: 66, w: 18, h: 10 },
  { id: 'C3', x: 38, y: 80, w: 12, h: 8 },
  { id: '99', x: 47, y: 90, w: 12, h: 8 },
  { id: '27', x: 9, y: 87, w: 11, h: 8 },
  { id: 'R10', x: 5, y: 18, w: 8, h: 6 },
  { id: 'R04', x: 12, y: 32, w: 11, h: 5 },
  { id: '34', x: 22, y: 69, w: 9, h: 6 },
  { id: '06', x: 69, y: 65, w: 11, h: 7 }
]

function CampusMap({ locations = [], route = [] }) {
  const [imageAvailable, setImageAvailable] = useState(false)
  const locationMap = new Map(locations.map((location) => [location.id, location]))
  const routeIds = normalizeRouteLocationIds(route).filter((locationId) => locationMap.has(locationId))
  const routeLocations = routeIds.map((locationId) => locationMap.get(locationId))
  const routePath = buildPathForLocationRoute(routeIds, paths)
  const routeOrder = new Map(routeIds.map((locationId, index) => [locationId, index + 1]))
  const networkNodes = new Map(paths.nodes.map((node) => [node.id, node]))
  const routePoints = routePath.nodes.length > 1
    ? routePath.nodes.map(toSvgPoint)
    : routeLocations.map(toSvgPoint)
  const hasNetworkRoute = routePath.nodes.length > 1

  return (
    <div className="campus-map">
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="map-svg" role="img" aria-label="校园路线地图">
        <defs>
          <linearGradient id="campusGrass" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#f7fee7" />
            <stop offset="58%" stopColor="#dcfce7" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </linearGradient>
          <linearGradient id="campusWater" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="routeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.16" />
          </filter>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#f8fafc" />
        <g className="map-fallback-base">
          <path
            d="M 90 110 L 700 20 L 860 130 L 940 560 L 905 790 L 1000 900 L 910 1110 L 650 1100 L 590 1450 L 75 1430 L 25 1180 L 150 1050 L 105 780 L 10 560 Z"
            fill="url(#campusGrass)"
            stroke="#d6d3d1"
            strokeWidth="8"
            filter="url(#mapShadow)"
          />
          <path
            d="M 500 120 C 525 245 500 375 530 520 C 560 690 520 820 565 950 C 600 1080 560 1250 575 1420"
            fill="none"
            stroke="url(#campusWater)"
            strokeWidth="62"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 500 120 C 525 245 500 375 530 520 C 560 690 520 820 565 950 C 600 1080 560 1250 575 1420"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        <image
          href={BACKGROUND_IMAGE}
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          preserveAspectRatio="xMidYMid meet"
          className="map-background-image"
          onLoad={() => setImageAvailable(true)}
          onError={() => setImageAvailable(false)}
        />

        {!imageAvailable && (
          <g className="map-building-layer">
            {BUILDINGS.map((building) => (
              <g key={building.id}>
                <rect
                  x={scaleX(building.x)}
                  y={scaleY(building.y)}
                  width={scaleX(building.w)}
                  height={scaleY(building.h)}
                  rx="8"
                  fill="#fed7aa"
                  stroke="#b45309"
                  strokeWidth="3"
                />
                <text
                  x={scaleX(building.x + building.w / 2)}
                  y={scaleY(building.y + building.h / 2)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="22"
                  fontWeight="800"
                  fill="#3f2f1f"
                >
                  {building.id}
                </text>
              </g>
            ))}
            <rect x={scaleX(31)} y={scaleY(34)} width={scaleX(16)} height={scaleY(22)} rx="50" fill="#86efac" stroke="#ef4444" strokeWidth="10" />
            <rect x={scaleX(18)} y={scaleY(86)} width={scaleX(20)} height={scaleY(18)} rx="50" fill="#86efac" stroke="#ef4444" strokeWidth="10" />
          </g>
        )}

        <g className="map-road-layer">
          {paths.edges.map((edge) => {
            const from = networkNodes.get(edge.from)
            const to = networkNodes.get(edge.to)
            if (!from || !to) return null

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={scaleX(from.x)}
                y1={scaleY(from.y)}
                x2={scaleX(to.x)}
                y2={scaleY(to.y)}
                className={`map-road map-road-${edge.type || 'branch'}`}
              />
            )
          })}
        </g>

        {routePoints.length > 1 && (
          <g className="map-active-route" filter="url(#routeGlow)">
            <polyline
              points={routePoints.map((point) => `${point.svgX},${point.svgY}`).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.28"
            />
            <polyline
              points={routePoints.map((point) => `${point.svgX},${point.svgY}`).join(' ')}
              fill="none"
              stroke="#f97316"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={routePoints.map((point) => `${point.svgX},${point.svgY}`).join(' ')}
              fill="none"
              stroke="#fff7ed"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="18 14"
            />
          </g>
        )}

        <g className="map-location-layer">
          {locations.map((location) => {
            const point = toSvgPoint(location)
            const order = routeOrder.get(location.id)
            const isVisited = Boolean(order)
            const typeStyle = TYPE_STYLES[location.type] || TYPE_STYLES.practice

            return (
              <g key={location.id} className={`map-location ${isVisited ? 'is-visited' : ''}`} transform={`translate(${point.svgX}, ${point.svgY})`}>
                <circle r={isVisited ? 29 : 22} fill={typeStyle.fill} stroke={typeStyle.stroke} strokeWidth={isVisited ? 7 : 4} />
                <text textAnchor="middle" dominantBaseline="middle" fontSize={isVisited ? 25 : 21}>
                  {location.icon}
                </text>
                {isVisited && (
                  <g transform="translate(23, -24)">
                    <circle r="17" fill="#1e293b" stroke="#fff7ed" strokeWidth="4" />
                    <text textAnchor="middle" dominantBaseline="middle" fontSize="17" fontWeight="800" fill="white">
                      {order}
                    </text>
                  </g>
                )}
                <text
                  y={isVisited ? 53 : 43}
                  textAnchor="middle"
                  fontSize="19"
                  fontWeight="800"
                  fill="#1e293b"
                  paintOrder="stroke"
                  stroke="#ffffff"
                  strokeWidth="7"
                >
                  {location.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {routeLocations.length > 0 && (
        <div className="route-timeline">
          <div className="timeline-header">
            <span className="timeline-icon">🚶</span>
            <span className="timeline-title">今日行程</span>
            <span className="timeline-count">{routeLocations.length} 个地点</span>
            <span className="timeline-mode">{hasNetworkRoute ? '道路网络路线' : '地点直连兜底'}</span>
          </div>
          <div className="timeline-items">
            {routeLocations.map((location, index) => (
              <div key={`${location.id}-${index}`} className="timeline-item">
                <span className="timeline-number">{index + 1}</span>
                <span className="timeline-icon-small">{location.icon}</span>
                <span className="timeline-name">{location.name}</span>
                {index < routeLocations.length - 1 && (
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

function toSvgPoint(item) {
  return {
    ...item,
    svgX: scaleX(item.x),
    svgY: scaleY(item.y)
  }
}

function scaleX(value) {
  return Number(value) * (MAP_WIDTH / 100)
}

function scaleY(value) {
  return Number(value) * (MAP_HEIGHT / 100)
}

export default CampusMap

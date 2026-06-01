function ScorePanel({ scores, compact = false }) {
  const scoreLabels = {
    health: { label: '健康', icon: '💪', color: '#22c55e' },
    study: { label: '学业', icon: '📚', color: '#6366f1' },
    social: { label: '社交', icon: '👥', color: '#f59e0b' },
    practice: { label: '实践', icon: '🔧', color: '#ec4899' },
    pressure: { label: '压力', icon: '⚡', color: '#ef4444' }
  }

  if (compact) {
    return (
      <div className="scores-display">
        {Object.entries(scores).map(([key, value]) => {
          const config = scoreLabels[key]
          const maxScore = 10
          const normalizedValue = Math.max(-maxScore, Math.min(maxScore, value))
          const percentage = ((normalizedValue + maxScore) / (maxScore * 2)) * 100
          
          return (
            <div key={key} className="score-bar-item">
              <div className="score-bar-header">
                <span className="score-icon">{config.icon}</span>
                <span className="score-label">{config.label}</span>
                <span className={`score-value ${value >= 0 ? 'positive' : 'negative'}`}>
                  {value >= 0 ? '+' : ''}{value}
                </span>
              </div>
              <div className="score-bar-track">
                <div 
                  className="score-bar-fill" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: config.color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="score-panel">
      <h3 className="panel-title">当前状态</h3>
      <div className="scores-grid">
        {Object.entries(scores).map(([key, value]) => {
          const config = scoreLabels[key]
          const isNegative = value < 0
          const displayValue = isNegative ? value : `+${value}`
          
          return (
            <div key={key} className="score-item">
              <span className="score-icon">{config.icon}</span>
              <span className="score-label">{config.label}</span>
              <span className={`score-value ${isNegative ? 'negative' : 'positive'}`}>
                {displayValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScorePanel
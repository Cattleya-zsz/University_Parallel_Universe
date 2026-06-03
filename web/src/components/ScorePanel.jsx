function ScorePanel({ scores, compact = false }) {
  const scoreConfig = {
    health: { label: '健康节奏', shortLabel: '健康', icon: '💪', color: '#16a34a' },
    study: { label: '学习投入', shortLabel: '学习', icon: '📚', color: '#4f46e5' },
    social: { label: '社交协作', shortLabel: '社交', icon: '👥', color: '#d97706' },
    practice: { label: '实践探索', shortLabel: '实践', icon: '🔧', color: '#db2777' },
    pressure: { label: '压力指数', shortLabel: '压力', icon: '⚡', color: '#dc2626' }
  }
  const scoreOrder = ['health', 'study', 'social', 'practice', 'pressure']

  const getLevel = (key, value) => {
    if (key === 'pressure') {
      if (value >= 7) return '偏高'
      if (value >= 4) return '适中'
      if (value >= 1) return '轻微'
      return '轻盈'
    }

    if (value >= 7) return '突出'
    if (value >= 4) return '稳定'
    if (value >= 1) return '有一点'
    if (value < 0) return '偏低'
    return '待点亮'
  }

  const getPercentage = (value) => {
    const maxScore = 10
    return Math.max(6, Math.min(100, (Math.abs(value) / maxScore) * 100))
  }

  const getValueClass = (key, value) => {
    if (key === 'pressure') {
      return value >= 7 ? 'warning' : value <= 0 ? 'calm' : 'neutral'
    }

    return value < 0 ? 'negative' : 'positive'
  }

  if (compact) {
    return (
      <div className="scores-display">
        {scoreOrder.map((key) => {
          const value = scores[key] || 0
          const config = scoreConfig[key]
          const percentage = getPercentage(value)
          const valueClass = getValueClass(key, value)
          
          return (
            <div key={key} className={`score-bar-item ${valueClass}`}>
              <div className="score-bar-header">
                <span className="score-icon">{config.icon}</span>
                <span className="score-label">{config.label}</span>
                <span className="score-level">{getLevel(key, value)}</span>
                <span className={`score-value ${valueClass}`}>
                  {value >= 0 ? '+' : ''}{value}
                </span>
              </div>
              <div className="score-bar-track">
                <div 
                  className="score-bar-fill" 
                  style={{ 
                    width: `${percentage}%`,
                    '--score-color': config.color
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
        {scoreOrder.map((key) => {
          const value = scores[key] || 0
          const config = scoreConfig[key]
          const percentage = getPercentage(value)
          const valueClass = getValueClass(key, value)
          
          return (
            <div key={key} className={`score-item ${valueClass}`}>
              <div className="score-card-top">
                <span className="score-icon">{config.icon}</span>
                <span className={`score-value ${valueClass}`}>
                  {value >= 0 ? '+' : ''}{value}
                </span>
              </div>
              <span className="score-label">{config.shortLabel}</span>
              <span className="score-level">{getLevel(key, value)}</span>
              <div className="score-mini-track">
                <div
                  className="score-mini-fill"
                  style={{
                    width: `${percentage}%`,
                    '--score-color': config.color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScorePanel

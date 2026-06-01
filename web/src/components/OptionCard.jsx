function OptionCard({ option, onSelect, onClick }) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(option)
    } else if (onClick) {
      onClick(option)
    }
  }
  
  return (
    <div className="option-card" onClick={handleClick}>
      <div className="option-label">{option.label}</div>
      <div className="option-details">
        <span className="option-event">{option.event}</span>
        <span className="option-arrow">→</span>
        <span className="option-score-summary">
          {Object.entries(option.score)
            .filter(([, value]) => value !== 0)
            .map(([key, value]) => {
              const keyMap = {
                health: '健康',
                study: '学习',
                social: '社交',
                practice: '实践',
                pressure: '压力'
              }
              return (
                <span key={key} className={`score-tag ${value > 0 ? 'positive' : 'negative'}`}>
                  {keyMap[key]} {value > 0 ? '+' : ''}{value}
                </span>
              )
            })}
        </span>
      </div>
    </div>
  )
}

export default OptionCard
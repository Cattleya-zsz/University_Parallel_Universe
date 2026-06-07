function MajorCard({ major, onSelect }) {
  return (
    <button
      type="button"
      className="major-card" 
      onClick={() => onSelect(major)}
      style={{ '--major-color': major.color }}
      data-major={major.id}
    >
      <div className="card-topline">
        <div className="card-icon">{major.icon}</div>
        <span className="card-signal">专业存档</span>
      </div>
      <div className="card-save-meta">
        <span>SLOT / {major.id}</span>
        <span>READY</span>
      </div>
      <h3 className="card-title">{major.name}</h3>
      <p className="card-description">{major.description}</p>
      {major.tags && major.tags.length > 0 && (
        <div className="card-tags">
          {major.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="card-stat-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="card-button">
        <span>载入这一天</span>
        <span className="card-button-mark">→</span>
      </span>
    </button>
  )
}

export default MajorCard

function MajorCard({ major, onSelect }) {
  return (
    <div 
      className="major-card" 
      onClick={() => onSelect(major)}
      style={{ '--major-color': major.color }}
    >
      <div className="card-icon">{major.icon}</div>
      <h3 className="card-title">{major.name}</h3>
      <p className="card-description">{major.description}</p>
      {major.tags && major.tags.length > 0 && (
        <div className="card-tags">
          {major.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <button className="card-button">开始体验</button>
    </div>
  )
}

export default MajorCard
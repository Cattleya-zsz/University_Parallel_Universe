import ScorePanel from '../components/ScorePanel'
import CampusMap from '../components/CampusMap'
import CourseChat from '../components/CourseChat'
import locations from '../data/test/locations.json'
import { getProfile } from '../data/test/profile'

function Result({ selectedMajor, selectedOptions, scores, onRestart, onGoHome }) {
  const profile = getProfile(scores)
  
  const routeLocations = selectedOptions.map(opt => {
    return locations.find(loc => loc.id === opt.locationId)
  }).filter(Boolean)

  return (
    <div className="result-page">
      <div className="result-header">
        <h1 className="result-title">你的校园画像</h1>
        <div className="major-badge">
          <span className="badge-icon">{selectedMajor?.icon}</span>
          <span className="badge-text">{selectedMajor?.name}</span>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-icon">{profile.icon}</div>
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-description">{profile.description}</p>
      </div>

      <div className="map-section map-highlight">
        <h3 className="section-title map-title">🗺️ 你的校园路线</h3>
        <CampusMap locations={locations} route={routeLocations} />
      </div>

      <div className="route-section route-compact">
        <div className="route-path">
          {routeLocations.map((location, index) => (
            <div key={index} className="route-item">
              <span className="route-icon">{location.icon}</span>
              <span className="route-name">{location.name}</span>
              {index < routeLocations.length - 1 && (
                <span className="route-arrow">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="two-columns">
        <div className="scores-section">
          <h3 className="section-title">五维评分</h3>
          <ScorePanel scores={scores} compact={true} />
        </div>

        <div className="choices-section">
          <h3 className="section-title">今日选择</h3>
          <div className="choices-list">
            {selectedOptions.map((option, index) => (
              <div key={index} className="choice-item">
                <span className="choice-number">{index + 1}</span>
                <span className="choice-label">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="course-chat-section">
        <h3 className="section-title">课程问答</h3>
        <CourseChat selectedMajor={selectedMajor} />
      </div>

      <div className="action-buttons">
        <button className="action-btn secondary" onClick={onGoHome}>返回首页</button>
        <button className="action-btn primary" onClick={onRestart}>再次体验</button>
      </div>
    </div>
  )
}

export default Result
import ScorePanel from '../components/ScorePanel'
import CampusMap from '../components/CampusMap'
import CourseChat from '../components/CourseChat'
import locations from '../data/locations.json'
import coreCourses from '../data/coreCourses.json'
import { generateProfile } from '../utils/profile.js'
import { buildRouteFromOptions } from '../utils/route.js'
import { generateDayEvaluation } from '../utils/dayEvaluation.js'

function Result({ selectedMajor, selectedOptions, scores, onRestart, onGoHome }) {
  const profile = generateProfile(scores)
  const evaluation = generateDayEvaluation({
    majorId: selectedMajor?.id,
    selectedOptions,
    scores,
    coreCourses
  })
  const routeIds = buildRouteFromOptions(selectedOptions)
  const routeLocations = routeIds
    .map(locationId => locations.find(loc => loc.id === locationId))
    .filter(Boolean)

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
        <h2 className="profile-name">{profile.title}</h2>
        <p className="profile-description">{profile.description}</p>
        <p className="profile-advice">{profile.advice}</p>
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

      <div className="evaluation-section">
        <h3 className="section-title">{evaluation.title}</h3>
        <p className="evaluation-summary">{evaluation.summary}</p>

        <div className="dimension-list">
          {evaluation.dimensionEvaluations.map((dimension) => (
            <div key={dimension.key} className="dimension-item">
              <div className="dimension-heading">
                <span className="dimension-label">{dimension.label}</span>
                <span className="dimension-level">{dimension.level}</span>
              </div>
              <p>{dimension.text}</p>
            </div>
          ))}
        </div>

        <div className="featured-courses">
          <h4>可能会遇到的特色课程</h4>
          <div className="course-list">
            {evaluation.featuredCourses.map((course) => (
              <div key={course.courseName} className="course-item">
                <strong>{course.courseName}</strong>
                <span>{course.briefIntro}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="closing-message">{evaluation.closingMessage}</p>
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

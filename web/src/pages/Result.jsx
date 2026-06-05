import ScorePanel from '../components/ScorePanel'
import CampusMap from '../components/CampusMap'
import ResultArt from '../components/ResultArt'
import locations from '../data/locations.json'
import { generateProfile } from '../utils/profile.js'
import { buildRouteFromOptions } from '../utils/route.js'

function Result({ selectedMajor, selectedOptions, scores, onRestart, onGoHome, onOpenDetails }) {
  const profile = generateProfile(scores)
  const routeIds = buildRouteFromOptions(selectedOptions)
  const currentLocationId = routeIds[routeIds.length - 1] || ''

  return (
    <div className="result-page">
      <div className="result-header">
        <h1 className="result-title">你的校园画像</h1>
        <div className="major-badge">
          <span className="badge-icon">{selectedMajor?.icon}</span>
          <span className="badge-text">{selectedMajor?.name}</span>
        </div>
      </div>

      <div className="result-layout">
        <aside className="result-map-panel map-section map-highlight">
          <h3 className="section-title map-title">你的校园路线</h3>
          <CampusMap locations={locations} route={routeIds} currentLocationId={currentLocationId} />
        </aside>

        <main className="result-content-panel">
          <ResultArt major={selectedMajor} profile={profile} />

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
        </main>
      </div>

      <div className="result-actions-row">
        <div className="detail-entry-card">
          <div>
            <h3>专业体验卡与课程问答</h3>
            <p>查看更完整的专业体验分析、AI 总结和课程相关问答。</p>
          </div>
          <button className="action-btn primary" onClick={onOpenDetails}>查看详情</button>
        </div>

        <div className="action-buttons">
          <button className="action-btn secondary" onClick={onGoHome}>返回首页</button>
          <button className="action-btn primary" onClick={onRestart}>再次体验</button>
        </div>
      </div>
    </div>
  )
}

export default Result

import { useEffect, useMemo, useState } from 'react'
import ScorePanel from '../components/ScorePanel'
import CampusMap from '../components/CampusMap'
import CourseChat from '../components/CourseChat'
import locations from '../data/locations.json'
import coreCourses from '../data/coreCourses.json'
import { generateProfile } from '../utils/profile.js'
import { buildRouteFromOptions } from '../utils/route.js'
import { generateDayEvaluation, requestAIDayEvaluation } from '../utils/dayEvaluation.js'

function Result({ selectedMajor, selectedOptions, scores, onRestart, onGoHome }) {
  const profile = generateProfile(scores)
  const evaluation = useMemo(
    () => generateDayEvaluation({
      majorId: selectedMajor?.id,
      selectedOptions,
      scores,
      coreCourses
    }),
    [selectedMajor?.id, selectedOptions, scores]
  )
  const [aiEvaluation, setAiEvaluation] = useState({
    answer: '',
    notice: '',
    source: '',
    isLoading: false,
    error: ''
  })
  const routeIds = buildRouteFromOptions(selectedOptions)
  const routeLocations = routeIds
    .map(locationId => locations.find(loc => loc.id === locationId))
    .filter(Boolean)
  const currentLocationId = routeIds[routeIds.length - 1] || ''
  const finalEvaluationText = aiEvaluation.answer || evaluation.closingMessage
  const aiSourceLabel = aiEvaluation.isLoading
    ? 'AI 正在生成'
    : aiEvaluation.source === 'deepseek'
      ? 'DeepSeek 生成'
      : '本地兜底评价'

  useEffect(() => {
    let isMounted = true

    setAiEvaluation({
      answer: '',
      notice: '',
      source: '',
      isLoading: true,
      error: ''
    })

    requestAIDayEvaluation(evaluation.aiEvaluationRequest.body)
      .then((data) => {
        if (!isMounted) return

        setAiEvaluation({
          answer: data?.answer || evaluation.closingMessage,
          notice: data?.notice || '',
          source: data?.source || 'local-fallback',
          isLoading: false,
          error: ''
        })
      })
      .catch((error) => {
        if (!isMounted) return

        setAiEvaluation({
          answer: evaluation.closingMessage,
          notice: '',
          source: 'frontend-fallback',
          isLoading: false,
          error: error instanceof Error ? error.message : 'AI day evaluation request failed.'
        })
      })

    return () => {
      isMounted = false
    }
  }, [evaluation])

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
          <h3 className="section-title map-title">🗺️ 你的校园路线</h3>
          <CampusMap locations={locations} route={routeIds} currentLocationId={currentLocationId} />
        </aside>

        <main className="result-content-panel">
          <div className="profile-card">
            <h2 className="profile-name">{profile.title}</h2>
            <p className="profile-description">{profile.description}</p>
            <p className="profile-advice">{profile.advice}</p>
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

            <div className="ai-evaluation-card">
              <div className="ai-evaluation-meta">
                <span>{aiSourceLabel}</span>
                {aiEvaluation.notice && <span>{aiEvaluation.notice}</span>}
                {aiEvaluation.error && <span>AI 暂时不可用，已显示本地评价</span>}
              </div>
              <p className="closing-message">
                {aiEvaluation.isLoading ? '正在整理你的最终体验评价...' : finalEvaluationText}
              </p>
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
        </main>
      </div>
    </div>
  )
}

export default Result

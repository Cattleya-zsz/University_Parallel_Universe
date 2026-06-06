import OptionCard from '../components/OptionCard'
import ScorePanel from '../components/ScorePanel'
import CampusMap from '../components/CampusMap'
import experienceTemplates from '../data/experienceTemplates.json'
import locations from '../data/locations.json'
import { removeConsecutiveDuplicates } from '../utils/route.js'

function Experience({ selectedMajor, currentStep, selectedOptions = [], scores, onSelectOption }) {
  const steps = selectedMajor && experienceTemplates[selectedMajor.id] ? experienceTemplates[selectedMajor.id] : []
  const currentStepData = steps[currentStep]
  const totalSteps = steps.length || 5
  const previewRouteIds = removeConsecutiveDuplicates([
    'dorm',
    ...selectedOptions.map((option) => option.locationId).filter(Boolean)
  ])
  const currentLocationId = previewRouteIds[previewRouteIds.length - 1] || 'dorm'

  return (
    <div className="experience-page">
      <header className="experience-topbar">
        <div className="experience-major-lockup">
          <span className="experience-major-icon">{selectedMajor?.icon}</span>
          <div>
            <span className="experience-kicker">今日专业体验</span>
            <h1>{selectedMajor?.name || '专业体验'}</h1>
          </div>
        </div>
        <div className="experience-step-pill">
          <span>{currentStep + 1}</span>
          <strong>{totalSteps}</strong>
        </div>
      </header>

      <div className="experience-layout">
        <main className="experience-choice-panel">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>

          <div className="step-info">
            <span className="step-number">第 {currentStep + 1} / {totalSteps} 阶段</span>
            <h2 className="step-period">{currentStepData?.period || '加载中...'}</h2>
          </div>

          <ScorePanel scores={scores} />

          <div className="question-section">
            <p className="question-text">{currentStepData?.question || '准备开始...'}</p>

            <div className="options-grid">
              {currentStepData?.options?.map((option, index) => (
                <OptionCard
                  key={index}
                  option={option}
                  onSelect={onSelectOption}
                />
              ))}
            </div>
          </div>
        </main>

        <aside className="experience-map-panel map-section map-highlight">
          <h3 className="section-title map-title">当前校园路线</h3>
          <CampusMap locations={locations} route={previewRouteIds} currentLocationId={currentLocationId} />
        </aside>
      </div>
    </div>
  )
}

export default Experience

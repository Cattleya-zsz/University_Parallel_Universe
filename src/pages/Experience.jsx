import OptionCard from '../components/OptionCard'
import ScorePanel from '../components/ScorePanel'
import experienceTemplates from '../data/test/experienceTemplates.json'

function Experience({ selectedMajor, currentStep, scores, onSelectOption }) {
  const steps = selectedMajor && experienceTemplates[selectedMajor.id] ? experienceTemplates[selectedMajor.id] : []
  const currentStepData = steps[currentStep]
  const totalSteps = 5

  return (
    <div className="experience-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentStep) / totalSteps) * 100}%` }} />
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
    </div>
  )
}

export default Experience
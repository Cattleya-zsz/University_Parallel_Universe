import { useState } from 'react'
import Home from './pages/Home'
import Experience from './pages/Experience'
import Result from './pages/Result'
import experienceTemplates from './data/experienceTemplates.json'

import { applyOptionScore, createInitialScores } from './utils/score.js'

const initialScores = createInitialScores()

function getStepCount(majorId) {
  const steps = experienceTemplates[majorId]
  return Array.isArray(steps) ? steps.length : 0
}

function App() {
  const [page, setPage] = useState('home')
  const [selectedMajor, setSelectedMajor] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [scores, setScores] = useState(initialScores)

  const handleSelectMajor = (major) => {
    setSelectedMajor(major)
    setCurrentStep(0)
    setSelectedOptions([])
    setScores(createInitialScores())
    setPage('experience')
  }

  const handleSelectOption = (option) => {
    setSelectedOptions(prev => [...prev, option])

    const newScores = applyOptionScore(scores, option)
    setScores(newScores)

    const nextStep = currentStep + 1
    setCurrentStep(nextStep)

    const totalSteps = getStepCount(selectedMajor?.id)
    if (nextStep >= totalSteps) {
      setPage('result')
    }
  }

  const handleRestart = () => {
    setPage('home')
    setSelectedMajor(null)
    setCurrentStep(0)
    setSelectedOptions([])
    setScores(createInitialScores())
  }

  const handleGoHome = () => {
    handleRestart()
  }

  return (
    <div className="app">
      {page === 'home' && (
        <Home onSelectMajor={handleSelectMajor} />
      )}
      {page === 'experience' && (
        <Experience
          selectedMajor={selectedMajor}
          currentStep={currentStep}
          selectedOptions={selectedOptions}
          scores={scores}
          onSelectOption={handleSelectOption}
        />
      )}
      {page === 'result' && (
        <Result
          selectedMajor={selectedMajor}
          selectedOptions={selectedOptions}
          scores={scores}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  )
}

export default App

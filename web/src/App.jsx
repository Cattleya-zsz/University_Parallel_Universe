import { useState } from 'react'
import Home from './pages/Home'
import Experience from './pages/Experience'
import Result from './pages/Result'

import { updateScores } from './data/test/score'
import { getProfile } from './data/test/profile'

window.updateScores = updateScores
window.getProfile = getProfile

function App() {
  const [page, setPage] = useState('home')
  const [selectedMajor, setSelectedMajor] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [scores, setScores] = useState({
    health: 0,
    study: 0,
    social: 0,
    practice: 0,
    pressure: 0
  })

  const handleSelectMajor = (major) => {
    setSelectedMajor(major)
    setCurrentStep(0)
    setSelectedOptions([])
    setScores({
      health: 0,
      study: 0,
      social: 0,
      practice: 0,
      pressure: 0
    })
    setPage('experience')
  }

  const handleSelectOption = (option) => {
    setSelectedOptions(prev => [...prev, option])
    
    const newScores = updateScores(scores, option.score || {})
    setScores(newScores)
    
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    
    const totalSteps = 5
    if (nextStep >= totalSteps) {
      setPage('result')
    }
  }

  const handleRestart = () => {
    setPage('home')
    setSelectedMajor(null)
    setCurrentStep(0)
    setSelectedOptions([])
    setScores({
      health: 0,
      study: 0,
      social: 0,
      practice: 0,
      pressure: 0
    })
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
          getProfile={getProfile}
        />
      )}
    </div>
  )
}

export default App
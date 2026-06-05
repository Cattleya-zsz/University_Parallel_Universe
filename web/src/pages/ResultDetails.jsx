import { useEffect, useMemo, useState } from 'react'
import CourseChat from '../components/CourseChat'
import coreCourses from '../data/coreCourses.json'
import { generateDayEvaluation, requestAIDayEvaluation } from '../utils/dayEvaluation.js'

function ResultDetails({ selectedMajor, selectedOptions, scores, onBack, onRestart }) {
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
    <div className="result-detail-page">
      <div className="result-detail-header">
        <button className="detail-back-btn" onClick={onBack}>返回总览</button>
        <div className="major-badge">
          <span className="badge-icon">{selectedMajor?.icon}</span>
          <span className="badge-text">{selectedMajor?.name}</span>
        </div>
      </div>

      <main className="result-detail-layout">
        <section className="evaluation-section detail-evaluation-section">
          <h1 className="section-title">{evaluation.title}</h1>
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
        </section>

        <section className="course-chat-section detail-chat-section">
          <h2 className="section-title">课程问答</h2>
          <CourseChat selectedMajor={selectedMajor} />
        </section>
      </main>

      <div className="action-buttons">
        <button className="action-btn secondary" onClick={onBack}>返回总览</button>
        <button className="action-btn primary" onClick={onRestart}>再次体验</button>
      </div>
    </div>
  )
}

export default ResultDetails

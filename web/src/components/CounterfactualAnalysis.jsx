import { useEffect, useMemo, useState } from 'react'

const COUNTERFACTUAL_ENDPOINT = '/api/counterfactual-analysis'

const GOALS = [
  {
    id: 'reducePressure',
    label: '降低压力',
    description: '更舒缓'
  },
  {
    id: 'increasePractice',
    label: '加强实践',
    description: '做项目'
  },
  {
    id: 'balanceDay',
    label: '更均衡',
    description: '稳节奏'
  },
  {
    id: 'increaseSocial',
    label: '增加协作',
    description: '多讨论'
  }
]

function CounterfactualAnalysis({ selectedMajor, selectedOptions = [], scores = {}, profile = null }) {
  const [activeGoalId, setActiveGoalId] = useState(GOALS[0].id)
  const [analysis, setAnalysis] = useState({
    answer: '',
    alternatives: [],
    notice: '',
    source: '',
    isLoading: false,
    error: ''
  })

  const activeGoal = useMemo(
    () => GOALS.find((goal) => goal.id === activeGoalId) || GOALS[0],
    [activeGoalId]
  )

  useEffect(() => {
    if (!selectedMajor?.id) return

    let isMounted = true

    async function requestCounterfactualAnalysis() {
      setAnalysis((current) => ({
        ...current,
        isLoading: true,
        error: '',
        notice: '',
        source: ''
      }))

      try {
        const response = await fetch(COUNTERFACTUAL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId: activeGoalId,
            majorId: selectedMajor.id,
            majorName: selectedMajor.name,
            scores,
            profile: profile
              ? {
                  title: profile.title,
                  dominantKey: profile.dominantKey
                }
              : null,
            selectedEvents: selectedOptions.map((option) => ({
              id: option.id,
              label: option.label,
              event: option.event,
              locationId: option.locationId,
              score: option.score
            }))
          })
        })

        if (!response.ok) {
          throw new Error(`AI 反事实分析返回 ${response.status}`)
        }

        const data = await response.json()
        if (!isMounted) return

        setAnalysis({
          answer: data.answer || '',
          alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
          notice: data.notice || '',
          source: data.source || '',
          isLoading: false,
          error: ''
        })
      } catch (error) {
        if (!isMounted) return

        setAnalysis({
          answer: 'AI 暂不可用。压力高可换运动或休息；实践低可换项目。',
          alternatives: [],
          notice: '',
          source: 'frontend-fallback',
          isLoading: false,
          error: error instanceof Error ? error.message : 'AI counterfactual request failed.'
        })
      }
    }

    requestCounterfactualAnalysis()

    return () => {
      isMounted = false
    }
  }, [activeGoalId, selectedMajor?.id, selectedMajor?.name, selectedOptions, scores, profile])

  const sourceLabel = analysis.isLoading
    ? 'AI 正在推演'
    : analysis.source === 'deepseek'
      ? 'DeepSeek 推演'
      : '本地兜底推演'

  return (
    <div className="counterfactual-card">
      <div className="counterfactual-heading">
        <div>
          <span className="ai-kicker">AI 平行路线</span>
          <h3>反事实体验分析</h3>
        </div>
        <span className="ai-status-pill">{sourceLabel}</span>
      </div>

      <div className="counterfactual-goals" aria-label="反事实分析目标">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            type="button"
            className={`counterfactual-goal ${goal.id === activeGoalId ? 'is-active' : ''}`}
            onClick={() => setActiveGoalId(goal.id)}
            disabled={analysis.isLoading && goal.id === activeGoalId}
          >
            <strong>{goal.label}</strong>
            <span>{goal.description}</span>
          </button>
        ))}
      </div>

      <div className="counterfactual-answer">
        <div className="ai-evaluation-meta">
          <span>{activeGoal.label}</span>
          {analysis.notice && <span>{analysis.notice}</span>}
          {analysis.error && <span>已显示前端兜底分析</span>}
        </div>
        <p>{analysis.isLoading ? '正在推演另一条可能的大学一天...' : analysis.answer}</p>
      </div>

      {analysis.alternatives.length > 0 && (
        <div className="counterfactual-options">
          {analysis.alternatives.map((option) => (
            <div key={option.id} className="counterfactual-option">
              <span>{option.period}</span>
              <strong>{option.label}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CounterfactualAnalysis

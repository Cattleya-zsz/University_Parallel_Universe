import { useMemo, useState } from 'react'
import courseKnowledgeBase from '../data/courseKnowledgeBase.json'

const SUGGESTED_QUESTIONS = [
  '这个专业最有代表性的课是什么？',
  '高中生适合先了解哪门课？',
  '这类专业学习起来难在哪里？'
]

function CourseChat({ selectedMajor, selectedOptions = [], scores = {}, profile = null }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [notice, setNotice] = useState('')
  const [source, setSource] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const relatedCourses = useMemo(
    () => courseKnowledgeBase
      .filter(course => course.majorId === selectedMajor?.id)
      .slice(0, 4),
    [selectedMajor?.id]
  )
  const sourceLabel = isLoading
    ? '正在生成'
    : source === 'deepseek'
      ? 'DeepSeek 生成'
      : '本地知识库兜底'

  const askCourseAssistant = async (nextQuestion = question) => {
    const trimmedQuestion = nextQuestion.trim()
    if (!trimmedQuestion || isLoading) return

    setQuestion(trimmedQuestion)
    setIsLoading(true)
    setNotice('')
    setSource('')

    try {
      const response = await fetch('/api/course-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          majorId: selectedMajor?.id,
          majorName: selectedMajor?.name,
          question: trimmedQuestion,
          dayContext: {
            profile: profile
              ? {
                  id: profile.id,
                  title: profile.title,
                  dominantKey: profile.dominantKey,
                  description: profile.description,
                  advice: profile.advice
                }
              : null,
            scores,
            selectedEvents: selectedOptions.map((option) => ({
              id: option.id,
              label: option.label,
              event: option.event,
              locationId: option.locationId,
              score: option.score
            }))
          }
        })
      })

      if (!response.ok) {
        throw new Error(`AI 服务返回 ${response.status}`)
      }

      const data = await response.json()
      setAnswer(data.answer || 'AI 暂时没有生成内容。')
      setNotice(data.notice || '')
      setSource(data.source || '')
    } catch (error) {
      setAnswer('AI 代理还没有启动，或 DeepSeek 暂时不可用。你可以先查看下方课程标签，等本地后端启动后再提问。')
      setNotice(error instanceof Error ? error.message : '请求失败')
      setSource('frontend-fallback')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="course-chat">
      <div className="chat-intro">
        <p>
          可以问问 {selectedMajor?.name || '当前专业'} 的课程、难度和日常体验。
          当前课程库已准备 {relatedCourses.length} 门代表课程。
        </p>
      </div>

      <div className="chat-course-tags" aria-label="代表课程">
        {relatedCourses.map(course => (
          <span key={course.id}>{course.courseName}</span>
        ))}
      </div>

      <div className="suggested-questions">
        {SUGGESTED_QUESTIONS.map(suggestedQuestion => (
          <button
            key={suggestedQuestion}
            type="button"
            className="suggested-question"
            onClick={() => askCourseAssistant(suggestedQuestion)}
            disabled={isLoading}
          >
            {suggestedQuestion}
          </button>
        ))}
      </div>

      <div className="chat-input-row">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="例如：经管类为什么要学统计？计算机操作系统到底在学什么？"
          rows={3}
        />
        <button
          type="button"
          className="chat-submit"
          onClick={() => askCourseAssistant()}
          disabled={isLoading || !question.trim()}
        >
          {isLoading ? '思考中...' : '提问'}
        </button>
      </div>

      {(answer || isLoading) && (
        <div className="chat-answer">
          <div className="chat-answer-meta">
            <span>{sourceLabel}</span>
            {notice && <span>{notice}</span>}
          </div>
          <p>{isLoading ? '正在整理一个更适合高中生理解的回答...' : answer}</p>
        </div>
      )}
    </div>
  )
}

export default CourseChat

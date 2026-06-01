import courseKnowledgeBase from '../data/courseKnowledgeBase.json'

function CourseChat({ selectedMajor }) {
  const relatedCourses = courseKnowledgeBase
    .filter(course => course.majorId === selectedMajor?.id)
    .slice(0, 4)

  return (
    <div className="course-chat-placeholder">
      <p>课程问答组件 - 待接入 AI</p>
      <p>已准备 {relatedCourses.length} 门 {selectedMajor?.name || ''} 课程的本地知识。</p>
      {relatedCourses.length > 0 && (
        <div className="chat-course-tags">
          {relatedCourses.map(course => (
            <span key={course.id}>{course.courseName}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseChat

import MajorCard from '../components/MajorCard'
import majors from '../data/majors.json'

function Home({ onSelectMajor }) {
  return (
    <div className="home-page">
      <div className="header">
        <h1 className="title">大学平行时空</h1>
        <p className="subtitle">选择专业，体验一天的大学生活</p>
      </div>

      <div className="majors-grid">
        {majors.map(major => (
          <MajorCard
            key={major.id}
            major={major}
            onSelect={onSelectMajor}
          />
        ))}
      </div>
    </div>
  )
}

export default Home

import MajorCard from '../components/MajorCard'
import majors from '../data/majors.json'

function Home({ onSelectMajor }) {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="header">
          <span className="hero-kicker">Campus Simulator</span>
          <span className="hero-project-name">University Parallel Universe</span>
          <h1 className="title">大学平行时空</h1>
          <p className="subtitle">高校生活模拟终端 + AI驱动专业解答</p>
          <div className="hero-actions">
            <a className="hero-action primary" href="#major-select">开始选择</a>
            <a className="hero-action secondary" href="#major-select">查看存档槽</a>
          </div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <div className="hero-pixel-console">
            <div className="hero-console-top">
              <div className="hero-console-meta">
                <span>DAY 01</span>
                <span>08:00</span>
                <span>READY</span>
              </div>
            </div>

            <div className="hero-campus-card">
              <div className="hero-map-hud">
                <span>"时空可视化"——</span>
                <strong>风格化校园地图</strong>
              </div>
            </div>

            <div className="hero-console-bottom">
              <div className="hero-avatar-card">
                <img src="/art/result/computer/study.png" alt="" />
                <span>计算机</span>
              </div>
              <div className="hero-avatar-card">
                <img src="/art/result/medicine/practice.png" alt="" />
                <span>医学类</span>
              </div>
              <div className="hero-avatar-card">
                <img src="/art/result/business/health.png" alt="" />
                <span>经管类</span>
              </div>
              <div className="hero-event-panel">
                <div className="hero-event-meta">
                  <span>一日模拟</span>
                  <strong>08:00 宿舍</strong>
                </div>
                <p>今天第一站，你想怎样开始专业体验？</p>
                <div className="hero-event-options">
                  <span>→ 营养早餐开启一天</span>
                  <span>→ 干劲满满自习启动</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-majors" id="major-select">
        <div className="home-section-heading">
          <span>Save slots</span>
          <h2>选择一个专业“平行时空”，载入这一天……</h2>
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
      </section>
    </div>
  )
}

export default Home

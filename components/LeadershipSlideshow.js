import {useState, useRef, useEffect} from 'react'

export default function LeadershipSlideshow({ leaders }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollArrows, setShowScrollArrows] = useState(false)
  const leaderBtnsRef = useRef(null)

  const go = (delta) => {
    setActiveIndex((i) => (i + delta + leaders.length) % leaders.length)
  }

  const select = (i) => setActiveIndex(i)

  const scrollLeaderBtns = (direction) => {
    if (leaderBtnsRef.current) {
      const scrollAmount = 120 // Height of one leader-btn approximately
      leaderBtnsRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Find max caption height for fixed section height in dots mode
  const captionRefs = useRef([])
  const [maxCaptionHeight, setMaxCaptionHeight] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1400
      setIsMobile(mobile)
      
      if (mobile) {
        setShowScrollArrows(false)
        setTimeout(() => {
          const maxH = Math.max(...captionRefs.current.map(r => r ? r.offsetHeight : 0))
          setMaxCaptionHeight(maxH)
        }, 100)
      } else {
        setMaxCaptionHeight(0)
        // Check if leader-btns needs scrolling
        if (leaderBtnsRef.current) {
          const needsScroll = leaderBtnsRef.current.scrollHeight > leaderBtnsRef.current.clientHeight
          setShowScrollArrows(needsScroll)
        }
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [leaders, activeIndex])

  const minHeightStyle = isMobile && maxCaptionHeight ? { minHeight: maxCaptionHeight + 380 } : {};
  
  return (
    <section className="section-leadership" style={minHeightStyle}>
      <h2 className="leadership-title">Leadership</h2>
      <div className="about-container">
        <div className="leader-containers">
          {leaders.map((leader, i) => (
            <div key={i} className={`leader-container ${i === activeIndex ? 'active' : ''}`}>
              <div className="large-img-box">
                <div className="arrow-btn-container">
                  <button className="arrow-btn-about arrow-square ion-android-arrow-dropleft" onClick={() => go(-1)}></button>
                  <button className="arrow-btn-about arrow-square ion-android-arrow-dropright" onClick={() => go(1)}></button>
                </div>
                <img className="large-img" src={leader.image} alt={leader.name} />
              </div>
              <div className="leader-caption" ref={el => captionRefs.current[i] = el}>
                <span>{leader.name}</span>
                <p className="caption-position">{leader.position}</p>
                <p>{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="leader-btns-wrapper">
          {showScrollArrows && (
            <button className="leader-scroll-arrow leader-scroll-up" onClick={() => scrollLeaderBtns('up')}>
              <span className="ion-chevron-up"></span>
            </button>
          )}
          <div className="leader-btns" ref={leaderBtnsRef}>
            {leaders.map((leader, i) => (
              <div
                key={i}
                className={`leader-btn ${i === activeIndex ? 'active' : ''}`}
                onClick={() => select(i)}
              >
                <div className="small-img-box">
                  <img className="small-img" src={leader.image} alt={leader.name} />
                </div>
                <div className="leader-btn-caption">
                  <span>{leader.name}</span>
                  <p className={i === activeIndex ? 'black-txt' : 'purple-txt'}>{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
          {showScrollArrows && (
            <button className="leader-scroll-arrow leader-scroll-down" onClick={() => scrollLeaderBtns('down')}>
              <span className="ion-chevron-down"></span>
            </button>
          )}
        </div>
      </div>
      <div className="leader-dots">
        {leaders.map((_, i) => (
          <div
            key={i}
            className={`leader-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => select(i)}
          ></div>
        ))}
      </div>
    </section>
  )
}
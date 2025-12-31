import {useState} from 'react'
import Link from 'next/link'

export default function SectionUs({ data, leadershipImages }) {
  const [active, setActive] = useState(0)

  return (
    <section className="section-us">
      <div className="work-title-flex hide-on-mobile">
        <h3 className="js--anim-1" dangerouslySetInnerHTML={{ __html: data.title }} />
      </div>
      <div className="container-space">
        {data.tabs.map((tab, index) => (
          <div key={index} className={`container-about ${active === index ? 'opacity-change z-indextop' : 'z-indexbot'}`} id={tab.title}>
            <div className="container-about-title">
              <span>{tab.title}</span>
            </div>
            <div className="container-about-text">
              {tab.title === 'People' && leadershipImages && (
                <div className="container-about-text-imgs">
                  {leadershipImages.map((img, i) => (
                    <img key={i} className="square-img" src={img} alt={`Team member ${i + 1}`} />
                  ))}
                </div>
              )}
              {tab.motto && <h5>{tab.motto}</h5>}
              {tab.title === 'People' ? (
                <p dangerouslySetInnerHTML={{ __html: tab.content }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: tab.content }} />
              )}
            </div>
            <div className="container-about-link">
              <Link href={tab.link} className="learnmore-btn about-btn">{tab.linkText}<span className="arrow-span">→</span></Link>
            </div>
          </div>
        ))}
      </div>
      <ul className="btn-layout hide-on-mobile">
        {data.tabs.map((tab, index) => (
          <li key={index} className={`btn-layout-listItem ${active === index ? 'background-change' : ''}`} onClick={()=>setActive(index)}>
            {tab.buttonLabel}
          </li>
        ))}
      </ul>
    </section>
  )
}
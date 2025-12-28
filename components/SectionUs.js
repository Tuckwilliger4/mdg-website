import {useState} from 'react'
import Link from 'next/link'

export default function SectionUs({ data, leadershipImages }) {
  const [active, setActive] = useState(0)

  return (
    <section className="section-us">
      <div className="work-title-flex hide-on-mobile">
        <h3 className="js--anim-1">Plan. Design.<br/>Architecture.</h3>
      </div>
      <div className="container-space">
        <div className={`container-about ${active === 0 ? 'opacity-change z-indextop' : 'z-indexbot'}`} id="About">
          <div className="container-about-title">
            <span>About</span>
          </div>
          <div className="container-about-text">
            McKim Design Group is a highly-regarded full-service architecture firm located in San Jose, California.<br/><br/>We work with school districts, commercial developers, residential homeowners, and specialty clients to deliver successful and award-winning projects on schedule and under budget.
          </div>
          <div className="container-about-link">
            <Link href="/services" className="learnmore-btn about-btn">Our Services<span className="arrow-span">→</span></Link>
          </div>
        </div>
        <div className={`container-about ${active === 1 ? 'opacity-change z-indextop' : 'z-indexbot'}`} id="People">
          <div className="container-about-title">
            <span>People</span>
          </div>
          <div className="container-about-text">
            <div className="container-about-text-imgs">
              {leadershipImages && leadershipImages.map((img, i) => (
                <img key={i} className="circle-img square-img" src={img} alt={`Team member ${i + 1}`} />
              ))}
            </div>
            <p>Our team provides an efficient, enjoyable design environment to tackle your building needs. The personal attention we give to our clients has built a project base that generates 85% of our work from repeat patrons.</p>
          </div>
          <div className="container-about-link">
            <Link href="/about" className="learnmore-btn about-btn">Our Story<span className="arrow-span">→</span></Link>
          </div>
        </div>
        <div className={`container-about ${active === 2 ? 'opacity-change z-indextop' : 'z-indexbot'}`} id="Values">
          <div className="container-about-title">
            <span>Values</span>
          </div>
          <div className="container-about-text">
            <h5>Personal Engagement Matters</h5>
            We strive to bring you personalized attention to suit your design and building needs.
          </div>
          <div className="container-about-link">
            <Link href="/about" className="learnmore-btn about-btn">Our Standards<span className="arrow-span">→</span></Link>
          </div>
        </div>
      </div>
      <ul className="btn-layout hide-on-mobile">
        <li className={`btn-layout-listItem ${active === 0 ? 'background-change' : ''}`} onClick={()=>setActive(0)}>What we do</li>
        <li className={`btn-layout-listItem ${active === 1 ? 'background-change' : ''}`} onClick={()=>setActive(1)}>Who we are</li>
        <li className={`btn-layout-listItem ${active === 2 ? 'background-change' : ''}`} onClick={()=>setActive(2)}>What we value</li>
      </ul>
    </section>
  )
}
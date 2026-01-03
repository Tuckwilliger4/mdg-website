import { useState } from 'react'

export default function Services({ data }) {
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Safety check for data
  if (!data || !data.services) {
    return <div>Loading services...</div>
  }

  return (
    <>
      <section className="section-services-header">
        <img src={data.heroImage} alt="McKim Design Group" className="services-hero-image" />
        <div className="services-header-content">
          <h2>{data.title}</h2>
          <p>{data.subtitle}</p>
        </div>
      </section>

      <section className="section-services-titles">
        {data.services.map((service, index) => (
          <div key={index} className="services-section">
            <button 
              type="button" 
              className={`services-btn ${openSections[index] ? 'active' : ''}`}
              onClick={() => toggleSection(index)}
            >
              <p>{service.name}</p>
              <span className={`services-icon ${openSections[index] ? 'open' : ''}`}>
                <span className="horizontal-line"></span>
                <span className="vertical-line"></span>
              </span>
            </button>
            <div className={`services-content ${openSections[index] ? 'open' : ''}`}>
              <div className="services-content-inner">
                <ul>
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
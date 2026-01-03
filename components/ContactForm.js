import { useState } from 'react'

export default function ContactForm({ site }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check honeypot field
    if (formData.website) {
      return // Bot detected, silently fail
    }
    
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      const form = e.target
      const formDataObj = new FormData(form)
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataObj).toString()
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '', website: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-contact-page">
      <div className="contact-page-container">
        <div className="contact-page-info">
          <h2 className="contact-section-title">Contact</h2>
          <div className="contact-page-title">
            <p>{site?.branding?.companyName}<br/>{site?.contact?.address}</p>
            <p><span>T</span><span className="contact-value">{site?.contact?.phone}</span></p>
            {site?.contact?.fax && <p><span>F</span><span className="contact-value">{site?.contact?.fax}</span></p>}
            <p><span>E</span><span className="contact-value">{site?.contact?.email}</span></p>
          </div>
        </div>
        <div className="contact-page-flex">
          <h2 className="contact-section-title">Inquiries</h2>
          <form onSubmit={handleSubmit} className="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="website">
            <input type="hidden" name="form-name" value="contact" />
            <div className="form-item">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-item">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                rows="5"
              ></textarea>
            </div>
            
            {/* Honeypot field - hidden from humans, visible to bots */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />
            
            <div className="form-item">
              <input
                type="submit"
                value={isSubmitting ? 'Sending...' : 'Submit'}
                disabled={isSubmitting}
              />
            </div>
            {submitStatus === 'success' && (
              <div className="form-status success">Thank you! Your message has been sent.</div>
            )}
            {submitStatus && submitStatus !== 'success' && (
              <div className="form-status error">
                {submitStatus === 'error' 
                  ? 'Sorry, there was an error sending your message. Please try again.'
                  : submitStatus}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
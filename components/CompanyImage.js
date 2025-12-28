export default function CompanyImage({ data }) {
  const smoothScroll = (target, duration = 1500) => {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <section
      className="section-company-image"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${data.bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="company-image-container">
        <h4>A Small Firm Centered Around You</h4>
        <div>
          <a className="image-btn js-scroll-story" onClick={() => {
            const element = document.querySelector('.section-our-story');
            if (element) smoothScroll(element, 1500);
          }}>Our Story</a>
          <a className="image-btn js-scroll-leadership" id="colored-btn" onClick={() => {
            const element = document.querySelector('.section-leadership');
            if (element) smoothScroll(element, 1500);
          }}>Our Leadership</a>
        </div>
      </div>
    </section>
  )
}
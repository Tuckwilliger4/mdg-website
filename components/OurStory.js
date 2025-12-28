export default function OurStory({ data }) {
  return (
    <section className="section-our-story">
      <p className="our-story-title">ABOUT US</p>
      <div dangerouslySetInnerHTML={{__html: data.body}} />
    </section>
  )
}
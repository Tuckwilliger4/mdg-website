export default function Stats({ stats }) {
  return (
    <section className="section-stats">
      <div className="stats-flex">
        {stats.map((s,i)=>(
          <div key={i} className="stats-box">
            <div className="stats-stat">{s.stat}</div>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
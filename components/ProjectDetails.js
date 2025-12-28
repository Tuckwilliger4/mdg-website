export default function ProjectDetails({ project }) {
  if (!project) return null

  const renderMetaItem = (label, value) => {
    if (!value) return null
    return (
      <div className="project-meta-item">
        <div className="project-meta-label">{label}</div>
        <div className="project-meta-value">{value}</div>
      </div>
    )
  }

  return (
    <section className="section-project-details">
      <h1 className="project-title">{project.title}</h1>
      <p className="project-location">{project.location}</p>
      
      <div className="project-content">
        <div className="project-meta">
          {renderMetaItem('Project Status', project.status)}
          {renderMetaItem('Design Lead', project.designLead)}
          {renderMetaItem('Year', project.year)}
          {renderMetaItem('Size', project.size)}
          {renderMetaItem('Type', project.type)}
          {/* Add more metadata fields as needed */}
        </div>
        
        <div className="project-details">
          <div className="project-description-title">Details</div>
          <div 
            className="project-description" 
            dangerouslySetInnerHTML={{__html: project.description || project.descriptionHtml}} 
          />
        </div>
      </div>
    </section>
  )
}
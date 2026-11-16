import { useEffect, useRef } from 'react'
import { portfolio } from '../data/portfolio'
import type { Landmark } from '../game/layout'
import { AboutSection, ContactSection, ExperienceSection, ProjectDetail, SkillsSection } from './sections'

function PanelBody({ landmark }: { landmark: Landmark }) {
  switch (landmark.kind) {
    case 'about':
      return <AboutSection />
    case 'skills':
      return <SkillsSection />
    case 'experience':
      return <ExperienceSection />
    case 'contact':
      return <ContactSection />
    case 'project': {
      const project = portfolio.projects.find((p) => p.id === landmark.projectId)
      return project ? <ProjectDetail project={project} /> : null
    }
  }
}

export function InfoPanel({ landmark, onClose }: { landmark: Landmark; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => closeButton.current?.focus(), [landmark])

  return (
    <div className="panel-backdrop" onPointerDown={onClose}>
      <section
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <header className="panel-header">
          <h2 id="panel-title">{landmark.label}</h2>
          <button ref={closeButton} className="icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <PanelBody landmark={landmark} />
      </section>
    </div>
  )
}

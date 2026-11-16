import type { ReactNode } from 'react'
import { portfolio, type Project } from '../data/portfolio'
import { assetUrl } from './assetUrl'

/**
 * Content blocks shared by the in-game panels and the classic view, so both
 * always show the same information from data/portfolio.ts.
 */

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={assetUrl(href)} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function AboutSection() {
  const { profile, resumeUrl } = portfolio
  return (
    <div className="section">
      <p className="lead">{profile.pitch}</p>
      <p>{profile.bio}</p>
      {profile.location && <p className="muted">📍 {profile.location}</p>}
      {resumeUrl && (
        <p>
          <ExternalLink href={resumeUrl}>Download résumé (PDF)</ExternalLink>
        </p>
      )}
    </div>
  )
}

export function SkillsSection() {
  return (
    <div className="section skill-groups">
      {portfolio.skills.map((group) => (
        <div key={group.name}>
          <h4>{group.name}</h4>
          <ul className="tags">
            {group.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function ExperienceSection() {
  return (
    <ol className="section timeline">
      {portfolio.experience.map((e) => (
        <li key={`${e.title}-${e.org}`}>
          <h4>
            {e.title} · <span className="muted">{e.org}</span>
          </h4>
          <p className="muted small">{e.period}</p>
          <p>{e.summary}</p>
        </li>
      ))}
    </ol>
  )
}

export function ContactSection() {
  const { contact } = portfolio
  return (
    <div className="section">
      {contact.email && (
        <p>
          ✉️ <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      )}
      <ul className="link-list">
        {contact.links.map((l) => (
          <li key={l.url}>
            <ExternalLink href={l.url}>{l.label}</ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="section">
      <p className="lead">{project.tagline}</p>
      {project.images.length > 0 && (
        <div className="gallery">
          {project.images.map((src) => (
            <img key={src} src={assetUrl(src)} alt={`${project.title} screenshot`} loading="lazy" />
          ))}
        </div>
      )}
      <p>{project.description}</p>
      <p>
        <strong>My role:</strong> {project.role}
      </p>
      <ul className="tags">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="link-row">
        {project.liveUrl && <ExternalLink href={project.liveUrl}>Live demo ↗</ExternalLink>}
        {project.repoUrl && <ExternalLink href={project.repoUrl}>Source code ↗</ExternalLink>}
      </p>
    </div>
  )
}

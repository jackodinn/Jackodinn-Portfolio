import { portfolio } from '../data/portfolio'
import { AboutSection, ContactSection, ExperienceSection, ProjectDetail, SkillsSection } from './sections'

/**
 * Plain, fast, accessible version of the portfolio — for recruiters in a
 * hurry, low-end devices, and anyone who prefers not to play.
 */
const YEAR = new Date().getFullYear()

export function ClassicView({ canPlay }: { canPlay: boolean }) {
  const { profile, projects } = portfolio
  return (
    <div className="classic">
      <header className="classic-hero">
        <div>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
        </div>
        {canPlay && (
          <a className="button button--primary" href="#/">
            ▶ Play the 3D world
          </a>
        )}
      </header>

      <main>
        <section aria-labelledby="about">
          <h2 id="about">About</h2>
          <AboutSection />
        </section>

        <section aria-labelledby="projects">
          <h2 id="projects">Projects</h2>
          <div className="project-grid">
            {projects.map((p) => (
              <article key={p.id} className="card">
                <h3>{p.title}</h3>
                <ProjectDetail project={p} />
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="skills">
          <h2 id="skills">Skills</h2>
          <SkillsSection />
        </section>

        <section aria-labelledby="experience">
          <h2 id="experience">Experience</h2>
          <ExperienceSection />
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact">Contact</h2>
          <ContactSection />
        </section>
      </main>

      <footer className="muted small">
        © {YEAR} {profile.name}
      </footer>
    </div>
  )
}

/**
 * Single source of truth for all portfolio content.
 *
 * Both the 3D game world and the classic view read from this file, so
 * update a project here once and it changes everywhere.
 *
 * Everything below is PLACEHOLDER content — replace it with your own.
 * Leave a field as an empty string ('') to hide it.
 */

export interface Link {
  label: string
  url: string
}

export interface Project {
  id: string
  title: string
  /** One-line summary shown on cards and signposts. */
  tagline: string
  /** What it does / what problem it solves. */
  description: string
  /** What YOU did on the project. */
  role: string
  tech: string[]
  /** Paths relative to /public (e.g. 'projects/my-app-1.png') or full URLs. */
  images: string[]
  liveUrl: string
  repoUrl: string
}

export interface SkillGroup {
  name: string
  skills: string[]
}

export interface Experience {
  title: string
  org: string
  period: string
  summary: string
}

export interface Portfolio {
  profile: {
    name: string
    role: string
    pitch: string
    bio: string
    location: string
  }
  /** Path relative to /public (e.g. 'resume.pdf') or a full URL. */
  resumeUrl: string
  contact: {
    email: string
    links: Link[]
  }
  projects: Project[]
  skills: SkillGroup[]
  experience: Experience[]
}

export const portfolio: Portfolio = {
  profile: {
    name: 'Jackodinn',
    role: 'Creative Frontend Developer',
    pitch: 'I build interactive web experiences with React and 3D.',
    bio: 'Placeholder bio — a few sentences about your background, what drives you, and what you are looking for next.',
    location: 'Your City, Country',
  },
  resumeUrl: '',
  contact: {
    email: 'you@example.com',
    links: [
      { label: 'GitHub', url: 'https://github.com/jackodinn' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    ],
  },
  projects: [
    {
      id: 'project-one',
      title: 'Project One',
      tagline: 'Short one-line summary of the project.',
      description: 'What the project does and which problem it solves.',
      role: 'What you personally built or led.',
      tech: ['React', 'TypeScript'],
      images: [],
      liveUrl: '',
      repoUrl: '',
    },
    {
      id: 'project-two',
      title: 'Project Two',
      tagline: 'Short one-line summary of the project.',
      description: 'What the project does and which problem it solves.',
      role: 'What you personally built or led.',
      tech: ['Node.js', 'PostgreSQL'],
      images: [],
      liveUrl: '',
      repoUrl: '',
    },
    {
      id: 'project-three',
      title: 'Project Three',
      tagline: 'Short one-line summary of the project.',
      description: 'What the project does and which problem it solves.',
      role: 'What you personally built or led.',
      tech: ['Three.js', 'GLSL'],
      images: [],
      liveUrl: '',
      repoUrl: '',
    },
  ],
  skills: [
    { name: 'Frontend', skills: ['React', 'TypeScript', 'HTML', 'CSS'] },
    { name: '3D & Graphics', skills: ['Three.js', 'React Three Fiber', 'Blender'] },
    { name: 'Backend', skills: ['Node.js', 'REST APIs'] },
    { name: 'Tools', skills: ['Git', 'Vite', 'Figma'] },
  ],
  experience: [
    {
      title: 'Job Title',
      org: 'Company / School',
      period: '2024 — Present',
      summary: 'One or two lines about what you did and achieved.',
    },
  ],
}

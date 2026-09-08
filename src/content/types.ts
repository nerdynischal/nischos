export type Project = {
  id: string
  title: string
  subtitle: string
  iconTone: string
  thumbnail?: string
  type: string
  model: string
  sortOrder: number
  dockOrder?: number
  story: string
  screenshots: string[]
  demoUrl?: string
  sourceUrl?: string
  postId?: string
  caseStudy?: ProjectCaseStudy
}

export type ProjectCaseStudyImage = {
  src: string
  alt: string
  caption?: string
}

export type ProjectCaseStudySection = {
  title: string
  body?: string[]
  bullets?: string[]
  images?: ProjectCaseStudyImage[]
  imageLayout?: 'grid'
}

export type ProjectCaseStudy = {
  tags: string[]
  sections: ProjectCaseStudySection[]
}

export type BlogPost = {
  id: string
  title: string
  date: string
  folder: 'Notes' | 'Build Logs' | 'Drafts'
  isPinned: boolean
  contentMarkdown: string
}

export type SettingsDetail = {
  label: string
  value: string
  href?: string
}

export type SettingsTool = {
  title: string
  description: string
  icon: string
  url?: string
}

export type SettingsToolGroup = {
  id: string
  label: string
  tools: SettingsTool[]
}

export type SettingsSection = {
  id: string
  label: string
  displayTitle?: string
  displaySubtitle?: string
  body: string
  details?: SettingsDetail[]
  toolGroups?: SettingsToolGroup[]
  items: string[]
}

export type Project = {
  id: string
  title: string
  subtitle: string
  iconTone: string
  thumbnail?: string
  type: string
  model: string
  story: string
  screenshots: string[]
  demoUrl?: string
  sourceUrl?: string
  postId?: string
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
}

export type SettingsSection = {
  id: string
  label: string
  displayTitle?: string
  displaySubtitle?: string
  body: string
  details?: SettingsDetail[]
  items: string[]
}

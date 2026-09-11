import { legacyProjects } from '../../content/legacyProjects'
import { EmptyState } from '../../components/EmptyState'
import { LegacyProjectWindow } from './LegacyProjectWindow'

export function LegacyCaseStudyWindow({ projectId }: { projectId: string }) {
  const project = legacyProjects.find((item) => item.id === projectId)
  return project
    ? <LegacyProjectWindow project={project} />
    : <EmptyState title="Project missing" body="This app moved somewhere else." />
}

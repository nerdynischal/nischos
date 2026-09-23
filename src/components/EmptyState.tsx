export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state" role="status">
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  )
}

type MarkdownNode = {
  type: string
  depth?: number
  children?: MarkdownNode[]
}

// The reader supplies the H1. Preserve Markdown section nesting beneath it,
// including notes that start at H2 or skip a heading rank.
export function remarkNoteHeadings() {
  return (tree: MarkdownNode) => {
    const ancestors: number[] = []
    function walk(node: MarkdownNode) {
      if (node.type === 'heading' && node.depth !== undefined) {
        const sourceDepth = node.depth
        while (ancestors.length && ancestors[ancestors.length - 1] >= sourceDepth) {
          ancestors.pop()
        }
        ancestors.push(sourceDepth)
        node.depth = Math.min(ancestors.length + 1, 6)
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}

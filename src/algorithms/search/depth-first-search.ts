import { GraphNode } from '../graphs/graph-node'

/**
 * Perform a depth-first search through a directed graph.
 *
 * Time complexity: O(V+E)
 * Space complexity: O(V)
 *
 * @param {GraphNode<T>} startNode
 * @param {Map<GraphNode<T>, Array<GraphNode<T>>} graph
 * @return {Array<GraphNode<T>>}
 */
export const dfs = <T>(startNode: GraphNode<T>, graph: Map<GraphNode<T>, Array<GraphNode<T>>>) => {
  const output: Array<T> = new Array()
  const visited = new Set<GraphNode<T>>()

  recurse(startNode, graph, visited, output)

  return output
}

const recurse = <T>(
  root: GraphNode<T>,
  graph: Map<GraphNode<T>, Array<GraphNode<T>>>,
  visited: Set<GraphNode<T>>,
  output: Array<T>
): void => {
  output.push(root.val)
  visited.add(root)

  const children = graph.get(root)
  if (!children) throw new Error('Children shouldnt be null')

  // loop through children of root and recurse
  for (const child of children) {
    if (!visited.has(child)) recurse(child, graph, visited, output)
  }
}

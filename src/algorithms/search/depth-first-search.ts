import { GraphNode } from './graph-node'

/**
 * Perform a depth-first search through a directed graph.
 *
 * Time complexity: O(V+E)
 * Space complexity: O(V)
 *
 * @param startNode - The node to begin the search at
 * @return {Array<GraphNode<T>>}
 */
export const dfs = <T>(startNode: GraphNode<T>) => {
  const output: Array<T> = new Array()
  const visited = new Set<GraphNode<T>>()

  recurse(startNode, visited, output)

  return output
}

const recurse = <T>(
  startNode: GraphNode<T>,
  visited: Set<GraphNode<T>>,
  output: Array<T>
): void => {
  output.push(startNode.val)
  visited.add(startNode)

  for (const child of startNode.children) {
    if (!visited.has(child)) recurse(child, visited, output)
  }
}

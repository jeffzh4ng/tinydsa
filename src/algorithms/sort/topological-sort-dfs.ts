import LinkedList from '../../data-structures/sequences/linked-list'
import { GraphNode } from '../graphs/graph-node'

/**
 * Perform a topological sort through a directed graph using the depth first technique.
 *
 * Time complexity: O(V+E)
 * Space complexity: O(V) (recursion and output)
 *
 * @param startNode - The node to begin the search at
 * @return {Array<GraphNode<T>>}
 */
export const topologicalSortDepthFirst = <T>(
  graph: Map<GraphNode<T>, Array<GraphNode<T>>>
): Array<T> => {
  const output = new LinkedList<T>()
  const visited = new Set<GraphNode<T>>()

  for (const node of graph.keys()) {
    if (!visited.has(node)) dfs(node, graph, visited, output)
  }

  return Array.from(output)
}

const dfs = <T>(
  root: GraphNode<T>,
  graph: Map<GraphNode<T>, Array<GraphNode<T>>>,
  visited: Set<GraphNode<T>>,
  output: LinkedList<T>
): void => {
  visited.add(root)
  const children = graph.get(root)

  if (children) {
    for (const child of children) {
      dfs(child, graph, visited, output)
    }
  }

  output.addFront(root.val)
}

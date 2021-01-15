import { Queue } from '../../data-structures/sequences/queue'
import { GraphNode } from '../graphs/graph-node'

/**
 * Perform a breadth-first search through a directed graph.
 *
 * Time complexity: O(V+E)
 * Space complexity: O(V)
 *
 * @param startNode - The node to begin the search at
 * @return {Array<GraphNode<T>>}
 */
export const bfs = <T>(startNode: GraphNode<T>, graph: Map<GraphNode<T>, Array<GraphNode<T>>>) => {
  const output: Array<T> = new Array()
  const q: Queue<GraphNode<T>> = new Queue()
  const visited = new Set<GraphNode<T>>()

  q.enqueue(startNode)
  visited.add(startNode)

  while (!q.isEmpty()) {
    let size = q.size()

    while (size-- > 0) {
      const node = q.dequeue()
      if (!node) throw new Error('Node shouldnt be null.')
      output.push(node.val)

      if (graph.has(node)) {
        const children = graph.get(node)
        if (!children) throw new Error('Children shouldnt be null.')

        for (const child of children) {
          if (!visited.has(child)) {
            q.enqueue(child)
            visited.add(child!)
          }
        }
      }
    }
  }

  return output
}

import { Queue } from '../../data-structures/sequences/queue'
import { GraphNode } from './graph-node'

/**
 * Perform a breadth-first search through a directed graph.
 *
 * Time complexity: O(V+E)
 * Space complexity: O(V)
 *
 * @param startNode - The node to begin the search at
 * @return {Array<GraphNode<T>>}
 */
export const bfs = <T>(startNode: GraphNode<T>) => {
  const output: Array<T> = new Array()
  const q: Queue<GraphNode<T>> = new Queue()
  const visited = new Set<GraphNode<T>>()

  q.enqueue(startNode)
  visited.add(startNode)

  while (!q.isEmpty()) {
    let size = q.size()

    while (size-- > 0) {
      const node = q.dequeue()
      output.push(node?.val!) // node can't be null, we're in a !q.isEmpty() loop

      for (const child of node?.children!) {
        if (!visited.has(child)) {
          q.enqueue(child)
          visited.add(child!)
        }
      }
    }
  }

  return output
}

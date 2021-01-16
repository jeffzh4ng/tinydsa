import { Queue } from '../../data-structures/sequences/queue'
import { GraphNode } from '../graphs/graph-node'

/**
 * Perform a topological sort on a directed graph using Kahn's algorithm.
 *
 * Time complexity: O(V+E)
 * Space complexity: O(V)
 *
 * @param {Map<GraphNode<T>, Array<GraphNode<T>>} graph
 * @return {Array<GraphNode<T>>}
 */
export const topologicalSortKahn = <T>(graph: Map<GraphNode<T>, Array<GraphNode<T>>>) => {
  const inDegree: Map<GraphNode<T>, number> = new Map()

  for (const node of graph.keys()) {
    inDegree.set(node, 0)
  }

  for (const [node, children] of graph.entries()) {
    for (const child of children) {
      inDegree.set(child, inDegree.get(child)! + 1)
    }
  }

  const sources = new Queue<GraphNode<T>>() // queue of nodes with inDegree of 0 aka sources
  for (const [node, _] of graph.entries()) {
    if (inDegree.get(node) === 0) sources.enqueue(node)
  }

  const output: Array<T> = []
  while (!sources.isEmpty()) {
    const node = sources.dequeue()
    if (!node) throw new Error('Node must not be null')

    output.push(node.val)

    const children = graph.get(node)
    if (!children) throw new Error('Children must not be null')

    for (const child of children) {
      inDegree.set(child, inDegree.get(child)! - 1)

      if (inDegree.get(child) === 0) sources.enqueue(child)
    }
  }

  return output
}

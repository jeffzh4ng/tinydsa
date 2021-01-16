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

  // initialize inDegree map
  for (const node of graph.keys()) {
    inDegree.set(node, 0)
  }

  // calculate in degree's for each node
  for (const children of graph.values()) {
    for (const child of children) {
      inDegree.set(child, inDegree.get(child)! + 1)
    }
  }

  // build the sources queue which contains node with inDegree of 0 aka sources
  const sources = new Queue<GraphNode<T>>()
  for (const [node, _] of graph.entries()) {
    if (inDegree.get(node) === 0) sources.enqueue(node)
  }

  // loop while sources is not empty
  const output: Array<T> = []
  while (!sources.isEmpty()) {
    const node = sources.dequeue()
    if (!node) throw new Error('Node must not be null')

    // push current node to output
    output.push(node.val)

    const children = graph.get(node)
    if (!children) throw new Error('Children must not be null')

    // for every child of the node, remove 1 from their inDegree becauase we visited one of their parents
    for (const child of children) {
      inDegree.set(child, inDegree.get(child)! - 1)

      // if that child is now a source, add it to the sources q
      if (inDegree.get(child) === 0) sources.enqueue(child)
    }
  }

  return output
}

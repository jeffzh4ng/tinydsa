import { MinBinaryHeap } from '../../../data-structures/priority-queues'
import { GraphNode, PrevVertices, ShortestDistances, WeightedGraph } from '../graph-node'

/**
 * Perform Dijkstra's shortest path algorithm.
 * Find the shortest path between two vertices in a directed graph with positive weights.
 *
 * Time complexity: O[(V+E)logV]
 * Space complexity: O(V+E)
 *
 * @param {WeightedGraph<T>} graph
 * @param {GraphNode<T>} source
 * @param {GraphNode<T>} target
 * @return {[Array<<T>>, number]}
 */
export const shortestPath = <T>(
  graph: WeightedGraph<T>,
  source: GraphNode<T>,
  target: GraphNode<T>
): [Array<T>, number] => {
  const [dist, prev] = dijkstra(graph, source)
  const shortestPath = new Array<T>()

  for (let at = target; at !== null; at = prev.get(at)!) {
    shortestPath.push(at.val)
  }

  return [shortestPath.reverse(), dist.get(target)!]
}

const dijkstra = <T>(
  graph: WeightedGraph<T>,
  source: GraphNode<T>
): [ShortestDistances<T>, PrevVertices<T>] => {
  const visited = new Set<GraphNode<T>>()
  const dist: ShortestDistances<T> = new Map()
  const prev: PrevVertices<T> = new Map()

  for (const node of graph.keys()) {
    dist.set(node, Number.POSITIVE_INFINITY)
    prev.set(node, null)
  }
  dist.set(source, 0) // dist[source] needs to be 0, not infinity

  const pq = new MinBinaryHeap<[GraphNode<T>, number]>([], (a, b) => a[1] - b[1])
  pq.add([source, 0])

  while (!pq.isEmpty()) {
    const [u, uDist] = pq.poll()!

    if (!u) throw new Error('This will never happen')

    const uDistStale = uDist > dist.get(u)!
    if (uDistStale) continue

    visited.add(u)

    const neighborsOfU = graph.get(u)!

    for (const [v, weight] of neighborsOfU) {
      if (visited.has(v)) continue

      const altDistance = uDist + weight

      if (altDistance < dist.get(v)!) {
        dist.set(v, altDistance)
        prev.set(v, u)

        pq.add([v, altDistance])
      }
    }
  }

  return [dist, prev]
}

import { GraphNode, PrevVertices, ShortestDistances, WeightedGraph } from '../graph-node'

/**
 * Perform Bellman-Ford shortest path algorithm.
 * Find the shortest path between two vertices in a directed graph with positive weights.
 *
 * Time complexity: O[VE]
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
  const [dist, prev] = bellmanFord(graph, source)
  const shortestPath = new Array<T>()

  for (let at = target; at !== null; at = prev.get(at)!) {
    shortestPath.push(at.val)
  }

  return [shortestPath.reverse(), dist.get(target)!]
}

const bellmanFord = <T>(
  graph: WeightedGraph<T>,
  source: GraphNode<T>
): [ShortestDistances<T>, PrevVertices<T>] => {
  const dist: ShortestDistances<T> = new Map()
  const prev: PrevVertices<T> = new Map()

  // step 1. initialize
  for (const node of graph.keys()) {
    dist.set(node, Number.POSITIVE_INFINITY)
    prev.set(node, null)
  }
  dist.set(source, 0) // dist[source] needs to be 0, not infinity

  // build edge list
  const edgeList: Array<[GraphNode<T>, GraphNode<T>, number]> = []
  for (const [v, vEdges] of graph.entries()) {
    for (const edge of vEdges) {
      edgeList.push([v, edge[0], edge[1]])
    }
  }

  // step 2. relax edges V-1 time
  const V = graph.size
  for (let i = 0; i < V - 1; i++) {
    for (const edge of edgeList) {
      const [u, v, weight] = edge
      if (dist.get(u)! + weight < dist.get(v)!) {
        dist.set(v, dist.get(u)! + weight)
        prev.set(v, u)
      }
    }
  }

  // step 3. check for negative cycles
  for (const edge of edgeList) {
    const [u, v, weight] = edge
    if (dist.get(u)! + weight < dist.get(v)!) {
      throw new Error('Negative-weighted cycle found in graph.')
    }
  }

  return [dist, prev]
}

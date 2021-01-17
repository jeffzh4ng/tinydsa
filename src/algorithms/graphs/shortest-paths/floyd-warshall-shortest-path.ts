import { GraphNode, WeightedGraph } from '../graph-node'

type U = GraphNode<number>
type V = GraphNode<number>
type Weight = number

type DP = Array<Array<number>>
type Next = Array<Array<GraphNode<number> | null>>

export const shortestPath = (
  next: Next,
  source: GraphNode<number>,
  target: GraphNode<number>
): Array<number> => {
  if (next[source.val][target.val] === null) return []

  const path = []

  while (source !== target) {
    path.push(source.val)

    const nextNode = next[source.val][target.val]

    if (nextNode === null) return []
    source = nextNode
  }

  path.push(source.val) // source is now target

  return path
}
export const floydWarshall = (graph: WeightedGraph<number>): [DP, Next] => {
  const V = graph.size
  const dp: Array<Array<number>> = new Array(V)
    .fill(0)
    .map(() => new Array<number>(V).fill(Infinity))
  const next: Array<Array<GraphNode<number> | null>> = new Array(V)
    .fill(0)
    .map(() => new Array<GraphNode<number> | null>(V).fill(null))

  // initialize dp matrix
  const edgeList: Array<[U, V, Weight]> = []
  for (const [v, vEdges] of graph.entries()) {
    for (const edge of vEdges) {
      edgeList.push([v, edge[0], edge[1]])
    }
  }
  for (const edge of edgeList) {
    const [u, v, weight] = edge
    dp[u.val][v.val] = weight
    next[u.val][v.val] = v
  }
  for (const v of graph.keys()) {
    dp[v.val][v.val] = 0
    next[v.val][v.val] = v
  }

  // build the shorest distances
  for (let k = 0; k < dp.length; k++) {
    for (let i = 0; i < dp.length; i++) {
      for (let j = 0; j < dp.length; j++) {
        if (dp[i][k] + dp[k][j] < dp[i][j]) {
          dp[i][j] = dp[i][k] + dp[k][j]
          next[i][j] = next[i][k]
        }
      }
    }
  }

  // detect and propagate negative cycle
  for (let k = 0; k < dp.length; k++) {
    for (let i = 0; i < dp.length; i++) {
      for (let j = 0; j < dp.length; j++) {
        if (dp[i][k] + dp[k][j] < dp[i][j]) {
          dp[i][j] = -Infinity
          next[i][j] = null
        }
      }
    }
  }

  return [dp, next]
}

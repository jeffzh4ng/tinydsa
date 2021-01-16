import { GraphNode, WeightedGraph } from '../../../src/algorithms/graphs/graph-node'
import { shortestPath } from '../../../src/algorithms/graphs/shortest-paths/bellman-ford-shortest-path'

describe('Bellman-Ford Shortest Path', () => {
  test('Basic Graph', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const aNeighbors: Map<GraphNode<string>, number> = new Map([
      [b, 5],
      [c, 1],
    ])
    const bNeighbors: Map<GraphNode<string>, number> = new Map()
    const cNeighbors: Map<GraphNode<string>, number> = new Map([[b, 1]])

    const graph: WeightedGraph<string> = new Map([
      [a, aNeighbors],
      [b, bNeighbors],
      [c, cNeighbors],
    ])

    const [path, cost] = shortestPath(graph, a, b)

    expect(path).toEqual(['a', 'c', 'b'])
    expect(cost).toBe(2)
  })

  test('Basic Graph with Cycle', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const aNeighbors: Map<GraphNode<string>, number> = new Map([
      [b, 5],
      [c, 1],
    ])
    const bNeighbors: Map<GraphNode<string>, number> = new Map([[a, 4]])
    const cNeighbors: Map<GraphNode<string>, number> = new Map([[b, 1]])

    const graph: WeightedGraph<string> = new Map([
      [a, aNeighbors],
      [b, bNeighbors],
      [c, cNeighbors],
    ])

    const [path, cost] = shortestPath(graph, a, b)

    expect(path).toEqual(['a', 'c', 'b'])
    expect(cost).toBe(2)
  })

  test('Basic Graph with Negative-Weighted Cycle', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')
    const d = new GraphNode('d')

    const aNeighbors: Map<GraphNode<string>, number> = new Map([[b, 2]])
    const bNeighbors: Map<GraphNode<string>, number> = new Map([
      [c, -1],
      [d, 1],
    ])
    const cNeighbors: Map<GraphNode<string>, number> = new Map([[a, -2]])
    const dNeighbors: Map<GraphNode<string>, number> = new Map([])

    const graph: WeightedGraph<string> = new Map([
      [a, aNeighbors],
      [b, bNeighbors],
      [c, cNeighbors],
      [d, dNeighbors],
    ])

    expect(() => {
      shortestPath(graph, a, b)
    }).toThrow()
  })
})

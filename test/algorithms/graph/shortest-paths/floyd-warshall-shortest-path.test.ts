import { GraphNode, WeightedGraph } from '../../../../src/algorithms/graphs/graph-node'
import {
  floydWarshall,
  shortestPath,
} from '../../../../src/algorithms/graphs/shortest-paths/floyd-warshall-shortest-path'

describe('Floyd Warshall', () => {
  test('Basic graph', () => {
    const zero = new GraphNode(0)
    const one = new GraphNode(1)
    const two = new GraphNode(2)

    const zerosNeighbors: Map<GraphNode<number>, number> = new Map([
      [one, 5],
      [two, 1],
    ])
    const onesNeighbors: Map<GraphNode<number>, number> = new Map()
    const twoNeighbors: Map<GraphNode<number>, number> = new Map([[one, 1]])

    const graph: WeightedGraph<number> = new Map([
      [zero, zerosNeighbors],
      [one, onesNeighbors],
      [two, twoNeighbors],
    ])

    const expectedDP = [
      [0, 2, 1],
      [Infinity, 0, Infinity],
      [Infinity, 1, 0],
    ]

    const [dist, _] = floydWarshall(graph)

    for (let i = 0; i < dist.length; i++) {
      for (let j = 0; j < dist.length; j++) {
        expect(dist[i][j]).toEqual(expectedDP[i][j])
      }
    }
  })

  test('Basic Graph with Cycle', () => {
    const zero = new GraphNode(0)
    const one = new GraphNode(1)
    const two = new GraphNode(2)

    const zerosNeighbors: Map<GraphNode<number>, number> = new Map([
      [one, 5],
      [two, 1],
    ])
    const onesNeighbors: Map<GraphNode<number>, number> = new Map([[zero, 3]])
    const twosNeighbors: Map<GraphNode<number>, number> = new Map([[one, 1]])

    const graph: WeightedGraph<number> = new Map([
      [zero, zerosNeighbors],
      [one, onesNeighbors],
      [two, twosNeighbors],
    ])

    const expectedDP = [
      [0, 2, 1],
      [3, 0, 4],
      [4, 1, 0],
    ]

    const [dist, _] = floydWarshall(graph)

    for (let i = 0; i < dist.length; i++) {
      for (let j = 0; j < dist.length; j++) {
        expect(dist[i][j]).toEqual(expectedDP[i][j])
      }
    }
  })

  test('Basic path', () => {
    const zero = new GraphNode(0)
    const one = new GraphNode(1)
    const two = new GraphNode(2)

    const zerosNeighbors: Map<GraphNode<number>, number> = new Map([
      [one, 5],
      [two, 1],
    ])
    const onesNeighbors: Map<GraphNode<number>, number> = new Map()
    const twoNeighbors: Map<GraphNode<number>, number> = new Map([[one, 1]])

    const graph: WeightedGraph<number> = new Map([
      [zero, zerosNeighbors],
      [one, onesNeighbors],
      [two, twoNeighbors],
    ])

    const [_, next] = floydWarshall(graph)

    expect(shortestPath(next, zero, one)).toEqual([0, 2, 1])
    expect(shortestPath(next, zero, two)).toEqual([0, 2])
    expect(shortestPath(next, one, zero)).toEqual([])
    expect(shortestPath(next, one, two)).toEqual([])
    expect(shortestPath(next, two, zero)).toEqual([])
    expect(shortestPath(next, two, one)).toEqual([2, 1])
  })

  test('Basic path with cycle', () => {
    const zero = new GraphNode(0)
    const one = new GraphNode(1)
    const two = new GraphNode(2)

    const zerosNeighbors: Map<GraphNode<number>, number> = new Map([
      [one, 5],
      [two, 1],
    ])
    const onesNeighbors: Map<GraphNode<number>, number> = new Map([[zero, 3]])
    const twoNeighbors: Map<GraphNode<number>, number> = new Map([[one, 1]])

    const graph: WeightedGraph<number> = new Map([
      [zero, zerosNeighbors],
      [one, onesNeighbors],
      [two, twoNeighbors],
    ])

    const [_, next] = floydWarshall(graph)

    expect(shortestPath(next, zero, one)).toEqual([0, 2, 1])
    expect(shortestPath(next, zero, two)).toEqual([0, 2])
    expect(shortestPath(next, one, zero)).toEqual([1, 0])
    expect(shortestPath(next, one, two)).toEqual([1, 0, 2])
    expect(shortestPath(next, two, zero)).toEqual([2, 1, 0])
    expect(shortestPath(next, two, one)).toEqual([2, 1])
  })
})

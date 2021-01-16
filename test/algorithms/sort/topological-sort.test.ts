import { GraphNode } from '../../../src/algorithms/graphs/graph-node'
import { topologicalSortDepthFirst } from '../../../src/algorithms/sort/topological-sort-dfs'
import { topologicalSortKahn } from '../../../src/algorithms/sort/topological-sort-kahn'

describe('Topological Sort DFS', () => {
  test('Basic graph', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, []],
    ])

    expect(topologicalSortDepthFirst(graph)).toEqual(['a', 'b', 'c'])
  })

  test('Graph with dependencies', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')
    const d = new GraphNode('d')
    const e = new GraphNode('e')

    // a      d
    //  v    ^
    //   c --
    //  ^    v
    // b      e

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, [d, e]],
      [d, []],
      [e, []],
    ])

    expect(topologicalSortDepthFirst(graph)).toEqual(['a', 'b', 'c', 'e', 'd'])
  })
})

describe('Topological Sort DFS', () => {
  test('Basic graph', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, []],
    ])

    expect(topologicalSortDepthFirst(graph)).toEqual(['a', 'b', 'c'])
  })

  test('Graph with dependencies', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')
    const d = new GraphNode('d')
    const e = new GraphNode('e')

    // a      d
    //  v    ^
    //   c --
    //  ^    v
    // b      e

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, [d, e]],
      [d, []],
      [e, []],
    ])

    expect(topologicalSortDepthFirst(graph)).toEqual(['a', 'b', 'c', 'e', 'd'])
  })
})

describe('Topological Sort Kahn', () => {
  test('Basic graph', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, []],
    ])

    expect(topologicalSortKahn(graph)).toEqual(['a', 'b', 'c'])
  })

  test('Graph with dependencies', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')
    const d = new GraphNode('d')
    const e = new GraphNode('e')

    // a      d
    //  v    ^
    //   c --
    //  ^    v
    // b      e

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, [d, e]],
      [d, []],
      [e, []],
    ])

    expect(topologicalSortKahn(graph)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })
})

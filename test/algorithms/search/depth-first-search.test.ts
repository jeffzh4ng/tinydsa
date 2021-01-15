import { GraphNode } from '../../../src/algorithms/graphs/graph-node'
import { dfs } from '../../../src/algorithms/search/depth-first-search'

describe('Depth First Search', () => {
  test('Basic depth first search', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, []],
    ])

    expect(dfs(a, graph)).toEqual(['a', 'b', 'c'])
  })

  test('Graph with node with two parents', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')
    const d = new GraphNode('d')
    const e = new GraphNode('e')

    const graph = new Map([
      [a, [b, e]],
      [b, [c]],
      [c, [d]],
      [d, []],
      [e, [d]],
    ])

    //  e -----\
    // /        v
    // a->b->c->d

    expect(dfs(a, graph)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  test('Graph with loner node', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, []],
      [c, []],
    ])

    expect(dfs(a, graph)).toEqual(['a', 'b'])
  })

  test('Cyclic graph', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, [c]],
      [c, [a]],
    ])

    expect(dfs(a, graph)).toEqual(['a', 'b', 'c'])
  })
})

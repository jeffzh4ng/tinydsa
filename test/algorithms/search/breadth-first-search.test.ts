import { GraphNode } from '../../../src/algorithms/graphs/graph-node'
import { bfs } from '../../../src/algorithms/search/breadth-first-search'

describe('Breadth First Search', () => {
  test('Basic search', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [b, [c]],
    ])

    expect(bfs(a, graph)).toEqual(['a', 'b', 'c'])
  })

  test('Graph with node with two parents', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')
    const d = new GraphNode('d')
    const e = new GraphNode('e')

    //  e -----\
    // /        v
    // a->b->c->d

    const graph = new Map([
      [a, [b, e]],
      [b, [c]],
      [c, [d]],
      [d, []],
      [e, [d]],
    ])

    // o: [a, b, e ]
    // q:  c, d

    expect(bfs(a, graph)).toEqual(['a', 'b', 'e', 'c', 'd'])
  })

  test('Graph with loner node', () => {
    const a = new GraphNode('a')
    const b = new GraphNode('b')
    const c = new GraphNode('c')

    const graph = new Map([
      [a, [b]],
      [c, []],
    ])

    expect(bfs(a, graph)).toEqual(['a', 'b'])
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

    expect(bfs(a, graph)).toEqual(['a', 'b', 'c'])
  })
})

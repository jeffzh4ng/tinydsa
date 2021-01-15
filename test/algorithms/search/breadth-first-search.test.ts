import { bfs } from '../../../src/algorithms/search/breadth-first-search'
import { GraphNode } from '../../../src/algorithms/search/graph-node'

describe('Breadth First Search', () => {
  test('Basic search', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])

    a.children = [b]
    b.children = [c]

    expect(bfs(a)).toEqual(['a', 'b', 'c'])
  })

  test('Graph with node with two parents', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])
    const d = new GraphNode('d', [])
    const e = new GraphNode('e', [])

    a.children = [b, e]
    b.children = [c]
    c.children = [d]
    e.children = [d]

    //  e -----\
    // /        v
    // a->b->c->d

    // o: [a, b, e ]
    // q:  c, d

    expect(bfs(a)).toEqual(['a', 'b', 'e', 'c', 'd'])
  })

  test('Graph with loner node', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])

    a.children = [b]

    expect(bfs(a)).toEqual(['a', 'b'])
  })

  test('Cyclic graph', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])

    a.children = [b]
    b.children = [c]
    c.children = [a]

    expect(bfs(a)).toEqual(['a', 'b', 'c'])
  })
})

import { dfs } from '../../../src/algorithms/search/depth-first-search'
import { GraphNode } from '../../../src/algorithms/search/graph-node'

describe('Depth First Search', () => {
  test('Basic depth first search', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])

    a.children = [b]
    b.children = [c]

    expect(dfs(a)).toEqual(['a', 'b', 'c'])
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

    expect(dfs(a)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  test('Graph with loner node', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])

    a.children = [b]

    expect(dfs(a)).toEqual(['a', 'b'])
  })

  test('Cyclic graph', () => {
    const a = new GraphNode('a', [])
    const b = new GraphNode('b', [])
    const c = new GraphNode('c', [])

    a.children = [b]
    b.children = [c]
    c.children = [a]

    expect(dfs(a)).toEqual(['a', 'b', 'c'])
  })
})

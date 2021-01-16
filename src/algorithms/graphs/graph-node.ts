export class GraphNode<T> {
  val: T

  constructor(val: T) {
    this.val = val
  }
}

type EdgeList<T> = Map<GraphNode<T>, number>
export type WeightedGraph<T> = Map<GraphNode<T>, EdgeList<T>>
export type ShortestDistances<T> = Map<GraphNode<T>, number>
export type PrevVertices<T> = Map<GraphNode<T>, GraphNode<T> | null>

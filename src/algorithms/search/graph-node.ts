export class GraphNode<T> {
  val: T
  children: Array<GraphNode<T>>

  constructor(val: T, children: Array<GraphNode<T>>) {
    this.val = val
    this.children = children
  }
}

// We use a LCRS representation which is more efficient for the heap use case.
// See more here: https://stackoverflow.com/a/14015526/6113956

class FibonacciNode<T> {
  value: T
  degree: number

  mark: boolean

  parent: FibonacciNode<T> | null
  sibling: FibonacciNode<T> | null
  prevSibling: FibonacciNode<T> | null
  child: FibonacciNode<T> | null

  constructor(value: T) {
    this.value = value
    this.degree = 0

    this.mark = false

    this.parent = null
    this.sibling = null
    this.prevSibling = null
    this.child = null
  }
}

export default FibonacciNode

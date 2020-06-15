// We use a LCRS representation which is more efficient for the heap use case.
// See more here: https://stackoverflow.com/a/14015526/6113956

class BinomialNode<T> {
  value: T
  degree: number

  parent: BinomialNode<T> | null
  sibling: BinomialNode<T> | null
  child: BinomialNode<T> | null

  constructor(value: T) {
    this.value = value
    this.degree = 0

    this.parent = null
    this.sibling = null
    this.child = null
  }
}

export default BinomialNode

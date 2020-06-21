class BTreeNode<T> {
  values: T[] // array of n values
  children: BTreeNode<T>[] // array of children with length n + 1
  isLeaf: boolean // true if node is leaf

  // initialize node with k children
  constructor() {
    this.values = []
    this.children = []
    this.isLeaf = false
  }
}

export default BTreeNode

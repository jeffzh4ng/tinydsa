class RBTreeNode<T> {
  value: T
  color: 'red' | 'black'

  left: RBTreeNode<T> | null
  right: RBTreeNode<T> | null
  parent: RBTreeNode<T> | null

  constructor(value: T, color: 'red' | 'black', parent: RBTreeNode<T> | null) {
    this.value = value
    this.color = color

    this.left = null
    this.right = null
    this.parent = parent
  }
}

export default RBTreeNode

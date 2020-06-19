class AVLTreeNode<T> {
  value: T

  left: AVLTreeNode<T> | null
  right: AVLTreeNode<T> | null
  parent: AVLTreeNode<T> | null

  balanceFactor: number
  height: number

  constructor(value: T, parent: AVLTreeNode<T> | null) {
    this.value = value

    this.left = null
    this.right = null
    this.parent = parent

    this.balanceFactor = 0
    this.height = 1
  }
}

export default AVLTreeNode
